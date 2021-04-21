import Express from 'express'
import bodyParser from 'body-parser'
import sequelize from 'sequelize'
import orm_login from './orm.js'
let orm = new sequelize.Sequelize({
    dialect: orm_login.dialect,
    username: orm_login.username,
    password: orm_login.password,
    database: orm_login.database,
    host: orm_login.host,
    logging: orm_login.logging
});

/**
 * Server holds information about the season so the entry knows where which season to compile to
 */
class Server extends sequelize.Model {}
Server.init({
    server_id: {
        type: sequelize.DataTypes.BIGINT,
        primaryKey: true,
    },
    season_number: sequelize.DataTypes.BIGINT,
    off_season: sequelize.DataTypes.BOOLEAN
}, {sequelize: orm, modelName: "Severs", timestamps: false})

/**
 * Entry holds all the entries that will ever be inputted, but compiles entries to the Seasons class,
 * so when a season ends all entries from a server get removed.
 */
class Entry extends sequelize.Model {}
Entry.init({
    serveruser_id: {
        type: sequelize.DataTypes.TEXT,
        primaryKey: true,
    },
    server_avatar: sequelize.DataTypes.TEXT,
    server_id: sequelize.DataTypes.BIGINT,
    user_avatar: sequelize.DataTypes.TEXT,
    user_id: sequelize.DataTypes.TEXT,
    hours: sequelize.DataTypes.BIGINT,
    proof: sequelize.DataTypes.TEXT,
    tag_id: sequelize.DataTypes.TEXT

}, {sequelize: orm, modelName: "Entries", timestamps: false});

/**
 * Season is a compressed record of a studier's time on a specific server and season
 */
class Season extends sequelize.Model {}
Season.init({
    server_user_season: {
        type: sequelize.DataTypes.TEXT,
        primaryKey: true,
    },
    season_number: sequelize.DataTypes.BIGINT,
    server_avatar: sequelize.DataTypes.TEXT,
    server_id: sequelize.DataTypes.BIGINT,
    user_avatar: sequelize.DataTypes.TEXT,
    user_id: sequelize.DataTypes.TEXT,
    total_hours: sequelize.DataTypes.BIGINT,
    tag_id: sequelize.DataTypes.TEXT

}, {sequelize: orm, modelName: "Seasons", timestamps: false});

Season.belongsTo(Server, {as: "Server", foreignKey: "server_id"})

orm.sync()
    .then((orm) => {

    const app = Express();
    app.use(bodyParser.json());
    app.use("/", Express.static("static"));

    app.set("view engine","ejs");
    app.set("views", "data_displays");



    /**
     *
     * @param object body that has server_id as a property
     * @returns a promise that is the server
     */
    async function getServer(object)
    {
        if(typeof object === "object") {
            return await Server.findOne({
                where: {
                    server_id: {[sequelize.Op.eq]: BigInt(object.server_id)}
                },
            });
        }else{
            return await Server.findOne({
                where: {
                    server_id: {[sequelize.Op.eq]: BigInt(object)}
                },
            });
        }
    }

        //http://localhost:9999/Ping
        /**
         * test endpoint to see if the discord bot is communicating with the server correctly
         */
    app.get("/Ping",(request,response)=>{

        response.send({ping: "Pong!"});
    })
        /**
         * gets the information about a particular server
         */
    app.get("/Server/:server_id", async(request,response)=>{
        let server_id = request.params.server_id;
        let server = await getServer(server_id);
        if(server === null || server === undefined)
        {
            response.status(404);
        }else{
            response.status(200)
            Entry.aggregate('user_id', 'count',{
                distinct: true
            })
                .then((count)=>{
                    server.dataValues['logging'] = count;
                    response.json(server)
                })


        }
    })

    app.delete("/Server/User", async (request, response)=>{
        let server_info = request.body;


            let entries = await Entry.destroy({
                where: {
                    server_id: { [sequelize.Op.eq]: BigInt(server_info.server_id)},
                    user_id: { [sequelize.Op.eq]: server_info.user}
                }
            })
        let seasons = await Season.destroy({
            where: {
                server_id: { [sequelize.Op.eq]: BigInt(server_info.server_id)},
                user_id: { [sequelize.Op.eq]: server_info.user}
            }
        })
            if(entries === 0&&seasons === 0)
            {
                response.status(200);
                response.json("");

            }else{
                response.status(500);
                response.json("");
            }


    })
        /**
         * wipes all entries from a server, which most likely is a result from ending a season
         */
    app.delete("/Entry/:id", async(request, response)=>{
        let server_info = request.params.id;
        let server = await getServer(server_info);
        if(server === null) {
            response.status(500);
            response.json("Error: Wrong end point: There is no Season to update");
        }else{
            let entries = await Entry.destroy({
                where: {
                    server_id: { [sequelize.Op.eq]: BigInt(server_info)}
                }
            })
            if(entries === 0)
            {
                response.status(200);
                response.json("");

            }else{
                response.status(500);
                response.json("");
            }

        }
    })
        /**
         * updates a server's season to on season if they exist and are off season
         */
    app.put("/Season/Toggle", async (request,response)=>{
        let server_info = request.body;
        let isServer = await getServer(server_info.server_id)

        if(isServer === null)
        {
            response.status(404);
            response.json("Error: Wrong end point: There is no Season to update");
        }else{
            Server.findOne({
                where:{
                server_id: { [sequelize.Op.eq]: BigInt(server_info.server_id)}
                }

            })
                .then((server)=> {
                    //if it is off season, start the season
                    if (server.off_season && server_info.arg.toLowerCase() === "start") {
                        response.json({
                            season_number: server.season_number + 1
                        });
                        server.season_number += 1;
                        server.off_season = false;
                        response.status(200);
                        server.save();
                    }
                    //if the season is on, end it
                    else if(!(server.off_season) && server_info.arg.toLowerCase() === "end" ){
                        server.off_season = true;
                        response.status(200);
                        response.json("The season is over!");
                        server.save();
                    }else{
                        response.status(500);
                        response.json({"error": server})
                    }
                })
        }

    })
        /**
         * Creates a server entry for them on the database and starts their season
         */
    app.post("/Season/Create", (request, response) =>{
        let server_info = request.body;
        let isServer = null;
        getServer(server_info.server_id).then((result)=>{
            isServer = result;
        })
        if(isServer === null)
        {
            Server.create({
                server_id: server_info.server_id,
                season_number: 1,
                off_season: false
            }).then(r => {
                response.status(200);
                response.json({
                    message:"Server was added and the season is on!",
                    server: r
                })
            } )

        }else{
            response.status(500);
            response.json({"Error:":server_info});
        }
    })
    app.put("/Season/Update",async (request,response)=>{
        let {server_user_season,hours,tag_id} = request.body;
        let season = await Season.findOne({
            where: {
                server_user_season: {
                    [sequelize.Op.eq]:
                        (server_user_season)
                }
            }
        })
        season.total_hours = parseInt(hours) + parseInt(season.total_hours);
        season.tag_id = tag_id;
        season.save();

    })
        /**
         * /Entry will add a user entry to the entry database and update their position in the season. If a season isn't
         * started this won't go through fully, and if a user isn't in the season yet, this will create a new position
         * for them.
         */
    app.post("/Entry", async (request,response) => {

        //makes sure that the fields provided by the bot are good
        let user_entry = request.body;

        let server_info = await getServer(user_entry)

            try {
                //checks to see if the server has a season so it can then find the season to compress the entry to,
                if (server_info == null || server_info.off_season) {
                    response.status(404);
                    response.json("server off season");
                } else {
                    //creates an entry
                    await Entry.create({
                        serveruser_id: user_entry.server_id + "|" + user_entry.user_id,
                        server_avatar: user_entry.server_avatar,
                        server_id: BigInt(user_entry.server_id),
                        user_avatar: user_entry.user_avatar,
                        user_id: user_entry.user_id,
                        hours: BigInt(user_entry.hours),
                        proof: user_entry.proof,
                        tag_id: user_entry.tag_id
                    })
                    //fetching to find a Season entry for the user
                    let season = await Season.findOne({
                        where: {
                            server_user_season: {
                                [sequelize.Op.eq]:
                                    (user_entry.server_id + "|" +
                                        user_entry.user_id + "|" +
                                        server_info.season_number)
                            }
                        }
                    })

                    //if the season doesn't exist we'll create it
                    if (season === null) {
                        await Season.create({
                                server_user_season: (user_entry.server_id + "|"
                                    + user_entry.user_id + "|" + server_info.season_number),
                                season_number: BigInt(server_info.season_number),
                                server_avatar: user_entry.server_avatar,
                                server_id: BigInt(server_info.server_id),
                                user_avatar: user_entry.user_avatar,
                                user_id: user_entry.user_id,
                                total_hours: BigInt(user_entry.hours),
                                tag_id: user_entry.tag_id
                            }
                        )
                        response.status(200);


                    } else {
                        response.status(200);
                    }


                }
            }catch(e){
            response.status(500)
                response.json({"error": "wrong num"});
        }



        response.send();
    })
        /**
         * webpage for displaying all the users ranks within a server's season
         */
    app.get("/Season/List/:server_id", async (request, response) => {
        let server_id = request.params.server_id;
        let server = await getServer(server_id);
        Season.findAll({
            where: {
                server_id: {[sequelize.Op.eq]: server_id},
                season_number: {[sequelize.Op.eq]: server.season_number}
            }
        })
            .then((season_loggers) => {

                if (request.headers.accept.includes("text/html")) {
                    response.render("leaderboard", {loggers: season_loggers})

                } else {
                    response.json(season_loggers);
                }
            })

    })
        /**
         * returns an array with the top user objects filtered from the Season table
         */
    app.get("/Season/Display/",async (request,response)=>{
        let season_number = request.query.season_number;
        let server_id = request.query.server_id;
        let server = await getServer(server_id);
        let user = {};
        let to_use = (season_number !== "-1")? season_number : server.season_number

        Season.findAll({
            where: {
                server_id: { [sequelize.Op.eq]: server_id},
                season_number: { [sequelize.Op.eq]: to_use}
            }
        }).then(async(users)=>{
            users.sort( (a,b)=> (parseInt(a.total_hours) < parseInt(b.total_hours))? 1 : -1);

            user['seasons'] = (users.length > 10)? await users.splice(0,9): users;
            response.json(user);
        })
    })

        /**
         * returns season information about a user
         */
    app.get("/Season/User",async(request, response)=>{
        let user_id = request.query.user_id;
        let server_id = request.query.server_id;
        let user = {};

        Season.findAll({
            where: {
                server_id: { [sequelize.Op.eq]: BigInt(server_id)},
                user_id: { [sequelize.Op.eq]: user_id}
            }
        }).then(async (results)=>{
            results.sort( (a,b)=> (parseInt(a.season_number) < parseInt(b.season_number))? 1 : -1);

             user['seasons'] = (results.length > 5)? await results.splice(0,5): results;
                response.json(user);
        })


    })
        /**
         * this route finds season results for a user
         */
     app.get("/Season/:serveruser_id", async(request, response) => {
        let user = request.params.serveruser_id;
        let ids = user.split("|");
        let season = await Server.findOne({
             where: {
                 server_id: {[sequelize.Op.eq]: BigInt(ids[0])}
             },
         });
            let {season_number} = season;
                Season.findOne({
                    where: {
                        server_user_season: {
                            [sequelize.Op.eq]:
                                ( user+"|" + season_number)
                        }
                    }
                })

                    .then((results)=>{
                        if(results === null)
                        {
                            response.status(404);
                            response.json({"User season entry not found": results});
                        } else{
                            //if all goes well the season entry will be returned
                            response.status(200);
                            response.json(results);
                        }

                        response.send();
                    })


    })


        app.listen(9999, () => {
            console.log ("Server started on port 9999");
        })
})



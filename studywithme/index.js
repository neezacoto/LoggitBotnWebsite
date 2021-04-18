import Express from 'express'
import bodyParser from 'body-parser'
import sequelize from 'sequelize'

let orm = new sequelize.Sequelize({
    dialect: "postgres",
    username: "c_rudder1",
    password: "c_rudder1",
    database: "c_rudder1",
    host: "45.79.131.73",
    logging: false
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
    proof: sequelize.DataTypes.TEXT

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
         * returns an array with the top user objects filtered from the Season table
         */
    app.get("/Season/Leaderboard",(request,response)=>{
        let server_id = request.query.server;
        let top_num_of_people = request.query.top;
        let server = getServer(server_id);

        Season.findAll({
            where: {
                server_id: { [sequelize.Op.eq]: server_id},
                season_number: { [sequelize.Op.eq]: server.season_number}
            }
        }).then((users)=>{
           users.sort((a,b)=> (a.total_hours > b.total_hours)? 1 : -1);
           if(top_num_of_people === 0 || top_num_of_people === null)
           {
               return users;
           }else{
               return users.splice(0,top_num_of_people-1);
           }
        })
    })

        /**
         * wipes all entries from a server, which most likely is a result from ending a season
         */
    app.delete("/Entry/Wipe/:id", (request, response)=>{
        let server_info = request.params.id;
        let server = getServer(server_info.server_id);
        if(server === null) {
            response.status(500);
            response.json("Error: Wrong end point: There is no Season to update");
        }else{
            Entry.findAll({
                where: {
                    server_id: { [sequelize.Op.eq]: server.server_id}
                }
            }).then((results)=>{
                results.delete();
                response.status(200);
                response.json("")
            })
        }
    })
        /**
         * updates a server's season to on season if they exist and are off season
         */
    app.put("/Season/Toggle", (request,response)=>{
        let server_info = request.body;
        let isServer = null;
        getServer(server_info.server_id)
            .then((result)=>{
            isServer = result;
        })
        if( isServer === null)
        {
            response.status(404);
            response.json("Error: Wrong end point: There is no Season to update");
        }else{
            Server.findOne({
                server_id: { [sequelize.Op.eq]: server_info.server_id}

            })
                .then((server)=> {
                    //if it is off season, start the season
                    if (!(server.off_season) && server_info.arg.toLowerCase() === "start") {
                        response.json({
                            season_number: server.season_number + 1
                        });
                        server.season_number += 1;
                        server.off_season = false;
                        response.status(200);
                    }
                    //if the season is on, end it
                    else if(server.off_season && server_info.arg.toLowerCase() === "end" ){
                        server.off_season = true;
                        response.status(200);
                        response.json("The season is over!");
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
        let {server_user_season,hours} = request.body;
        let season = await Season.findOne({
            where: {
                server_user_season: {
                    [sequelize.Op.eq]:
                        (server_user_season)
                }
            }
        })
        season.total_hours = parseInt(hours) + parseInt(season.total_hours);
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
                    proof: user_entry.proof
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
                                    total_hours: BigInt(user_entry.hours)
                                }
                            )
                            response.status(200);



                        } else {
                            response.status(500);
                            response.json({"error": "player already in season"});

                        }


            }



        response.send();
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


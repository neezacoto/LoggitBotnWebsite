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
        type: sequelize.DataTypes.INTEGER,
        primaryKey: true,
    },
    season_number: sequelize.DataTypes.INTEGER,
    off_season: sequelize.DataTypes.BOOLEAN
}, {sequelize: orm, modelName: "Severs", timestamps: true})

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
    server_id: sequelize.DataTypes.INTEGER,
    user_avatar: sequelize.DataTypes.TEXT,
    user_id: sequelize.DataTypes.INTEGER,
    hours: sequelize.DataTypes.INTEGER,
    proof: sequelize.DataTypes.TEXT

}, {sequelize: orm, modelName: "Entries", timestamps: true});

/**
 * Season is a compressed record of a studier's time on a specific server and season
 */
class Season extends sequelize.Model {}
Season.init({
    server_user_season: {
        type: sequelize.DataTypes.TEXT,
        primaryKey: true,
    },
    season_number: sequelize.DataTypes.INTEGER,
    server_avatar: sequelize.DataTypes.TEXT,
    server_id: sequelize.DataTypes.INTEGER,
    serveruser_id: sequelize.DataTypes.INTEGER,
    user_avatar: sequelize.DataTypes.TEXT,
    user_id: sequelize.DataTypes.TEXT,
    total_hours: sequelize.DataTypes.INTEGER,

}, {sequelize: orm, modelName: "Seasons", timestamps: true});

Season.belongsTo(Server, {as: "Server", foreignKey: "server_id"})

orm.sync()
    .then((orm) => {

    const app = Express();
    app.use(bodyParser.json());
    app.use("/", Express.static("static"));

    app.set("view engine","ejs");
    app.set("views", "data_displays");

    //https://45.79.131.73/Ping

    /**
     *
     * @param object body that has server_id as a property
     * @returns a promise that is the server
     */
    async function getServer(object)
    {
        return await Server.findOne({
            where: {
                server_id: {[sequelize.Op.eq]: object.server_id}
            },
        });
    }

        /**
         * test endpoint to see if the discord bot is communicating with the server correctly
         */
    app.get("/Ping",(request,response)=>{
        response.json("Pong!");
        response.send();
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
        if(getServer(server_info.server_id) === null)
        {
            response.status(500);
            response.json("Error: Wrong end point: There is no Season to update");
        }else{
            Server.findOne({
                server_id: { [sequelize.Op.eq]: server_info.server_id}

            })
                .then((server)=> {
                    //if it is off season, start the season
                    if (!(server.off_season)) {
                        server.season_number++;
                        server.off_season = false;
                        response.status(200);
                        response.json("The season is on!");

                    }
                    //if the season is on, error
                    else{
                        server.off_season = false;
                        response.status(200);
                        response.json("The season is over!");
                    }
                })
        }

    })
        /**
         * Creates a server entry for them on the database and starts their season
         */
    app.post("/Season/Create", (request, response) =>{
        let server_info = request.body;
        if(getServer(server_info.server_id) === null)
        {
            Server.create({
                server_id: server_info.server_id,
                season_number: 1,
                off_season: false
            })
            response.status(200);
            response.json("Server was added and the season is on!")
        }else{

        }
    })

        /**
         * /Entry will add a user entry to the entry database and update their position in the season. If a season isn't
         * started this won't go through fully, and if a user isn't in the season yet, this will create a new position
         * for them.
         */
    app.post("/Entry", (request,response) => {


        //makes sure that the fields provided by the bot are good
        let user_entry = request.body;
        let valid = true;
        let check = ["server_avatar", "server_id","user_avatar","user_id","hours","proof"];
        let tbd = Object.keys(user_entry);
        try{
            for(let i = 0; i < check.length; i++)
            {
                if(check[i] !== tbd[i])
                {
                    valid = false;
                }
            }
        }catch(error){
            valid=false;
            response.status(500);
            response.json({"Error with key list size:": error});
        }
        if(valid) {
            let server_info = getServer(user_entry);
                    //checks to see if the server has a season so it can then find the season to compress the entry to,
                    if (server_info == null || server_info.off_season) {
                        response.status(404);
                        response.json("Your Server has not created a season");
                    } else {
                            //creates an entry
                            Entry.create({
                                serveruser_id: user_entry.server_id + "|" + user_entry.user_id,
                                server_avatar: user_entry.server_avatar,
                                server_id: user_entry.server_id,
                                user_avatar: user_entry.user_avatar,
                                user_id: user_entry.user_id,
                                hours: user_entry.hours,
                                proof: user_entry.proof
                            })

                            //fetching to find a Season entry for the user
                            Season.findOne({
                                where: {
                                    server_user_season: {
                                        [sequelize.Op.eq]:
                                            (user_entry.server_id + "|" +
                                                user_entry.user_id + "|" +
                                                server_info.season_number)
                                    }
                                }
                            })
                                .then((season) => {
                                    //if the season doesn't exist we'll create it
                                    if (season === null) {
                                        Season.create({
                                                server_user_season: (Entry.server_id + "|"
                                                    + Entry.user_id + "|" + server_info.season_number),
                                                server_number: server_info.id,
                                                server_avatar: user_entry.server_avatar,
                                                server_id: server_info.server_id,
                                                user_avatar: user_entry.user_avatar,
                                                user_id: user_entry.user_id,
                                                total_hours: user_entry.hours
                                            }
                                        )
                                    } else {
                                        season.total_hours += user_entry.hours;
                                    }

                                    response.status(200);
                                    response.json("Entry added and season position updated!")
                                })
                            }

        }else {
            response.status(500);
            response.json("the keys were incorrectly named");
        }
        response.send();
    })


        /**
         * this route finds season results for a user
         */
     app.get("/Season/:user", (request, response) => {
        let user = request.body;
        let season = getServer(user).season_number;
                Season.findOne({
                    where: {
                        server_user_season: {
                            [sequelize.Op.eq]:
                                (user.server_id + "|" + user.user_id + "|" + season)
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
})


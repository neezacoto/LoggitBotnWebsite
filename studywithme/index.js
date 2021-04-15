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
    off_season: sequelize.DataTypes.Boolean //CAN I DO THIS????
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

Season.hasMany(Entry, {as: "Seasons", foreignKey: "serveruser_id"})

orm.sync()
    .then((orm) => {

    const app = Express();
    app.use(bodyParser.json());
    app.use("/", Express.static("static"));

    app.set("view engine","ejs");
    app.set("views", "data_displays");

        /**
         * returns the server body of the id requested
         */
    app.get("/Season/:id", (request, response) => {
        let server_info = request.params.id;
        Server.findOne({
            where: {
                server_id: {[sequelize.Op.eq]: server_info}
            }
        }).then((results)=>{
            response.json(results);
            response.send();
        })

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
            response.status(500);
            response.json({"Error with key list size:": error});
        }
        //checks to see if the server has a season so it can then find the season to compress the entry to,
        //by fetching /Server/:id get
        fetch("http://45.79.131.73/Season/"+user_entry.server_id)
            .then((server_info) => {
                if(server_info == null || server_info.off_season)
                {
                    response.status(404);
                    response.json("Your Server has not created a season");
                }
                else{
                    if(valid)
                    {
                        //creates an entry
                        Entry.create({
                            serveruser_id: user_entry.server_id+"|"+ user_entry.user_id,
                            server_avatar: user_entry.server_avatar,
                            server_id: user_entry.server_id,
                            user_avatar: user_entry.user_avatar,
                            user_id: user_entry.user_id,
                            hours: user_entry.hours,
                            proof: user_entry.proof
                        })
                        //finding the season for the entry to be compiled to
                        Season.findOne({
                            where: {
                                server_user_season: { [sequelize.Op.eq]: entry.server_id +"|"
                                    +entry.user_id+"|"+server_info.season_number}
                            }
                        }).then((season)=>{
                            //if the season doesn't exist we'll create it
                            if(season === null)
                            {
                                Season.create({
                                    server_user_season: (Entry.server_id +"|"
                                        +Entry.user_id+"|"+server_info.season_number),
                                    server_number: server_info.id,
                                    server_avatar: user_entry.server_avatar,
                                    server_id: server_info.server_id,
                                    user_avatar: user_entry.user_avatar,
                                    user_id: user_entry.user_id,
                                    total_hours: user_entry.hours
                                    }
                                )
                            }else{
                                season.total_hours += user_entry.hours;
                            }
                            response.status(200);
                            response.json("Entry added and season position updated!")
                        })


                    }else{
                        response.status(500);
                        response.json("the keys were incorrectly named");
                    }

                    Entry.create({

                    })
                }
            })





    })
        /**
         * this route finds season results for a user
         */
    app.get("/Season/:user", (request, response) => {
        let user = request.body;
        //checking to see if a server has a season started and what
        fetch("http://45.79.131.73/Season/"+user_entry.server_id)
            .then((server_body) => {
                if(server_body == null || server_body.off_season)
                {
                    response.status(404);
                    response.json("Server Season was not created");
                }
                else {
                    Season.findOne({
                        where: {
                            server_user_season: { // stopping place "what is server_user doing here
                                [sequelize.Op.eq]: (entry.server_id + "|"
                                + entry.user_id + "|" + server_body.season_number)
                            }
                        }
                    })
                        .then((results)=>{
                            response.json(results);
                            response.send();
                        })
                }
            })
    })
})


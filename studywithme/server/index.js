import pg from 'node-postgres';

let pool = new pg.Pool({
    host: '45.79.131.73',
    port: 5432,
    user: 'c_rudder1',
    password: 'c_rudder1',
    database: 'c_rudder1'
});

pool.connect()
    .then((client) => {

        let servers_table = `
           CREATE TABLE IF NOT EXISTS Servers
           (
               server_id     VARCHAR(18) NOT NULL, 
               user_id       VARCHAR(37) NOT NULL,
               server_avatar VARCHAR(88) NOT NULL,
               PRIMARY KEY (server_id, user_id)
           );
        `;

        let users_table = `
           CREATE TABLE IF NOT EXISTS Users
           (
               user_id     VARCHAR(37) UNIQUE NOT NULL,
               user_avatar VARCHAR(88) NOT NULL,
               hours       VARCHAR(40) NOT NULL,
               PRIMARY KEY (user_id)
           );
        `;
        let entries_table = `
           CREATE TABLE IF NOT EXISTS Entries
           (
               user_id   VARCHAR(37) NOT NULL,
               hours VARCHAR(40) NOT NULL,
               date_entered  VARCHAR(10) NOT NULL,
               proof_discord_link VARCHAR(88) NOT NULL,
               PRIMARY KEY (user_id)
           );
        `;
        client.query(entries_table);
        client.query(users_table);
        client.query(servers_table);

    })



import Express from 'express';
import StudyWithMeAPI from './studywithmeapi.js';

const app = Express();
const MY_PORT = 9999;


app.use('/StudyWithMe', StudyWithMeAPI);


app.use('/',Express.static('./webpage',{
    index: 'webfront.html'
}));

app.listen(MY_PORT, ()=>{
    console.log(`Server started on port: ${MY_PORT}`);
})
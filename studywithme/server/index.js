import Express from 'express';

const app = Express();
const MY_PORT = 9999;


app.use('/Politician', CongressApi);


app.use('/',Express.static('./webpage',{
    index: 'webfront.html'
}));

app.listen(MY_PORT, ()=>{
    console.log(`Server started on port: ${MY_PORT}`);
})
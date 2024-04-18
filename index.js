const http = require("http");
const path = require("path");
const fs = require("fs");
const {MongoClient} = require('mongodb');

const server = http.createServer((req, res) => {  
    if (req.url==='/api')
    {
        connectToDB().then(
            (stats)=>
            {  
                res.setHeader("Access-Control-Allow-Origin",'*');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(stats));
            }
        )
    }
    else{
        let fPath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
        fs.readFile(fPath,
        (err, content) => {
            if (err)
            {
                console.log("Unable to load the Portfolio....");
                res.end();
            }
            else
            { 
                res.writeHead(200, { 'Content-Type': webContentType(fPath) });
                res.end(content);
            }  
            }
  );
    }
});

const PORT= 6562;
server.listen(PORT,()=> console.log(`Server is running on port ${PORT} `));

function webContentType(fPath)
{
    const contentType=
    {
        '.css':'text/css',
        '.json':'application/json',
        '.jpg':'image/jpg',
        '.png':'image/png',
        '.html':'text/html'

    }
    return contentType[path.extname(fPath)] || 'text/plain';s
}

async function connectToDB(){
    const uri ="mongodb+srv://sandireddy:prem@cluster0.ua2834z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log("Connected to mongodb server");
       return await findWorldCupStats(client);
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
async function findWorldCupStats(client ){
    try{
        console.log("Fetching Details");
        const cursor = client.db("WorldCup").collection("Worldcup-Stats").find({});
        const results = await cursor.toArray();
        return results;
    }
    catch(err)
    {
        console.log("Something went wrong in fetching the data");
        console.err(err);
    }
};
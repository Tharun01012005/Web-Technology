const http = require('http');
const url = require('url');
const querystring = require('querystring');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; 
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectDB();

async function onRequest(req, res) {
    const path = url.parse(req.url).pathname;
    console.log('Request for ' + path + ' received');

    const query = url.parse(req.url).query;
    const params = querystring.parse(query);
    const username = params["username"];
    const id = params["id"];
    const date = params["date"];
    const group = params["group"];
    const mobileNo = params["phno"];
    const gender = params["gender"];
    const email = params["email"];
    const add = params["add"];
 

    if (req.url.includes("/insert")) {
        await insertData(req, res, username,id,date,group,mobileNo,gender,add,email);
    } else if (req.url.includes("/delete")) {
        await deleteData(req, res, id);
    } else if (req.url.includes("/update")) {
        await updateData(req, res, id,add);
    } else if (req.url.includes("/display")) {
        await displayTable(req, res);
    }
}

async function insertData(req, res, username,id,date,group,mobileNo,gender,add,email) {
    try {
        const database = client.db('proj'); 
        const collection = database.collection('donar');

        const donar = {
            username,
            id,
            date,
            group,
            mobileNo,
            gender,
            add,
            email
        };

        const result = await collection.insertOne(donar);
        console.log(`${result.insertedCount} document inserted`);

        const htmlResponse = `
            <html>
                <head>
                    <title>User Details</title>
                    <style>
                        table {
                            font-family: Arial, sans-serif;
                            border-collapse: collapse;
                            width: 50%;
                            margin: 20px auto;
                        }
                        td, th {
                            border: 1px solid #dddddd;
                            text-align: left;
                            padding: 8px;
                        }
                        th {
                            background-color:  #f87979;
                        }
                        td{
                            background-color: #d3cdcd;
                        }
                        a{
                            text-decoration: none;
                        }
                    </style>
                </head>
                <body>
                    <center> <h2>Donar Details</h2> </center> <hr> <br>
                    <table>
                        <tr>
                            <th>Field</th>
                            <th>Value</th>
                        </tr>
                        <tr>
                            <th>Donar Name</th>
                            <td>${username}</td>
                        </tr>
                        <tr>
                            <th>Donar Id</th>
                            <td>${id}</td>
                        </tr>
                        <tr>
                            <th>Blood Group</th>
                            <td>${group}</td>
                        </tr>
                        <tr>
                            <th>Mobile No</th>
                            <td>${mobileNo}</td>
                        </tr>
                        <tr>
                            <th>Gender</th>
                            <td>${gender}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>${email}</td>
                        </tr>    
                        <tr>
                            <th>Address</th>
                            <td>${add}</td>
                        </tr>
                    </table>
                    <a href="/display">View Inserted Table</a>
                </body>
            </html>
        `;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(htmlResponse);
        res.end();
    } catch (error) {
        console.error('Error inserting data:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

async function deleteData(req, res, id) {
    try {
        const database = client.db('proj'); 
        const collection = database.collection('donar');

        const filter = { id: id };

        const result = await collection.deleteOne(filter);
        console.log(`${result.deletedCount} document deleted`);

        if (result.deletedCount === 1) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Document deleted successfully');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Document not found');
        }
    } catch (error) {
        console.error('Error deleting data:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

async function updateData(req, res, id, newadd) {
    try {
        const database = client.db('proj'); 
        const collection = database.collection('donar');

        const filter = { id: id };

        const updateDoc = {
            $set: {add: newadd }
        };

        const result = await collection.updateOne(filter, updateDoc);
        console.log(`${result.modifiedCount} document updated`);

        if (result.modifiedCount === 1) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Donar Address updated successfully');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Donar ID not found');
        }
    } catch (error) {
        console.error('Error updating data:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

async function displayTable(req, res) {
    try {
        const database = client.db('proj'); 
        const collection = database.collection('donar');

        const cursor = collection.find({});
        const donars = await cursor.toArray();

        let tableHtml = `
            <html>
                <head>
                    <title>Donar Details</title>
                    <style>
                        table {
                            font-family: Arial, sans-serif;
                            border-collapse: collapse;
                            width: 100%;
                        }
                        th, td {
                            border: 1px solid #dddddd;
                            text-align: left;
                            padding: 8px;
                        }
                        th {
                            background-color: #f2f2f2;
                        }
                    </style>
                </head>
                <body>
                    <center> <h2>Donar Details</h2> </center> <hr> <br>
                    <table>
                        <tr>
                            <th>Donar name</th>
                            <th>Donar Id</th>
                            <th>Blood Group</th>
                            <th>Mobile No</th>
                            <th>Gender</th>
                            <th>Email</th>
                            <th>Address</th>
                        </tr>
        `;
        donars.forEach(donar => {
            tableHtml += `
                <tr>
                    <td>${donar.username}</td>
                    <td>${donar.id}</td>
                    <td>${donar.group}</td>
                    <td>${donar.mobileNo}</td>
                    <td>${donar.gender}</td>
                    <td>${donar.email}</td>
                    <td>${donar.add}</td>
                </tr>
            `;
        });
        tableHtml += `
                    </table>
                </body>
            </html>
        `;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(tableHtml);
        res.end();
    } catch (error) {
        console.error('Error displaying table:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

http.createServer(onRequest).listen(7050);
console.log('Server is running...');
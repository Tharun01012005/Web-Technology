var http = require('http');
var querystring = require('querystring');

function onRequest(req, res) {
    if (req.method === 'POST' && req.url === '/login') {
        var requestBody = '';
        req.on('data', function (data) {
            requestBody += data;
        });
        req.on('end', function () {
            var formData = querystring.parse(requestBody);
            var username = formData["username"];
            var id = formData["id"];
            var dob = formData["date"]
            var branch = formData["branch"];
            var mobileNo = formData["phno"];
            var gender = formData["gender"];
            var branchadd = formData["branchadd"];

            var htmlResponse = `
                <html>
                <head>
                <title>User Details</title>
                <style>
                    table {
                        font-family: Arial, sans-serif;
                        border-collapse: collapse;
                        width: 90%;
                        margin: 20px auto;
                    }
                    td, th {
                        border: 1px solid #dddddd;
                        text-align: left;
                        padding: 15px;
                    }
                    th {
                        background-color: rgb(188, 215, 225);
                    }
                    td{   
                      background-color: #f9f9f9;
                    }
                </style>
                </head>
                <body>
                 <center><h2>User Details</h2></center> <hr>
                <table>
                    <tr>
                    <th>Username</th>
                    <th>ID</th>
                    <th>Date of Birth</th>
                    <th>Branch</th>
                    <th>Mobile No</th>
                    <th>Gender</th>
                    <th>Branch Address</th>
                    </tr>
                    <tr>
                        <td>${username}</td>
                        <td>${id}</td>
                        <td>${dob}</td>
                        <td>${branch}</td>
                        <td>${mobileNo}</td>
                        <td>${gender}</td>
                        <td>${branchadd}</td>
                    </tr>
                </table>
                </body>
                </html>
            `;

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(htmlResponse);
            res.end();
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page not found');
    }
}

http.createServer(onRequest).listen(8000);
console.log('Server is running...');

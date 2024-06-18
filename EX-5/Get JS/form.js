var http = require('http');
var url = require('url');
var querystring = require('querystring');

function onRequest(req, res) {
  var path = url.parse(req.url).pathname;
  console.log('Request for ' + path + ' received');
  
  var query = url.parse(req.url).query;
  console.log(query);
  var params = querystring.parse(query);
  var username = params["username"];
  var id = params["id"];
  var dob = params["date"];
  var branch = params["branch"];
  var mobileNo = params["phno"];
  var gender = params["gender"];
  var branchadd = params["branchadd"];

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
  
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(htmlResponse);
  res.end();
}

http.createServer(onRequest).listen(8000);
console.log('Server is running...');
const express = require("express");
const app = express();

const https = require("https");
const request = require("request");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// for server to be able to serve static files such as styles.css or images
app.use(express.static("public"));

app.listen(process.env.PORT || 3001, function () {
  console.log("Server is running on port 3001");
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const fName = req.body.fName;
  const lName = req.body.lName;
  const email = req.body.email;

  const data = {
    members : [
    {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME : fName,
        LNAME : lName
      }
    }
  ]
  }

  const jsonData = JSON.stringify(data);

  const url = "https://us8.api.mailchimp.com/3.0/lists/9b6bb0d8fd";

  const options = {
    method : "POST",
    auth : "dinda:69d1f7c4eb6f041874b618670c59b0d0-us8"
  }

  // save our post request's response to a variable
  const request = https.request(url, options, function(response){

    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html")
    }
    else{
      res.sendFile(__dirname + "/failure.html")
    }

    // take whatever data we get from mailchimp's response
    response.on("data", function(data){
      console.log(JSON.parse(data));
    })    
  });

  // send/write the data we get from user to mailchimp server
  request.write(jsonData);
  request.end();


  console.log(email);
});

app.post("/failure", function(req, res){
  return res.redirect('/');
});
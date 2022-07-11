const Parse = require('parse/node');
const express = require('express')
const app = express()
const cors = require("cors")
const morgan = require('morgan')
const bodyParser = require('body-parser')
const masterKey = "EiLDaqAiTMab4Qws2g5nEQEzW75Jn6lKZ44dp9A3"

app.use(bodyParser.json());
app.use(cors())
app.use(morgan('tiny'))

Parse.initialize("f3uKzoRyLgM4hnYMxkTFbZr6oABcuO4kHbAxQ3Ur", "hJKEz9itTiqQbFq0bx5bRyO15LI95m9H44kSWLR0", `${masterKey}`);
Parse.serverURL = 'https://parseapi.back4app.com/'

// Expects parameters for username and password
app.post('/users/register', async(req, res) => {
    let infoUser = req.body;
    let user = new Parse.User();

    user.set("username", infoUser.username);
    user.set("email", infoUser.email);
    user.set("password", infoUser.password);
    user.set("logged_in", true)

    try{
      await user.signUp();
      res.send({"sessionToken" : user.getSessionToken()});
    } catch (error){
      res.status(400).send({ loginMessage: error.message, RegisterMessage: '', typeStatus: "danger",  infoUser: infoUser});
    }
})

// Expects parameters for username and password
app.post('/users/login', async (req, res) => {
  try {
    const user = await Parse.User.logIn(req.body.username, req.body.password)
    res.send({"sessionToken" : user.getSessionToken()})
  } catch (error) {
    res.status(400).send({"error" : error.message })
  }
})

app.post('/users/dashboard', async (req, res) => {
  let sessionToken = req.body.sessionToken
  let query = new Parse.Query("_Session")

  query.equalTo("sessionToken", sessionToken)

  query.first({useMasterKey: true}).then(function(user) {
    if(user) {
      console.log(user)

      user.destroy({useMasterKey:true}).then(function(res) {
        console.log("session destroyed")
      }).catch(function (error) {
        console.log(error)
        return null
      })
    }
    else {
      console.log("Nothing to destroy")
      return null
    }
  })
})


module.exports = app

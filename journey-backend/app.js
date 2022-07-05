const Parse = require('parse/node');
const express = require('express')
const app = express()
const cors = require("cors")
const morgan = require('morgan')
const bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(cors())
app.use(morgan('tiny'))

Parse.initialize("f3uKzoRyLgM4hnYMxkTFbZr6oABcuO4kHbAxQ3Ur", "hJKEz9itTiqQbFq0bx5bRyO15LI95m9H44kSWLR0");
Parse.serverURL = 'https://parseapi.back4app.com/'


app.post('/users/register', async(req, res) => {
    let infoUser = req.body;
    let user = new Parse.User();

    user.set("username", infoUser.username);
    user.set("email", infoUser.email);
    user.set("password", infoUser.password);
    user.set("logged_in", true)

    try{
      await user.signUp()
      res.send({ loginMessage: "User logged!", RegisterMessage: '', typeStatus: "success",  infoUser: infoUser });
    } catch (error){
      res.send({ loginMessage: error.message, RegisterMessage: '', typeStatus: "danger",  infoUser: infoUser});
    }
})

module.exports = app

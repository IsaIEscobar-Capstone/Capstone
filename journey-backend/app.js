const Parse = require('parse/node');
const express = require('express')
const app = express()
const cors = require("cors")
const morgan = require('morgan')
const bodyParser = require('body-parser');
const { query } = require('express');
const masterKey = "EiLDaqAiTMab4Qws2g5nEQEzW75Jn6lKZ44dp9A3"

app.use(bodyParser.json());
app.use(cors())
app.use(morgan('tiny'))

Parse.initialize("f3uKzoRyLgM4hnYMxkTFbZr6oABcuO4kHbAxQ3Ur", "hJKEz9itTiqQbFq0bx5bRyO15LI95m9H44kSWLR0", `${masterKey}`);
Parse.serverURL = 'https://parseapi.back4app.com/'
// Parse.Cloud.useMasterKey();

app.post('/users/flightExample', async (req, res) => {
  let exampleRes = req.body.exampleRes;
  let exampleCall = new Parse.Object("Flight_Example_Calls")
  console.log('exampleres: ', typeof(exampleRes), exampleRes)

  exampleCall.set("responseCall", exampleRes)

  try {
    await exampleCall.save()
  } catch (error) {
    console.log('flightExample eror: ', error.message)
  }
})

app.post ('/users/accessInfo', async (req, res) => {
  let objectId = 'brGe5Fg4K7'
  let query = new Parse.Query("Flight_Example_Calls");

  query.equalTo("objectId", objectId)
  query.first({ useMasterKey: true }).then(function (trip) {
    let flightData = trip.get('responseCall')
    res.send({"flightData":  flightData})
  }).catch(function (error) {
    console.log(error)
  })

})

// Expects parameters for username and password
app.post('/users/register', async (req, res) => {
  let infoUser = req.body;
  let user = new Parse.User();
  let userData = new Parse.Object("User_Data");

  user.set("username", infoUser.username);
  user.set("email", infoUser.email);
  user.set("password", infoUser.password);
  user.set("logged_in", true)

  userData.set("User_id", infoUser.username);

  try {
    await user.signUp();
    await userData.save();
    res.send({ "sessionToken": user.getSessionToken() });
  } catch (error) {
    res.status(400).send({ loginMessage: error.message, RegisterMessage: '', typeStatus: "danger", infoUser: infoUser });
  }
})
// Expects parameters for username and password
app.post('/users/login', async (req, res) => {
  let query = new Parse.Query("User_Data")
  query.equalTo("User_id", req.body.username)

  try {
    const user = await Parse.User.logIn(req.body.username, req.body.password)
    query.first({ useMasterKey: true }).then(function (trip) {
      let tripList = trip.get('trips_accessed')
      res.send({ "sessionToken": user.getSessionToken(), "trips": tripList })
    }).catch(function (error) {
      console.log(error)
    })
  } catch (error) {
    res.status(400).send({ "error": error.message })
  }
})

// Excpects sessionToken
app.post('/users/dashboard', async (req, res) => {
  let sessionToken = req.body.sessionToken
  let query = new Parse.Query("_Session")

  query.equalTo("sessionToken", sessionToken)

  query.first({ useMasterKey: true }).then(function (user) {
    if (user) {
      user.destroy({ useMasterKey: true }).then(function (res) {
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

app.post('/users/trip', async (req, res) => {
  let vacationName = req.body.vacationName
  let username = req.body.username
  let userQ = new Parse.Query("User_Data")
  const trip = new Parse.Object("Trip");

  userQ.equalTo("User_id", username)
  console.log(userQ.toJSON())

  trip.set("TripName", vacationName)
  trip.set("Travelers", [username])
  trip.set("Activities", [])

  try {
    let result = await trip.save();
    userQ.first({ useMasterKey: true }).then(function (user) {
      current_user = user.get('trips_accessed')
      current_trip = {
        id: result.id,
        name: vacationName
      }
      current_user = [...current_user, current_trip]

      user.set('trips_accessed', current_user)
      user.save();
      res.send({ "trip_id": result.id });
    })
    console.log('New object created with objectId: ' + result.id);
  } catch (error) {
    console.log('Failed to create new object, with error code: ' + error.message);
  }
})

app.post('/users/tripList', async (req, res) => {
  let username = req.body.username;
  let query = new Parse.Query("User_Data");

  query.equalTo("User_id", username)
  query.first({ useMasterKey: true }).then(function (trip) {
    let tripList = trip.get('trips_accessed')
    res.send({ "trips": tripList })
  }).catch(function (error) {
    console.log(error)
  })
})

app.post('/users/calendar', async (req, res) => {
  let trip_id = req.body.trip_id;
  console.log('id: ', trip_id)
  let query = new Parse.Query("Trip")

  query.equalTo("objectId", trip_id)
  console.log('query', query.toJSON())
  query.first({ useMasterKey: true }).then(function (trip) {
    console.log('trip: ', trip)
    let activityList = trip.get('Activities')
    res.send({ "activities": activityList })
  }).catch(function (error) {
    console.log(error)
  })
})

app.post('/users/activity', async (req, res) => {
  let trip_id = req.body.trip_id
  let activity = req.body.activity
  let query = new Parse.Query("Trip")

  query.equalTo("objectId", trip_id)
  query.first({ useMasterKey: true }).then(function (trip) {
    let activityList = trip.get('Activities')
    activityList = [...activityList, activity]
    trip.set('Activities', activityList)
    trip.save()
  }).catch(function (error) {
    console.log(error)
  })
})

// TODO:
app.post('/users/removeActivity', async (req, res) => {
  let activity = req.body.activity
  let trip_id = req.body.trip_id
  console.log('deleted id: ' + trip_id)
  console.log('deleted activity: ' + activity)
  let query = new Parse.Query("Trip");

  query.equalTo("objectId", trip_id)
  query.first({ useMasterKey: true }).then(function (trip) {
    let activityList = trip.get('Activities')
    let new_activities = []
    for (let i = 0; i < activityList.length; i++) {
      if (activityList[i].name != activity.name || activityList[i].startDate != activity.startDate || activityList[i].endDate != activity.endDate) {
        console.log(activityList[i].name + ' ' + activity.name)
        new_activities = [...new_activities, activityList[i]]
      }
    }
    trip.set('Activities', new_activities)
    trip.save()
  }).catch(function (error) {
    console.log(error)
  })
})

app.post('/users/share', async (req, res) => {
  let user = req.body.user
  let trip_id = req.body.trip_id
  let trip_name = req.body.trip_name
  let new_trip = {
    id: trip_id,
    name: trip_name
  }
  let query = new Parse.Query("User_Data");
  console.log('trip_id: ', trip_id)

  query.equalTo("User_id", user)

  console.log(query.toJSON())
  query.first({ useMasterKey: true }).then(function (trip) {
    let trips = trip.get('trips_accessed')
    trips = [...trips, new_trip]
    trip.set('trips_accessed', trips)
    trip.save();
  })
})

module.exports = app

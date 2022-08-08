const Parse = require('parse/node');
const express = require('express');

const app = express();
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const masterKey = 'EiLDaqAiTMab4Qws2g5nEQEzW75Jn6lKZ44dp9A3';

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('tiny'));

Parse.initialize('f3uKzoRyLgM4hnYMxkTFbZr6oABcuO4kHbAxQ3Ur', 'hJKEz9itTiqQbFq0bx5bRyO15LI95m9H44kSWLR0', `${masterKey}`);
Parse.serverURL = 'https://parseapi.back4app.com/';

app.post('/users/uploadPhotos', async (req) => {
  const { tripId } = req.body;
  const { imgUrl } = req.body;
  const query = new Parse.Query('Trip');

  query.equalTo('objectId', tripId);

  query.first({ useMasterKey: true }).then((trip) => {
    let temp = trip?.get('img_list');
    temp = [...temp, imgUrl];
    trip.set('img_list', temp);
    trip.save();
  });
});

app.post('/users/getPhotos', async (req, res) => {
  const { tripId } = req.body;
  const query = new Parse.Query('Trip');

  query.equalTo('objectId', tripId);

  query.first({ useMasterKey: true }).then((trip) => {
    const photoList = trip.get('img_list');
    res.send({ photoList });
  })
    .catch((err) => {
      console.log(err);
    });
});

app.post('/users/deletePhoto', async (req) => {
  const { tripId } = req.body;
  const { photoLink } = req.body;
  const query = new Parse.Query('Trip');

  query.equalTo('objectId', tripId);

  query.first({ useMasterKey: true }).then((trip) => {
    let photoList = trip.get('img_list');
    photoList = photoList.filter((photo) => photo !== photoLink);
    trip.set('img_list', photoList);
    trip.save();
  })
    .catch((err) => {
      console.log(err);
    });
});

app.post('/users/deleteCalendar', async (req) => {
  const { tripId } = req.body;
  const { username } = req.body;
  const query = new Parse.Query('Trip');
  const userQ = new Parse.Query('User_Data');

  query.equalTo('objectId', tripId);
  userQ.equalTo('User_id', username);

  userQ.first({ useMasterKey: true }).then((userTrip) => {
    const temp = userTrip.get('trips_accessed').filter((trip) => trip.id !== tripId);
    userTrip.set('trips_accessed', temp);
    userTrip.save();
  });
  query.first({ useMasterKey: true }).then((trip) => {
    if (trip) {
      trip.destroy({ useMasterKey: true }).then(() => {
        console.log('session destroyed');
      }).catch((error) => {
        console.log(error);
        return null;
      });
    } else {
      console.log('Nothing to destroy');
      return null;
    }
  });
});

app.post('/users/flightExample', async (req) => {
  const { exampleRes } = req.body;
  const exampleCall = new Parse.Object('Flight_Example_Calls');

  exampleCall.set('responseCall', exampleRes);

  try {
    await exampleCall.save();
  } catch (error) {
    console.log('flightExample eror: ', error.message);
  }
});

app.post('/users/accessInfo', async (req, res) => {
  const objectId = 'brGe5Fg4K7';
  const query = new Parse.Query('Flight_Example_Calls');

  query.equalTo('objectId', objectId);
  query.first({ useMasterKey: true }).then((trip) => {
    const flightData = trip.get('responseCall');
    res.send({ flightData });
  }).catch((error) => {
    console.log(error);
  });
});

// Expects parameters for username and password
app.post('/users/register', async (req, res) => {
  const infoUser = req.body;
  const user = new Parse.User();
  const userData = new Parse.Object('User_Data');

  user.set('username', infoUser.username);
  user.set('email', infoUser.email);
  user.set('password', infoUser.password);
  user.set('logged_in', true);

  userData.set('User_id', infoUser.username);

  try {
    await user.signUp();
    await userData.save();
    res.send({ sessionToken: user.getSessionToken() });
  } catch (error) {
    res.status(400).send({
      loginMessage: error.message, RegisterMessage: '', typeStatus: 'danger', infoUser,
    });
  }
});

// Expects parameters for username and password
app.post('/users/login', async (req, res) => {
  const query = new Parse.Query('User_Data');
  query.equalTo('User_id', req.body.username);

  try {
    const user = await Parse.User.logIn(req.body.username, req.body.password);
    query.first({ useMasterKey: true }).then((trip) => {
      const tripList = trip.get('trips_accessed');
      res.send({ sessionToken: user.getSessionToken(), trips: tripList });
    }).catch((error) => {
      console.log(error);
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Excpects sessionToken
app.post('/users/dashboard', async (req) => {
  const { sessionToken } = req.body;
  const query = new Parse.Query('_Session');

  query.equalTo('sessionToken', sessionToken);

  query.first({ useMasterKey: true }).then((user) => {
    if (user) {
      user.destroy({ useMasterKey: true }).then(() => {
        console.log('session destroyed');
      }).catch((error) => {
        console.log(error);
        return null;
      });
    } else {
      console.log('Nothing to destroy');
      return null;
    }
  });
});

app.post('/users/trip', async (req, res) => {
  const { vacationName } = req.body;
  const { username } = req.body;
  const userQ = new Parse.Query('User_Data');
  const trip = new Parse.Object('Trip');

  userQ.equalTo('User_id', username);

  trip.set('TripName', vacationName);
  trip.set('Travelers', [username]);
  trip.set('Activities', []);
  trip.set('chat_access', [username]);

  try {
    const result = await trip.save();
    userQ.first({ useMasterKey: true }).then((user) => {
      let currentUser = user.get('trips_accessed');
      const currentTrip = {
        id: result.id,
        name: vacationName,
      };
      currentUser = [...currentUser, currentTrip];

      user.set('trips_accessed', currentUser);
      user.save();
      res.send({ tripId: result.id });
    });
    console.log(`New object created with objectId: ${result.id}`);
  } catch (error) {
    console.log(`Failed to create new object, with error code: ${error.message}`);
  }
});

app.post('/users/tripList', async (req, res) => {
  const { username } = req.body;
  const query = new Parse.Query('User_Data');

  query.equalTo('User_id', username);
  query.first({ useMasterKey: true }).then((trip) => {
    const tripList = trip.get('trips_accessed');
    res.send({ trips: tripList });
  }).catch((error) => {
    console.log(error);
  });
});

app.post('/users/calendar', async (req, res) => {
  const { tripId } = req.body;
  const query = new Parse.Query('Trip');

  query.equalTo('objectId', tripId);
  query.first({ useMasterKey: true }).then((trip) => {
    const activityList = trip.get('Activities');
    res.send({ activities: activityList });
  }).catch((error) => {
    console.log(error);
  });
});

app.post('/users/activity', async (req) => {
  const { tripId } = req.body;
  const { activity } = req.body;
  const query = new Parse.Query('Trip');

  query.equalTo('objectId', tripId);
  query.first({ useMasterKey: true }).then((trip) => {
    let activityList = trip.get('Activities');
    activityList = [...activityList, activity];
    trip.set('Activities', activityList);
    trip.save();
  }).catch((error) => {
    console.log(error);
  });
});

app.post('/users/removeActivity', async (req) => {
  const { activity } = req.body;
  const { tripId } = req.body;
  const query = new Parse.Query('Trip');

  query.equalTo('objectId', tripId);
  query.first({ useMasterKey: true }).then((trip) => {
    const activityList = trip.get('Activities');
    let newActivities = [];
    for (let i = 0; i < activityList.length; i++) {
      if (activityList[i].name !== activity.name
        || activityList[i].startDate !== activity.startDate
        || activityList[i].endDate !== activity.endDate) {
        newActivities = [...newActivities, activityList[i]];
      }
    }
    trip.set('Activities', newActivities);
    trip.save();
  }).catch((error) => {
    console.log(error);
  });
});

app.post('/users/share', async (req) => {
  const { user } = req.body;
  const { tripId } = req.body;
  const { tripName } = req.body;
  const newTrip = {
    id: tripId,
    name: tripName,
  };
  const query = new Parse.Query('User_Data');
  const tripQ = new Parse.Query('Trip');

  query.equalTo('User_id', user);
  tripQ.equalTo('objectId', tripId);

  tripQ.first({ useMasterKey: true }).then((chat) => {
    const currentChat = chat.get('chat_access');
    chat.set('chat_access', [...currentChat, user]);
    chat.save();
  });
  query.first({ useMasterKey: true }).then((trip) => {
    let trips = trip.get('trips_accessed');
    trips = [...trips, newTrip];
    trip.set('trips_accessed', trips);
    trip.save();
  });
});

app.post('/users/chatCheck', async (req, res) => {
  const { tripId } = req.body;
  const { user } = req.body;
  const query = new Parse.Query('Trip');

  query.equalTo('objectId', tripId);

  query.first({ useMasterKey: true }).then((trip) => {
    const accessTrue = trip.get('chat_access');
    let access = false;
    for (let i = 0; i < accessTrue.length; i++) {
      if (accessTrue[i] === user) {
        access = true;
      }
    }
    res.send({ access });
  });
});

module.exports = app;

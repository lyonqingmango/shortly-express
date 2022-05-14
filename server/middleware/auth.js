const models = require('../models');
const Promise = require('bluebird');

console.log(models);
module.exports.createSession = (req, res, next) => {
  //check req.cookies
  req.session = {};
  req.session.hash = '';

  //if no cookie, create a new session and assign the session to req
  // assign a new cookie to
  if (Object.keys(req.cookies).length === 0) {
    console.log('ONE');
    models.Sessions.create()
      .then((result) => models.Sessions.get({id: result.insertId}))
      .then((result) => req.session = result )
      .then(() => {
        var username = req.body.username;
        if (username) {
          models.Users.get({username})
            .then((user) => { console.log('from auth', user); req.session.userId = user.id; });
        } else {
          console.log('username not exist');

        }
      })
      .then(()=> { console.log(req.body.username + 'req.session'); res.cookie('shortlyid', req.session.hash); next(); })
      .catch((err) => console.log(err));

  } else {
    // database get user ....userID
    // req.session.username =username

    // if there is a cookie, get the session using this cookie
    // if there is a session corresponding with the cookie, assign the session to req
    // else create a new session, assign the seesion to req and add cookie to res.


    //user : id, username, hashed password(cookie), salt
    //session: id, hash, userId

    var hash = req.cookies.shortlyid;
    models.Sessions.get({hash: hash})
      .then((result) => {
        if (result) {
          req.session = result;
          var id = result.userId;
          console.log('id' + id);
          if (id) {
            models.Users.get({id: id})
              .then((user) => req.session.user = {username: user.username});
            next();
          } else {
            console.log('user not exist');
            next();
          }

        } else {
          models.Sessions.create()
            .then((result) => models.Sessions.get({id: result.insertId}))
            .then((result) => { req.session = result; })
            .then(()=> { res.cookie('shortlyid', req.session.hash); next(); })
            .catch((err) => console.log(err));
        }
      });
  }
  //
};


/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/


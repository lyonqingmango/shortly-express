const models = require('../models');
const Promise = require('bluebird');


module.exports.createSession = (req, res, next) => {

  //if no cookie, create a new session and assign the session to req
  // assign a new cookie to
  if (Object.keys(req.cookies).length === 0) {
    return models.Sessions.create()
      .then(result => {
        var id = result.insertId;
        return models.Sessions.get({id});
      })
      .then(result => {
        req.session = {
          hash: result.hash,
          userId: result.id};
        res.cookie('shortlyid', result.hash);
        next();
      })
      .catch(err => console.log(err));

  } else {
    var hash = req.cookies.shortlyid;
    return models.Sessions.get({hash: hash})
      .then(result => {
        if (result) {
          req.session = result;
          next();
        } else {
          return models.Sessions.create()
            .then(result => {
              return models.Sessions.get({id: result.insertId});
            }
            )
            .then(result => {
              req.session = {
                hash: result.hash,
                userId: hash.id
              };
              res.cookie('shortlyid', req.session.hash);
              next();
            })
            .catch((err) => console.log(err));
        }
      });
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

module.exports.verifySession = (req, res, next) => {
  if (models.Sessions.isLoggedIn(req.session)) {
    next();
  } else {
    res.redirect('/login');
  }
};
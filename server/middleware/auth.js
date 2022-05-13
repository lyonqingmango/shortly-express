const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  //check req.cookies
  req.session = {};
  req.session.hash = '';
  if (Object.keys(req.cookies).length === 0) {
    models.Sessions.create()
      .then((result) => models.Sessions.get({id: result.insertId}))
      .then((result) => { req.session.hash = result.hash;})
      .then(()=> { res.cookie('shortlyid', req.session.hash); next(); })
      .catch((err) => console.log(err));

  } else {
    var hash = req.cookies.shortlyid;
    models.Sessions.get({hash: hash})
      .then((result) => {
        if (result) {req.session = result; next();} else {
          models.Sessions.create()
            .then((result) => models.Sessions.get({id: result.insertId}))
            .then((result) => { req.session.hash = result.hash;})
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


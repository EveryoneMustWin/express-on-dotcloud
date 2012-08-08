var tools = require('./tools.js');

// This middleware will force the visitor to authenticate
exports.auth = function(req, res, next) {
  // a user is consider authenticate if he has enter a name, sounds secure right ?
  if(req.session && req.session.name) {
    next();
  }
  else {
    tools.log(req.session);
    res.redirect('/who-are-you');
  }
  
}

exports.admin = function(req, res, next) {
  //res.redirect('/welcome');
  tools.log(req.session);
  next();
}
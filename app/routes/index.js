var tools = require('../tools.js');

// Root route :D
exports.index = function(req, res){
  res.redirect('/welcome');
};

exports.welcome = function(req, res){
  res.render('welcome', { title: 'Express', session: req.session });
};

exports.login = function(req, res){
  
  res.render('login', { title: 'Express', session: req.session });

  //res.redirect('/welcome');
}

// process auth
exports.initSession = function(req, res){
  console.log("-- initSession body received:");
  tools.log(req.body);

  if(req.body && req.body.name && req.body.name.length > 0) {
    if (!req.session)
        req.session = {};

    req.session.name = req.body.name;
    
    res.redirect('/welcome');
  }
  else {
    var data = {};
    data.title = "Could you tell me you name ?";
    data.error = "no name given or too short (at least 3 characters)";
    res.redirect('/who-are-you', data);
  }
}



// admin page
exports.admin = function(req, res){
  res.render('admin', {users: []})
}

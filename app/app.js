
/*
    Module dependencies.
*/

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var RedisStore = require('connect-redis')(express);


/*
    Some useful modules
*/
var util = require('util');

/*
    Initialisation of Express
*/
var app = express();


/*
    Setup the option for the redisStore in which are saved the sessions
*/
var redisOptions = {prefix: 'myfirstapp'};

/*
    Express configuration
*/
app.configure(function(){
  app.set('port', process.env.PORT || 8080);
  app.set('views', __dirname + '/views');

  /*
      Choose you template engine, have a look at express doc for ejs, haml, and html
  */
  app.set('view engine', 'jade');
  app.use(express.favicon());

  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  app.use(express.cookieParser('My First Express App'));
  app.use(express.session({ store: new RedisStore(redisOptions) }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/*
    A wrapper function arround
*/
function log(obj) {
  console.log(util.inspect(obj.session, false, 1, true));
}

/*
    
*/
function session(req, res, next) {
  log(req);
  next();
}


app.get('/', session, routes.index);
app.get('/login', session, routes.login);


/*
    Start the Express server
*/
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

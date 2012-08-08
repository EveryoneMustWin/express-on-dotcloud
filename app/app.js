
// Module dependencies
var express = require('express')
  , routes = require('./routes') // this is just like doing , routes = require('./routes/index.js')
  , http = require('http')
  , path = require('path');

var RedisStore = require('connect-redis')(express);



// Let's keep out tools together
var tools = require('./tools.js');

// Middleware are awesome, they able you to do a lt of things easily
var mid = require('./middlewares.js');

// Initialisation of Express
var app = express();


// Setup the option for the redisStore in which are saved the sessions
var redisOptions = {prefix: 'myfirstapp'};

// Express configuration
app.configure(function(){
  // Setup the port from the UNIX environement with a fallback , practical for dev and prod
  app.set('port', process.env.WWW_PORT || 8080);
  
  app.set('views', __dirname + '/views');

  // Choose you template engine, have a look at express doc for ejs, haml, and html
  app.set('view engine', 'jade');

  // Setup the favicon, if no path given a default favicon is used
  app.use(express.favicon());

  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  // Setup a session store in redis, if you ever want to scale this will be needed
  app.use(express.cookieParser('My First Express App'));
  app.use(express.session({ store: new RedisStore(redisOptions) }));

  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});




/*
    This route is the default one, the one you hit when to arrive directly on the server.
    It is "protected" by the session middleware to force the user to authenticate.
    routes.index in the exported route called index in the module route,
    here the module route is defined in routes/index.js.
*/
app.get('/', mid.auth, routes.index);

// Actually let's have a polite url, by redirecting you to /Welcome, it sounds nicer
app.get('/welcome', mid.auth, routes.welcome);

// A non protected route where to redirect the user to he can authenticate.
app.get('/who-are-you', routes.login);

// Handle the authentication
app.post('/init-session', routes.initSession);

// An admin page complety hardcoded ?
app.get('/admin', mid.auth, mid.admin, routes.admin);

// Start the Express server
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

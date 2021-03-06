var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');

var app = express();

var flash = require('connect-flash');
var morgan = require('morgan');
var session = require('express-session');
var passport = require('passport');

//socket.io
var server = require('http').createServer(app);
var io = require('socket.io')(server);


//模版引擎
var nunjucks = require('nunjucks');
// https://mozilla.github.io/nunjucks/api.html#configure
nunjucks.configure('views',{
    autoescape:true,
    express: app,
    cache:false,
    tags:{
        variableStart:'<$',
        variableEnd:'$>'
    }
});

io.on('connection',(socket)=>{
    setInterval(function(){
        socket.emit('result',{hello:'world'});
    },2000);
});
server.listen(8089);





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('njk',nunjucks.render);
app.set('view engine', 'njk');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js',express.static(path.join(__dirname, 'js')));
app.use('/build',express.static(path.join(__dirname, 'js')));
app.use(session({secret:'iloveyouandmorethaneverfromforever',resave:true,saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var models = require('./models');
var authRoute = require('./routes/auth')(app,passport);
require('./config/passport')(passport,models.User);


app.use('/', index);
app.use('/users', users);
app.use('/posts',posts);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var estatic=require('express-static');
var io = require('socket.io')();
var app = express();
app.io = io;
io.on('connection', function (socket) {
    io.emit('chat message', {'user':'system','msg':'有人登录了'});
    socket.on('chat message', function(msgitem){
        io.emit('chat message', msgitem);
    });
    socket.on('disconnect', function(){
        io.emit('chat message', {'user':'system','msg':'有人退出了'});
    });
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/Accounts', require('./routes/Accounts')(io));
app.use('/ExtraInfo', require('./routes/ExtraInfo')(io));
app.use('/Content', require('./routes/Content')(io));
app.use('/Operate', require('./routes/Operate')(io));

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
app.use(estatic('static/'));

module.exports = app;

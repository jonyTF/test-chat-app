var app = require('express')();
var room = require('./room.js');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('pages/index');
});

app.use('/room', room);

app.get('*', function(req, res) {
	res.send('<h1>Seems you\'ve hit a dead end...</h1>');
});

io.on('connection', function(socket) {
	console.log('user connected!');
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
	socket.on('join room', function(roomId) {
		socket.join(roomId);
	});
	socket.on('chat message', function(data) {
		console.log('received chat message');
		socket.broadcast.to(data.roomId).emit('chat message', data);
	});
	socket.on('add user', function(data) {
		io.sockets.in(data.roomId).emit('add user', data);
	});
});

http.listen(process.env.PORT || 3000, function() {
	console.log('listening on *:3000 or Heroku port');
});


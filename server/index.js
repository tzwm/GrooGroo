var io = require('socket.io')(2333);

io.on('connection', function (socket) {
  console.log('connect');
  socket.emit('state', 'ready');

  socket.on('siteInfo', function (data) {
    console.log(data.url);
    var id = 1;
    var messages = [
      {playTime: 4,
        text: 'lol',
        color: '#FFFFFF'},
      {playTime: 8,
        text: 'haha',
        color: '#000000'}];

    socket.emit('videoInfo', {
      id: id,
      allMessages: messages
    });
  });

  socket.on('post message', function (data) {
    var message = data;
    console.log(message.text);

    io.sockets.emit('new message', message);
  });
});



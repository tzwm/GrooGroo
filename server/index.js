var fs = require('fs');

var mongoose = require('mongoose'),
  DBPath = 'mongodb://localhost/GrooGroo';

//connect to mongodb
var connect = function () {
  var options = {server:
                  {socketOptions:
                    {keepAlive: 1}}};
  mongoose.connect(DBPath, options);
}
connect();

mongoose.connection.on('error', function(err) {
  console.log(err);
});

mongoose.connection.on('disconnected', function() {
  connect();
});


//bootstrap models
var models_path = __dirname + '/models';
fs.readdirSync(models_path).forEach(function (file) {
  if (file.split('.').pop() == 'js')
    require(models_path + '/' + file);
});


var io = require('socket.io')(2333),
  Video = mongoose.model('Video'),
  Message = mongoose.model('Message');

io.on('connection', function (socket) {
  console.log('connect');
  socket.emit('state', 'ready');

  socket.on('siteInfo', function (data) {
    var url = data.url.trim();
    var id, messages;

    Video.findOne({url: url}, function (err, video) {
      if (err || video === null) {
        var newVideo = new Video();
        newVideo.url = url;
        newVideo.messages = [];
        newVideo.save(function(err, product) {
          if (err) {
            console.log(err);

            return;
          }
          console.log('save ' + product.url);

          allMessages = [];
          for ( var messageId in product.messages) {

          }
          socket.emit('videoInfo', {
            id: product._id,
            allMessages: product.messages
          });
        });

        return;
      }

      console.log('find ' + video.url + " size: " + video.messages.length);
      socket.emit('videoInfo', {
        id: video._id,
        allMessages: video.messages
      });
    });
  });

  socket.on('post message', function (data) {
    console.log(data);
    var newMessage = new Message({
      _videoId: data.id,
      text: data.text,
      color: data.color,
      playTime: data.playTime
    });

    newMessage.save(function (err) {
      if (err) {
        console.log(err);

        return;
      }

      Video.findOne({_id: data.id}, function(err, video) {
        if (err || video === null) {
          console.log(err);

          return;
        }

        video.messages.push(newMessage);
        video.save(function (err) {
          if (err) {
            console.log(err);

            return;
          }


          io.sockets.emit('new message', newMessage);
        });
      });
    });
  });
});



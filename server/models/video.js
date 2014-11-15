var mongoose = require('mongoose'),
  connection = mongoose.connection,
  Schema = mongoose.Schema;


var videoSchema = new Schema({
  url: String,
  messages: []
});

var Video = mongoose.model('Video', videoSchema);

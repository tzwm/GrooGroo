var mongoose = require('mongoose'),
  connection = mongoose.connection,
  Schema = mongoose.Schema;

var messageSchema = new Schema({
  _videoId: [{ type: Schema.Types.ObjectId, ref: 'Video'}],
  text: String,
  color: String,
  playTime: Number
});

var Message = mongoose.model('Message', messageSchema);

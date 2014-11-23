var server = "localhost:2333";
var toolbarContainerList = {
  "youtube": "#player-api",
  "tudou": ".player_box"
};
var messagesContainerList = {
  "youtube": ".html5-video-container"
};
var template = '<div id="groo">' +
               '<div class="groo-post-form">' +
               '<input class="message" type="text"/><button class="btn-send">Send</button>' +
               '<input class="color" type="text" placeholder="#FFFFFF"/><div class="color-display"></div>' +
               '</div></div>';


var Groo = function(url, site) {
  this.toolbarContainer = null;
  this.messagesContainer = null;

  this.elemContentBox = null;
  this.elemBtnSend = null;
  this.elemColor = null;
  this.elemColorPreview = null;
  this.width = 0;
  this.height = 0;

  this.videoId = 0;
  this.site = site;
  this.socket = null;
  this.messages = [];
  this.url = url;

  this.initElements();
  this.initWebSocket();
};

Groo.prototype.initElements = function() {
  var _ = this,
    $container = $(toolbarContainerList[_.site]);

	$container.append(template);
  _.width = $container.width();
  _.height = $container.height();

  _.messagesContainer = $(messagesContainerList[_.site]);
  _.toolbarContainer = $('#groo');
  _.elemBtnSend = _.toolbarContainer.find('.btn-send').eq(0);
  _.elemContentBox = _.toolbarContainer.find('.message').eq(0);
  _.elemColor = _.toolbarContainer.find('.color').eq(0);
  _.elemColorPreview = _.toolbarContainer.find('.color-display').eq(0);

  _.toolbarContainer.css({
    width: _.width,
    top: _.height
  });

  _.elemBtnSend.on('click', function(){
    _.send(_.elemContentBox.val());
    _.elemContentBox.val('');
  });

  _.elemColor.change(function() {
    var colorPattern = /#[a-zA-Z0-9]{6}/;
    var currentColor = _.elemColor.val();
    if (!colorPattern.test(currentColor)) {
      currentColor = '#FFFFFF';
    }
    _.elemColorPreview.css({'background-color': currentColor});
    _.currentColor = currentColor;
  });
};

Groo.prototype.initWebSocket = function() {
  var _ = this;

  _.socket = io.connect('http://' + server + '/');
  _.socket.on('connect', function() {
    _.socket.emit('siteInfo', {
      url: _.url
    });

    _.socket
    .on('videoInfo', function(data) {
      _.videoId = data.id;
      for (var index in data.allMessages) {
        var
          playTime = data.allMessages[index].playTime,
          item = {
            text: data.allMessages[index].text,
            color: data.allMessages[index].color
          };
        if (_.messages[playTime] == undefined) {
          _.messages[playTime] = [item];
        } else {
          _.messages[playTime].push(item);
        }
      }
    })
    .on('new message', function(data) {
      var
        playTime = data.playTime,
        item = {
          text: data.text,
          color: data.color
        };
      if (_.messages[playTime] == undefined) {
        _.messages[playTime] = [item];
      } else {
        _.messages[playTime].push(item);
      }
    });
  });

  setInterval(function() {
    var item = _.messages[_.getPlayTime()];
    if (item) {
      for (var i in item) {
        _.generate(item[i].text, item[i].color);
      }
    }
  }, 1000);
};

Groo.prototype.generate = function(content, color) {
  var
    _ = this,
    easeTime = 5000;
    eastType = "linear";

  if (typeof content == "string") {
    $newItem = $('<div class="groo-item">' + content + '</div>');
    _.messagesContainer.append($newItem);

    // handle color
    color = color || '#fff';
    if (color.indexOf('#') < 0) {
      color = '#' + color;
    }
    $newItem
      .css({
        left: _.width,
        top: Math.floor(Math.random() * (_.height / 5 * 4)),
        color: color
      })
      .animate({
        left: -($newItem.width())
      }, easeTime, eastType, function() {
        $(this).remove();
      });
  }
};

Groo.prototype.send = function(content) {
  var _ = this;
  _.socket.emit('post message', {
    id: _.videoId,
    playTime: _.getPlayTime() + 1,
    text: content,
    color: _.currentColor
  });
}

Groo.prototype.getPlayTime = function() {
  var _ = this;

  if (_.site == 'youtube') {
    var slider = $('div[role="slider"]').eq(0);
    return parseInt(slider.attr('aria-valuenow'));
  }

}


$(document).ready(function() {
  var groo = null;

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    groo = new Groo(request.url, request.currentSite);
  });
});

var Groo = function(selector) {
	this.parent = null;
	this.elemContentBox = null;
	this.elemBtnSend = null;
	this.elemCurrentColor = null;
	this.elemColorList = null;
	this.width = 0;
	this.height = 0;

	this.videoId = 0;
	this.site = '';
	this.server = '172.27.221.76:2333';
	this.socket = null;
	this.messages = [];

	this.testCount = 0;

	this.initElements(selector);
	this.initWebSocket();
};

Groo.prototype.initElements = function(selector) {
	var template = '<div id="groo"><div class="groo-post-form"><div class="color-picker"><div class="current-color"></div><ul class="color-list"><li class="color-list-item"></li><li class="color-list-item"></li><li class="color-list-item"></li><li class="color-list-item"></li></ul></div><input class="message" type="text"><button class="btn-send">Send</button></div></div>';
	
	var 
		_ = this,
		$container = $(selector);

	$container.append(template);
	_.width = $container.width();
	_.height = $container.height();

	_.parent = $('#groo');
	_.elemBtnSend = _.parent.find('.btn-send').eq(0);
	_.elemContentBox = _.parent.find('.message').eq(0);
	_.elemColorList = _.parent.find('.color-list').eq(0);
	_.elemCurrentColor = _.parent.find('.current-color').eq(0);

	_.parent.css({
		width: _.width,
		'padding-top': _.height,
		margin: $container.css('margin')
	});

	_.elemBtnSend.on('click', function(){
		_.send(_.elemContentBox.val());
		_.elemContentBox.val('');
	});

	_.elemCurrentColor.click(function() {
		var clicked = $(this).data('clicked');
		if (clicked) {
			$(this).data('clicked', false);
			_.elemColorList.hide();
		} else {
			$(this).data('clicked', true);
			_.elemColorList.show();
		}
	});

	var url = window.location.href;
	if (url.indexOf('test') >= 0) {
		_.site = 'test';
	} else if (url.indexOf('youtube') >= 0) {
		_.site = 'youtube';
	} else if (url.indexOf('youku') >= 0) {
		_.site = 'youku';
	}
};

Groo.prototype.initWebSocket = function() {
	var 
		_ = this;

	_.socket = io('http://' + _.server + '/');
	_.socket.on('connect', function() {
		_.socket.emit('siteInfo', {
			url: window.location.href
		})
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
				console.log(_.messages);
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
				console.log(_.messages);
			});
	});

	setInterval(function() {
		var item = _.messages[_.getPlayTime()];
		console.log(item);
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
		_.parent.append($newItem);

		// handle color
		color = color || '#fff';
		if (color.indexOf('#') < 0) {
			color = '#' + color;
		}
		console.log($newItem);
		$newItem
			.css({
				left: _.width,
				top: Math.floor(Math.random() * (_.height / 5 * 4)),
				color: color
			})
			.animate({
				left: -($newItem.width())
			}, 
			easeTime, 
			eastType,
			function() {
				// $(this).remove();
			});
	}
};

Groo.prototype.send = function(content) {
	var _ = this;
	_.socket.emit('post message', {
		id: _.videoId,
		playTime: _.getPlayTime() + 3,
		text: content,
		color: "#fff"
	});
}

Groo.prototype.getPlayTime = function() {
	var _ = this;
	if (_.site == 'test') {
		_.testCount += 1;
		return _.testCount;
	} else if (_.site == 'youtube') {
		var slider = $('div[role="slider"]').eq(0);
		console.log(slider.attr('aria-valuenow'));
		return slider.attr('aria-valuenow');
	}
	
}

$(document).ready(function() {
	var location = window.location.href;
	var selector = '';
	if (location.indexOf('test') >= 0) {
		selector = '#test-container';
	} else if (location.indexOf('youtube') >= 0) {
		selector = '#player-api';
	}

	var groo = new Groo(selector);
});
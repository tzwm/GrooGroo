var Groo = function(selector) {
	this.parent = null;
	this.contentBox = null;
	this.btnSend = null;
	this.width = 0;
	this.height = 0;
	this.init(selector);
};

Groo.prototype.init = function(selector) {
	$(selector).append('<div id="groo"><div id="groo-new"></div></div>');
	var 
		_ = this,
		$parent = $('#groo'),
		$contentNew = $('#groo-new'),
		$btnSend = $('<button id="groo-send">Send</button>'),
		$input = $('<input id="groo-new-message" type="text">'),
		$container = $(selector);

	$contentNew.append($input).append($btnSend);
	_.parent = $parent;
	_.width = $container.width();
	_.height = $container.height();
	_.btnSend = $btnSend;
	_.contentBox = $input;

	_.parent.css({
		width: _.width,
		height: 30,
		'padding-top': _.height,
		margin: $container.css('margin')
	});

	$contentNew.css({
		height: 30
	});

	$btnSend.on('click', function(){
		_.send(_.contentBox.val());
		_.contentBox.val('');
	});
};

Groo.prototype.generate = function(content) {
	var 
		_ = this,
		easeTime = 5000;
		eastType = "linear";
	if (typeof content == "string") {
		$newItem = $('<div class="groo-item">' + content + '</div>');
		_.parent.append($newItem);
		$newItem
			.css({
				left: _.width,
				top: Math.floor(Math.random() * (_.height / 5 * 4))
			})
			.animate({
				left: -($newItem.width())
			}, 
			easeTime, 
			eastType,
			function() {
				$(this).remove();
			});
	}
};

Groo.prototype.send = function(content) {
	this.generate(content);
}

$(document).ready(function() {
	var location = window.location.href;
	var selector = '';
	if (location.indexOf('test') > 0) {
		selector = '#test-container';
	} else if (location.indexOf('youtube') > 0) {
		selector = '#player-api';
	}

	var groo = new Groo(selector);
});
(function() {
	function SnowingScene(config) {
		var that = this;

		that.canvas = config.canvas;
		that.context = that.canvas.getContext("2d");

		that.background = that._getImage("images/background.png");

		that.oldTime = new Date();
		that.framesCounter = 0;
		that.fps = 0;

		that._generateSnowflakes();
	}

	SnowingScene.prototype = {
		render: function() {
			var that = this;

			requestAnimationFrame(that.render.bind(that));

			that._update();

			that.context.clearRect(0, 0, canvas.width, canvas.height);
			that._render();
		},

		onSnowflakeFallen: function(snowflake) {
			snowflake.reset();
		},

		_generateSnowflakes: function() {
			var that = this;

			that.snowflakes = [];

			for (var i = 0; i < SNOWFLAKES_COUNT; i++) {
				var snowflake = new WinterNamespace.Snowflake({context: that.context, scene: this});

				that.snowflakes.push(snowflake);
			}
		},

		_update: function() {
			var that = this;

			for (var i = 0; i < that.snowflakes.length; i++) {
				that.snowflakes[i].update();
			}
		},

		_render: function() {
			var that = this,
				ctx = that.context;

			that._renderBackground();

			for (var i = 0; i < that.snowflakes.length; i++) {
				that.snowflakes[i].render();
			}

			that._renderFPS();
		},

		_renderBackground: function() {
			var that = this,
				ctx = that.context;

			ctx.drawImage(that.background, 0, 0);
		},

		_renderFPS: function() {
			var that = this,
				now = new Date(),
				ctx = that.context,
				diff = now.getTime() - that.oldTime.getTime();

			if (diff < 1000) {
				that.framesCounter++;
			} else {
				that.fps = that.framesCounter;
				that.framesCounter = 0;
				that.oldTime = new Date();
			}

			ctx.font = "14px Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "left";
			ctx.fillText("fps: " + that.fps, 550, 25);
		},

		_getImage: function(filename) {
			var image = new Image();
			image.src = filename;
			return image;
		},
	};

	window.WinterNamespace = window.WinterNamespace || {};
	WinterNamespace.SnowingScene = SnowingScene;

	const
		WIDTH = 600,
		HEIGHT = 600,
		SNOWFLAKES_COUNT = 1000
})();
(function() {
	class SnowingScene {
		constructor(config) {
			this.canvas = config.canvas;
			this.context = this.canvas.getContext("2d");

			this.background = this._getImage("images/background.png");

			this.oldTime = new Date();
			this.framesCounter = 0;
			this.fps = 0;

			this._generateSnowflakes();
		}

		render() {
			requestAnimationFrame(this.render.bind(this));

			this._update();

			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this._render();
		}

		onSnowflakeFallen(snowflake) {
			snowflake.reset();
		}

		_generateSnowflakes() {
			this.snowflakes = [];

			for (let i = 0; i < SNOWFLAKES_COUNT; i++) {
				let snowflake = new WinterNamespace.Snowflake({ context: this.context, scene: this });

				this.snowflakes.push(snowflake);
			}
		}

		_update() {
			for (let i = 0; i < this.snowflakes.length; i++) {
				this.snowflakes[i].update();
			}
		}

		_render() {
			let ctx = this.context;

			this._renderBackground();

			for (let i = 0; i < this.snowflakes.length; i++) {
				this.snowflakes[i].render();
			}

			this._renderFPS();
		}

		_renderBackground() {
			var ctx = this.context;

			ctx.drawImage(this.background, 0, 0);
		}

		_renderFPS() {
			var now = new Date(),
				ctx = this.context,
				diff = now.getTime() - this.oldTime.getTime();

			if (diff < 1000) {
				this.framesCounter++;
			} else {
				this.fps = this.framesCounter;
				this.framesCounter = 0;
				this.oldTime = new Date();
			}

			ctx.font = "14px Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "left";
			ctx.fillText("fps: " + this.fps, 550, 25);
		}

		_getImage(filename) {
			let image = new Image();
			image.src = filename;
			return image;
		}
	}

	window.WinterNamespace = window.WinterNamespace || {};
	WinterNamespace.SnowingScene = SnowingScene;

	const
		WIDTH = 600,
		HEIGHT = 600,
		SNOWFLAKES_COUNT = 1000
})();
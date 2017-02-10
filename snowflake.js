(function() {
	function Snowflake(config) {
		var that = this;

		that.context = config.context;
		that.scene = config.scene;

		that.speedVector = { x: 0, y: 0	};
		that.position = { x: 0, y: 0 };
		that.speedVector = { x: 0, y: 0, z: 0 };
		that.radius = 0;
		that.isFallen = false;

		that.radiusStep = [-0.05, 0.05];
		that.alreadyVisible = false;

		that.reset();
	}

	Snowflake.prototype = {
		reset: function() {
			var that = this;

			that.radius = Math.floor(that.randomRange(2, MAX_RADIUS));
			that.position.x = Math.floor(that.randomRange(1, WIDTH));
			that.position.y = -Math.floor(that.randomRange(1, HEIGHT));
			that.speedVector.x = 0;
			that.speedVector.y = that.radius / 1.5;
			that.speedVector.z = 0;

			if (that.radius <= 2 && that._shouldMoveInZPlane()) {
				that.speedVector.z = 0.05;
			}

			that.isFallen = false;
			that.alreadyVisible = false;
		},

		_shouldMoveInZPlane: function() {
			var probabilities = [0, 0, 1, 0, 0],
				index = Math.floor(this.randomRange(0, 4));

			return probabilities[index] === 1;
		},

		_isVisible: function() {
			var that = this;

			return that.position.x > 0 && that.position.x < WIDTH &&
					that.position.y > 0  && that.position.y < HEIGHT - 150;
		},

		update: function () {
			var that = this;

			if (that.isFallen) {
				return;
			}

			that.position.x += that.speedVector.x;
			that.position.y += that.speedVector.y;
			that.radius += that.speedVector.z;
			that.speedVector.y = that.radius / 1.5;

			if (!that.alreadyVisible && that._isVisible()) {
				that.alreadyVisible = true;
			}

			if (that.position.y > HEIGHT || that.radius > (MAX_RADIUS * 2) || that.radius <= 0) {
				that.isFallen = true;
				that.scene.onSnowflakeFallen(that);
			}
		},

		render: function() {
			var that = this,
				ctx = that.context;

			if (that.isFallen || !that._isVisible()) {
				return;
			}

			ctx.beginPath();
			ctx.arc(that.position.x, that.position.y, that.radius, 0, 2 * Math.PI, false);
			ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
			ctx.fill();
		},

		randomRange: function(min, max)
		{
			return ((Math.random()*(max - min)) + min);
		}
	};

	window.WinterNamespace = window.WinterNamespace || {};
	WinterNamespace.Snowflake = Snowflake;

	const
		WIDTH = 600,
		HEIGHT = 600,
		MAX_RADIUS = 6;
})();
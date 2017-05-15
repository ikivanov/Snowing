(function() {
	class Snowflake {
		constructor(config) {
			this.context = config.context;
			this.scene = config.scene;

			this.speedVector = { x: 0, y: 0	};
			this.position = { x: 0, y: 0 };
			this.speedVector = { x: 0, y: 0, z: 0 };
			this.radius = 0;
			this.isFallen = false;

			this.radiusStep = [-0.05, 0.05];
			this.alreadyVisible = false;

			this.reset();
		}

		reset() {
			this.radius = Math.floor(this.randomRange(2, MAX_RADIUS));
			this.position.x = Math.floor(this.randomRange(1, WIDTH));
			this.position.y = -Math.floor(this.randomRange(1, HEIGHT));
			this.speedVector.x = 0;
			this.speedVector.y = this.radius / 1.5;
			this.speedVector.z = 0;

			if (this.radius <= 2 && this._shouldMoveInZPlane()) {
				this.speedVector.z = 0.05;
			}

			this.isFallen = false;
			this.alreadyVisible = false;
		}

		_shouldMoveInZPlane() {
			let probabilities = [0, 0, 1, 0, 0],
				index = Math.floor(this.randomRange(0, 4));

			return probabilities[index] === 1;
		}

		_isVisible() {
			return this.position.x > 0 && this.position.x < WIDTH &&
					this.position.y > 0  && this.position.y < BOTTOM;
		}

		update() {
			if (this.isFallen) {
				return;
			}

			this.position.x += this.speedVector.x;
			this.position.y += this.speedVector.y;
			this.radius += this.speedVector.z;
			this.speedVector.y = this.radius / 1.5;

			if (!this.alreadyVisible && this._isVisible()) {
				this.alreadyVisible = true;
			}

			if (this.position.y > BOTTOM || this.radius > (MAX_RADIUS * 2) || this.radius <= 0) {
				this.isFallen = true;
				this.scene.onSnowflakeFallen(this);
			}
		}

		render() {
			let ctx = this.context;

			if (this.isFallen || !this._isVisible()) {
				return;
			}

			ctx.beginPath();
			ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
			ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
			ctx.fill();
		}

		randomRange(min, max)
		{
			return ((Math.random()*(max - min)) + min);
		}
	}

	window.WinterNamespace = window.WinterNamespace || {};
	WinterNamespace.Snowflake = Snowflake;

	const
		WIDTH = 600,
		HEIGHT = 600,
		BOTTOM = HEIGHT - 150,
		MAX_RADIUS = 6;
})();
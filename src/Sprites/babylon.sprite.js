var BABYLON;
(function (BABYLON) {
    var Sprite = (function () {
        function Sprite(name, manager) {
            this.name = name;
            this.color = new BABYLON.Color4(1.0, 1.0, 1.0, 1.0);
            this.width = 1.0;
            this.height = 1.0;
            this.angle = 0;
            this.cellIndex = 0;
            this.invertU = 0;
            this.invertV = 0;
            this.animations = new Array();
            this.isPickable = false;
            this._animationStarted = false;
            this._loopAnimation = false;
            this._fromIndex = 0;
            this._toIndex = 0;
            this._delay = 0;
            this._direction = 1;
            this._frameCount = 0;
            this._time = 0;
            if (manager) {
                this._manager = manager;
                manager.sprites.push(this);
            }
            this.position = BABYLON.Vector3.Zero();
        }
        Object.defineProperty(Sprite.prototype, "size", {
            get: function () {
                return this.width;
            },
            set: function (value) {
                this.width = value;
                this.height = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "manager", {
            get: function () {
                return this._manager;
            },
            set: function (value) {
                if (this._manager && value !== this._manager) {
                    this.remove();
                    this._manager = value;
                }
                if (value) {
                    var index = value.sprites.indexOf(this);
                    if (index == -1)
                        value.sprites.push(this);
                }
            },
            enumerable: true,
            configurable: true
        });
        Sprite.prototype.playAnimation = function (from, to, loop, delay, onAnimationEnd) {
            this._fromIndex = from;
            this._toIndex = to;
            this._loopAnimation = loop;
            this._delay = delay;
            this._animationStarted = true;
            this._direction = from < to ? 1 : -1;
            this.cellIndex = from;
            this._time = 0;
            this._onAnimationEnd = onAnimationEnd;
        };
        Sprite.prototype.stopAnimation = function () {
            this._animationStarted = false;
        };
        Sprite.prototype._animate = function (deltaTime) {
            if (!this._animationStarted)
                return;
            this._time += deltaTime;
            if (this._time > this._delay) {
                this._time = this._time % this._delay;
                this.cellIndex += this._direction;
                if (this.cellIndex === this._toIndex) {
                    if (this._loopAnimation) {
                        this.cellIndex = this._fromIndex;
                    }
                    else {
                        this._animationStarted = false;
                        if (this._onAnimationEnd) {
                            this._onAnimationEnd();
                        }
                        if (this.disposeWhenFinishedAnimating) {
                            this.dispose();
                        }
                    }
                }
            }
        };
        Sprite.prototype.dispose = function () {
            this.remove();
            this._manager = null;
        };
        Sprite.prototype.remove = function () {
            var index = this._manager.sprites.indexOf(this);
            if (index != -1)
                this._manager.sprites.splice(index, 1);
        };
        return Sprite;
    }());
    BABYLON.Sprite = Sprite;
})(BABYLON || (BABYLON = {}));

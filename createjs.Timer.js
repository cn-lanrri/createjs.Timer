var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * @module createjs
 */
var createjs;
(function (createjs) {
    /**
     * 事件触发基类
     * @class createjs.EventDispatcher
     * @public
     * @since 1.0.0
     */
    var EventDispatcher = (function () {
        function EventDispatcher() {
            var _this = this;
            _this.eventTypes = null;
            _this._instanceType = "createjs.EventDispatcher";
            _this.eventTypes = {};
            return _this;
        }
        /**
         * 给对象添加一个侦听
         * @method addEventListener
         * @public
         * @since 1.0.0
         * @param {string} type 侦听类形
         * @param {Function}listener 侦听后的回调方法,如果这个方法是类实例的方法,为了this引用的正确性,请在方法参数后加上.bind(this);
         * @example
         *      this.addEventListener(createjs.Event.ADD_TO_createjs,function(e){trace(this);}.bind(this));
         */
        EventDispatcher.prototype.addEventListener = function (type, listener) {
            if (!type) {
                throw new Error("添加侦听的type值为undefined");
            }
            if (!listener) {
                throw new Error("侦听回调函数不能为null");
            }
            var s = this;
            if (!s.eventTypes[type]) {
                s.eventTypes[type] = [];
            }
            if (s.eventTypes[type].indexOf(listener) < 0) {
                s.eventTypes[type].unshift(listener);
                if (type.indexOf("onMouse") == 0) {
                    s._changeMouseCount(type, true);
                }
            }
        };
        /**
         * 广播侦听
         * @method dispatchEvent
         * @public
         * @since 1.0.0
         * @param {createjs.Event|string} event 广播所带的事件对象,如果传的是字符串则直接自动生成一个的事件对象,事件类型就是你传入进来的字符串的值
         * @param {Object} data 广播后跟着事件一起传过去的其他任信息,默认值为null
         * @returns {boolean} 如果有收听者则返回true
         * @example
         *      var mySprite=new createjs.Sprite(),
         *          yourEvent=new createjs.Event("yourCustomerEvent");
         *       yourEvent.data='Flash2x';
         *       mySprite.addEventListener("yourCustomerEvent",function(e){
         *          trace(e.data);
         *        })
         *       mySprite.dispatchEvent(yourEvent);
         */
        EventDispatcher.prototype.dispatchEvent = function (event, data) {
            if (data === void 0) { data = null; }
            var s = this;
            if (typeof (event) == "string") {
                event = new createjs.Event(event);
            }
            var listeners = s.eventTypes[event.type];
            if (listeners) {
                var len = listeners.length;
                if (event.target == null) {
                    event.target = s;
                }
                if (data != null) {
                    event.data = data;
                }
                for (var i = len - 1; i >= 0; i--) {
                    if (listeners[i]) {
                        listeners[i](event);
                    }
                    else {
                        listeners.splice(i, 1);
                    }
                }
                return true;
            }
            else {
                return false;
            }
        };
        /**
         * 是否有添加过此类形的侦听
         * @method hasEventListener
         * @public
         * @since 1.0.0
         * @param {string} type 侦听类形
         * @returns {boolean} 如果有则返回true
         */
        EventDispatcher.prototype.hasEventListener = function (type) {
            if (this.eventTypes[type] && this.eventTypes[type].length > 0) {
                return true;
            }
            return false;
        };
        /**
         * 移除对应类型的侦听
         * @method removeEventListener
         * @public
         * @since 1.0.0
         * @param {string} type 要移除的侦听类型
         * @param {Function} listener 及侦听时绑定的回调方法
         */
        EventDispatcher.prototype.removeEventListener = function (type, listener) {
            var s = this;
            var listeners = s.eventTypes[type];
            if (listeners) {
                var len = listeners.length;
                for (var i = len - 1; i >= 0; i--) {
                    if (listeners[i] === listener) {
                        listeners.splice(i, 1);
                        if (type.indexOf("onMouse") == 0) {
                            s._changeMouseCount(type, false);
                        }
                    }
                }
            }
        };
        /**
         * 移除对象中所有的侦听
         * @method removeAllEventListener
         * @public
         * @since 1.0.0
         */
        EventDispatcher.prototype.removeAllEventListener = function () {
            var s = this;
            for (var type in s.eventTypes) {
                if (type.indexOf("onMouse") == 0) {
                    for (var j = 0; j < s.eventTypes[type].length; j++) {
                        s._changeMouseCount(type, false);
                    }
                }
            }
            s.eventTypes = {};
        };
        return EventDispatcher;
    }());

    /**
     * 事件类,createjs引擎中一切事件的基类
     * @class createjs.Event
     * @extends createjs.AObject
     * @public
     * @since 1.0.0
     */
    var Event = (function () {
        /**
         * @method Event
         * @param {string} type 事件类型
         */
        function Event(type) {
            var _this = this;
            /**
             * 事件类型名
             * @property type
             * @type {string}
             * @public
             * @since 1.0.0
             */
            _this.type = "";
            /**
             * 触发此事件的对象
             * @property target
             * @public
             * @since 1.0.0
             * @type {any}
             */
            _this.target = null;
            /**
             * 随着事件一起附带的信息对象
             * 所有需要随事件一起发送的信息都可以放在此对象中
             * @property data
             * @public
             * @since 1.0.0
             * @type {any}
             * @default null
             */
            _this.data = null;
            /**
             * 是否阻止事件向下冒泡
             * @property _pd
             * @type {boolean}
             * @private
             * @since 1.0.0
             */
            _this._pd = false;
            _this._instanceType = "createjs.Event";
            _this.type = type;
            return _this;
        }
        /**
         * 阻止向下冒泡事件,如果在接收到事件后调用事件的这个方法,那么这个事件将不会再向显示对象的子级派送
         * @method preventDefault
         * @public
         * @since 1.0.0
         */
        Event.prototype.preventDefault = function () {
            this._pd = true;
        };
        /**
         * 定时器触发事件
         * @property TIMER
         * @static
         * @since 1.0.9
         * @public
         * @type {string}
         */
        Event.TIMER = "onTimer";
        /**
         * 定时器完成事件
         * @property TIMER_COMPLETE
         * @since 1.0.9
         * @static
         * @public
         * @type {string}
         */
        Event.TIMER_COMPLETE = "onTimerComplete";
        return Event;
    }());

    /**
     * 定时器类
     * @class createjs.Timer
     * @public
     * @since 1.0.0
     */
    var Timer = (function (_super) {
        __extends(Timer, _super);
        /**
         * 构造函数，初始化
         * @method Timer
         * @param {number} delay
         * @param {number} repeatCount
         * @example
         *      var timer=new createjs.Timer(1000,10);
         *      timer.addEventListener(createjs.Event.TIMER,function (e) {
         *          trace("once");
         *      })
         *      timer.addEventListener(createjs.Event.TIMER_COMPLETE, function (e) {
         *          trace("complete");
         *          e.target.kill();
         *      })
         *      timer.start();
         */
        function Timer(delay, repeatCount) {
            if (repeatCount === void 0) { repeatCount = 0; }
            var _this = _super.call(this) || this;
            _this._currentCount = 0;
            _this._delay = 0;
            _this._frameDelay = 0;
            _this._currentFrameDelay = 0;
            _this._repeatCount = 0;
            _this._running = false;
            if (delay <= 0) {
                delay = 1;
            }
            var s = _this;
            s._delay = delay;
            s._frameDelay = Math.ceil(delay * 0.001 * 60);
            s._repeatCount = repeatCount;
            Timer._timerList.push(s);
            return _this;
        }
        /**
         * 重置定时器
         * @method reset
         * @public
         * @since 1.0.0
         */
        Timer.prototype.reset = function () {
            var s = this;
            s._running = false;
            s._currentCount = 0;
            s._currentFrameDelay = 0;
        };
        /**
         * 开始执行定时器
         * @method start
         * @public
         * @since 1.0.0
         */
        Timer.prototype.start = function () {
            var s = this;
            s._running = true;
            if (s._currentCount == s._repeatCount) {
                s._currentCount = 0;
            }
        };
        /**
         * 停止执行定时器，通过再次调用start方法可以接着之前未完成的状态运行
         * @method stop
         * @public
         * @since 1.0.0
         */
        Timer.prototype.stop = function () {
            this._running = false;
        };
        Object.defineProperty(Timer.prototype, "currentCount", {
            /**
             * 当前触发了多少次Timer事件
             * @property currentCount
             * @readonly
             * @public
             * @since 1.0.0
             * @returns {number}
             */
            get: function () {
                return this._currentCount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Timer.prototype, "delay", {
            /**
             * 设置或者获取当前定时器之间的执行间隔
             * @property delay
             * @since 1.0.0
             * @public
             * @returns {number}
             */
            get: function () {
                return this._delay;
            },
            set: function (value) {
                this._delay = value;
                this._frameDelay = Math.ceil(value * 0.001 * 60);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Timer.prototype, "repeatCount", {
            /**
             * 执行触发Timer 的总次数
             * @public
             * @since 1.0.0
             * @returns {number}
             */
            get: function () {
                return this._repeatCount;
            },
            set: function (value) {
                if (value < 0) {
                    value = 0;
                }
                this._repeatCount = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Timer.prototype, "running", {
            /**
             * 当前是否在运行中
             * @property running
             * @since 1.0.0
             * @returns {boolean}
             */
            get: function () {
                return this._running;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 定时器不用了，一定要记得杀死它，不然他会变成厉鬼，时时残绕着你
         * @method kill
         * @public
         * @since 1.0.0
         */
        Timer.prototype.kill = function () {
            var len = Timer._timerList.length;
            var s = this;
            for (var i = 0; i < len; i++) {
                if (Timer._timerList[i]._instanceId == s._instanceId) {
                    Timer._timerList.splice(i, 1);
                    break;
                }
            }
        };
        Timer.prototype.update = function () {
            var s = this;
            if (s._running) {
                s._currentFrameDelay++;
                if (s._currentFrameDelay == s._frameDelay) {
                    if (s._repeatCount) {
                        s._currentCount++;
                    }
                    s._currentFrameDelay = 0;
                    //触发事件
                    s.dispatchEvent("onTimer");
                    if (s._repeatCount && s._currentCount == s._repeatCount) {
                        //触发完成时事件
                        s._running = false;
                        s.dispatchEvent("onTimerComplete");
                    }
                }
            }
        };
        Timer.flush = function () {
            var len = Timer._timerList.length;
            for (var i = len - 1; i >= 0; i--) {
                if (Timer._timerList[i]) {
                    Timer._timerList[i].update();
                }
                else {
                    Timer._timerList.splice(i, 1);
                }
            }
        };
        Timer._timerList = [];
        return Timer;
    }(createjs.EventDispatcher));
    createjs.EventDispatcher = EventDispatcher;
    createjs.Event = Event;
    createjs.Timer = Timer;
})(createjs || (createjs = {}));

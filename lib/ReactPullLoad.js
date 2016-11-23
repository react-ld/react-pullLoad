'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

require('./ReactPullLoad.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STATS = {
  init: '',
  pulling: 'pulling',
  enough: 'pulling enough',
  refreshing: 'refreshing',
  refreshed: 'refreshed',
  reset: 'reset',

  loading: 'loading' // loading more
};
var endState = {
  loaderState: STATS.reset,
  pullHeight: 0
};

function addEvent(obj, type, fn) {
  if (obj.attachEvent) {
    obj['e' + type + fn] = fn;
    obj[type + fn] = function () {
      obj['e' + type + fn](window.event);
    };
    obj.attachEvent('on' + type, obj[type + fn]);
  } else obj.addEventListener(type, fn, false);
}
function removeEvent(obj, type, fn) {
  if (obj.detachEvent) {
    obj.detachEvent('on' + type, obj[type + fn]);
    obj[type + fn] = null;
  } else obj.removeEventListener(type, fn, false);
}

var ReactPullLoad = function (_Component) {
  _inherits(ReactPullLoad, _Component);

  function ReactPullLoad(props) {
    _classCallCheck(this, ReactPullLoad);

    var _this = _possibleConstructorReturn(this, (ReactPullLoad.__proto__ || Object.getPrototypeOf(ReactPullLoad)).call(this, props));

    _this.onTouchStart = _this.onTouchStart.bind(_this);
    _this.onTouchMove = _this.onTouchMove.bind(_this);
    _this.onTouchEnd = _this.onTouchEnd.bind(_this);
    _this.onPullDownMove = _this.onPullDownMove.bind(_this);
    _this.onPullDownRefresh = _this.onPullDownRefresh.bind(_this);
    _this.onPullUpMove = _this.onPullUpMove.bind(_this);
    _this.container = null;
    _this.state = {
      loaderState: STATS.init,
      pullHeight: 0
    };
    return _this;
  }

  _createClass(ReactPullLoad, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props;
      var isBlockContainer = _props.isBlockContainer;
      var offsetScrollTop = _props.offsetScrollTop;
      var downEnough = _props.downEnough;
      var distanceBottom = _props.distanceBottom;

      this.defaultConfig = {
        container: isBlockContainer ? (0, _reactDom.findDOMNode)(this) : document.body,
        offsetScrollTop: offsetScrollTop,
        downEnough: downEnough,
        distanceBottom: distanceBottom
      };
      console.info("downEnough = ", downEnough, this.defaultConfig.downEnough);
      addEvent(this.refs.container, "touchstart", this.onTouchStart);
      addEvent(this.refs.container, "touchmove", this.onTouchMove);
      addEvent(this.refs.container, "touchend", this.onTouchEnd);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      removeEvent(this.refs.container, "touchstart", this.onTouchStart);
      removeEvent(this.refs.container, "touchmove", this.onTouchMove);
      removeEvent(this.refs.container, "touchend", this.onTouchEnd);
    }
    // 拖拽的缓动公式 - easeOutSine

  }, {
    key: 'easing',
    value: function easing(distance) {
      // t: current time, b: begInnIng value, c: change In value, d: duration
      var t = distance;
      var b = 0;
      var d = screen.availHeight; // 允许拖拽的最大距离
      var c = d / 2.5; // 提示标签最大有效拖拽距离

      return c * Math.sin(t / d * (Math.PI / 2)) + b;
    }
  }, {
    key: 'canRefresh',
    value: function canRefresh() {
      return this.props.onRefresh && [STATS.refreshing, STATS.loading].indexOf(this.state.loaderState) < 0;
    }
  }, {
    key: 'onPullDownMove',
    value: function onPullDownMove(data) {
      if (!this.canRefresh()) return false;

      var loaderState = void 0,
          diff = data[0].touchMoveY - data[0].touchStartY;
      if (diff < 0) {
        diff = 0;
      }
      diff = this.easing(diff);
      if (diff > this.defaultConfig.downEnough) {
        loaderState = STATS.enough;
      } else {
        loaderState = STATS.pulling;
      }
      this.setState({
        pullHeight: diff,
        loaderState: loaderState
      });
    }
  }, {
    key: 'onPullDownRefresh',
    value: function onPullDownRefresh() {
      var _this2 = this;

      if (!this.canRefresh()) return false;

      if (this.state.loaderState === STATS.pulling) {
        this.setState(endState);
      } else {
        this.setState({
          pullHeight: 0,
          loaderState: STATS.refreshing
        });
        if (typeof this.props.onRefresh === "function") {
          this.props.onRefresh(function () {
            _this2.setState({
              pullHeight: 0,
              loaderState: STATS.refreshed
            });
            setTimeout(function () {
              _this2.setState(endState);
            }, 1000);
          }, function () {
            _this2.setState(endState);
          });
        }
      }
    }
  }, {
    key: 'onPullUpMove',
    value: function onPullUpMove(data) {
      var _this3 = this;

      if (!this.canRefresh()) return false;
      var _props2 = this.props;
      var hasMore = _props2.hasMore;
      var onLoadMore = _props2.onLoadMore;

      if (typeof this.props.onLoadMore === "function" && hasMore) {
        this.setState({
          pullHeight: 0,
          loaderState: STATS.loading
        });

        onLoadMore(function () {
          _this3.setState(endState);
        });
      }
    }
  }, {
    key: 'onTouchStart',
    value: function onTouchStart(event) {
      console.info("onTouchStart");
      var targetEvent = event.changedTouches[0];
      this.startX = targetEvent.clientX;
      this.startY = targetEvent.clientY;
    }
  }, {
    key: 'onTouchMove',
    value: function onTouchMove(event) {
      var scrollTop = this.defaultConfig.container.scrollTop,
          scrollH = this.defaultConfig.container.scrollHeight,
          conH = this.defaultConfig.container === document.body ? document.documentElement.clientHeight : this.defaultConfig.container.offsetHeight,
          targetEvent = event.changedTouches[0],
          curX = targetEvent.clientX,
          curY = targetEvent.clientY,
          diffX = curX - this.startX,
          diffY = curY - this.startY;

      //判断垂直移动距离是否大于5 && 横向移动距离小于纵向移动距离
      if (Math.abs(diffY) > 5 && Math.abs(diffY) > Math.abs(diffX)) {
        //滚动距离小于设定值 &&回调onPullDownMove 函数，并且回传位置值
        if (diffY > 5 && scrollTop < this.defaultConfig.offsetScrollTop) {
          //阻止执行浏览器默认动作
          event.preventDefault();
          this.onPullDownMove([{
            touchStartY: this.startY,
            touchMoveY: curY
          }]);
        } //滚动距离距离底部小于设定值
        else if (diffY < 0 && scrollH - scrollTop - conH < this.defaultConfig.distanceBottom) {
            //阻止执行浏览器默认动作
            // event.preventDefault();
            this.onPullUpMove([{
              touchStartY: this.startY,
              touchMoveY: curY
            }]);
          }
      }
    }
  }, {
    key: 'onTouchEnd',
    value: function onTouchEnd(event) {
      var scrollTop = this.defaultConfig.container.scrollTop,
          targetEvent = event.changedTouches[0],
          curX = targetEvent.clientX,
          curY = targetEvent.clientY,
          diffX = curX - this.startX,
          diffY = curY - this.startY;

      //判断垂直移动距离是否大于5 && 横向移动距离小于纵向移动距离
      if (Math.abs(diffY) > 5 && Math.abs(diffY) > Math.abs(diffX)) {
        if (diffY > 5 && scrollTop < this.defaultConfig.offsetScrollTop) {
          //回调onPullDownRefresh 函数，即满足刷新条件
          this.onPullDownRefresh();
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props;
      var children = _props3.children;
      var onRefresh = _props3.onRefresh;
      var onLoadMore = _props3.onLoadMore;
      var hasMore = _props3.hasMore;
      var initializing = _props3.initializing;
      var className = _props3.className;
      var offsetScrollTop = _props3.offsetScrollTop;
      var downEnough = _props3.downEnough;
      var distanceBottom = _props3.distanceBottom;
      var isBlockContainer = _props3.isBlockContainer;

      var other = _objectWithoutProperties(_props3, ['children', 'onRefresh', 'onLoadMore', 'hasMore', 'initializing', 'className', 'offsetScrollTop', 'downEnough', 'distanceBottom', 'isBlockContainer']);

      var _state = this.state;
      var pullHeight = _state.pullHeight;
      var loaderState = _state.loaderState;


      var msgStyle = pullHeight ? {
        WebkitTransform: 'translate3d(0, ' + pullHeight + 'px, 0)',
        transform: 'translate3d(0, ' + pullHeight + 'px, 0)'
      } : null;

      var symbolTop = pullHeight - 50 > 0 ? pullHeight - 50 : 0;
      var msgStyle2 = pullHeight ? {
        WebkitTransform: 'translate3d(0, ' + symbolTop + 'px, 0)',
        transform: 'translate3d(0, ' + symbolTop + 'px, 0)'
      } : null;

      var boxClassName = className + ' tloader state-' + loaderState;

      return _react2.default.createElement(
        'div',
        _extends({}, other, { className: boxClassName, ref: 'container' }),
        _react2.default.createElement(
          'div',
          { className: 'tloader-symbol', style: msgStyle2 },
          _react2.default.createElement(
            'p',
            { className: 'tloader-msg' },
            _react2.default.createElement('i', null)
          ),
          _react2.default.createElement(
            'p',
            { className: 'tloader-loading' },
            _react2.default.createElement('i', { className: 'ui-loading' })
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'tloader-body', style: msgStyle },
          children
        ),
        _react2.default.createElement(
          'div',
          { className: 'tloader-footer' },
          !hasMore ? _react2.default.createElement('p', { className: 'tloader-btn' }) : null,
          _react2.default.createElement(
            'p',
            { className: 'tloader-loading' },
            _react2.default.createElement('i', { className: 'ui-loading' })
          )
        )
      );
    }
  }]);

  return ReactPullLoad;
}(_react.Component);

exports.default = ReactPullLoad;


ReactPullLoad.propTypes = {
  onRefresh: _react.PropTypes.func.isRequired,
  onLoadMore: _react.PropTypes.func,
  hasMore: _react.PropTypes.bool, //是否还有更多内容可加载
  offsetScrollTop: _react.PropTypes.number,
  downEnough: _react.PropTypes.number, //下拉满足刷新的距离
  distanceBottom: _react.PropTypes.number, //距离底部距离触发加载更多
  isBlockContainer: _react.PropTypes.bool
};
//设置 props 默认值
ReactPullLoad.defaultProps = {
  hasMore: true,
  offsetScrollTop: 1,
  downEnough: 100,
  distanceBottom: 100,
  isBlockContainer: false,
  className: ""
};
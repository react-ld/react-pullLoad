'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _constants = require('./constants');

var _HeadNode = require('./HeadNode');

var _HeadNode2 = _interopRequireDefault(_HeadNode);

var _FooterNode = require('./FooterNode');

var _FooterNode2 = _interopRequireDefault(_FooterNode);

require('./ReactPullLoad.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

  function ReactPullLoad() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ReactPullLoad);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ReactPullLoad.__proto__ || Object.getPrototypeOf(ReactPullLoad)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      pullHeight: 0
    }, _this.getScrollTop = function () {
      if (_this.defaultConfig.container) {
        return _this.defaultConfig.container.scrollTop;
      } else {
        return 0;
      }
    }, _this.setScrollTop = function (value) {
      if (_this.defaultConfig.container) {
        var scrollH = _this.defaultConfig.container.scrollHeight;
        if (value < 0) {
          value = 0;
        }
        if (value > scrollH) {
          value = scrollH;
        }
        return _this.defaultConfig.container.scrollTop = value;
      } else {
        return 0;
      }
    }, _this.easing = function (distance) {
      // t: current time, b: begInnIng value, c: change In value, d: duration
      var t = distance;
      var b = 0;
      var d = screen.availHeight; // 允许拖拽的最大距离
      var c = d / 2.5; // 提示标签最大有效拖拽距离

      return c * Math.sin(t / d * (Math.PI / 2)) + b;
    }, _this.canRefresh = function () {
      return [_constants.STATS.refreshing, _constants.STATS.loading].indexOf(_this.props.action) < 0;
    }, _this.onPullDownMove = function (data) {
      if (!_this.canRefresh()) return false;

      var loaderState = void 0,
          diff = data[0].touchMoveY - data[0].touchStartY;
      if (diff < 0) {
        diff = 0;
      }
      diff = _this.easing(diff);
      if (diff > _this.defaultConfig.downEnough) {
        loaderState = _constants.STATS.enough;
      } else {
        loaderState = _constants.STATS.pulling;
      }
      _this.setState({
        pullHeight: diff
      });
      _this.props.handleAction(loaderState);
    }, _this.onPullDownRefresh = function () {
      if (!_this.canRefresh()) return false;

      if (_this.props.action === _constants.STATS.pulling) {
        _this.setState({ pullHeight: 0 });
        _this.props.handleAction(_constants.STATS.reset);
      } else {
        _this.setState({
          pullHeight: 0
        });
        _this.props.handleAction(_constants.STATS.refreshing);
      }
    }, _this.onPullUpMove = function (data) {
      if (!_this.canRefresh()) return false;

      // const { hasMore, onLoadMore} = this.props
      // if (this.props.hasMore) {
      _this.setState({
        pullHeight: 0
      });
      _this.props.handleAction(_constants.STATS.loading);
      // }
    }, _this.onTouchStart = function (event) {
      var targetEvent = event.changedTouches[0];
      _this.startX = targetEvent.clientX;
      _this.startY = targetEvent.clientY;
    }, _this.onTouchMove = function (event) {
      var scrollTop = _this.defaultConfig.container.scrollTop,
          scrollH = _this.defaultConfig.container.scrollHeight,
          conH = _this.defaultConfig.container === document.body ? document.documentElement.clientHeight : _this.defaultConfig.container.offsetHeight,
          targetEvent = event.changedTouches[0],
          curX = targetEvent.clientX,
          curY = targetEvent.clientY,
          diffX = curX - _this.startX,
          diffY = curY - _this.startY;

      //判断垂直移动距离是否大于5 && 横向移动距离小于纵向移动距离
      if (Math.abs(diffY) > 5 && Math.abs(diffY) > Math.abs(diffX)) {
        //滚动距离小于设定值 &&回调onPullDownMove 函数，并且回传位置值
        if (diffY > 5 && scrollTop < _this.defaultConfig.offsetScrollTop) {
          //阻止执行浏览器默认动作
          event.preventDefault();
          _this.onPullDownMove([{
            touchStartY: _this.startY,
            touchMoveY: curY
          }]);
        } //滚动距离距离底部小于设定值
        else if (diffY < 0 && scrollH - scrollTop - conH < _this.defaultConfig.distanceBottom) {
            //阻止执行浏览器默认动作
            // event.preventDefault();
            _this.onPullUpMove([{
              touchStartY: _this.startY,
              touchMoveY: curY
            }]);
          }
      }
    }, _this.onTouchEnd = function (event) {
      var scrollTop = _this.defaultConfig.container.scrollTop,
          targetEvent = event.changedTouches[0],
          curX = targetEvent.clientX,
          curY = targetEvent.clientY,
          diffX = curX - _this.startX,
          diffY = curY - _this.startY;

      //判断垂直移动距离是否大于5 && 横向移动距离小于纵向移动距离
      if (Math.abs(diffY) > 5 && Math.abs(diffY) > Math.abs(diffX)) {
        if (diffY > 5 && scrollTop < _this.defaultConfig.offsetScrollTop) {
          //回调onPullDownRefresh 函数，即满足刷新条件
          _this.onPullDownRefresh();
        }
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }
  //set props default values


  _createClass(ReactPullLoad, [{
    key: 'componentDidMount',


    // container = null;

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
      // console.info("downEnough = ", downEnough, this.defaultConfig.downEnough)
      /*
        As below reason handle touch event self ( widthout react defualt touch)
        Unable to preventDefault inside passive event listener due to target being treated as passive. See https://www.chromestatus.com/features/5093566007214080
      */
      addEvent(this.refs.container, "touchstart", this.onTouchStart);
      addEvent(this.refs.container, "touchmove", this.onTouchMove);
      addEvent(this.refs.container, "touchend", this.onTouchEnd);
    }

    // 未考虑到 children 及其他 props 改变的情况
    // shouldComponentUpdate(nextProps, nextState) {
    //   if(this.props.action === nextProps.action && this.state.pullHeight === nextState.pullHeight){
    //     //console.info("[ReactPullLoad] info new action is equal to old action",this.state.pullHeight,nextState.pullHeight);
    //     return false
    //   } else{
    //     return true
    //   }
    // }

  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      removeEvent(this.refs.container, "touchstart", this.onTouchStart);
      removeEvent(this.refs.container, "touchmove", this.onTouchMove);
      removeEvent(this.refs.container, "touchend", this.onTouchEnd);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      if (nextProps.action === _constants.STATS.refreshed) {
        setTimeout(function () {
          _this2.props.handleAction(_constants.STATS.reset);
        }, 1000);
      }
    }

    // 拖拽的缓动公式 - easeOutSine

  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props;
      var children = _props2.children;
      var action = _props2.action;
      var handleAction = _props2.handleAction;
      var hasMore = _props2.hasMore;
      var className = _props2.className;
      var offsetScrollTop = _props2.offsetScrollTop;
      var downEnough = _props2.downEnough;
      var distanceBottom = _props2.distanceBottom;
      var isBlockContainer = _props2.isBlockContainer;
      var HeadNode = _props2.HeadNode;
      var FooterNode = _props2.FooterNode;

      var other = _objectWithoutProperties(_props2, ['children', 'action', 'handleAction', 'hasMore', 'className', 'offsetScrollTop', 'downEnough', 'distanceBottom', 'isBlockContainer', 'HeadNode', 'FooterNode']);

      var pullHeight = this.state.pullHeight;


      var msgStyle = pullHeight ? {
        WebkitTransform: 'translate3d(0, ' + pullHeight + 'px, 0)',
        transform: 'translate3d(0, ' + pullHeight + 'px, 0)'
      } : null;

      var boxClassName = className + ' pull-load state-' + action;

      return _react2.default.createElement(
        'div',
        _extends({}, other, {
          className: boxClassName,
          ref: 'container' }),
        _react2.default.createElement(
          'div',
          { className: 'pull-load-body', style: msgStyle },
          _react2.default.createElement(
            'div',
            { className: 'pull-load-head' },
            _react2.default.createElement(HeadNode, { loaderState: action })
          ),
          children,
          _react2.default.createElement(
            'div',
            { className: 'pull-load-footer' },
            _react2.default.createElement(FooterNode, { loaderState: action, hasMore: hasMore })
          )
        )
      );
    }
  }]);

  return ReactPullLoad;
}(_react.Component);

ReactPullLoad.propTypes = {
  action: _react.PropTypes.string.isRequired, //用于同步状态
  handleAction: _react.PropTypes.func.isRequired, //用于处理状态
  hasMore: _react.PropTypes.bool, //是否还有更多内容可加载
  offsetScrollTop: _react.PropTypes.number, //必须大于零，使触发刷新往下偏移，隐藏部分顶部内容
  downEnough: _react.PropTypes.number, //下拉满足刷新的距离
  distanceBottom: _react.PropTypes.number, //距离底部距离触发加载更多
  isBlockContainer: _react.PropTypes.bool,

  HeadNode: _react.PropTypes.any, //refresh message react dom
  FooterNode: _react.PropTypes.any };
ReactPullLoad.defaultProps = {
  hasMore: true,
  offsetScrollTop: 1,
  downEnough: 100,
  distanceBottom: 100,
  isBlockContainer: false,
  className: "",
  HeadNode: _HeadNode2.default, //refresh message react dom
  FooterNode: _FooterNode2.default };
exports.default = ReactPullLoad;
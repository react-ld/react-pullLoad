'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FooterNode = function (_PureComponent) {
  _inherits(FooterNode, _PureComponent);

  function FooterNode() {
    _classCallCheck(this, FooterNode);

    return _possibleConstructorReturn(this, (FooterNode.__proto__ || Object.getPrototypeOf(FooterNode)).apply(this, arguments));
  }

  _createClass(FooterNode, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var loaderState = _props.loaderState;
      var hasMore = _props.hasMore;


      var className = 'pull-load-footer-default ' + (hasMore ? "" : "nomore");

      return _react2.default.createElement(
        'div',
        { className: className },
        _react2.default.createElement('i', null)
      );
    }
  }]);

  return FooterNode;
}(_react.PureComponent);

FooterNode.propTypes = {
  loaderState: _react.PropTypes.string.isRequired,
  hasMore: _react.PropTypes.bool.isRequired
};
FooterNode.defaultProps = {
  loaderState: _constants.STATS.init,
  hasMore: true
};
exports.default = FooterNode;
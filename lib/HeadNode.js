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

var HeadNode = function (_PureComponent) {
  _inherits(HeadNode, _PureComponent);

  function HeadNode() {
    _classCallCheck(this, HeadNode);

    return _possibleConstructorReturn(this, (HeadNode.__proto__ || Object.getPrototypeOf(HeadNode)).apply(this, arguments));
  }

  _createClass(HeadNode, [{
    key: 'render',
    value: function render() {
      var loaderState = this.props.loaderState;


      return _react2.default.createElement(
        'div',
        { className: 'pull-load-head-default' },
        _react2.default.createElement('i', null)
      );
    }
  }]);

  return HeadNode;
}(_react.PureComponent);

HeadNode.propTypes = {
  loaderState: _react.PropTypes.string.isRequired
};
HeadNode.defaultProps = {
  loaderState: _constants.STATS.init
};
exports.default = HeadNode;
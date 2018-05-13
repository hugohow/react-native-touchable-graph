Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zoomContainerMixin = undefined;

var _isFunction2 = require("lodash/isFunction");

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _defaults2 = require("lodash/defaults");

var _defaults3 = _interopRequireDefault(_defaults2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _zoomHelpers = require("./zoom-helpers");

var _zoomHelpers2 = _interopRequireDefault(_zoomHelpers);

var _victoryCore = require("victory-core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_DOWNSAMPLE = 150;

var zoomContainerMixin = exports.zoomContainerMixin = function (base) {
  var _class, _temp;

  return _temp = _class = function (_base) {
    _inherits(VictoryZoomContainer, _base);

    function VictoryZoomContainer() {
      _classCallCheck(this, VictoryZoomContainer);

      return _possibleConstructorReturn(this, (VictoryZoomContainer.__proto__ || Object.getPrototypeOf(VictoryZoomContainer)).apply(this, arguments));
    }

    _createClass(VictoryZoomContainer, [{
      key: "clipDataComponents",
      value: function clipDataComponents(children, props) {
        var scale = props.scale,
            clipContainerComponent = props.clipContainerComponent,
            polar = props.polar,
            origin = props.origin;

        var rangeX = scale.x.range();
        var rangeY = scale.y.range();
        var plottableWidth = Math.abs(rangeX[0] - rangeX[1]);
        var plottableHeight = Math.abs(rangeY[0] - rangeY[1]);
        var radius = Math.max.apply(Math, _toConsumableArray(rangeY));
        var groupComponent = _react2.default.cloneElement(clipContainerComponent, _extends({
          clipWidth: plottableWidth,
          clipHeight: plottableHeight,
          translateX: Math.min.apply(Math, _toConsumableArray(rangeX)),
          translateY: Math.min.apply(Math, _toConsumableArray(rangeY)),
          polar: polar,
          origin: polar ? origin : undefined,
          radius: polar ? radius : undefined
        }, clipContainerComponent.props));
        return _react2.default.Children.toArray(children).map(function (child) {
          var role = child && child.type && child.type.role;
          if (role === "axis" || role === "legend" || role === "label") {
            return child;
          } else {
            return _react2.default.cloneElement(child, { groupComponent: groupComponent });
          }
        });
      }
    }, {
      key: "modifyPolarDomain",
      value: function modifyPolarDomain(domain, originalDomain) {
        // Only zoom the radius of polar charts. Zooming angles is very confusing
        return {
          x: originalDomain.x,
          y: [0, domain.y[1]]
        };
      }
    }, {
      key: "downsampleZoomData",
      value: function downsampleZoomData(props, child, domain) {
        var downsample = props.downsample;


        var getData = function (childProps) {
          var data = childProps.data,
              x = childProps.x,
              y = childProps.y;

          var defaultGetData = child.type && (0, _isFunction3.default)(child.type.getData) ? child.type.getData : function () {
            return undefined;
          };
          // skip costly data formatting if x and y accessors are not present
          return Array.isArray(data) && !x && !y ? data : defaultGetData(childProps);
        };

        var data = getData(child.props);

        // return undefined if downsample is not run, then default() will replace with child.props.data
        if (!downsample || !domain || !data) {
          return undefined;
        }

        var maxPoints = downsample === true ? DEFAULT_DOWNSAMPLE : downsample;
        var dimension = props.zoomDimension || "x";

        // important: assumes data is ordered by dimension
        // get the start and end of the data that is in the current visible domain
        var startIndex = data.findIndex(function (d) {
          return d[dimension] >= domain[dimension][0];
        });
        var endIndex = data.findIndex(function (d) {
          return d[dimension] > domain[dimension][1];
        });
        // pick one more point (if available) at each end so that VictoryLine, VictoryArea connect
        if (startIndex !== 0) {
          startIndex -= 1;
        }
        if (endIndex !== -1) {
          endIndex += 1;
        }

        var visibleData = data.slice(startIndex, endIndex);

        return _victoryCore.Data.downsample(visibleData, maxPoints, startIndex);
      }
    }, {
      key: "modifyChildren",
      value: function modifyChildren(props) {
        var _this2 = this;

        var childComponents = _react2.default.Children.toArray(props.children);

        //eslint-disable-next-line max-statements
        return childComponents.map(function (child) {
          var role = child && child.type && child.type.role;
          var currentChild = child;
          var currentDomain = props.currentDomain,
              zoomActive = props.zoomActive,
              allowZoom = props.allowZoom;

          var originalDomain = (0, _defaults3.default)({}, props.originalDomain, props.domain);
          var zoomDomain = (0, _defaults3.default)({}, props.zoomDomain, props.domain);
          var cachedZoomDomain = (0, _defaults3.default)({}, props.cachedZoomDomain, props.domain);
          var domain = void 0;
          if (!_zoomHelpers2.default.checkDomainEquality(zoomDomain, cachedZoomDomain)) {
            // if zoomDomain has been changed, use it
            domain = zoomDomain;
          } else if (allowZoom && !zoomActive) {
            // if user has zoomed all the way out, use the child domain
            domain = currentChild.props.domain;
          } else {
            // default: use currentDomain, set by the event handlers
            domain = (0, _defaults3.default)({}, currentDomain, originalDomain);
          }

          var newDomain = props.polar ? _this2.modifyPolarDomain(domain, originalDomain) : domain;
          if (newDomain && props.zoomDimension) {
            // if zooming is restricted to a dimension, don't squash changes to zoomDomain in other dim
            newDomain = _extends({}, zoomDomain, _defineProperty({}, props.zoomDimension, newDomain[props.zoomDimension]));
          }
          return _react2.default.cloneElement(currentChild, (0, _defaults3.default)({
            domain: newDomain,
            data: role === "legend" ? undefined : _this2.downsampleZoomData(props, currentChild, newDomain)
          }, currentChild.props));
        });
      }

      // Overrides method in VictoryContainer

    }, {
      key: "getChildren",
      value: function getChildren(props) {
        var children = this.modifyChildren(props);
        return this.clipDataComponents(children, props);
      }
    }]);

    return VictoryZoomContainer;
  }(base), _class.displayName = "VictoryZoomContainer", _class.propTypes = _extends({}, _victoryCore.VictoryContainer.propTypes, {
    allowPan: _propTypes2.default.bool,
    allowZoom: _propTypes2.default.bool,
    clipContainerComponent: _propTypes2.default.element.isRequired,
    disable: _propTypes2.default.bool,
    downsample: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.number]),
    minimumZoom: _propTypes2.default.shape({
      x: _propTypes2.default.number,
      y: _propTypes2.default.number
    }),
    onZoomDomainChange: _propTypes2.default.func,
    zoomDimension: _propTypes2.default.oneOf(["x", "y"]),
    zoomDomain: _propTypes2.default.shape({
      x: _victoryCore.PropTypes.domain,
      y: _victoryCore.PropTypes.domain
    })
  }), _class.defaultProps = _extends({}, _victoryCore.VictoryContainer.defaultProps, {
    clipContainerComponent: _react2.default.createElement(_victoryCore.VictoryClipContainer, null),
    allowPan: true,
    allowZoom: true,
    zoomActive: false
  }), _class.defaultEvents = function (props) {
    return [{
      target: "parent",
      eventHandlers: {
        onMouseDown: function (evt, targetProps) {
          return props.disable ? {} : _zoomHelpers2.default.onMouseDown(evt, targetProps);
        },
        onTouchStart: function (evt, targetProps) {
          return props.disable ? {} : _zoomHelpers2.default.onMouseDown(evt, targetProps);
        },
        onMouseUp: function (evt, targetProps) {
          return props.disable ? {} : _zoomHelpers2.default.onMouseUp(evt, targetProps);
        },
        onTouchEnd: function (evt, targetProps) {
          return props.disable ? {} : _zoomHelpers2.default.onMouseUp(evt, targetProps);
        },
        onMouseLeave: function (evt, targetProps) {
          return props.disable ? {} : _zoomHelpers2.default.onMouseLeave(evt, targetProps);
        },
        onTouchCancel: function (evt, targetProps) {
          return props.disable ? {} : _zoomHelpers2.default.onMouseLeave(evt, targetProps);
        },
        onMouseMove: function (evt, targetProps, eventKey, ctx) {
          // eslint-disable-line max-params
          if (props.disable) {
            return {};
          }
          return _zoomHelpers2.default.onMouseMove(evt, targetProps, eventKey, ctx);
        },
        onTouchMove: function (evt, targetProps, eventKey, ctx) {
          // eslint-disable-line max-params
          if (props.disable) {
            return {};
          }
          evt.preventDefault();
          return _zoomHelpers2.default.onMouseMove(evt, targetProps, eventKey, ctx);
        },
        // eslint-disable-next-line max-params
        onWheel: function (evt, targetProps, eventKey, ctx) {
          if (targetProps.allowZoom && !props.disable) {
            evt.preventDefault();
          }
          return props.disable ? {} : _zoomHelpers2.default.onWheel(evt, targetProps, eventKey, ctx);
        }
      }
    }];
  }, _temp;
};

exports.default = zoomContainerMixin(_victoryCore.VictoryContainer);
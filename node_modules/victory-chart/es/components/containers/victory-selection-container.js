var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from "prop-types";
import React from "react";
import { VictoryContainer } from "victory-core";
import SelectionHelpers from "./selection-helpers";

export var selectionContainerMixin = function (base) {
  var _class, _temp;

  return _temp = _class = function (_base) {
    _inherits(VictorySelectionContainer, _base);

    function VictorySelectionContainer() {
      _classCallCheck(this, VictorySelectionContainer);

      return _possibleConstructorReturn(this, (VictorySelectionContainer.__proto__ || Object.getPrototypeOf(VictorySelectionContainer)).apply(this, arguments));
    }

    _createClass(VictorySelectionContainer, [{
      key: "getRect",
      value: function getRect(props) {
        var x1 = props.x1,
            x2 = props.x2,
            y1 = props.y1,
            y2 = props.y2,
            selectionStyle = props.selectionStyle,
            selectionComponent = props.selectionComponent;

        var width = Math.abs(x2 - x1) || 1;
        var height = Math.abs(y2 - y1) || 1;
        var x = Math.min(x1, x2);
        var y = Math.min(y1, y2);
        return y2 && x2 && x1 && y1 ? React.cloneElement(selectionComponent, { x: x, y: y, width: width, height: height, style: selectionStyle }) : null;
      }

      // Overrides method in VictoryContainer

    }, {
      key: "getChildren",
      value: function getChildren(props) {
        var children = React.Children.toArray(props.children);
        return [].concat(_toConsumableArray(children), [this.getRect(props)]).map(function (component, i) {
          return component ? React.cloneElement(component, { key: i }) : null;
        });
      }
    }]);

    return VictorySelectionContainer;
  }(base), _class.displayName = "VictorySelectionContainer", _class.propTypes = _extends({}, VictoryContainer.propTypes, {
    activateSelectedData: PropTypes.bool,
    allowSelection: PropTypes.bool,
    disable: PropTypes.bool,
    onSelection: PropTypes.func,
    onSelectionCleared: PropTypes.func,
    selectionBlacklist: PropTypes.arrayOf(PropTypes.string),
    selectionComponent: PropTypes.element,
    selectionDimension: PropTypes.oneOf(["x", "y"]),
    selectionStyle: PropTypes.object
  }), _class.defaultProps = _extends({}, VictoryContainer.defaultProps, {
    activateSelectedData: true,
    allowSelection: true,
    selectionComponent: React.createElement("rect", null),
    selectionStyle: {
      stroke: "transparent",
      fill: "black",
      fillOpacity: 0.1
    }
  }), _class.defaultEvents = function (props) {
    return [{
      target: "parent",
      eventHandlers: {
        onMouseDown: function (evt, targetProps) {
          return props.disable ? {} : SelectionHelpers.onMouseDown(evt, targetProps);
        },
        onTouchStart: function (evt, targetProps) {
          return props.disable ? {} : SelectionHelpers.onMouseDown(evt, targetProps);
        },
        onMouseMove: function (evt, targetProps) {
          return props.disable ? {} : SelectionHelpers.onMouseMove(evt, targetProps);
        },
        onTouchMove: function (evt, targetProps) {
          return props.disable ? {} : SelectionHelpers.onMouseMove(evt, targetProps);
        },
        onMouseUp: function (evt, targetProps) {
          return props.disable ? {} : SelectionHelpers.onMouseUp(evt, targetProps);
        },
        onTouchEnd: function (evt, targetProps) {
          return props.disable ? {} : SelectionHelpers.onMouseUp(evt, targetProps);
        }
      }
    }];
  }, _temp;
};

export default selectionContainerMixin(VictoryContainer);
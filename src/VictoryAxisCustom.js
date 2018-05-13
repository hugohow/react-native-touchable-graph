import React from "react";
import { Dimensions } from "react-native";
import { G } from "react-native-svg";
import { VictoryAxis } from "victory-chart/es";
import { VictoryLabel, VictoryContainer, Axis } from 'victory-native'

class VictoryAxisCustom extends VictoryAxis {
    static defaultProps = Object.assign({}, VictoryAxis.defaultProps, {
        axisComponent: <Axis/>,
        axisLabelComponent: <VictoryLabel/>,
        tickLabelComponent: <VictoryLabel/>,
        tickComponent: <Axis/>,
        gridComponent: <Axis/>,
        containerComponent: <VictoryContainer/>,
        groupComponent: <G/>,
        width: Dimensions.get("window").width
      });

      componentDidMount() {
          const baseProps = this.baseProps
          const axisData = Object.keys(baseProps).map(function(key, index) {
            return { tickLabels: baseProps[key].tickLabels, tickAxis: baseProps[key].axis }
          })
          this.props.getAxisData(axisData)
      }
}

export default VictoryAxisCustom

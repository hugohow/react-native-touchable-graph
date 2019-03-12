import React from "react";
import { Dimensions } from "react-native";
import { G } from "react-native-svg";
import { VictoryAxis } from "victory-axis/es";
import { VictoryContainer, VictoryLabel, Axis } from "victory-core/es";

class VictoryAxisCustom extends VictoryAxis {
  constructor(props) {
    super(props);
  }

  static defaultProps = Object.assign({}, VictoryAxis.defaultProps, {
    axisComponent: <Axis />,
    axisLabelComponent: <VictoryLabel />,
    tickLabelComponent: <VictoryLabel />,
    tickComponent: <Axis />,
    gridComponent: <Axis />,
    containerComponent: <VictoryContainer />,
    groupComponent: <G />,
    width: Dimensions.get("window").width
  });

  componentDidMount() {
    const baseProps = this.baseProps
    const { fontSize } = this.props.style.tickLabels
    const axisData = Object.keys(baseProps).map((key) => ({
      tickLabels: fontSize !== 0 && baseProps[key].tickLabels, tickAxis: baseProps[key].axis
    }))
    this.props.getTickAxisDatum(axisData)
  }
}

export default VictoryAxisCustom

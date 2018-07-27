import React from "react";
import { Dimensions } from "react-native";
import { G } from "react-native-svg";
import { VictoryLabel, VictoryContainer, Bar } from 'victory-native'
import { VictoryBar } from "victory-bar/es";


class VictoryBarCustom extends VictoryBar {
    constructor(props){
		super(props);
	}
    static defaultProps = Object.assign({}, VictoryBar.defaultProps, {
        dataComponent: <Bar/>,
        labelComponent: <VictoryLabel/>,
        containerComponent: <VictoryContainer/>,
        groupComponent: <G/>,
        width: Dimensions.get("window").width
      })

      componentDidMount() {
          const baseProps = this.baseProps
          const barData = Object.keys(baseProps).map(function(key, index) {
            return {
                datum: baseProps[key].data.datum,             
                x: baseProps[key].data.x,
                x0: baseProps[key].data.x0,
                y: baseProps[key].data.y,
                y0: baseProps[key].data.y0,
                height: baseProps[key].data.height,
            }
          })
        this.props.getBarDatum(barData)
      }
}

export default VictoryBarCustom

import React, { Component,  Children, cloneElement } from 'react';

import PropTypes from 'prop-types'

import { View, TouchableOpacity, Text } from 'react-native'
import VictoryBarCustom from './VictoryBarCustom'
import VictoryAxisCustom from './VictoryAxisCustom';


class TouchableGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barsData: [],
            axisData: []
        }
        this.getBarData = this.getBarData.bind(this)
        this.getAxisData = this.getAxisData.bind(this)
    }
    renderAxis(axisData) {
        const ticks = [].concat.apply([], axisData); 
        const { onPressTickAxis, tickAxisStyle, tickAxisTextStyle } = this.props
        return ticks.map((tick, index) => {
            let { tickLabels, tickAxis } = tick
            if(tickLabels) {
                let positionStyle;
                let widthButton = tickAxisStyle.width ? tickAxisStyle.width : 40;
                let textAlign
                let top = tickAxis.dimension === "x" ? tickLabels.y : tickLabels.y - tickLabels.style.fontSize/2
                if(tickLabels.textAnchor === "middle") {
                    textAlign= 'center'
                } else if (tickLabels.textAnchor === "end") {
                    textAlign= 'right'
                }
                if (tickLabels.verticalAnchor === "middle") {
                    positionStyle = {
                        left: tickLabels.x - widthButton
                    }
                } else if (tickLabels.verticalAnchor === "end") {
                    positionStyle = {
                        left: tickLabels.x
                    }
                } else {
                    positionStyle = {
                        left: tickLabels.x - widthButton/2
                    }
                }
                return (
                    <TouchableOpacity
                        key={`tick-${index}`}
                        style={[{
                            position: 'absolute',
                            width: widthButton,
                            top: top,
                            zIndex: 99
                        }, positionStyle, tickAxisStyle]}
                        onPress={() => onPressTickAxis(tick)}
                    >
                        <Text style={[{fontSize: tickLabels.style.fontSize, textAlign: textAlign}, tickAxisTextStyle]}>
                            {tickLabels.text}
                        </Text>
                    </TouchableOpacity>
                )
            }
        })
    }
    renderBars(barsData) {
        const bars = [].concat.apply([], barsData); 
        const { onPressBar, barStyle } = this.props
        return bars.map((data, index) => {
            let widthBar = 20
            let paddingBottom = 50
            if(!data || !data.x) {
                return null;
            }
            return (
                <TouchableOpacity 
                    key={`bar-${index}`}
                    style={[{
                        position: 'absolute', 
                        left: data.x - widthBar/2, 
                        bottom: paddingBottom,
                        height: data.height - data.y - paddingBottom,
                        width: widthBar,
                        zIndex: 99
                    }, barStyle]}
                    onPress={() => { onPressBar(data);}}>
                </TouchableOpacity>
            )
        })
    }
    getBarData(barData) {
        this.setState((prevState) => ({ barsData: [...prevState.barsData, barData] }))
    }
    getAxisData(axisData) {
        this.setState((prevState) => ({ axisData: [...prevState.axisData, axisData] }))
    }
	render() {
        const { children } = this.props
        const { barsData, axisData } = this.state
        const transparentBarStyle = {
            data: { fillOpacity: 0.0, strokeOpacity: 0 }
          }
		return (
			<View>
				{Children.map(children, (child) => { 
                    if (child.type && child.type.displayName === 'VictoryChart') {
                        width = child.props.width
                        let children = child.props.children.map((component) => {
                                if (component && component.type && component.type.displayName === "VictoryBar") {
                                    return (
                                        <VictoryBarCustom 
                                            {...component.props} 
                                            style={transparentBarStyle}
                                            getBarData={this.getBarData}
                                            events={[]}
                                        />
                                    )
                                } 
                                if (component && component.type && component.type.displayName === "VictoryAxis") {
									let tickLabels = component.props.style && component.props.style.tickLabels ? component.props.style.tickLabels : {}
                                    return (
                                        <VictoryAxisCustom 
                                            {...component.props}
                                            style={{...component.props.style, tickLabels: { ...tickLabels, fillOpacity: 0.0 }}}
                                            getAxisData={this.getAxisData}
                                        />
                                    )
                                }               
                                return component
                            })
                        return { ...child, props: { ...child.props, children: children } }
                    }
                    return child                    
                })}
                {barsData.length > 0 && this.renderBars(barsData)}
                {axisData.length > 0 && this.renderAxis(axisData)}
			</View>
		)
	}
}


TouchableGraph.propTypes = {
    barStyle: PropTypes.object,
    onPressBar: PropTypes.func,
    tickAxisStyle: PropTypes.object,
    tickAxisTextStyle: PropTypes.object,
    onPressTickAxis: PropTypes.func,
}

TouchableGraph.defaultProps = {
    barStyle: { borderColor: 'grey', borderWidth: 1 },
    onPressBar: () => {},
    tickAxisStyle: {},
    tickAxisTextStyle: { fontSize: 12, color: 'black' },
    onPressTickAxis: () => {},
}



export default TouchableGraph

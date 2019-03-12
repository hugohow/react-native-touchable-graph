import React, { Component,  Children } from 'react';

import PropTypes from 'prop-types'

import { View, TouchableOpacity, Text } from 'react-native'
import VictoryBarCustom from './VictoryBarCustom'
import VictoryAxisCustom from './VictoryAxisCustom'


class TouchableGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barsData: [],
            axisData: []
        }
        this.getBarDatum = this.getBarDatum.bind(this)
        this.getTickAxisDatum = this.getTickAxisDatum.bind(this)
        this._isMounted = false;
    }
    componentDidMount() {
        this.setIsMounted(true);
    }
    componentWillUnmount() {
        this.setIsMounted(false);
    }
    setIsMounted(value) {
        this._isMounted = value;
    }
    renderAxis(axisData) {
        const ticks = [].concat.apply([], axisData); 
        let { onPressTickAxis, tickAxisStyle, tickAxisTextStyle } = this.props
        return ticks.map((tick, index) => {
            let { tickLabels, tickAxis } = tick
            if(tickLabels) {
                if(this.props.renderTickAxis) {
                    return this.props.renderTickAxis(tick, index)
                }
                let positionStyle;
                let widthButton = 40;
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
                        }, positionStyle, typeof tickAxisStyle === "function" ? tickAxisStyle(tick, index) : tickAxisStyle]}
                        onPress={() => onPressTickAxis(tick, index)}
                    >
                        <Text style={[
                            {
                                fontSize: tickLabels.style.fontSize,
                                textAlign: textAlign
                            },
                            typeof tickAxisTextStyle === "function" ? tickAxisTextStyle(tick, index) : tickAxisTextStyle,
                        ]}>
                            {tickLabels.text}
                        </Text>
                    </TouchableOpacity>
                )
            }
        })
    }
    renderBars(barsData) {
        const bars = [].concat.apply([], barsData); 
        let { onPressBar, barStyle } = this.props
        return bars.map((data, index) => {
            let widthBar = 20
            let paddingBottom = 50
            if(!data || !data.x) {
                return null;
            }
            if (this.props.renderBar) {
                return this.props.renderBar(data, index);
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
                    }, typeof barStyle === "function" ? barStyle(data, index) : barStyle]}
                    onPress={() => { onPressBar(data, index);}}>
                </TouchableOpacity>
            )
        })
    }
    getBarDatum(barData) {
        const { getBarDatum } = this.props
        this.setState((prevState) => ({ barsData: [...prevState.barsData, barData] }))
        if(getBarDatum) {
            getBarDatum(barData)
        }
    }
    getTickAxisDatum(axisData) {
        const { getTickAxisDatum } = this.props
        this.setState((prevState) => ({ axisData: [...prevState.axisData, axisData] }))
        if(getTickAxisDatum) {
            getTickAxisDatum(axisData)
        }
    }
	render() {
        const { children, style } = this.props
        const { barsData, axisData } = this.state
        const transparentBarStyle = {
            data: { fillOpacity: 0.0, strokeOpacity: 0 }
          }
          const childrenRendered = Children.map(children, (child) => {
            
            if (child.type && child.type.displayName === 'VictoryChart') {
                const children = Children.map(child.props.children, (component) => {
                    if (component && component.type && component.type.displayName === "VictoryBar") {
                        return (
                            <VictoryBarCustom 
                                {...component.props} 
                                style={transparentBarStyle}
                                getBarDatum={this.getBarDatum}
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
                                getTickAxisDatum={this.getTickAxisDatum}
                            />
                        )
                    }
                    return component
                })
                return { ...child, props: { ...child.props, children } }
            }
            return child                    
        })
        if (this._isMounted || this.props.renderLoading === null) {
            return (
                <View style={style}>
                    <View pointerEvents="none">{childrenRendered}</View>
                    {barsData.length > 0 && this.renderBars(barsData)}
                    {axisData.length > 0 && this.renderAxis(axisData)}
                </View>
            )
        }
        if (this.props.renderLoading) {
            return this.props.renderLoading()
        }
        return null
        
	}
}


TouchableGraph.propTypes = {
    style: PropTypes.object,
    barStyle: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func
    ]),
    onPressBar: PropTypes.func,
    renderBar: PropTypes.func,
    getBarDatum: PropTypes.func,
    tickAxisStyle: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func
    ]),
    tickAxisTextStyle: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func
    ]),
    onPressTickAxis: PropTypes.func,
    renderTickAxis: PropTypes.func,
    getTickAxisDatum: PropTypes.func,
    renderLoading: PropTypes.func,
}

TouchableGraph.defaultProps = {
    style: null,
    barStyle: { borderColor: 'grey', borderWidth: 1 },
    onPressBar: () => {},
    renderBar: null,
    getBarDatum: null,
    tickAxisStyle: {},
    tickAxisTextStyle: { fontSize: 12, color: 'black' },
    onPressTickAxis: () => {},
    renderTickAxis: null,
    getTickAxisDatum: null,
    renderLoading: null
}



export default TouchableGraph

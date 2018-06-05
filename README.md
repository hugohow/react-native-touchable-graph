[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()
[![Version](https://img.shields.io/npm/v/react-native-touchable-graph.svg)](https://www.npmjs.com/package/react-native-touchable-graph)

# react-native-touchable-graph

React Native component for simply creating a graph, without any iOS or Android issue of touch.

## Motivation

<a href="https://github.com/FormidableLabs/victory-native" target="_blank">Victory Native</a> is a great library, but there are tons of problems with the touch behaviour, because it is based on react-native-svg.
The idea is to make a wrapper which replace the touchable svg element with react native Touchable component, so you are sure that it will work great both on Android and iOS.

## Example app

Android example            |  Ios example
:-------------------------:|:-------------------------:
![](./AndroidGraph.gif?raw=true)  |  ![](./iosGraph.gif?raw=true)


## Installation

1. Install library and react-native-svg

	```
	npm i --save react-native-touchable-graph victory-native react-native-svg
	```
2. Link native code for SVG

	```
	react-native link react-native-svg
	```

## Usage

Use as follows:

```jsx

import { VictoryAxis, VictoryBar, VictoryChart, VictoryArea } from 'victory-native'
import TouchableGraph from 'react-native-touchable-graph';

const data = [
  { x: 1, y: 13000 },
  { x: 2, y: 16500 },
  { x: 3, y: 14250 },
  { x: 4, y: 19000 }
];


<TouchableGraph
  onPressBar={(data) => { console.log(data) }}
  onPressTickAxis={(data) => { console.log(data) }}
  >
  <VictoryChart>
    <VictoryAxis
      crossAxis
      orientation="left"
    />
    <VictoryAxis 
      dependentAxis
      crossAxis
      orientation="bottom"
    />
    <VictoryBar
      data={data}
    />
    <VictoryArea
      data={data}
    />
  </VictoryChart>
</TouchableGraph>
```

## Props

Bar props :

* **`barStyle`** _(Object)_ or _(Function(barData, index))_  - Bar style 
* **`onPressBar`** _(Function(barData, index))_ - Callback when a bar is tapped
* **`renderBar`** _(Function(barData, index))_ - Custom bar
* **`getBarDatum`** _(Function(bars))_ - Get Bars datum

Tick axis props :

* **`tickAxisStyle`** _(Object)_ or _(Function(tickData, index))_  - Tick axis style 
* **`tickAxisTextStyle`** _(Object)_ or _(Function(tickData, index))_  - Tick axis text style 
* **`onPressTickAxis`** _(Function(tickData, index))_ - Callback when a tick axis is tapped
* **`renderTickAxis`** _(Function(tickData, index))_ - Custom tickAxis
* **`getTickAxisDatum`** _(Function(ticks))_ - Get Ticks axis datum

Other props :

* **`renderLoading`** _(Function())_ - Render a loading view when initializing

## Roadmap

Improve for : 
* VictoryAxis
* VictoryBar
* VictoryChart

Adapt it for : 
* VictoryArea
* VictoryBoxPlot
* VictoryCandlestick
* VictoryErrorBar
* VictoryPie
* VictoryPolarAxis
* VictoryScatter
* VictoryStack
* VictoryVoronoi

Others : 
* Example
* Expo Example
* Performance
* Tests


## Author

Hugo How-Choong

## License

MIT

import React from 'react';
import { View } from 'react-native';

const SquareView = React.createClass({
  getInitialState() {
    return {
      width: 0,
      height: 0,
      direction: 'row',
    };
  },
  render() {
    const square = (
      <View
        {...this.props}
        style={
        [this.props.style,
          { width: this.state.width, height: this.state.height }]
        }
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          const sideLength = Math.max(width, height);

          if (sideLength) {
            this.setState({ width: sideLength, height: sideLength });
          } else {
            this.setState({ direction: 'column' });
          }
        }}>
        {this.props.children}
      </View>
    );

    switch (this.state.direction) {
      case 'column': return square;
      case 'row': return (<View style={{ backgroundColor: 'transparent' }}>{square}</View>);
      default: return null;
    }
  },
});

module.exports = SquareView;

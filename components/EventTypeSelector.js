import React from 'react';
import { View } from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { Types, LowerCaseTypes } from '../util/constants';

export default class EventType extends React.Component {
  constructor(props) {
    super(props);

    const selectedIndices = props.types
      .map((type) => type.toLowerCase())
      .map((type) => LowerCaseTypes.indexOf(type));

    this.state = { selectedIndices };
  }

  handleIndexChange(index) {
    let selectedIndices = [];
    if (this.state.selectedIndices.includes(index)) {
      selectedIndices = this.state.selectedIndices.filter((i) => i !== index);
    } else {
      selectedIndices = this.state.selectedIndices.concat([index]);
    }

    this.setState({ selectedIndices });
    this.props.onTypeChange(selectedIndices.map((i) => Types[i].toLowerCase()));
  }

  render() {
    const { style } = this.props;

    return (
      <View style={style}>
        <SegmentedControlTab
          borderRadius={0}
          values={Types}
          tabStyle={{ marginHorizontal: 2, marginTop: 2, height: 36 }}
          selectedIndices={this.state.selectedIndices}
          multiple={true}
          onTabPress={this.handleIndexChange.bind(this)}
        />
      </View>
    );
  }
}

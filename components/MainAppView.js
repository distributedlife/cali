import React from 'react';
import { View, Dimensions } from 'react-native';
import Cali from './Cali';
import RefreshableEventsList from './RefreshableEventsList';
import EventTypeSelector from './EventTypeSelector';

export default class MainAppView extends React.Component {
  constructor(props) {
    super(props);

    this.state = { types: [] };
  }

  changeSelected(types) {
    this.setState({ types });
  }

  render() {
    const heightOfFilterBar = 40;
    const height = Dimensions.get('window').height - heightOfFilterBar;

    return (
      <View>
        <RefreshableEventsList style={{ flex: 0, height }}>
          <Cali filterTypes={this.state.types}/>
        </RefreshableEventsList>
        <EventTypeSelector
          style={{ flex: 0, height: heightOfFilterBar }}
          types={this.state.types}
          onTypeChange={this.changeSelected.bind(this)}
        />
      </View>
    );
  }
}

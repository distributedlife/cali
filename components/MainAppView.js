import React from 'react';
import { View } from 'react-native';
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
    return (
      <View>
        <RefreshableEventsList>
          <Cali filterTypes={this.state.types}/>
        </RefreshableEventsList>
        <EventTypeSelector
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: 'white' }}
          types={this.state.types}
          onTypeChange={this.changeSelected.bind(this)}
        />
      </View>
    );
  }
}

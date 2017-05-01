import React from 'react';
import { ScrollView, RefreshControl, AppState } from 'react-native';
import moment from 'moment';
import { Provider, connect } from 'react-redux';
import Cali from './Cali';
import store from '../util/store';
import { getEvents } from '../actions/events';

const today = moment().startOf('day');

class RefreshableListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }

  onRefresh() {
    const { getData } = this.props;

    this.setState({ refreshing: true });

    getData().then(() => {
      this.setState({ refreshing: false });
    });
  }

  handleAppStateChange(nextAppState) {
    if (nextAppState === 'active') {
      this.onRefresh();
    }
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange.bind(this));

    this.onRefresh();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange.bind(this));
  }


  render() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
      >
        <Cali today={today}/>
      </ScrollView>
    );
  }
}

const RefreshableList = connect(undefined, {
  getData: getEvents,
})(RefreshableListView);

const App = () => (
  <Provider store={store}>
    <RefreshableList />
  </Provider>
);

export default App;

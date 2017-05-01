import React from 'react';
import { ScrollView, RefreshControl, AppState } from 'react-native';

export default class RefreshableListView extends React.Component {
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
    const { style, children } = this.props;

    return (
      <ScrollView style={style} refreshControl={
        <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh.bind(this)}/>
      }>
        {children}
      </ScrollView>
    );
  }
}

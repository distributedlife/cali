import { connect } from 'react-redux';
import RefreshableList from './RefreshableList';
import { getEvents } from '../actions/events';

export default connect(undefined, {
  getData: getEvents,
})(RefreshableList);

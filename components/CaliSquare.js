import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import {
  Text, View, TouchableWithoutFeedback, ActivityIndicator, Image, Dimensions,
} from 'react-native';
import Toast from 'react-native-root-toast';
import SquareView from './Square';
import { addEvent, deleteEvent } from '../actions/events';
import Prompt from './Prompt';

const Weekend = [6, 7];

const textStyles = {
  regular: {
    color: 'black',
    marginVertical: 4,
    height: 20,
    textAlign: 'center',
  },
};

const { width } = Dimensions.get('window');
const squareHeight = Math.floor(width / 7);
const imageSize = squareHeight / 4.7;

const square = {
  flex: 1,
  margin: 2,
  alignItems: 'center',
  justifyContent: 'center',
  borderStyle: 'solid',
  borderWidth: 1,
};


const colours = {
  busy: 'orange',
  leave: 'green',
  today: 'red',
};

const styles = {
  past: {
    ...square,
  },
  skip: {
    ...square,
    borderWidth: 0,
  },
  nothing: {
  },
  busy: {
    backgroundColor: colours.busy,
  },
  leave: {
    borderColor: colours.leave,
    borderWidth: 2,
  },
  weekend: {
    borderColor: colours.leave,
    borderWidth: 2,
  },
  today: {
    borderColor: colours.today,
    borderWidth: 2,
    borderRadius: 8,
  },
  morning: {
    backgroundColor: colours.busy,
  },
  lunch: {
    backgroundColor: colours.busy,
  },
  evening: {
    backgroundColor: colours.busy,
  },
  note: {},
  filteredStyle: {
    opacity: 0.3,
  },
};

const expanded = { top: 10, bottom: 10, left: 10, right: 10 };

const getBaseTypes = (today, day, startOfMonth, event) => {
  if (day.isBefore(today)) {
    return 'past';
  }
  if (day.isBefore(startOfMonth)) {
    return 'padding';
  }

  if (day.isSame(today, 'day')) {
    return 'today';
  }
  if (Weekend.includes(day.isoWeekday())) {
    return 'weekend';
  }
  if (!event || !event.types) {
    return 'nothing';
  }
  if (event.types.filter((t) => ['morning', 'lunch', 'evening'].includes(t)).length === 0) {
    return 'nothing';
  }

  return 'busy';
};


const doNothing = () => undefined;
const getEventForDay = (day, events) => events[day.format('DD/MM/YYYY')];
const showMessageForDay = (today, day, event, startOfThisMonth) => {
  if (day.isBefore(today)) {
    return doNothing;
  }
  if (day.isBefore(startOfThisMonth)) {
    return doNothing;
  }

  if (event && event.what) {
    return (() => Toast.show(event.what));
  }

  return doNothing;
};


const morning = require('../assets/morning.png');
const noon = require('../assets/noon.png');
const night = require('../assets/night.png');
const note = require('../assets/note.png');

const icon = {
  width: imageSize,
  height: imageSize,
};

const Morning = ({ visible }) => (
  visible ? <Image style={icon} source={morning} /> : null
);
const Lunch = ({ visible }) => (
  visible ? <Image style={icon} source={noon} /> : null
);
const Note = ({ visible }) => (
  visible ? <Image style={icon} source={note} /> : null
);
const Night = ({ visible }) => (
  visible ? <Image style={icon} source={night} /> : null
);


const ModifyEvent = ({
  day, types, onTypeChange, event, onCancel, onDelete, onSubmit,
}) => (
  <Prompt
    title={day.format('DD MMMM YYYY')}
    types={types}
    onTypeChange={onTypeChange}
    defaultValue={event.what}
    visible={true}
    onCancel={onCancel}
    onDelete={onDelete}
    onSubmit={onSubmit}
  />
);

const EventIcons = ({ types }) => (
  <View style={{ flex: 1, flexDirection: 'row' }}>
    <Morning visible={types.includes('morning')} />
    <Lunch visible={types.includes('lunch')}/>
    <Night visible={types.includes('evening')}/>
    <Note visible={types.includes('note')}/>
  </View>
);

class CaliSquareView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popupVisible: false,
      types: props.event.types || [],
      loading: false,
    };

    this.show = this.show.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.state.types, nextProps.event.types)) {
      this.setState({ types: nextProps.event.types || [] });
    }
  }

  show() {
    this.setState({ popupVisible: true });
  }

  hide() {
    this.setState({ popupVisible: false });
  }

  onTypeChange(types) {
    this.setState({ types });
  }

  onDelete() {
    this.showSpinner();
    this.hide();

    this.props.dispatchDeleteEvent(this.props.event.id)
      .then(this.removeSpinner.bind(this));
  }

  onCancel() {
    this.hide();
  }

  onSubmit(value) {
    this.showSpinner();
    this.hide();

    this.props.dispatchAddEvent({
      id: this.props.event.id,
      date: this.props.day.format('DD/MM/YYYY'),
      types: this.state.types,
      what: value,
    })
    .then(this.removeSpinner.bind(this));
  }

  showSpinner() {
    this.setState({ loading: true });
  }

  removeSpinner() {
    this.setState({ loading: false });
  }

  render() {
    const {
      event,
      today,
      day,
      startOfThisMonth,
      baseType,
      filtered,
      filterTypes,
    } = this.props;

    if (baseType === 'past') {
      return (<SquareView style={styles.past} />);
    }
    if (baseType === 'padding') {
      return (<SquareView style={styles.skip} />);
    }

    const dayStyles = this.state.types.concat(baseType).map((t) => styles[t]);
    const filteredStyle = filtered ? styles.filteredStyle : {};

    const types = this.state.types && this.state.types.length > 0 ? this.state.types : filterTypes;

    return (
      <SquareView style={[square, dayStyles, filteredStyle]}>
        <TouchableWithoutFeedback
          onPress={showMessageForDay(today, day, event, startOfThisMonth)}
          onLongPress={this.show}
          hitSlop={expanded}
        >
          {
            this.state.loading
            ?
              <View />
            :
              <View>
                <Text style={textStyles.regular}>{moment(day).date()}</Text>
                <EventIcons types={this.state.types} />
              </View>
          }
        </TouchableWithoutFeedback>
        { this.state.loading && <ActivityIndicator /> }
        {
          this.state.popupVisible &&
          !this.state.loading &&
          <ModifyEvent
            day={day}
            types={types}
            onTypeChange={this.onTypeChange}
            event={event}
            onCancel={this.onCancel}
            onDelete={this.onDelete}
            onSubmit={this.onSubmit}
          />
        }
      </SquareView>
    );
  }
}

const CaliSquare = connect((state, ownProps) => {
  const event = getEventForDay(ownProps.day, state.events) || {};

  const eventTypes = event.types || [];
  const { filterTypes } = ownProps;
  const isInFilterType = (type) => filterTypes.includes(type);
  const filtered = eventTypes.filter(isInFilterType).length === 0 && filterTypes.length > 0;

  return {
    baseType: getBaseTypes(moment(state.time.today), ownProps.day, ownProps.startOfMonth, event),
    today: state.time.today,
    startOfThisMonth: state.time.startOfThisMonth,
    events: state.events,
    event,
    filtered,
    filterTypes,
  };
}, {
  dispatchAddEvent: addEvent,
  dispatchDeleteEvent: deleteEvent,
})(CaliSquareView);

export default CaliSquare;

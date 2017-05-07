import React from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import Toast from 'react-native-root-toast';
import isEqual from 'lodash/isEqual';
import Prompt from './Prompt';
import SquareView from './Square';
import { addEvent, deleteEvent } from '../actions/events';

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
  birthday: {},
  filteredStyle: {
    opacity: 0.3,
  },
};

const textStyles = {
  regular: {
    color: 'black',
    marginVertical: 4,
    height: 20,
    textAlign: 'center',
  },
};

const row = {
  height: 40,
  flexDirection: 'row',
  flexWrap: 'wrap',
};

const DaysInWeek = 7;
const Weekend = [6, 7];

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

const screen = {
  justifyContent: 'center',
  flexDirection: 'column',
  marginVertical: 20,
  alignItems: 'center',
};

const MonthHeader = ({ month }) => (
  <View>
    <Text style={{ textAlign: 'center' }}>{month.format('MMMM - YYYY')}</Text>
  </View>
);

const morning = require('../assets/morning.png');
const noon = require('../assets/noon.png');
const night = require('../assets/night.png');
const birthday = require('../assets/birthday.png');

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
const Birthday = ({ visible }) => (
  visible ? <Image style={icon} source={birthday} /> : null
);
const Night = ({ visible }) => (
  visible ? <Image style={icon} source={night} /> : null
);

const expanded = { top: 10, bottom: 10, left: 10, right: 10 };

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
    <Birthday visible={types.includes('birthday')}/>
    <Morning visible={types.includes('morning')} />
    <Lunch visible={types.includes('lunch')}/>
    <Night visible={types.includes('evening')}/>
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
          onLongPress={this.show.bind(this)}
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
            onTypeChange={this.onTypeChange.bind(this)}
            event={event}
            onCancel={this.onCancel.bind(this)}
            onDelete={this.onDelete.bind(this)}
            onSubmit={this.onSubmit.bind(this)}
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


const Days = ({ days, startOfMonth, filterTypes }) => {
  const numberOfRows = Math.floor(days.length / DaysInWeek) + (
    days.length % DaysInWeek > 0
    ? 1
    : 0
  );
  const rows = Array(numberOfRows).fill(0).map((x, i) => (
    days.slice(i * DaysInWeek, (i + 1) * DaysInWeek)),
  );

  return (
    <View style={{ flexDirection: 'column' }}>
    {
      rows.map((daysInRow, i) => (
        <View style={{ ...row, height: squareHeight }} key={i}>
        {
          daysInRow.map((day) => (
            <CaliSquare
              key={moment(day).date()}
              day={moment(day)}
              startOfMonth={startOfMonth}
              filterTypes={filterTypes}
            />
          ))
        }
        </View>
      ))
    }
    </View>
  );
};

const CurrentMonth = ({ month, days, filterTypes }) => (
  <View>
    <MonthHeader month={month} />
    <Days days={days} startOfMonth={month} filterTypes={filterTypes} />
  </View>
);

const FutureMonth = ({ month, filterTypes }) => {
  const monthDays = Array(month.daysInMonth()).fill(0).map((x, i) => (
    month.clone().add(i, 'days')),
  );

  Array(month.isoWeekday() - 1).fill(0).forEach((x, i) => (
    monthDays.unshift(month.clone().subtract(i + 1, 'days'))),
  );

  return (
    <View>
      <MonthHeader month={month} />
      <Days days={monthDays} startOfMonth={month} filterTypes={filterTypes} />
    </View>
  );
};

const Cali = ({ startOfThisMonth, daysInCurrentMonth, remainingMonthsInYear, filterTypes }) => (
  <View style={screen}>
    <CurrentMonth
      month={moment(startOfThisMonth)}
      days={daysInCurrentMonth}
      filterTypes={filterTypes}
    />
    {
      remainingMonthsInYear.map((month) => (
        <FutureMonth key={month} month={moment(month)} filterTypes={filterTypes} />
      ))
    }
  </View>
);

export default connect((state) => ({
  startOfThisMonth: state.time.startOfThisMonth,
  daysInCurrentMonth: state.time.daysInCurrentMonth,
  remainingMonthsInYear: state.time.remainingMonthsInYear,
}))(Cali);

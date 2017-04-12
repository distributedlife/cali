import React from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import moment from 'moment';
import Toast from 'react-native-root-toast';
import Prompt from './Prompt';
import SquareView from './Square';
import { addEvent, deleteEvent } from '../actions/events';

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
  optional: 'purple',
  birthday: 'red',
};

const styles = {
  past: {
    ...square,
  },
  skip: {
    ...square,
    borderWidth: 0,
  },
  busy: {
    ...square,
    backgroundColor: colours.busy,
  },
  leave: {
    ...square,
    borderColor: colours.leave,
    borderWidth: 2,
  },
  weekend: {
    ...square,
    borderColor: colours.leave,
    borderWidth: 2,
  },
  birthday: {
    ...square,
    backgroundColor: colours.birthday,
  },
  optional: {
    ...square,
    backgroundColor: colours.optional,
  },
};

const textStyles = {
  past: {
    color: 'white',
  },
  future: {
    color: 'black',
  },
};

const row = {
  height: 40,
  flexDirection: 'row',
  flexWrap: 'wrap',
};

const DaysInWeek = 7;
const Weekend = [6, 7];

const getType = (today, day, startOfMonth, events) => {
  if (day.isBefore(today)) {
    return 'past';
  }
  if (day.isBefore(startOfMonth)) {
    return 'padding';
  }

  const dayAsDataFormat = day.format('DD/MM/YYYY');
  const event = events[dayAsDataFormat];

  if (!event) {
    if (Weekend.includes(day.isoWeekday())) {
      return 'weekend';
    }

    return 'nothing-planned';
  }

  return event.busy;
};

const getTextStyle = (type) => {
  switch (type) {
    case 'past':
      return textStyles.past;
    case 'padding':
      return textStyles.past;
    default:
      return textStyles.future;
  }
};

const getStyle = (type) => {
  switch (type) {
    case 'past':
      return styles.past;
    case 'padding':
      return styles.skip;
    case 'weekend':
      return styles.weekend;
    case 'nothing-planned':
      return square;
    default:
      return styles.busy;
  }
};

const doNothing = () => undefined;
const getEventForDay = (day, events) => events[day.format('DD/MM/YYYY')];
const showMessageForDay = (today, day, events, startOfThisMonth) => {
  if (day.isBefore(today)) {
    return doNothing;
  }
  if (day.isBefore(startOfThisMonth)) {
    return doNothing;
  }

  const event = events[day.format('DD/MM/YYYY')];
  if (event && event.what) {
    return (() => Toast.show(event.what));
  }

  return doNothing;
};

const screen = {
  justifyContent: 'center',
  flexDirection: 'column',
  top: 20,
  alignItems: 'center',
};

const MonthHeader = ({ month }) => (
  <View>
    <Text style={{ textAlign: 'center' }}>{month}</Text>
  </View>
);

const expanded = { top: 10, bottom: 10, left: 10, right: 10 };

class CaliSquareView extends React.Component {
  constructor(props) {
    super(props);

    const eventForDay = getEventForDay(props.day, props.events);

    this.state = {
      popupVisible: false,
      type: (eventForDay && eventForDay.type) || 'busy',
    };
  }

  render() {
    const {
      today, day, startOfMonth, dispatchAddEvent, events, dispatchDeleteEvent, startOfThisMonth,
    } = this.props;

    return (
      <SquareView style={getStyle(getType(today, day, startOfMonth, events))}>
        <TouchableWithoutFeedback
          onPress={showMessageForDay(today, day, events, startOfThisMonth)}
          onLongPress={() => { this.setState({ popupVisible: true }); }}
          hitSlop={expanded}
        >
          <View>
            <Text
              style={getTextStyle(getType(today, day, startOfMonth, events))}
            >
              {moment(day).date()}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <Prompt
          title={day.format('DD MMMM YYYY')}
          type={this.state.type}
          onTypeChange={(newType) => {
            this.setState({ type: newType });
          }}
          placeholder="..."
          defaultValue={getEventForDay(day, events) && getEventForDay(day, events).what}
          visible={ this.state.popupVisible }
          onCancel={() => {
            this.setState({ popupVisible: false });
          }}
          onDelete={() => {
            this.setState({ popupVisible: false });
            dispatchDeleteEvent(
              getEventForDay(day, events) && getEventForDay(day, events).id,
            );
          }}
          onSubmit={(value) => {
            this.setState({ popupVisible: false });
            dispatchAddEvent({
              date: day.format('DD/MM/YYYY'),
              type: this.state.type,
              what: value,
            });
          }}
        />
      </SquareView>
    );
  }
}

const CaliSquare = connect((state) => ({
  today: state.time.today,
  startOfThisMonth: state.time.startOfThisMonth,
  events: state.events,
}), {
  dispatchAddEvent: addEvent,
  dispatchDeleteEvent: deleteEvent,
})(CaliSquareView);


const Days = ({ days, startOfMonth }) => {
  const numberOfRows = Math.floor(days.length / DaysInWeek) + (
    days.length % DaysInWeek > 0
    ? 1
    : 0
  );
  const rows = Array(numberOfRows).fill(0).map((x, i) => (
    days.slice(i * DaysInWeek, (i + 1) * DaysInWeek)),
  );

  const { width } = Dimensions.get('window');
  const height = Math.floor(width / 7);

  return (
    <View style={{ flexDirection: 'column' }}>
    {
      rows.map((daysInRow, i) => (
        <View style={{ ...row, height }} key={i}>
        {
          daysInRow.map((day) => (
            <CaliSquare key={moment(day).date()} day={moment(day)} startOfMonth={startOfMonth} />
          ))
        }
        </View>
      ))
    }
    </View>
  );
};

const CurrentMonth = ({ month, days }) => (
  <View>
    <MonthHeader month={month} />
    <Days days={days} startOfMonth={month} />
  </View>
);

const FutureMonth = ({ month }) => {
  const monthDays = Array(month.daysInMonth()).fill(0).map((x, i) => (
    month.clone().add(i, 'days')),
  );

  Array(month.isoWeekday() - 1).fill(0).forEach((x, i) => (
    monthDays.unshift(month.clone().subtract(i + 1, 'days'))),
  );

  return (
    <View>
      <MonthHeader month={month.format('MMMM - YYYY')} />
      <Days days={monthDays} startOfMonth={month} />
    </View>
  );
};

const Cali = ({ startOfThisMonth, daysInCurrentMonth, remainingMonthsInYear }) => (
  <View style={screen}>
    <CurrentMonth month={startOfThisMonth} days={daysInCurrentMonth}/>
    {
      remainingMonthsInYear.map((month) => (<FutureMonth key={month} month={moment(month)} />))
    }
  </View>
);

export default connect((state) => ({
  startOfThisMonth: state.time.startOfThisMonth,
  daysInCurrentMonth: state.time.daysInCurrentMonth,
  remainingMonthsInYear: state.time.remainingMonthsInYear,
}))(Cali);

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
  publicHoliday: 'green',
  annualLeave: 'green',
  weekend: 'green',
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
  'public-holiday': {
    ...square,
    backgroundColor: colours.publicHoliday,
  },
  'annual-leave': {
    ...square,
    backgroundColor: colours.annualLeave,
  },
  weekend: {
    ...square,
    backgroundColor: colours.weekend,
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

const today = moment().startOf('day');
const startOfThisMonth = today.clone().startOf('month');
const dayOfMonth = today.date();
const daysInMonth = today.daysInMonth();
const dayOfWeek = today.isoWeekday();
const daysLeft = daysInMonth - dayOfMonth;

const daysInCurrentMonth = Array(daysLeft).fill(0).map((x, i) => today.clone().add(i + 1, 'days'));

Array(dayOfWeek).fill(0).forEach((x, i) => daysInCurrentMonth.unshift(
  today.clone().subtract(i, 'days'),
));

const getType = (day, startOfMonth, events) => {
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

  return event.type;
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
      return styles[type];
  }
};

const doNothing = () => undefined;
const getEventForDay = (day, events) => events[day.format('DD/MM/YYYY')];
const showMessageForDay = (day, events) => {
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

const thisMonth = today.month();
const remainingMonthsInYear = Array(11 - thisMonth).fill(0).map((x, i) => today.clone().add(i + 1, 'months').startOf('month'));

const MonthHeader = ({ month }) => (
  <View>
    <Text style={{ textAlign: 'center' }}>{month.format('MMMM - YYYY')}</Text>
  </View>
);

const expanded = { top: 10, bottom: 10, left: 10, right: 10 };

class CaliSquareView extends React.Component {
  constructor(props) {
    super(props);

    this.state = { popupVisible: false };
  }
  render() {
    const { day, startOfMonth, dispatchAddEvent, events, dispatchDeleteEvent } = this.props;

    return (
      <SquareView style={getStyle(getType(day, startOfMonth, events))}>
        <TouchableWithoutFeedback
          onPress={showMessageForDay(day, events)}
          onLongPress={() => { this.setState({ popupVisible: true }); }}
          hitSlop={expanded}
        >
          <View>
            <Text style={getTextStyle(getType(day, startOfMonth, events))}>{day.date()}</Text>
          </View>
        </TouchableWithoutFeedback>
        <Prompt
          title={day.format('DD MMMM YYYY')}
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
              type: 'busy',
              what: value,
            });
          }}
        />
      </SquareView>
    );
  }
}

const CaliSquare = connect((state) => ({
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
            <CaliSquare key={day.date()} day={day} startOfMonth={startOfMonth} />
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
      <MonthHeader month={month} />
      <Days days={monthDays} startOfMonth={month} />
    </View>
  );
};

const Cali = () => (
  <View style={screen}>
    <CurrentMonth month={startOfThisMonth} days={daysInCurrentMonth}/>
    {
      remainingMonthsInYear.map((month) => (<FutureMonth key={month} month={month} />))
    }
  </View>
);

export default Cali;

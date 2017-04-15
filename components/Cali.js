import React from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
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
  morning: {
    backgroundColor: colours.busy,
  },
  lunch: {
    backgroundColor: colours.busy,
  },
  night: {
    backgroundColor: colours.busy,
  },
  birthday: {},
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

const { width } = Dimensions.get('window');
const squareHeight = Math.floor(width / 7);
const imageSize = squareHeight / 4.7;

const getBaseTypes = (today, day, startOfMonth, events) => {
  if (day.isBefore(today)) {
    return 'past';
  }
  if (day.isBefore(startOfMonth)) {
    return 'padding';
  }

  const dayAsDataFormat = day.format('DD/MM/YYYY');
  const event = events[dayAsDataFormat];

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

class CaliSquareView extends React.Component {
  constructor(props) {
    super(props);

    const eventForDay = getEventForDay(props.day, props.events) || {};

    this.state = {
      popupVisible: false,
      types: eventForDay.types || [],
    };
  }

  show() {
    this.setState({ popupVisible: true });
  }

  hide() {
    this.setState({ popupVisible: false });
  }

  render() {
    const {
      today, day, startOfMonth, dispatchAddEvent, events, dispatchDeleteEvent, startOfThisMonth,
    } = this.props;

    const baseType = getBaseTypes(today, day, startOfMonth, events);

    if (baseType === 'past') {
      return (<SquareView style={styles.past} />);
    }
    if (baseType === 'padding') {
      return (<SquareView style={styles.skip} />);
    }

    const eventForDay = getEventForDay(day, events) || {};
    eventForDay.types = eventForDay.types || [];
    const dayStyles = this.state.types.concat(baseType).map((t) => styles[t]);

    return (
      <SquareView style={[square, ...dayStyles]}>
        <TouchableWithoutFeedback
          onPress={showMessageForDay(today, day, events, startOfThisMonth)}
          onLongPress={this.show.bind(this)}
          hitSlop={expanded}
        >
          <View>
            <Text style={textStyles.regular}>{moment(day).date()}</Text>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Birthday visible={eventForDay.types.includes('birthday')}/>
              <Morning visible={eventForDay.types.includes('morning')} />
              <Lunch visible={eventForDay.types.includes('lunch')}/>
              <Night visible={eventForDay.types.includes('evening')}/>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <Prompt
          title={day.format('DD MMMM YYYY')}
          types={this.state.types}
          onTypeChange={(types) => {
            this.setState({ types });
          }}
          defaultValue={eventForDay.what}
          visible={ this.state.popupVisible }
          onCancel={this.hide.bind(this)}
          onDelete={() => {
            this.hide();
            dispatchDeleteEvent(eventForDay.id);
          }}
          onSubmit={(value) => {
            this.hide();
            dispatchAddEvent({
              id: eventForDay.id,
              date: day.format('DD/MM/YYYY'),
              types: this.state.types,
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

  return (
    <View style={{ flexDirection: 'column' }}>
    {
      rows.map((daysInRow, i) => (
        <View style={{ ...row, squareHeight }} key={i}>
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
      <MonthHeader month={month} />
      <Days days={monthDays} startOfMonth={month} />
    </View>
  );
};

const Cali = ({ startOfThisMonth, daysInCurrentMonth, remainingMonthsInYear }) => (
  <View style={screen}>
    <CurrentMonth month={moment(startOfThisMonth)} days={daysInCurrentMonth}/>
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

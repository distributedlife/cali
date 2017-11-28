import moment from 'moment-timezone';
import { EVENT_ADDED, EVENTS_RESET_TO_SERVER, EVENT_DELETED } from '../actions';

const updateTimeInfo = () => {
  const timeZone = moment.tz.guess();

  const today = moment().tz(timeZone).startOf('day');
  const daysInMonth = today.daysInMonth();
  const dayOfMonth = today.date();
  const daysLeft = daysInMonth - dayOfMonth;
  const dayOfWeek = today.isoWeekday();

  const daysInCurrentMonth = Array(daysLeft).fill(0).map((x, i) => (
    today.clone().add(i + 1, 'days')),
  );

  Array(dayOfWeek).fill(0).forEach((x, i) => daysInCurrentMonth.unshift(
    today.clone().subtract(i, 'days').format(),
  ));

  const thisMonth = today.month();
  const remainingMonthsInYear = Array(2).fill(0).map((x, i) => (
    today.clone().add(i + 1, 'months').startOf('month')).format(),
  );

  return {
    today: today.format(),
    startOfThisMonth: today.clone().startOf('month').format(),
    dayOfMonth,
    daysInMonth,
    dayOfWeek,
    daysLeft,
    daysInCurrentMonth,
    thisMonth,
    remainingMonthsInYear,
  };
};

const initialValues = updateTimeInfo();

export default (state = initialValues, action) => {
  switch (action.type) {
    case EVENTS_RESET_TO_SERVER:
      return updateTimeInfo();
    case EVENT_ADDED:
      return updateTimeInfo();
    case EVENT_DELETED:
      return updateTimeInfo();
    default:
      return state;
  }
};

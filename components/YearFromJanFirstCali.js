import { connect } from 'react-redux';
import moment from 'moment';
import Cali from './Cali';
import BirthdaySquare from './BirthdaySquare';

export default connect(() => {
  const startOfYear = moment().startOf('year');
  const offsetDays = startOfYear.isoWeekday() - 1;

  return {
    startOfThisMonth: startOfYear.format(),
    daysInCurrentMonth: Array(31 + offsetDays).fill(0).map((x, i) => (
      moment()
        .startOf('year')
        .subtract(offsetDays, 'days')
        .add(i, 'days')),
    ),
    remainingMonthsInYear: Array(11).fill(0).map((x, i) => (
      moment().startOf('year').add(i + 1, 'months').format()),
    ),
    formatMonth: (month) => month.format('MMMM'),
    SquareStyle: BirthdaySquare,
  };
})(Cali);

import { connect } from 'react-redux';
import Cali from './Cali';
import CaliSquare from './CaliSquare';

export default connect((state) => ({
  startOfThisMonth: state.time.startOfThisMonth,
  daysInCurrentMonth: state.time.daysInCurrentMonth,
  remainingMonthsInYear: state.time.remainingMonthsInYear,
  formatMonth: (month) => month.format('MMMM - YYYY'),
  SquareStyle: CaliSquare,
}))(Cali);

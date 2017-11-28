import React from 'react';
import { View } from 'react-native';
import MonthHeader from './MonthHeader';
import Days from './Days';

const FutureMonth = ({ month, label, filterTypes, SquareStyle }) => {
  const monthDays = Array(month.daysInMonth()).fill(0).map((x, i) => (
    month.clone().add(i, 'days')),
  );

  Array(month.isoWeekday() - 1).fill(0).forEach((x, i) => (
    monthDays.unshift(month.clone().subtract(i + 1, 'days'))),
  );

  return (
    <View>
      <MonthHeader label={label} />
      <Days
        days={monthDays}
        startOfMonth={month}
        filterTypes={filterTypes}
        SquareStyle={SquareStyle}
      />
    </View>
  );
};

export default FutureMonth;

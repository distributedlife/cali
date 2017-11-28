import React from 'react';
import { View } from 'react-native';
import MonthHeader from './MonthHeader';
import Days from './Days';

const CurrentMonth = ({ month, days, filterTypes, label, SquareStyle }) => (
  <View>
    <MonthHeader label={label} />
    <Days days={days} startOfMonth={month} filterTypes={filterTypes} SquareStyle={SquareStyle} />
  </View>
);

export default CurrentMonth;

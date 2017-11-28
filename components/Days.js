import React from 'react';
import moment from 'moment';
import { View, Dimensions } from 'react-native';

const DaysInWeek = 7;

const row = {
  height: 40,
  flexDirection: 'row',
  flexWrap: 'wrap',
};

const Row = ({ height, children }) => (
  <View style={[row, { height }]}>{children}</View>
);

const Days = ({ days, startOfMonth, filterTypes, SquareStyle }) => {
  const numberOfRows = Math.floor(days.length / DaysInWeek)
    + (days.length % DaysInWeek > 0 ? 1 : 0);

  const rows = Array(numberOfRows).fill(0).map((ignore, i) => (
    days.slice(i * DaysInWeek, (i + 1) * DaysInWeek)),
  );

  const { width } = Dimensions.get('window');
  const squareHeight = Math.floor(width / 7);

  return (
    <View style={{ flexDirection: 'column' }}>
    {
      rows.map((daysInRow, i) => (
        <Row height={squareHeight} key={i}>
        {
          daysInRow.map((day) => (
            <SquareStyle
              key={moment(day).date()}
              day={moment(day)}
              startOfMonth={startOfMonth}
              filterTypes={filterTypes}
            />
          ))
        }
        </Row>
      ))
    }
    </View>
  );
};

export default Days;

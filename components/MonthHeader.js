import React from 'react';
import { Text, View } from 'react-native';

const MonthHeader = ({ label }) => (
  <View>
    <Text style={{ textAlign: 'center' }}>{label}</Text>
  </View>
);

export default MonthHeader;

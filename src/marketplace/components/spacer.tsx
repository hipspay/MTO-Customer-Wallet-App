import {View} from 'react-native';
import React from 'react';

interface SpacerProps {
  height?: number;
  width?: number;
}

export const Spacer = ({height, width}: SpacerProps) => {
  return (
    <View
      style={[
        height ? {paddingTop: height} : {paddingTop: 0},
        width ? {paddingRight: width} : {paddingRight: 0},
      ]}
    />
  );
};

import * as React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import BackIcon from '../assets/back.png';

export function MarketPlaceMain() {
  return (
    <View style={styles.root}>
      <View style={styles.topSpacer}></View>
      <View style={styles.topBar}>
        <Image source={BackIcon} style={styles.backButton}></Image>
        <Text style={styles.pageTitle}>Market Place</Text>
        <View></View>
      </View>
    </View>
  );
}

export default function MarketPlaceScreen() {
  return <MarketPlaceMain />;
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column',
  },
  topSpacer: {
    paddingVertical: 30,
  },
  pageTitle: {
    textAlign: 'center',
    fontSize: 30,
    color: 'black',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    height: 36,
    width: 36,
    marginStart: 16,
  },
});

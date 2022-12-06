import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { TouchableOpacity, Image, StyleSheet, View, Text } from 'react-native';
import Routes from '@rainbow-me/routes';
import BackIcon from '../../assets/back.png';

export const ProfileActionButton = () => {
  const profileIcon = require('../../assets/user.png');
  const navigator = useNavigation();
  return (
    <View>
      <View style={styles.topSpacer}></View>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => {
            navigator.goBack();
          }}
        >
          <Image source={BackIcon} style={styles.backButton}></Image>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Profile</Text>
        <TouchableOpacity
          onPress={() => {
            //navigator.navigate(Routes.MARKETPLACE_PROFILE);
          }}
        >
          <View style={{ paddingEnd: 16, marginStart: 8 }}>
            <View style={styles.profileIcon}></View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column',
  },
  profileIcon: {
    height: 36,
    width: 36,
  },
  topSpacer: {
    paddingVertical: 5,
  },
  pageTitle: {
    textAlign: 'center',
    fontSize: 30,
    color: 'black',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    height: 36,
    width: 36,
    marginStart: 16,
  },
});

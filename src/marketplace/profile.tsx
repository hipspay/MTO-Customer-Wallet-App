import * as React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Divider } from '../marketplace/components/divider';
import { Spacer } from '../marketplace/components/spacer';
import { LoadingSpinner, LoadingWrapper } from './components/Loader';
import { ProfileActionButton } from './components/profile_action';

export const MarketPlaceProfileScreen = () => {
  const [data, setData] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const bkdDriver = useSelector(state => state.sdkDriver.bkdDriver);

  const profile = async () => {
    console.log('profile1');
    if (!bkdDriver || !bkdDriver.headers) return;

    console.log('profile2', bkdDriver);
    setIsLoading(true);

    const res = await bkdDriver.getProfile({
      address: bkdDriver.wallet.address,
    });

    console.log('res', res);
    setData(res);
    setIsLoading(false);
  };

  React.useEffect(() => {
    profile();
  }, [bkdDriver]);

  const userImage = require('../assets/man.png');
  return (
    <SafeAreaView>
      <View>
        <View style={{ height: 60 }}>
          <ProfileActionButton />
        </View>
        <Spacer height={50} />
        <Image source={userImage} style={styles.profilePic}></Image>
        <Spacer height={32} />
        <ProfileItem
          title={'Username'}
          value={data?.name}
          textColor={'black'}
        />
        <Spacer height={8} />
        <Divider />
        <Spacer height={32} />
        <ProfileItem
          title={'Address'}
          value={data?.shippingAddress}
          textColor={'black'}
        />
        <Spacer height={8} />
        <Divider />
        <Spacer height={32} />
        <ProfileItem
          title={'Website Link'}
          value={data?.externalLink}
          textColor={'blue'}
        />
        <Spacer height={8} />
        <Divider />
      </View>
      {!!isLoading && (
        <LoadingWrapper>
          <LoadingSpinner />
        </LoadingWrapper>
      )}
    </SafeAreaView>
  );
};

interface ProfileItemProps {
  title: String;
  value: String;
  textColor?: String;
}

function ProfileItem({ title, value, textColor }: ProfileItemProps) {
  return (
    <View style={styles.profileItem}>
      <Text style={styles.titleStyle}>{title}</Text>
      <Text style={[styles.itemValueTextStyle, { color: textColor }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profilePic: {
    height: 200,
    width: 200,
    borderRadius: 100,
    borderColor: 'green',
    borderWidth: 2,
    alignSelf: 'center',
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  titleStyle: {
    fontSize: 20,
  },
  itemValueTextStyle: {
    fontSize: 20,
    color: 'black',
    width: '60%',
    textAlign: 'right',
  },
});

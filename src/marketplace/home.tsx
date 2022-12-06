import { CustomerDriver } from 'mto-custom-backend-driver';
import { MTOCustomDriver } from 'mto-custom-driver';
import * as React from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
// import { MTO_API, MTO_APPKEY, MTO_BLOCKCHAIN } from 'react-native-dotenv';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { useDispatch, useSelector } from 'react-redux';
import { MarketPlaceAppBar } from './components/marketplace_action';
import { DisputeScreen } from './disputes';
import { MarketPlaceScreen } from './marketplace';
import { MyOrderScreen } from './my_orders';
import { MyProductScreen } from './my_products';
import { loadAddress, loadWallet } from '@rainbow-me/model/wallet';
import { setBkdDriver, setScDriver, setCurrentTab } from '@rainbow-me/redux/sdkDriver';

const renderScene = SceneMap({
  first: MarketPlaceScreen,
  second: MyProductScreen,
  third: MyOrderScreen,
  fourth: DisputeScreen,
});
export default function MarketPlace() {
  const layout = useWindowDimensions();
  const dispatch = useDispatch();
  const scDriver = useSelector(state => state.sdkDriver.scDriver);
  const bkdDriver = useSelector(state => state.sdkDriver.bkdDriver);
  const currentTab = useSelector(state => state.sdkDriver.currentTab);
  const [routes] = React.useState([
    { key: 'first', title: 'MarketPlace' },
    { key: 'second', title: 'My Products' },
    { key: 'third', title: 'My Orders' },
    { key: 'fourth', title: 'Disputes' },
  ]);

  // const navigation = useNavigation<NavigationProp<any>>();
  // const renderScene = SceneMap({
  //   first: () => <MarketPlaceScreen index={index} />,
  //   second: () => <MyProductScreen index={index} />,
  //   third: () => <MyOrderScreen index={index} />,
  //   fourth: () => <DisputeScreen index={index} />,
  // });

  const getPrivateKey = async () => {
    const selectedWallet = await loadAddress();
    console.log('selected Wallet', selectedWallet);

    const wallet = await loadWallet(selectedWallet!);
    console.log('wallet4', wallet?.privateKey);

    return wallet?.privateKey;
  };
  const initSDKs = async () => {
    try {
      const MTO_API = 'https://b119-37-111-244-64.in.ngrok.io';
      const MTO_BLOCKCHAIN = 'goerli-testnet';
      const MTO_APPKEY = 'mtoapp';
      const privateKey = await getPrivateKey();
      const _scDriver = new MTOCustomDriver({
        blockchain: MTO_BLOCKCHAIN,
        privateKey: privateKey,
      });
      await _scDriver.init();
      // console.log('_scDriver', _scDriver.wallet.address);
      dispatch(setScDriver(_scDriver));

      const _bkdDriver = new CustomerDriver({
        apiKey: MTO_APPKEY,
        baseUrl: MTO_API,
        privateKey: privateKey,
      });
      await _bkdDriver.init();
      // console.log('_bkdDriver', _bkdDriver.wallet.address);
      dispatch(setBkdDriver(_bkdDriver));

      const profile = await _bkdDriver.getProfile({
        address: _bkdDriver.wallet.address,
      });

      console.log('profile', profile);
    } catch (error) {
      console.log('error=>', error);
      // showPurchaseErrorAlert();
    }
  };

  const checkAndInit = async () => {
    const selectedWallet = await loadAddress();
    if (!scDriver && !bkdDriver) {
      await sleep(2000);
      if (!scDriver && !bkdDriver) {
        initSDKs();
      } else {
        if (
          selectedWallet?.toLowerCase() !==
          scDriver.wallet.address.toLowerCase()
        ) {
          initSDKs();
        }
      }
    } else {
      if (
        selectedWallet?.toLowerCase() !== scDriver.wallet.address.toLowerCase()
      ) {
        initSDKs();
      }
    }
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  React.useEffect(() => {
    checkAndInit();
  }, [scDriver, bkdDriver]);

  React.useEffect(() => {
    dispatch(setCurrentTab(0));
  }, []);

  return (
    <SafeAreaView>
      <View style={{ height: '100%' }}>
        <View style={{ height: 60 }}>
          <MarketPlaceAppBar title={'Market Place'} />
        </View>
        <TabView
          navigationState={{ index: currentTab, routes }}
          renderScene={renderScene}
          onIndexChange={(e) => {
            dispatch(setCurrentTab(e));
          }}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: 'white' }}
              style={{ backgroundColor: '#1A1464' }}
              renderLabel={({ route, focused, color }) => (
                <Text style={{ color, marginVertical: 8, fontSize: 13 }}>
                  {route.title}
                </Text>
              )}
            />
          )}
          initialLayout={{ width: layout.width }}
        />
      </View>
    </SafeAreaView>
  );
}

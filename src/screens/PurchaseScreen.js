import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { IS_TESTING } from 'react-native-dotenv';
import { ActivityList } from '../components/activity-list';
import { BackButton, Header, HeaderButton } from '../components/header';
import { Icon } from '../components/icons';
import { Page } from '../components/layout';
import { ProfileMasthead } from '../components/profile';
import TransactionList from '../components/transaction-list/TransactionList';
import { useTheme } from '../context/ThemeContext';
import { Centered, Row, RowWithMargins } from '../components/layout';
import { Text } from '../components/text';
import useNativeTransactionListAvailable from '../helpers/isNativeTransactionListAvailable';
import NetworkTypes from '../helpers/networkTypes';
import { useNavigation } from '../navigation/Navigation';
import "@ethersproject/shims";
import AesEncryptor from '@rainbow-me/handlers/aesEncryption';
import { RAINBOW_MASTER_KEY } from 'react-native-dotenv';
import { Alert } from '../components/alerts';
import {
  useAccountSettings,
  useAccountTransactions,
  useContacts,
  useRequests,
  useDimensions,
} from '@rainbow-me/hooks';
import Routes from '@rainbow-me/routes';
import styled from '@rainbow-me/styled-components';
import { padding, position } from '@rainbow-me/styles';
import { StyleSheet } from 'react-native';
import ExchangeInput from '../components/exchange/ExchangeInput';
import { useColorForAsset } from '@rainbow-me/hooks';
import {
  ButtonPressAnimation,
  ScaleButtonZoomableAndroid,
} from '../components/animations';
import { MTOCustomDriver } from 'mto-custom-driver';
import {
  loadString,
  publicAccessControlOptions,
} from '../model/keychain';
import {
  signingWalletAddress,
  signingWallet as signingWalletKeychain,
} from '../utils/keychainConstants';

const ACTIVITY_LIST_INITIALIZATION_DELAY = 5000;
const ExchangeFieldHeight = android ? 64 : 38;
const CenterAlignmedColumnWidth = 360;

export const ONE_DAY_IN_SECOND = 86400;
const now = new Date();
export const UTCMILLLISECONDSSINCEEPOCH =
  now.getTime() + now.getTimezoneOffset() * 60 * 1000;
export const UTCSECONDSSINCEEPOCH =
  Math.round(UTCMILLLISECONDSSINCEEPOCH / 1000) + ONE_DAY_IN_SECOND;

// export const AMOUNT = 100;
export const PRODUCT_ID = 1;
export const DISPUTABLE_TIME = UTCSECONDSSINCEEPOCH + 380;
export const WITHDRAW_TIME = UTCSECONDSSINCEEPOCH + 800;
export const MERCHANT_ADDRESS = '0x13B5dBE5Ff3CaDEee318a18B4feb231eE8E054ed';

const PurchaseScreenPage = styled(Page)({
  ...position.sizeAsObject('100%'),
  flex: 1,
});

const CopyAddressButton = styled(ButtonPressAnimation).attrs(
  ({ theme: { colors } }) => ({
    backgroundColor: colors.alpha(colors.copyAddress),
    borderRadius: 23,
  })
)({
  ...padding.object(10.5, 15, 14.5),
});
const Input = styled(ExchangeInput).attrs({
  letterSpacing: 'roundedTightest',
})({
  height: ExchangeFieldHeight + (android ? 20 : 0),
  marginVertical: -10,
});

const CenterAlignmedColumn = styled(Centered).attrs({ direction: 'column' })(
  ({ isSmallPhone }) => ({
    ...(isSmallPhone && { bottom: 80 }),
    position: 'absolute',
    top: 60,
    width: CenterAlignmedColumnWidth,
  })
);

export default function PurchaseScreen({ navigation }) {
  const { colors } = useTheme();
  const [activityListInitialized, setActivityListInitialized] = useState(false);
  const isFocused = useIsFocused();
  const { navigate } = useNavigation();
  // const nativeTransactionListAvailable = useNativeTransactionListAvailable();
  const accountTransactions = useAccountTransactions(
    activityListInitialized,
    isFocused
  );
  const { isLoadingTransactions: isLoading } = accountTransactions;
  // const { contacts } = useContacts();
  // const { pendingRequestCount, requests } = useRequests();
  // const { network } = useAccountSettings();
  const colorForAsset = useColorForAsset();
  // const isEmpty = !transactionsCount && !pendingRequestCount;
  const [amount, setAmount] = useState(10);
  const { isSmallPhone } = useDimensions();

  useEffect(() => {
    setTimeout(() => {
      setActivityListInitialized(true);
    }, ACTIVITY_LIST_INITIALIZATION_DELAY);
  }, []);

  const onPressBackButton = useCallback(() => navigate(Routes.WALLET_SCREEN), [
    navigate,
  ]);

  function showPurchaseErrorAlert() {
    Alert({
      buttons: [
        {
          text: 'Ok',
        },
      ],
      message: `Transaction has failed, please try gain later.`,
      title: 'An error occurred',
    });
  }

  function showPurchaseSuccessAlert() {
    Alert({
      buttons: [
        {
          text: 'Ok',
        },
      ],
      message: `Your purchase has successfully completed`,
      title: 'Purchase success',
    });
  }

  const purchase = async () => {
    
    const encryptedPrivateKeyOfTheSigningWallet = await loadString(
      signingWalletKeychain,
      publicAccessControlOptions
    );

    const encryptor = new AesEncryptor();
    const decryptedSignature = await encryptor.decrypt(
      RAINBOW_MASTER_KEY,
      encryptedPrivateKeyOfTheSigningWallet
    );

    console.log('purchase', decryptedSignature);
    try {
      
      const driver = new MTOCustomDriver({
        privateKey: decryptedSignature,
        blockchain: 'rinkeby-testnet',
      });
      await driver.init();

      const result = await driver.purchase(
        PRODUCT_ID,
        MERCHANT_ADDRESS,
        amount,
        DISPUTABLE_TIME,
        WITHDRAW_TIME,
        { gasLimit: 800000 }
      );
      // const result = await driver.approve(amount, { gasLimit: 60000 });
      console.log('result=>', result);
      if (result) {
        showPurchaseSuccessAlert();
      }
    } catch (error) {
      console.log('error=>', error.message);
      showPurchaseErrorAlert();
    }
  };

  return (
    <PurchaseScreenPage testID="profile-screen" style={styles.PurchaseScreen}>
      <Header align="center" justify="space-between">
        <BackButton
          color={colors.black}
          direction="left"
          onPress={onPressBackButton}
        />
      </Header>

      <CenterAlignmedColumn isSmallPhone={isSmallPhone}>
        <Input
          color={colorForAsset}
          // onBlur={onBlur}
          onChangeText={setAmount}
          // onFocus={onFocus}
          placeholder="Input Amount"
          placeholderTextColor={colors.alpha(colors.blueGreyDark, 0.1)}
          // ref={ref}
          // testID={amount ? `${testID}-${amount}` : testID}
          // useCustomAndroidMask={useCustomAndroidMask}
          value={amount}
        />
        <CopyAddressButton
          onPress={purchase}
          radiusAndroid={23}
          testID="copy-address-button"
        >
          <RowWithMargins margin={6}>
            <Text
              align="center"
              color={colors.copyAddressText}
              lineHeight="loose"
              size="large"
              weight="bold"
            >
              Purchase
            </Text>
          </RowWithMargins>
        </CopyAddressButton>
      </CenterAlignmedColumn>
    </PurchaseScreenPage>
  );
}

var styles = StyleSheet.create({
  PurchaseScreen: {
    paddingTop: 10,
  },
});

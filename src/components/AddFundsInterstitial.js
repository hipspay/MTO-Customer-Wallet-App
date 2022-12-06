import analytics from '@segment/analytics-react-native';
import { captureMessage } from '@sentry/react-native';
import lang from 'i18n-js';
import { get } from 'lodash';
import React, { Fragment, useCallback } from 'react';
import { Linking } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import networkInfo from '../helpers/networkInfo';
import networkTypes from '../helpers/networkTypes';
import showWalletErrorAlert from '../helpers/support';
import { useNavigation } from '../navigation/Navigation';
import { magicMemo } from '../utils';
import Divider from './Divider';
import { ButtonPressAnimation, ScaleButtonZoomableAndroid } from './animations';
import { Icon } from './icons';
import { Centered, Row, RowWithMargins } from './layout';
import {View, StyleSheet} from "react-native";
import { Text } from './text';
import {
  useAccountSettings,
  useDimensions,
  useWallets,
} from '@rainbow-me/hooks';
import Routes from '@rainbow-me/routes';
import styled from '@rainbow-me/styled-components';
import { padding, position } from '@rainbow-me/styles';
import ShadowStack from 'react-native-shadow-stack';
import { black } from 'make-color-more-chill';

const CenterAlignmedColumnWidth = 261;

const CenterAlignmedColumn = styled(Centered).attrs({ direction: 'column' })(
  ({ isSmallPhone }) => ({
    ...(isSmallPhone && { bottom: 80 }),
    position: 'absolute',
    top: 60,
    width: CenterAlignmedColumnWidth,
  })
);

const InterstitialButton = styled(ButtonPressAnimation).attrs(
  ({ theme: { colors } }) => ({
    backgroundColor: colors.secondaryButton,
    borderRadius: 23,
  })
)({
  ...padding.object(11, 15, 14),
});

const InterstitialButtonRow = styled(Row)({
  marginBottom: ({ isSmallPhone }) => (isSmallPhone ? 19 : 42),
});

const InterstitialDivider = styled(Divider).attrs(({ theme: { colors } }) => ({
  color: colors.rowDividerExtraLight,
  inset: [0, 0, 0, 0],
}))({
  borderRadius: 1,
  width: 150,
});

const CopyAddressButton = styled(ButtonPressAnimation).attrs(
  ({ theme: { colors } }) => ({
    backgroundColor: colors.alpha(colors.copyAddress),
    borderRadius: 23,
  })
)({
  ...padding.object(10.5, 15, 14.5),
});

const AmountBPA = styled(ButtonPressAnimation)({
  borderRadius: 25,
  overflow: 'visible',
});

const Paragraph = styled(Text).attrs(({ theme: { colors } }) => ({
  align: 'center',
  color: colors.alpha(colors.blueGreyDark, 0.4),
  letterSpacing: 'roundedMedium',
  lineHeight: 'paragraphSmall',
  size: 'lmedium',
  weight: 'semibold',
}))({
  marginBottom: 24,
  marginTop: 19,
});

const Title = styled(Text).attrs(({ theme: { colors } }) => ({
  align: 'center',
  color: colors.dark,
  lineHeight: 32,
  size: 'bigger',
  weight: 'heavy',
}))({
  marginHorizontal: 27,
});

const TitleSecondary = styled(Text).attrs(({ theme: { colors } }) => ({
  align: 'right',
  color: colors.dark,
  lineHeight: 40,
  size: 'h1',
  weight: 'heavy',
}))({
  marginHorizontal: 27,
  width: 300
});

const Subtitle = styled(Title).attrs(({ theme: { colors } }) => ({
  color: colors.dark,
}))({
  marginTop: ({ isSmallPhone }) => (isSmallPhone ? 19 : 42),
});

const AmountText = styled(Text).attrs(({ children }) => ({
  align: 'center',
  children: android ? `  ${children.join('')}  ` : children,
  letterSpacing: 'roundedTightest',
  size: 'bigger',
  weight: 'heavy',
}))(({ color }) => ({
  ...(android ? padding.object(15, 4.5) : padding.object(24, 15, 25)),
  alignSelf: 'center',
  textShadowColor: color,
  textShadowOffset: { height: 0, width: 0 },
  textShadowRadius: 20,
  zIndex: 1,
}));

const AmountButtonWrapper = styled(Row).attrs({
  justify: 'center',
  marginLeft: 7.5,
  marginRight: 7.5,

})({
  ...(android && { width: 100 }),
});

const onAddFromFaucet = accountAddress =>
  Linking.openURL(`https://faucet.paradigm.xyz/?addr=${accountAddress}`);

const InnerBPA = android ? ButtonPressAnimation : ({ children }) => children;

const Wrapper = android ? ScaleButtonZoomableAndroid : AmountBPA;

const AmountButton = ({ amount, backgroundColor, color, onPress }) => {
  const handlePress = useCallback(() => onPress?.(amount), [amount, onPress]);
  const { colors } = useTheme();
  const shadows = {
    [colors.blackAmountButton]: [
      [0, 5, 15, colors.shadow, 0.2],
      [0, 10, 30, colors.swapPurple, 0.4],
    ],
    [colors.purpleDark]: [
      [0, 5, 15, colors.shadow, 0.2],
      [0, 10, 30, colors.purpleDark, 0.4],
    ],
  };

  return (
    <AmountButtonWrapper>
      <Wrapper disabled={android} onPress={handlePress}>
        <ShadowStack
          {...position.coverAsObject}
          backgroundColor={backgroundColor}
          borderRadius={25}
          shadows={shadows[backgroundColor]}
          {...(android && {
            height: 80,
            width: 100,
          })}
        />
        <InnerBPA
          onPress={handlePress}
          reanimatedButton
          wrapperStyle={{
            zIndex: 10,
          }}
        >
          <AmountText color={color} textShadowColor={color}>
            ${amount}
          </AmountText>
        </InnerBPA>
      </Wrapper>
    </AmountButtonWrapper>
  );
};

const AddFundsInterstitial = ({ network }) => {
  const { isSmallPhone } = useDimensions();
  const { navigate } = useNavigation();
  const { isDamaged } = useWallets();
  const { accountAddress } = useAccountSettings();
  const { colors } = useTheme();

  const handleMarketPlaceClick = useCallback(
    () => {
      navigate(Routes.MARKETPLACE);
    },
    []
  );


  const handlePressAmount = useCallback(
    amount => {
      if (isDamaged) {
        showWalletErrorAlert();
        captureMessage('Damaged wallet preventing add cash');
        return;
      }
      if (ios) {
        navigate(Routes.ADD_CASH_FLOW, {
          params: !isNaN(amount) ? { amount } : null,
          screen: Routes.ADD_CASH_SCREEN_NAVIGATOR,
        });
        analytics.track('Tapped Add Cash', {
          amount: amount,
          category: 'add cash',
          newWallet: true,
        });
      } else {
        navigate(Routes.WYRE_WEBVIEW_NAVIGATOR, {
          params: {
            address: accountAddress,
            amount: !isNaN(amount) ? amount : null,
          },
          screen: Routes.WYRE_WEBVIEW,
        });
        analytics.track('Tapped Add Cash', {
          amount: amount,
          category: 'add cash',
          newWallet: true,
        });
      }
    },
    [isDamaged, navigate, accountAddress]
  );

  const addFundsToAccountAddress = useCallback(
    () => onAddFromFaucet(accountAddress),
    [accountAddress]
  );

  const handlePressCopyAddress = useCallback(() => {
    if (isDamaged) {
      showWalletErrorAlert();
      return;
    }
    navigate(Routes.RECEIVE_MODAL);
  }, [navigate, isDamaged]);

  const goPurchase = () => {
    console.log('goPurchase clicked');
    navigate(Routes.PURCHASE_SCREEN);
  };

  return (
    <CenterAlignmedColumn isSmallPhone={isSmallPhone}>
      {network === networkTypes.mainnet ? (
        <Fragment>
          <Title>
            To get started,
          </Title>
          <TitleSecondary>
            Buy some ETH{ios ? ` with Apple Pay` : ''}
          </TitleSecondary>
          <Row justify="space-between" marginVertical={30}>
            <AmountButton
              amount={100}
              backgroundColor={colors.blackAmountButton}
              color={colors.white}
              onPress={handlePressAmount}
            />
            <AmountButton
              amount={200}
              backgroundColor={colors.blackAmountButton}
              color={colors.white}
              onPress={handlePressAmount}
            />
            <AmountButton
              amount={300}
              backgroundColor={colors.purpleDark}
              color={colors.white}
              onPress={handlePressAmount}
            />
          </Row>
          <InterstitialButtonRow>
            <InterstitialButton onPress={handlePressAmount} radiusAndroid={23}>
              <Text
                align="center"
                color={colors.otherAmountText}
                lineHeight="loose"
                size="large"
                weight="bold"
              >
                {` 􀍡 ${lang.t('wallet.add_cash.interstitial.other_amount')}`}
              </Text>
            </InterstitialButton>
          </InterstitialButtonRow>
          <InterstitialButtonRow>
            <InterstitialButton onPress={handleMarketPlaceClick} radiusAndroid={23}>
              <Text
                align="center"
                color={colors.otherAmountText}
                lineHeight="loose"
                size="large"
                weight="bold"
              >
                {` 􀍡 ${lang.t('marketplace.default_label')}`}
              </Text>
            </InterstitialButton>
          </InterstitialButtonRow>
          {!isSmallPhone && 
          <View style={styels.dividerRow}>
            <View width={100} height={1} backgroundColor={black}></View>
            <Text size="large">  OR  </Text>
            <View width={100} height={1} backgroundColor={black}></View>
          </View>
          }
          <Subtitle isSmallPhone={isSmallPhone}>
            Send ETH to your wallet
          </Subtitle>

          <Paragraph>
            Send from Coinbase or another exchange—or ask a friend!
          </Paragraph>
        </Fragment>
      ) : (
        <Fragment>
          <Title>
            Request test ETH through the {get(networkInfo[network], 'name')}{' '}
            faucet
          </Title>
          <Row marginTop={30}>
            <InterstitialButton onPress={addFundsToAccountAddress}>
              <Text
                align="center"
                color={colors.alpha(colors.blueGreyDark, 0.6)}
                lineHeight="loose"
                size="large"
                weight="bold"
              >
                􀎬 Add from faucet
              </Text>
            </InterstitialButton>
          </Row>
          {!isSmallPhone && <InterstitialDivider />}
          <Subtitle isSmallPhone={isSmallPhone}>
            or send test ETH to your wallet
          </Subtitle>

          <Paragraph>
            Send test ETH from another {get(networkInfo[network], 'name')}{' '}
            wallet—or ask a friend!
          </Paragraph>
        </Fragment>
      )}
      <CopyAddressButton
        onPress={handlePressCopyAddress}
        radiusAndroid={23}
        testID="copy-address-button"
      >
        <RowWithMargins margin={6}>
          <Icon
            color={colors.copyAddressText}
            marginTop={0.5}
            name="copy"
            size={19}
          />
          <Text
            align="center"
            color={colors.copyAddressText}
            lineHeight="loose"
            size="large"
            weight="bold"
          >
            {lang.t('wallet.settings.copy_address')}
          </Text>
        </RowWithMargins>
      </CopyAddressButton>
      <Title />
      <CopyAddressButton
        onPress={goPurchase}
        radiusAndroid={23}
        marginTop={20}
        testID="copy-address-button"
      >
        {/* <RowWithMargins margin={6}> */}
          <Text
            align="center"
            color={colors.copyAddressText}
            lineHeight="loose"
            size="large"
            weight="bold"
          >
            Purchase
          </Text>
        {/* </RowWithMargins> */}
      </CopyAddressButton>
    </CenterAlignmedColumn>
  );
};

var styels = StyleSheet.create({
  dividerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
  }
})

export default magicMemo(AddFundsInterstitial, ['network', 'offsetY']);

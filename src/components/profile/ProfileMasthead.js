import Clipboard from '@react-native-community/clipboard';
import analytics from '@segment/analytics-react-native';
import lang from 'i18n-js';
import React, { useCallback, useRef } from 'react';
import Divider from '../Divider';
import { ButtonPressAnimation } from '../animations';
import { RainbowButton } from '../buttons';
import { FloatingEmojis } from '../floating-emojis';
import AppIcon from '../../assets/app_logo.png'
import { Icon } from '../icons';
import { Centered, Column, Row, RowWithMargins } from '../layout';
import { TruncatedText } from '../text';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import ProfileAction from './ProfileAction';
import showWalletErrorAlert from '@rainbow-me/helpers/support';
import AddCashIcon from "../../assets/addCash.png"
import {
  useAccountProfile,
  useDimensions,
  useOnAvatarPress,
  useWallets,
} from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
import styled from '@rainbow-me/styled-components';
import { abbreviations } from '@rainbow-me/utils';
import { colors } from '@rainbow-me/styles';

const dropdownArrowWidth = 21;

const FloatingEmojisRegion = styled(FloatingEmojis).attrs({
  distance: 250,
  duration: 500,
  fadeOut: false,
  scaleTo: 0,
  size: 50,
  wiggleFactor: 0,
})({
  height: 0,
  left: 0,
  position: 'absolute',
  top: 0,
  width: 130,
});

const AccountName = styled(TruncatedText).attrs({
  align: 'left',
  firstSectionLength: abbreviations.defaultNumCharsPerSection,
  letterSpacing: 'roundedMedium',
  size: 'bigger',
  truncationLength: 4,
  weight: 'bold',
})({
  height: android ? 38 : 33,
  marginBottom: android ? 10 : 1,
  marginTop: android ? -10 : -1,
  maxWidth: ({ deviceWidth }) => deviceWidth - dropdownArrowWidth - 60,
  paddingRight: 6,
  color: "black"
});

const AddCashButton = styled(RainbowButton).attrs({
  overflowMargin: 30,
  skipTopMargin: true,
  type: 'addCash',
})({
  marginTop: 16,
});

const DropdownArrow = styled(Centered)({
  height: 9,
  marginTop: 11,
  width: dropdownArrowWidth,
});

const ProfileMastheadDivider = styled(Divider).attrs(
  ({ theme: { colors } }) => ({
    color: colors.rowDividerLight,
  })
)({
  bottom: 0,
  position: 'absolute',
});

export default function ProfileMasthead({
  addCashAvailable,
  recyclerListRef,
  showBottomDivider = true,
}) {
  const { isDamaged } = useWallets();
  const onNewEmoji = useRef();
  const setOnNewEmoji = useCallback(
    newOnNewEmoji => (onNewEmoji.current = newOnNewEmoji),
    []
  );
  const { width: deviceWidth } = useDimensions();
  const { navigate } = useNavigation();
  const {
    accountAddress,
    accountColor,
    accountSymbol,
    accountName,
    accountImage,
  } = useAccountProfile();

  const { onAvatarPress } = useOnAvatarPress();

  const handlePressAvatar = useCallback(() => {
    recyclerListRef?.scrollToTop(true);
    setTimeout(
      onAvatarPress,
      recyclerListRef?.getCurrentScrollOffset() > 0 ? 200 : 1
    );
  }, [onAvatarPress, recyclerListRef]);

  const handlePressReceive = useCallback(() => {
    if (isDamaged) {
      showWalletErrorAlert();
      return;
    }
    navigate(Routes.RECEIVE_MODAL);
  }, [navigate, isDamaged]);

  const handlePressAddCash = useCallback(() => {
    if (isDamaged) {
      showWalletErrorAlert();
      return;
    }

    analytics.track('Tapped Add Cash', {
      category: 'add cash',
    });

    if (ios) {
      navigate(Routes.ADD_CASH_FLOW);
    } else {
      navigate(Routes.WYRE_WEBVIEW_NAVIGATOR, {
        params: {
          address: accountAddress,
        },
        screen: Routes.WYRE_WEBVIEW,
      });
    }
  }, [accountAddress, navigate, isDamaged]);

  const handlePressChangeWallet = useCallback(() => {
    navigate(Routes.CHANGE_WALLET_SHEET);
  }, [navigate]);

  const handlePressCopyAddress = useCallback(() => {
    if (isDamaged) {
      showWalletErrorAlert();
    }
    if (onNewEmoji && onNewEmoji.current) {
      onNewEmoji.current();
    }
    Clipboard.setString(accountAddress);
  }, [accountAddress, isDamaged]);

  const { colors } = useTheme();
  return (
    <Column
      align="center"
      height={addCashAvailable ? 260 : 185}
      marginBottom={24}
      marginTop={0}
    >
      <Image source={AppIcon} style={styles.appIcon}/>
      <ButtonPressAnimation onPress={handlePressChangeWallet}>
        <Row style={styles.addressArea}>
          <AccountName deviceWidth={deviceWidth}>{accountName} </AccountName>
          <DropdownArrow>
            <Icon color={"black"} direction="down" name="caret" />
          </DropdownArrow>
        </Row>
      </ButtonPressAnimation>
      <RowWithMargins align="center" margin={19} style={styles.actionSection}>
        <ProfileAction
          icon="copy"
          onPress={handlePressCopyAddress}
          radiusWrapperStyle={{ marginRight: 10, width: 150 }}
          scaleTo={0.88}
          text={lang.t('wallet.settings.copy_address_capitalized')}
          width={127}
          wrapperProps={{
            containerStyle: {
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              paddingLeft: 10,
            },
          }}
        />
        <FloatingEmojisRegion setOnNewEmoji={setOnNewEmoji} />
        <ProfileAction
          icon="qrCode"
          onPress={handlePressReceive}
          radiusWrapperStyle={{ marginRight: 10, width: 104 }}
          scaleTo={0.88}
          text={lang.t('button.receive')}
          width={81}
          wrapperProps={{
            containerStyle: {
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              paddingLeft: 10,
            },
          }}
        />
      </RowWithMargins>
      {addCashAvailable && 
        <TouchableOpacity style={styles.addCashButton} onPress={handlePressAddCash}>
          <Image source={AddCashIcon} style={styles.addCashIcon}/>
          <Text style={styles.addCashButtonText}>Add Cash</Text>
        </TouchableOpacity>}
    </Column>
  );
}

var styles = StyleSheet.create({
    appIcon: {
      height: 87,
      width: 87
    },
    addressArea: {
      backgroundColor: colors.secondaryButton,
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingTop: 6,
      marginVertical: 10
    },
    addCashButton: {
      backgroundColor: "#7B50B6",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      elevation: 10,
      marginVertical: 10
    },
    addCashIcon: {
      height: 34,
      width: 34,
    },
    addCashButtonText: {
      fontSize: 20,
      fontWeight: "600",
      color: "white",
      marginStart: 10,
    },
    actionSection: {
      marginVertical: 6
    },
})
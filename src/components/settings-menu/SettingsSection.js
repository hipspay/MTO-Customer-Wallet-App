import AsyncStorage from '@react-native-community/async-storage';
import lang from 'i18n-js';
import { isString } from 'lodash';
import React, { Fragment, useCallback, useMemo } from 'react';
import { Image, Linking, NativeModules, ScrollView, Share, TouchableOpacity, View, StyleSheet } from 'react-native';
import { THEMES, useTheme } from '../../context/ThemeContext';
import { supportedLanguages } from '../../languages';
import AppVersionStamp from '../AppVersionStamp';
import { Icon } from '../icons';
import { Column, ColumnWithDividers } from '../layout';
import AppIcon from "../../assets/app_logo.png";
import TwitterIcon from "../../assets/twitterIcon.png";
import TwitterIconDark from "../../assets/twitterIconDark.png";
import {
  ListFooter,
  ListItem,
  ListItemArrowGroup,
  ListItemDivider,
} from '../list';
import { Emoji, Text } from '../text';
import BackupIcon from '@rainbow-me/assets/settingsBackupIcon.png';
import BackupIconDark from '@rainbow-me/assets/settingsBackupIconDark.png';
import CurrencyIcon from '@rainbow-me/assets/settingsCurrency.png';
import CurrencyIconDark from '@rainbow-me/assets/settingsCurrencyDark.png';
import DarkModeIcon from '@rainbow-me/assets/settingsDarkMode.png';
import DarkModeIconDark from '@rainbow-me/assets/settingsDarkModeDark.png';
import LanguageIcon from '@rainbow-me/assets/settingsLanguage.png';
import LanguageIconDark from '@rainbow-me/assets/settingsLanguageDark.png';
import NetworkIcon from '@rainbow-me/assets/settingsNetwork.png';
import NetworkIconDark from '@rainbow-me/assets/settingsNetworkDark.png';
import PrivacyIcon from '@rainbow-me/assets/settingsPrivacy.png';
import PrivacyIconDark from '@rainbow-me/assets/settingsPrivacyDark.png';
import useExperimentalFlag, {
  LANGUAGE_SETTINGS,
} from '@rainbow-me/config/experimentalHooks';
import networkInfo from '@rainbow-me/helpers/networkInfo';
import WalletTypes from '@rainbow-me/helpers/walletTypes';
import {
  useAccountSettings,
  useDimensions,
  useSendFeedback,
  useWallets,
} from '@rainbow-me/hooks';
import styled from '@rainbow-me/styled-components';
import { position } from '@rainbow-me/styles';
import {
  AppleReviewAddress,
  REVIEW_DONE_KEY,
} from '@rainbow-me/utils/reviewAlert';

const { RainbowRequestReview, RNReview } = NativeModules;

export const SettingsExternalURLs = {
  rainbowHomepage: 'https://merchanttoken.org/',
  rainbowLearn: 'https://merchanttoken.org/',
  review:
    'itms-apps://itunes.apple.com/us/app/appName/id1457119021?mt=8&action=write-review',
  twitterDeepLink: 'https://twitter.com/merchant_token',
  twitterWebUrl: 'https://twitter.com/merchant_token',
};

const CheckmarkIcon = styled(Icon).attrs({
  name: 'checkmarkCircled',
})({
  shadowColor: ({ theme: { colors, isDarkMode } }) =>
    colors.alpha(isDarkMode ? colors.shadow : colors.blueGreyDark50, 0.4),
  shadowOffset: { height: 4, width: 0 },
  shadowRadius: 6,
});

const Container = styled(Column).attrs({})({
  ...position.coverAsObject,

  backgroundColor: ({ backgroundColor }) => backgroundColor,
});

const ScrollContainer = styled(ScrollView).attrs({
  scrollEventThrottle: 32,
})({});

// ⚠️ Beware: magic numbers lol
const SettingIcon = styled(Image)({
  ...position.sizeAsObject(40),

  marginLeft: -16,
  marginRight: -11,
  marginTop: 8,
});

const VersionStampContainer = styled(Column).attrs({
  align: 'center',
  justify: 'end',
})({
  flex: 1,
  paddingBottom: 19,
});

const WarningIcon = styled(Icon).attrs(({ theme: { colors } }) => ({
  color: colors.orangeLight,
  name: 'warning',
}))({
  marginTop: 1,
  shadowColor: ({ theme: { colors, isDarkMode } }) =>
    isDarkMode ? colors.shadow : colors.alpha(colors.orangeLight, 0.4),
  shadowOffset: { height: 4, width: 0 },
  shadowRadius: 6,
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const checkAllWallets = wallets => {
  if (!wallets) return false;
  let areBackedUp = true;
  let canBeBackedUp = false;
  let allBackedUp = true;
  Object.keys(wallets).forEach(key => {
    if (!wallets[key].backedUp && wallets[key].type !== WalletTypes.readOnly) {
      allBackedUp = false;
    }

    if (
      !wallets[key].backedUp &&
      wallets[key].type !== WalletTypes.readOnly &&
      !wallets[key].imported
    ) {
      areBackedUp = false;
    }
    if (wallets[key].type !== WalletTypes.readOnly) {
      canBeBackedUp = true;
    }
  });
  return { allBackedUp, areBackedUp, canBeBackedUp };
};

export default function SettingsSection({
  onCloseModal,
  onPressBackup,
  onPressCurrency,
  onPressDev,
  onPressIcloudBackup,
  onPressLanguage,
  onPressNetwork,
  onPressPrivacy,
  onPressShowSecret,
}) {
  const isReviewAvailable = false;
  const { wallets, isReadOnlyWallet } = useWallets();
  const {
    language,
    nativeCurrency,
    network,
    testnetsEnabled,
  } = useAccountSettings();
  const { isNarrowPhone } = useDimensions();
  const isLanguageSelectionEnabled = useExperimentalFlag(LANGUAGE_SETTINGS);

  const { colors, isDarkMode, setTheme, colorScheme } = useTheme();

  const onSendFeedback = useSendFeedback();

  const onPressReview = useCallback(async () => {
    if (ios) {
      onCloseModal();
      RainbowRequestReview.requestReview(handled => {
        if (!handled) {
          AsyncStorage.setItem(REVIEW_DONE_KEY, 'true');
          Linking.openURL(AppleReviewAddress);
        }
      });
    } else {
      RNReview.show();
    }
  }, [onCloseModal]);

  const onPressShare = useCallback(() => {
    Share.share({
      message: `👋️ Hey friend! You should download Wallet App, it's my favorite Ethereum wallet  ${SettingsExternalURLs.rainbowHomepage}`,
    });
  }, []);

  const onPressTwitter = useCallback(async () => {
    Linking.canOpenURL(SettingsExternalURLs.twitterDeepLink).then(supported =>
      supported
        ? Linking.openURL(SettingsExternalURLs.twitterDeepLink)
        : Linking.openURL(SettingsExternalURLs.twitterWebUrl)
    );
  }, []);

  const onPressLearn = useCallback(
    () => Linking.openURL(SettingsExternalURLs.rainbowLearn),
    []
  );

  const { allBackedUp, areBackedUp, canBeBackedUp } = useMemo(
    () => checkAllWallets(wallets),
    [wallets]
  );

  const backupStatusColor = allBackedUp
    ? colors.wallet_green
    : colors.wallet_green;

  const toggleTheme = useCallback(() => {
    if (colorScheme === THEMES.SYSTEM) {
      setTheme(THEMES.LIGHT);
    } else if (colorScheme === THEMES.LIGHT) {
      setTheme(THEMES.DARK);
    } else {
      setTheme(THEMES.SYSTEM);
    }
  }, [setTheme, colorScheme]);

  const SettingFooterButton = ({
    path,
    label,
    onPress
  }) => {
    return (
      <TouchableOpacity style={[styles.settingFooterButton, styles.elevation]} onPress={onPress}>
          {path && <Image style={styles.buttonIcon} source={path}/>}
          <View width={7}/>
          <Text style={styles.buttonText}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Container backgroundColor={colors.white}>
      <ScrollContainer>
        <ColumnWithDividers dividerRenderer={ListItemDivider} marginTop={16}>
          {canBeBackedUp && (
            <ListItem
              icon={
                <SettingIcon
                  source={isDarkMode ? BackupIconDark : BackupIcon}
                />
              }
              label={lang.t('settings.backup')}
              onPress={onPressBackup}
              onPressIcloudBackup={onPressIcloudBackup}
              onPressShowSecret={onPressShowSecret}
              testID="backup-section"
            >
              <ListItemArrowGroup>
                {areBackedUp ? (
                  <CheckmarkIcon
                    color={backupStatusColor}
                    isDarkMode={isDarkMode}
                  />
                ) : (
                  <WarningIcon />
                )}
              </ListItemArrowGroup>
            </ListItem>
          )}
          <ListItem
            icon={
              <SettingIcon
                source={isDarkMode ? CurrencyIconDark : CurrencyIcon}
              />
            }
            label={lang.t('settings.currency')}
            onPress={onPressCurrency}
            testID="currency-section"
          >
            <ListItemArrowGroup>{nativeCurrency || ''}</ListItemArrowGroup>
          </ListItem>
          {(testnetsEnabled || IS_DEV) && (
            <ListItem
              icon={
                <SettingIcon
                  source={isDarkMode ? NetworkIconDark : NetworkIcon}
                />
              }
              label={lang.t('settings.network')}
              onPress={onPressNetwork}
              testID="network-section"
            >
              <ListItemArrowGroup>
                {networkInfo?.[network]?.name}
              </ListItemArrowGroup>
            </ListItem>
          )}
          <ListItem
            icon={
              <SettingIcon
                source={isDarkMode ? DarkModeIconDark : DarkModeIcon}
              />
            }
            label={lang.t('settings.theme')}
            onPress={toggleTheme}
            testID={`darkmode-section-${isDarkMode}`}
          >
            <Column align="end" flex={1} justify="end">
              <Text
                color={colors.alpha(colors.blueGreyDark, 0.6)}
                size="large"
                weight="medium"
              >
                {capitalizeFirstLetter(colorScheme)}
              </Text>
            </Column>
          </ListItem>
          {!isReadOnlyWallet && (
            <ListItem
              icon={
                <SettingIcon
                  source={isDarkMode ? PrivacyIconDark : PrivacyIcon}
                  height={30}
                  width={30}
                />
              }
              label={lang.t('settings.privacy')}
              onPress={onPressPrivacy}
              testID="privacy"
            >
              <ListItemArrowGroup />
            </ListItem>
          )}
          {isLanguageSelectionEnabled && (
            <ListItem
              icon={
                <SettingIcon
                  source={isDarkMode ? LanguageIconDark : LanguageIcon}
                />
              }
              label={lang.t('settings.language')}
              onPress={onPressLanguage}
            >
              <ListItemArrowGroup>
                {supportedLanguages[language] || ''}
              </ListItemArrowGroup>
            </ListItem>
          )}
        </ColumnWithDividers>
        <ListFooter />
        <ColumnWithDividers dividerRenderer={ListItemDivider}>
          <SettingFooterButton 
            path={AppIcon}
            label="Share"
            onPress={onPressShare}
          />
          <SettingFooterButton
            label="Learn about App and Ethereum"
            onPress={onPressLearn}
          />
          <SettingFooterButton
            label={
              ios
              ? lang.t('settings.feedback_and_support')
              : lang.t('settings.feedback_and_reports')
            }
            onPress={onSendFeedback}
          />
          <SettingFooterButton
            label={lang.t('settings.developer')}
            onPress={onPressDev}
          />
          <TouchableOpacity style={styles.twitterContainer} onPress={onPressTwitter}>
            <Image source={TwitterIcon}/>
            <Text>Follow Us on Twitter</Text>
          </TouchableOpacity>
        </ColumnWithDividers>
        <VersionStampContainer>
          <AppVersionStamp />
        </VersionStampContainer>
      </ScrollContainer>
    </Container>
  );
}

var styles = StyleSheet.create({
  settingFooterButton: {
    flexDirection: "row",
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 6,
    paddingVertical: 4,
    marginHorizontal: 20
  },
  elevation: {
    elevation: 20,
    shadowColor: "#6F6F6F",
    shadowOffset: { width: 3, height: 1 },
    shadowOpacity: 1,
  },
  buttonIcon: {
    height: 26,
    width: 26
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "500",
    color: "black"
  },
  twitterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  }
})

import { toChecksumAddress } from '@walletconnect/utils';
import { toLower } from 'lodash';
import React, { useCallback, useState } from 'react';
import { Share } from 'react-native';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import TouchableBackdrop from '../components/TouchableBackdrop';
import { CopyFloatingEmojis } from '../components/floating-emojis';
import { Centered, Column, ColumnWithMargins } from '../components/layout';
import QRCode from '../components/qr-code/QRCode';
import ShareButton from '../components/qr-code/ShareButton';
import { SheetHandle } from '../components/sheet';
import { Text, TruncatedAddress } from '../components/text';
import { CopyToast, ToastPositionContainer } from '../components/toasts';
import { useNavigation } from '../navigation/Navigation';
import { abbreviations, deviceUtils } from '../utils';
import { useAccountProfile } from '@rainbow-me/hooks';
import styled from '@rainbow-me/styled-components';
import { padding, shadow } from '@rainbow-me/styles';
import { View, StyleSheet, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
const QRCodeSize = ios ? 250 : Math.min(230, deviceUtils.dimensions.width - 20);

const AddressText = styled(TruncatedAddress).attrs(({ theme: { colors } }) => ({
  align: 'center',
  color: colors.whiteText,
  lineHeight: 'loosest',
  size: 'large',
  weight: 'semibold',
}))({
});

const Container = styled(Centered).attrs({
  direction: 'column',
})({
  bottom: 16,
  flex: 1,
});

const Handle = styled(SheetHandle).attrs(({ theme: { colors } }) => ({
  color: colors.whiteLabel,
}))({
  marginBottom: 19,
});

const QRWrapper = styled(Column).attrs({ align: 'center' })(
  ({ theme: { colors } }) => ({
    ...shadow.buildAsObject(0, 10, 50, colors.shadowBlack, 0.6),
    ...padding.object(24),
    backgroundColor: colors.whiteLabel,
    borderRadius: 39,
  })
);

const NameText = styled(Text).attrs(({ theme: { colors } }) => ({
  align: 'center',
  color: colors.whiteLabel,
  letterSpacing: 'roundedMedium',
  size: 'bigger',
  weight: 'bold',
}))({});

const accountAddressSelector = state => state.settings.accountAddress;
const lowercaseAccountAddressSelector = createSelector(
  accountAddressSelector,
  toLower
);

export default function ReceiveModal() {
  const { goBack } = useNavigation();
  const accountAddress = useSelector(lowercaseAccountAddressSelector);
  const { accountName } = useAccountProfile();

  const [copiedText, setCopiedText] = useState(undefined);
  const [copyCount, setCopyCount] = useState(0);
  const handleCopiedText = useCallback(text => {
    setCopiedText(abbreviations.formatAddressForDisplay(text));
    setCopyCount(count => count + 1);
  }, []);

  const checksummedAddress = useMemo(() => toChecksumAddress(accountAddress), [
    accountAddress,
  ]);

  const handlePress = useCallback(() => {
    Share.share({
      message: accountAddress,
      title: 'My account address:',
    });
  }, [accountAddress]);


  return (
    <Container testID="receive-modal">
      <TouchableBackdrop onPress={goBack} />
      <Handle />
      <ColumnWithMargins align="center" margin={24}>
        <QRWrapper>
          <QRCode size={QRCodeSize} value={checksummedAddress} />
        </QRWrapper>
        <CopyFloatingEmojis
          onPress={handleCopiedText}
          textToCopy={checksummedAddress}
        >
        </CopyFloatingEmojis>
        <View style={styels.addressShare}>
            <AddressText address={checksummedAddress} />
            <View style={styels.verticalDivider}/>
            <TouchableOpacity onPress={handlePress}>
              <Image style={styels.shareIcon} source={require('../assets/share.png')}/>
            </TouchableOpacity>
          </View>
      
      </ColumnWithMargins>
      <ToastPositionContainer>
        <CopyToast copiedText={copiedText} copyCount={copyCount} />
      </ToastPositionContainer>
    </Container>
  );

}

var styels = StyleSheet.create({
  addressShare: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#212429',
        marginTop: 30,
        paddingHorizontal: 26,
        borderRadius: 20,
        height: 50
  },
  shareIcon: {
    height: 30,
    width: 30,
  },
  verticalDivider: {
    height: 26,
    width: 2,
    backgroundColor: "white",
    marginHorizontal: 28
  }
})

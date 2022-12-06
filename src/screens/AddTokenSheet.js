import { useRoute } from '@react-navigation/native';
import { toLower } from 'lodash';
import React, { useCallback } from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { getSoftMenuBarHeight } from 'react-native-extra-dimensions-android';
import { useSafeArea } from 'react-native-safe-area-context';
import Divider from '../components/Divider';
import TouchableBackdrop from '../components/TouchableBackdrop';
import { ButtonPressAnimation } from '../components/animations';
import { CoinIcon } from '../components/coin-icon';
import { Centered, Column, Row } from '../components/layout';
import {
  SheetActionButton,
  SheetActionButtonRow,
  SlackSheet,
} from '../components/sheet';
import { Emoji, Text } from '../components/text';
import { DefaultTokenLists } from '../references/';
import {
  useAccountSettings,
  useDimensions,
  useUserLists,
} from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import styled from '@rainbow-me/styled-components';
import { position } from '@rainbow-me/styles';
import { haptics } from '@rainbow-me/utils';


const Container = styled(Centered).attrs({
  direction: 'column',
})(({ deviceHeight, height }) => ({
  ...position.coverAsObject,
  ...(height ? { height: height + deviceHeight } : {}),
}));

const RemoveButton = styled(ButtonPressAnimation)({
  backgroundColor: ({ theme: { colors } }) => colors.walletRed,
  borderRadius: 15,
  height: 30,
  marginLeft: 8,
  paddingLeft: 6,
  paddingRight: 10,
  paddingTop: 5,
  marginTop: 2,
  top: android ? 0 : 2,
});

const RemoveButtonContent = styled(Text).attrs(({ theme: { colors } }) => ({
  color: colors.white,
  letterSpacing: 'roundedTight',
  size: 'lmedium',
  weight: 'bold',
}))(android ? { marginTop: -5 } : {});

const ListButton = styled(ButtonPressAnimation)({
  paddingBottom: 6,
  paddingTop: 6,
});

const ListEmoji = styled(Emoji).attrs({
  size: 'large',
})({
  marginRight: 6,
  marginTop: android ? 4 : 1,
});

const WRITEABLE_LISTS = ['watchlist', 'favorites'];

export const sheetHeight = android ? 490 - getSoftMenuBarHeight() : 394;

export default function AddTokenSheet() {
  const { goBack } = useNavigation();
  const { height: deviceHeight } = useDimensions();
  const { network } = useAccountSettings();
  const { favorites, lists, updateList } = useUserLists();
  const insets = useSafeArea();
  const {
    params: { item },
  } = useRoute();

  const isTokenInList = useCallback(
    listId => {
      if (listId === 'favorites') {
        return !!favorites?.find(
          address => toLower(address) === toLower(item.address)
        );
      } else {
        const list = lists?.find(list => list?.id === listId);
        return !!list?.tokens?.find(
          token => toLower(token) === toLower(item.address)
        );
      }
    },
    [favorites, item.address, lists]
  );

  const { colors } = useTheme();

  return (
    <Container deviceHeight={deviceHeight} height={sheetHeight} insets={insets}>
      {ios && <StatusBar barStyle="light-content" />}
      {ios && <TouchableBackdrop onPress={goBack} />}

      <SlackSheet
        additionalTopPadding={android}
        contentHeight={sheetHeight}
        scrollEnabled={false}
      >
        <Centered direction="column" testID="add-token-sheet">
          <View style={styles.header}>
            <CoinIcon address={item.address} size={71} symbol={item.symbol} />
            <View width={24}/>
            <Text
              align="center"
              color={colors.alpha(colors.blueGreyDark, 0.8)}
              letterSpacing="roundedMedium"
              size="larger"
              weight="semibold"
            >
              {item.name}
            </Text>
          </View>
          <Column marginBottom={0}>
            <Text
              align="center"
              color={colors.dark}
              letterSpacing="roundedMedium"
              size="bigger"
              weight="heavy"
            >
              Add to List
            </Text>
          </Column>

          <Centered marginBottom={2}>
            <Divider color={colors.rowDividerExtraLight} inset={[0, 143.5]} />
          </Centered>

          <Column align="center" marginBottom={20}>
            {DefaultTokenLists[network]
              .filter(list => WRITEABLE_LISTS.indexOf(list?.id) !== -1)
              .map(list => {
                const alreadyAdded = isTokenInList(list?.id);
                const handleAdd = () => {
                  if (alreadyAdded) return;
                  updateList(item.address, list?.id, !alreadyAdded);
                  haptics.notificationSuccess();
                };
                const handleRemove = () => {
                  updateList(item.address, list?.id, false);
                  haptics.notificationSuccess();
                };
                return (
                  <Row align="center" key={`list-${list?.id}`}>
                    <ListButton
                      alreadyAdded={alreadyAdded}
                      onPress={alreadyAdded ? handleRemove : handleAdd}
                      testID={`add-to-${list?.id}`}
                    >
                      <Row style={styles.itemButton}>
                        <ListEmoji name={list.emoji} />
                        <Text
                          color={
                            alreadyAdded
                              ? colors.black
                              : colors.appleBlue
                          }
                          size="larger"
                          weight="bold"
                        >
                          {list.name}
                        </Text>
                      </Row>
                    </ListButton>
                    {alreadyAdded && (
                      <RemoveButton
                        onPress={handleRemove}
                        testID={`remove-from-${list?.id}`}
                      >
                        <RemoveButtonContent>􀈔 Remove</RemoveButtonContent>
                      </RemoveButton>
                    )}
                  </Row>
                );
              })}
          </Column>

          <SheetActionButtonRow>
            <SheetActionButton
              color={colors.white}
              label="Cancel"
              onPress={goBack}
              size="big"
              testID="close"
              textColor={colors.alpha(colors.blueGreyDark, 0.8)}
              weight="bold"
            />
          </SheetActionButtonRow>
        </Centered>
      </SlackSheet>
    </Container>
  );
}

var styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 30,
  },
  itemButton: {
    backgroundColor: "#DADADA",
    borderRadius: 20,
    paddingHorizontal: 10,
  }
})
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { primaryColor } from '../../assets/color';
import { Spacer } from './spacer';
import Routes from '@rainbow-me/routes';

export interface ProductProps {
  /**
   * Product Title
   *
   * @type {string}
   */
  title: String;
  productImage: String;
  productPrice: String;
  createdAt?: String;
  purchasedAt?: String;
  soldOutNumber?: String;
  currentOrderStatus?: String;
}

export const MyProductItem = ({
  title,
  productImage,
  productPrice,
  soldOutNumber,
  purchasedAt,
}: ProductProps) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(Routes.MY_PRODUCT_DETAILS);
      }}
    >
      <View style={styles.rootRow}>
        <View style={styles.productBodyLeading}>
          <ProductImage path={productImage} />
          <Spacer width={8} />
          <ProductBody
            title={title}
            productImage={productImage}
            productPrice={productPrice}
            soldOutNumber={soldOutNumber}
            purchasedAt={purchasedAt}
          />
        </View>
        <ProductPrice value={'20'} />
      </View>
    </TouchableOpacity>
  );
};

interface ProductImageProps {
  path?: String;
}

function ProductImage({ path }: ProductImageProps) {
  // const productImagePath = require('../../assets/nft.png');
  // return <Image source={productImagePath} style={styles.productImage}></Image>;
  return <Image source={{uri: path}} style={styles.productImage}></Image>;
}

const parseDate = d => {
  const date = new Date(d).getDate();
  const month = new Date(d).getMonth() + 1;
  const year = new Date(d).getFullYear();

  const hours = new Date(d).getHours();
  const minutes = new Date(d).getMinutes();
  return `${date}/${month}/${year} ${hours}:${minutes}`;
};
interface SingleValueProp {
  value: String;
}

function ProductPrice({ value }: SingleValueProp) {
  return (
    <View style={styles.priceBackground}>
      <Text style={styles.productPriceText}>{`${value} MTO`}</Text>
    </View>
  );
}

function ProductBody({
  title,
  productImage,
  productPrice,
  soldOutNumber,
  purchasedAt,
}: ProductProps) {
  return (
    <View style={styles.productBody}>
      <Text style={styles.productTitle}>{title}</Text>
      <Text>{`Purchased at ${parseDate(purchasedAt)}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rootRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: 'white',
    borderRadius: 16,
  },
  productBodyLeading: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingStart: 8,
  },
  productImage: {
    height: 50,
    width: 50,
  },
  productBody: {
    flexDirection: 'column',
  },
  productTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
  },
  productSoldOut: {
    fontSize: 16,
  },
  productPriceText: {
    fontSize: 16,
    color: 'white',
  },
  priceBackground: {
    backgroundColor: primaryColor,
    borderBottomStartRadius: 16,
    borderTopEndRadius: 16,
    height: '50%',
    paddingHorizontal: 12,
  },
});

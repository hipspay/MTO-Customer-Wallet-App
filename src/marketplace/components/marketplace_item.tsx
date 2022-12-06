import RoutesAndroid from '@rainbow-me/navigation/Routes.android';
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
  id: Number;
  title: String;
  productImage: String;
  productPrice: String;
  createdAt?: String;
  purchasedAt?: String;
  soldOutNumber?: String;
  currentOrderStatus?: String;
}

export const ProductItem = ({
  id,
  title,
  productImage,
  productPrice,
  soldOutNumber,
}: ProductProps) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(Routes.PRODUCT_DETAILS, {
          id: id,
        });
      }}
    >
      <View style={styles.rootRow}>
        <View style={styles.productBodyLeading}>
          <ProductImage path={productImage}/>
          <Spacer width={8} />
          <ProductBody
            productImage={productImage}
            productPrice={productPrice}
            soldOutNumber={soldOutNumber}
            title={title}
          />
        </View>
        <ProductPrice value={productPrice} />
      </View>
    </TouchableOpacity>
  );
};

interface ProductImageProps {
  path?: String;
}

function ProductImage({ path }: ProductImageProps) {
  // const productImagePath = require('../../assets/nft.png');
  return <Image source={{uri: path}} style={styles.productImage}></Image>;
}

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
}: ProductProps) {
  return (
    <View style={styles.productBody}>
      <Text style={styles.productTitle}>{title}</Text>
      <Text>{`${soldOutNumber} Sold out`}</Text>
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

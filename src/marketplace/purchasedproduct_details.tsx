import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { primaryColor } from '../assets/color';
import { Spacer } from '../marketplace/components/spacer';
import { MarketPlaceAppBar } from './components/marketplace_action';

export const PurchasedProductDetails = () => {
  const shopImagePath = require('../assets/store.png');
  return (
    <View style={styles.root}>
      <View style={{ height: 30 }}></View>
      <View style={{ height: 60 }}>
        <MarketPlaceAppBar title={'My Product Details'} />
      </View>
      <View style={styles.productInfoContainer}>
        <Spacer height={20} />
        <ProductImage value={''} />
        <Spacer height={8} />
        <Text style={styles.purchaseTitle}>Purchased at</Text>
        <Text style={styles.purchaseDate}>2021-07-15 07:38:23</Text>
        <Spacer height={20} />
        <View style={styles.productBody}>
          <ProductTitle value={''} />
          <ProductDescription value={''} />
          <Spacer height={12} />
          <ProductLocation value={''} />
          <Spacer height={2} />
          <View style={styles.sellerRow}>
            <ShopImage value={''} />
            <Spacer width={8} />
            <ProductOwner value={''} />
          </View>
          <Spacer height={24} />
          <ProductPrice value={''} />
        </View>
      </View>
    </View>
  );
};

interface SingleValueProp {
  value: String;
}

function ProductTitle({ value }: SingleValueProp) {
  return <Text style={styles.productTitle}>NF-Tim By Creative Tim </Text>;
}

function ProductDescription({ value }: SingleValueProp) {
  return (
    <Text style={styles.prodcutDescription}>
      This is an awesome product, already sold out thousands for last 1 year
    </Text>
  );
}

function ProductLocation({ value }: SingleValueProp) {
  return <Text style={styles.productAddress}>123 Street, Newyork, USA </Text>;
}

function ProductOwner({ value }: SingleValueProp) {
  return <Text style={styles.productOwner}>Sold by Jhon Smith</Text>;
}

function ProductPrice({ value }: SingleValueProp) {
  return <Text style={styles.productPrice}>13.14 MTO</Text>;
}

function ProductImage({ value }: SingleValueProp) {
  const productImagePath = require('../assets/product.png');
  return <Image source={productImagePath} style={styles.productImage}></Image>;
}

function ShopImage({ value }: SingleValueProp) {
  const productImagePath = require('../assets/store.png');
  return <Image source={productImagePath} style={styles.shopImage}></Image>;
}

function PurchaseButton() {
  return (
    <TouchableOpacity>
      <View style={styles.purchaseButton}>
        <Text style={styles.buttonText}>Purchase</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  productInfoContainer: {
    flex: 1,
  },
  productBody: {
    paddingHorizontal: 16,
  },
  productImage: {
    height: 260,
    width: '100%',
    resizeMode: 'contain',
  },
  productAddress: {
    fontSize: 16,
  },
  productTitle: {
    fontSize: 24,
    color: '#695A97',
  },
  productOwner: {
    fontSize: 14,
  },
  prodcutDescription: {
    fontSize: 18,
    color: '#575757',
  },
  productPrice: {
    fontSize: 32,
    color: primaryColor,
    fontWeight: '900',
  },
  purchaseButton: {
    width: '100%',
    height: 60,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: primaryColor,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    justifyContent: 'center',
  },
  sellerRow: {
    flexDirection: 'row',
  },
  shopImage: {
    height: 20,
    width: 20,
  },
  purchaseTitle: {
    textAlign: 'center',
  },
  purchaseDate: {
    textAlign: 'center',
  },
});

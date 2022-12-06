import { useRoute } from '@react-navigation/core';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Dialog from 'react-native-dialog';
import { useSelector } from 'react-redux';
import { primaryColor } from '../assets/color';
import { GenericToast } from '../components/toasts';
import { Spacer } from '../marketplace/components/spacer';
import { LoadingSpinner, LoadingWrapper } from './components/Loader';
import { MarketPlaceAppBar } from './components/marketplace_action';
import { MyOrderProps } from './my_orders';
import { toWei } from '@rainbow-me/handlers/web3';
import Routes from '@rainbow-me/routes';

export const ProductDetails = () => {
  const shopImagePath = require('../assets/store.png');
  const bkdDriver = useSelector(state => state.sdkDriver.bkdDriver);
  const scDriver = useSelector(state => state.sdkDriver.scDriver);
  const route = useRoute();
  const params = route.params;
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState(null);
  const navigation = useNavigation<NavigationProp<any>>();
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState(
    'Something went wrong'
  );
  const [isConformPurchase, setConfirmPurchase] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    if (!bkdDriver || !bkdDriver.headers) {
      return;
    }

    setIsLoading(true);
    const id = params?.id;

    const res = await bkdDriver.getProductById(id);
    console.log('product', res);
    setData(res);
    setIsLoading(false);
  }, [params.id, bkdDriver]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showNotification = (msg: string) => {
    console.log(msg);
    setToastMessage(msg);
    setShowToast(true);
  };
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const verifyOrder = async (escrowId: string, timeToEnd: number) => {
    if (!bkdDriver || !bkdDriver.headers) return;

    try {
      const { id } = await bkdDriver.getOrderByEscrow(escrowId);
      if (id) {
        return id;
      } else {
        await sleep(2000);
        if (Date.now() > timeToEnd) {
          return false;
        }
        return verifyOrder(escrowId, timeToEnd);
      }
    } catch (error) {
      console.log('error ', error);
      await sleep(2000);
      if (Date.now() > timeToEnd) {
        return false;
      }
      return verifyOrder(escrowId, timeToEnd);
    }
  };

  const purchaseProduct = async () => {
    handleCancel();
    setIsLoading(true);

    const createdAt = Math.round(new Date().getTime() / 1000);
    const escrowWithdrawableTime = createdAt + 900;
    const escrowDisputableTime = createdAt + 120;
    try {
      const priceAmount = toWei(data?.price?.toString());
      console.log('priceAmount', priceAmount);
      const balance = await scDriver.getTokenBalance();
      console.log('balance', balance.toString());
      if (Number(balance.toString()) < Number(priceAmount)) {
        showNotification('User does not have enough balance.');
        setIsLoading(false);
        return;
      }

      const result = await scDriver.purchase(
        data?.id,
        data?.merchant?.walletAddress,
        priceAmount,
        escrowDisputableTime,
        escrowWithdrawableTime,
        { gasLimit: 600000 }
      );
      const receipt = await result.wait();
      console.log('purchase receipt', receipt);
      const escrow = receipt.events?.filter((x) => x.event === "Escrowed");
      const _escrowId = escrow[0].args._escrowId.toString();
      console.log('purchase _escrowId', _escrowId);

      const endRequestsAt = Date.now() + 120000;
      const orderId = await verifyOrder(_escrowId, endRequestsAt);
      if (orderId) {
        //history.push(`/orders/${orderId}`);
        navigation.navigate(Routes.ORDER_DETAILS, {
          id: orderId,
        } as MyOrderProps);
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error, 'error');
      setIsLoading(false);
      showNotification(error?.message);
    }
  };

  const handleCancel = () => {
    setConfirmPurchase(false);
  };

  return (
    <View style={styles.root}>
      <View style={{ height: 30 }}></View>
      <View style={{ height: 60 }}>
        <MarketPlaceAppBar title={'Product Details'} />
      </View>
      <View style={styles.productInfoContainer}>
        <Spacer height={20} />
        <ProductImage value={data?.image} />
        <Spacer height={20} />
        <View style={styles.productBody}>
          <ProductTitle value={data?.name} />
          <ProductDescription value={data?.description} />
          <Spacer height={12} />
          <ProductLocation value={data?.shopAddress} />
          <Spacer height={2} />
          <View style={styles.sellerRow}>
            <ShopImage value={''} />
            <Spacer width={8} />
            <ProductOwner value={data?.merchant?.name} />
          </View>
          <Spacer height={24} />
          <ProductPrice value={data?.price} />
        </View>
      </View>
      <PurchaseButton setConfirmPurchase={setConfirmPurchase} />
      {!!isLoading && (
        <LoadingWrapper>
          <LoadingSpinner />
        </LoadingWrapper>
      )}
      <GenericToast
        isVisible={showToast}
        message={toastMessage}
        setIsVisible={setShowToast}
      />
      <Dialog.Container visible={isConformPurchase}>
        <Dialog.Title>Confirm Purchase</Dialog.Title>
        <Dialog.Description>
          Are you sure to proceed for purchasing this product?
        </Dialog.Description>
        <Dialog.Button label="No" onPress={handleCancel} />
        <Dialog.Button label="Yes" onPress={purchaseProduct} />
      </Dialog.Container>
    </View>
  );
};

interface SingleValueProp {
  value: String;
}

function ProductTitle({ value }: SingleValueProp) {
  return <Text style={styles.productTitle}>{value}</Text>;
}

function ProductDescription({ value }: SingleValueProp) {
  return <Text style={styles.prodcutDescription}>{value}</Text>;
}

function ProductLocation({ value }: SingleValueProp) {
  return <Text style={styles.productAddress}>{value}</Text>;
}

function ProductOwner({ value }: SingleValueProp) {
  return <Text style={styles.productOwner}>{value}</Text>;
}

function ProductPrice({ value }: SingleValueProp) {
  return <Text style={styles.productPrice}>{value} MTO</Text>;
}

function ProductImage({ value }: SingleValueProp) {
  // const productImagePath = require('../assets/product.png');
  return <Image source={{uri: value}} style={styles.productImage} />;
}

function ShopImage({ value }: SingleValueProp) {
  const productImagePath = require('../assets/store.png');
  return <Image source={productImagePath} style={styles.shopImage}></Image>;
}

function PurchaseButton({ setConfirmPurchase }) {
  return (
    <TouchableOpacity onPress={() => setConfirmPurchase(true)}>
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
});

import {
  NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import moment from 'moment';
import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Dialog from 'react-native-dialog';
import { CUSTOMER_ESCROW_FEE } from 'react-native-dotenv';
import { useSelector } from 'react-redux';
import { primaryColor } from '../assets/color';
import { GenericToast } from '../components/toasts';
import { getOrderStatusColor } from '../marketplace/components/myorder_item';
import { Spacer } from '../marketplace/components/spacer';
import { OrderStatus } from '../marketplace/enums/delivery_status';
import { LoadingSpinner, LoadingWrapper } from './components/Loader';
import { MarketPlaceAppBar } from './components/marketplace_action';
import { TimeInfo } from './dispute_details';
import { MyOrderProps } from './my_orders';
import { toWei } from '@rainbow-me/handlers/web3';
import Routes from '@rainbow-me/routes';
const orderStatus = {
  completed: 'Completed',
  in_delivery: 'In Delivery',
  in_dispute: 'Disputed',
  over_delivery: 'Over Delivery',
};
export const OrderDetails = () => {
  const shopImagePath = require('../assets/store.png');
  const route = useRoute();
  const params = route.params as MyOrderProps;
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isConfirmArrival, setIsConfirmArrival] = React.useState(false);
  const [isConfirmDispute, setIsConfirmDispute] = React.useState(false);
  const [remainTime, setRemainTime] = React.useState('');
  const scDriver = useSelector(state => state.sdkDriver.scDriver);
  const bkdDriver = useSelector(state => state.sdkDriver.bkdDriver);
  const [currentOrderStatus, setCurrentOrderStatus] = React.useState('');
  const navigation = useNavigation<NavigationProp<any>>();
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState(
    'Something went wrong'
  );
  const [description, setDescription] = React.useState('');
  // const sleep = ms => new Promise((resolve) => setTimeout(resolve, ms));

  const getStandardTime = (time: number) => {
    const standardTimestamp =
      new Date(time).getTime() + new Date(time).getTimezoneOffset() * 60 * 1000;
    const standardTime = new Date(standardTimestamp);
    return standardTime;
  };

  const getOrderStatus = (deliveryTime, status) => {
    // let { status, deliveryTime } = order;
    deliveryTime = getStandardTime(deliveryTime);

    if (
      status === 'in_delivery' &&
      new Date(deliveryTime).getTime() > new Date().getTime()
    ) {
      status = OrderStatus.InDelivey;
    }

    if (
      status === 'in_delivery' &&
      new Date(deliveryTime).getTime() < new Date().getTime()
    ) {
      status = OrderStatus.OverDelivery;
    }

    if (
      status === 'over_delivery' &&
      new Date(deliveryTime).getTime() < new Date().getTime()
    ) {
      status = OrderStatus.OverDelivery;
    }

    if (status === 'in_dispute') {
      status = OrderStatus.InDispute;
    }

    if (orderStatus[status] === 'over_delivery') {
      status = OrderStatus.OverDelivery;
    }

    setCurrentOrderStatus(status);
  };
  React.useEffect(() => {
    if (!data) {
      return;
    }

    const deadline = getStandardTime(data.deliveryTime).getTime();
    const timer = setInterval(() => {
      const currentTime = new Date().getTime();
      // if (deadline > currentTime) {
      //   setCurrentOrderStatus(OrderStatus.InDelivey);
      // } else {
      //   setCurrentOrderStatus(OrderStatus.OverDelivery);
      // }
      getOrderStatus(data.deliveryTime, data.status);
      let seconds = (deadline - currentTime) / 1000;
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
      minutes %= 60;
      const days = Math.floor(hours / 24);
      hours %= 24;
      seconds %= 60;
      const time = `${days > 0 ? days : 0}d: ${hours > 0 ? hours : 0}h: ${
        minutes > 0 ? minutes : 0
      }m: ${seconds > 0 ? Math.floor(seconds) : 0}s`;
      setRemainTime(time);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [data]);

  const getOrder = async () => {
    if (!bkdDriver || !bkdDriver.headers) return;

    setIsLoading(true);
    const id = params.id;
    const order = await bkdDriver.myorder(id);
    console.log('order', order);
    setData(order);
    setIsLoading(false);
  };

  React.useEffect(() => {
    getOrder();
  }, [params.id]);

  const parseDate = d => {
    const date = new Date(d).getDate();
    const month = new Date(d).getMonth() + 1;
    const year = new Date(d).getFullYear();

    const hours = new Date(d).getHours();
    const minutes = new Date(d).getMinutes();
    return `${date}/${month}/${year} ${hours}:${minutes}`;
  };

  const getDateDiffInDays = _date => {
    const date = getStandardTime(_date);
    const diff = moment(date).diff(moment(), 'days');
    return diff > 0 ? diff : 0;
  };
  const confirmArival = () => {
    console.log('confirmArival');
    showNotification('Coming soon');
  };

  const showNotification = (msg: string) => {
    console.log(msg);
    setToastMessage(msg);
    setShowToast(true);
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const verifyDispute = async (disputeId, timeToEnd) => {
    if (!bkdDriver || !bkdDriver.headers) {
      return;
    }

    try {
      const { id } = await bkdDriver.getDisputeByDisputeId(disputeId);
      console.log('returning', id);
      if (id) {
        return id;
      } else {
        await sleep(2000);
        if (Date.now() > timeToEnd) {
          return false;
        }
        return verifyDispute(disputeId, timeToEnd);
      }
    } catch (error) {
      console.log(error);
      await sleep(2000);
      if (Date.now() > timeToEnd) {
        return false;
      }
      return verifyDispute(disputeId, timeToEnd);
    }
  };
  const updateDisputeDescription = async (disputeId, description) => {
    if (!bkdDriver || !bkdDriver.headers) return;
    try {
      const { id } = await bkdDriver.updateDispute(disputeId, {
        description,
      });
      console.log('returning', id);
      return id;
    } catch (error) {
      console.log(error);
    }
  };
  const disputeOrder = async description => {
    console.log(description, 'description');

    setIsLoading(true);
    setIsConfirmDispute(false);
    try {
      const feeAmount = toWei(CUSTOMER_ESCROW_FEE);
      const balance = await scDriver.getTokenBalance();
      if (Number(balance.toString()) < Number(feeAmount)) {
        showNotification('User does not have enough balance.');
        setIsLoading(false);
        return;
      }

      const approve = await scDriver.approve(feeAmount);
      const approveReceipt = await approve.wait();
      console.log(' approve_receipt', approveReceipt);

      const dispute = await scDriver.startDispute(data?.escrowId);
      const disputeReceipt = await dispute.wait();
      console.log(' approve_receipt', disputeReceipt);
      const disputeEvents = disputeReceipt.events?.filter(
        x => x.event === 'Disputed'
      );
      const disputeId = disputeEvents[0].args._disputeId.toString();
      console.log('purchase _disputeId', disputeId);

      const endRequestsAt = Date.now() + 120000;
      const orderId = await verifyDispute(disputeId, endRequestsAt);
      if (orderId) {
        const disputeUpdateResult = await updateDisputeDescription(
          disputeId,
          description
        );
        console.log('disputeUpdateResult', disputeUpdateResult);
        navigation.navigate(Routes.DISPUTE_DETAILS, {
          id: orderId,
        } as MyOrderProps);
        //history.push(`/disputes/${orderId}`);
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error, 'error');

      setIsLoading(false);
      setToastMessage(error.message);
      setShowToast(true);
    }
  };
  // const startDispute = () => {
  //   console.log('startDispute');
  //   // setIsLoading(true);
  //   // setShowToast(true);
  //   setIsConfirmDispute(true);
  // };

  const handleCancel = () => {
    setIsConfirmDispute(false);
  };

  const submitForm = async () => {
    console.log('description', description);
    if (description === '') {
      setToastMessage('Enter description');
      setShowToast(true);
    } else {
      disputeOrder(description);
    }
  };
  const handleDispute = () => {
    if (getStandardTime(data?.deliveryTime).getTime() >= new Date().getTime()) {
      showNotification('Delivery time not over yet.');
      return;
    }
    if (new Date().getTime() >= getStandardTime(data?.escrowTime).getTime()) {
      showNotification('Dispute time is over.');
      return;
    }
    setIsConfirmDispute(true);
  };
  return (
    <View style={styles.root}>
      <View style={{ height: 30 }}></View>
      <View style={{ height: 60 }}>
        <MarketPlaceAppBar title={'Order Details'} />
      </View>
      <View style={styles.productInfoContainer}>
        <Spacer height={20} />
        <ProductImage value={data?.product?.image} />
        <Spacer height={8} />
        <Text
          style={[
            styles.currentStatus,
            { color: getOrderStatusColor(currentOrderStatus) },
          ]}
        >
          {currentOrderStatus}
        </Text>
        <Spacer height={8} />
        <View style={styles.productBody}>
          <View style={styles.timeInfoRow}>
            <TimeInfo
              title={getStatusTitle(currentOrderStatus)}
              value={remainTime}
            />
            <TimeInfo
              title={'Purchased at'}
              value={parseDate(data?.createdAt)}
            />
          </View>
          <Spacer height={20} />
          <ProductTitle value={data?.product?.name} />
          <ProductDescription value={data?.product?.description} />
          <Spacer height={12} />
          <ProductLocation value={data?.product?.shopAddress} />
          <Spacer height={2} />
          <View style={styles.sellerRow}>
            <ShopImage value={''} />
            <Spacer width={8} />
            <ProductOwner value={data?.product?.merchant.name} />
          </View>
          <Spacer height={24} />
          <ProductPrice value={data?.product?.price} />
          <Spacer height={12} />
          <Text>
            Delivery in (days): {getDateDiffInDays(data?.deliveryTime)}
          </Text>
          <Text>
            Escrow period (days): {getDateDiffInDays(data?.escrowTime)}
          </Text>
        </View>
      </View>
      {getFooterButton(currentOrderStatus, confirmArival, handleDispute)}
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
      <Dialog.Container visible={isConfirmDispute}>
        <Dialog.Title>Give a detail description:</Dialog.Title>
        <Dialog.Description>
          Detail reason for dispute, max 500 character.
        </Dialog.Description>
        <Dialog.Input onChangeText={text => setDescription(text)} />
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Submit" onPress={submitForm} />
      </Dialog.Container>
    </View>
  );
};

interface SingleValueProp {
  value: String;
}

function getStatusTitle(currentOrderStatus: OrderStatus | undefined) {
  switch (currentOrderStatus) {
    case OrderStatus.InDelivey: {
      return 'Delivery period ends in';
    }
    case OrderStatus.OverDelivery: {
      return 'Escrow period ends in';
    }
    default: {
      return '';
    }
  }
}

function getFooterButton(
  currentOrderStatus: OrderStatus | undefined,
  confirmArival,
  startDispute
) {
  switch (currentOrderStatus) {
    case OrderStatus.InDelivey: {
      return <ConfirmArrivalButton confirmArival={confirmArival} />;
    }
    case OrderStatus.OverDelivery: {
      return (
        <ConfirmArrivalWithDisputeButton
          confirmArival={confirmArival}
          startDispute={startDispute}
        />
      );
    }
    default: {
      return;
    }
  }
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
  return <Text style={styles.productOwner}>Sold by {value}</Text>;
}

function ProductPrice({ value }: SingleValueProp) {
  return <Text style={styles.productPrice}>{value} MTO</Text>;
}

function ProductImage({ value }: SingleValueProp) {
  // const productImagePath = require('../assets/product.png');
  return <Image source={{ uri: value }} style={styles.productImage}></Image>;
}

function ShopImage({ value }: SingleValueProp) {
  const productImagePath = require('../assets/store.png');
  return <Image source={productImagePath} style={styles.shopImage}></Image>;
}

function ConfirmArrivalButton({ confirmArival }) {
  return (
    <TouchableOpacity onPress={confirmArival}>
      <View style={styles.confrimArrivalButton}>
        <Text style={styles.buttonText}>Confirm Arrival</Text>
      </View>
    </TouchableOpacity>
  );
}

function ConfirmArrivalWithDisputeButton({ startDispute, confirmArival }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <TouchableOpacity onPress={confirmArival}>
        <View style={styles.footerButton}>
          <Text style={styles.buttonText}>Confirm Arrival</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={startDispute}>
        <View style={[styles.footerButton, { backgroundColor: '#BA0F30' }]}>
          <Text style={styles.buttonText}>Dispute</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  productInfoContainer: {
    flex: 1,
  },
  currentStatus: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  productBody: {
    paddingHorizontal: 16,
  },
  productImage: {
    height: 260,
    width: '100%',
    resizeMode: 'contain',
  },
  periodEndingIn: { textAlign: 'center' },
  countDown: { textAlign: 'center' },
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
  footerButton: {
    width: 200,
    height: 60,
    backgroundColor: primaryColor,
    justifyContent: 'center',
  },
  confrimArrivalButton: {
    width: '100%',
    height: 60,
    borderTopEndRadius: 16,
    borderTopStartRadius: 16,
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
  timeInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

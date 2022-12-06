import { useRoute } from '@react-navigation/native';
import moment from 'moment';
import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { primaryColor } from '../assets/color';
import { GenericToast } from '../components/toasts';
import { DisputeProps } from '../marketplace/components/dispute_item';
import { Spacer } from '../marketplace/components/spacer';
import { DisputeStatus } from '../marketplace/enums/dispute_status';
import { LoadingSpinner, LoadingWrapper } from './components/Loader';
import { MarketPlaceAppBar } from './components/marketplace_action';

export const DisputeDetails = () => {
  const shopImagePath = require('../assets/store.png');
  const route = useRoute();
  const params = route.params as DisputeProps;
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState(
    'Something went wrong'
  );
  // const history = useHistory();
  const bkdDriver = useSelector(state => state.sdkDriver.bkdDriver);

  const parseDate = d => {
    const date = new Date(d).getDate();
    const month = new Date(d).getMonth() + 1;
    const year = new Date(d).getFullYear();
    const hours = new Date(d).getHours();
    const minutes = new Date(d).getMinutes();
    return `${date}/${month}/${year} ${hours}:${minutes}`;
  };
  const getDisputeDetail = async () => {
    if (!bkdDriver || !bkdDriver.headers) return;
    setIsLoading(true);
    const id = params.id;
    const res = await bkdDriver.getDisputeById(id);
    console.log('dispute', res);
    setData(res);
    setIsLoading(false);
  };
  React.useEffect(() => {
    getDisputeDetail();
  }, [bkdDriver]);

  const withdrawClick = () => {
    console.log('withdraw Clicked');
    showNotification('Coming soon');
  };

  const cancelClick = () => {
    console.log('withdraw Clicked');
    showNotification('Coming soon');
  };

  const showNotification = (msg: string) => {
    console.log(msg);
    setToastMessage(msg);
    setShowToast(true);
  };

  const getStandardTime = (time: number) => {
    const standardTimestamp =
      new Date(time).getTime() + new Date(time).getTimezoneOffset() * 60 * 1000;
    const standardTime = new Date(standardTimestamp);
    return standardTime;
  };
  const getDateDiffInDays = _date => {
    const date = getStandardTime(_date);
    const diff = moment(date).diff(moment(), 'days')
    return diff > 0 ? diff : 0;
  };

  return (
    <View style={styles.root}>
      <View style={{ height: 30 }}></View>
      <View style={{ height: 60 }}>
        <MarketPlaceAppBar title={'Dispute Details'} />
      </View>
      <View style={styles.productInfoContainer}>
        <Spacer height={20} />
        <ProductImage value={data?.order?.product?.image} />
        <Spacer height={8} />
        <Text
          style={[styles.currentStatus, { color: getStatusColor(data?.status) }]}
        >
          {DisputeStatus[data?.status]}
        </Text>
        <View style={styles.productBody}>
          <View style={styles.timeInfoRow}>
            <TimeInfo
              title={'Dispute created at'}
              value={parseDate(data?.createdAt)}
            />
            <TimeInfo
              title={'Purchased at'}
              value={parseDate(data?.order?.createdAt)}
            />
          </View>
          <Spacer height={20} />
          <ProductTitle value={data?.order?.product?.name} />
          <ProductDescription value={data?.order?.product?.description} />
          <Spacer height={12} />
          <View style={styles.sellerRow}>
            <ShopImage value={''} />
            <Spacer width={8} />
            <ProductOwner value={data?.order?.product?.merchant?.name} />
          </View>
          <Spacer height={12} />
          <ProductPrice value={data?.order?.product?.price} />
          <Spacer height={30} />
          <View style={styles.countRow}>
            <View style={styles.deliveryCountDataRow}>
              <CountInfo
                title={'Delivery in (days):'}
                value={getDateDiffInDays(data?.order?.deliveryTime)}
              />
              <Spacer height={4} />
              <CountInfo
                title={'Escrow period (days):'}
                value={getDateDiffInDays(data?.order?.deliveryTime)}
              />
            </View>
            {getAgentInfo(data)}
          </View>
        </View>
      </View>
      {getCurrentFooter(data?.status, withdrawClick, cancelClick)}
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
    </View>
  );
};

interface SingleValueProp {
  value: String;
}

interface CountInfo {
  title: String;
  value: String;
}

function getAgentInfo(data) {
  const currentStatus: DisputeStatus = data?.status;
  switch (currentStatus) {
    case DisputeStatus.init:
    case DisputeStatus.review:
    case DisputeStatus.waiting: {
      return (
        <View>
          <CountInfo title={'Agents in Review:'} value={data?.appliedAgentsCount} />
          <Spacer height={4} />
          <CountInfo title={'Agents in Approved:'} value={data?.approvedCount} />
          <Spacer height={4} />
          <CountInfo title={'Agents in Disapproved:'} value={data?.disapprovedCount} />
        </View>
      );
    }
    default: {
      return;
    }
  }
}

export function getStatusColor(currentStatus: DisputeStatus) {
  // console.log('currentStatus', currentStatus, DisputeStatus.win);
  switch (currentStatus) {
    case DisputeStatus.win: {
      return 'green';
    }
    case DisputeStatus.init: {
      return 'black';
    }
    case DisputeStatus.fail: {
      return 'red';
    }
    case DisputeStatus.review: {
      return '#D1D100';
    }
    case DisputeStatus.waiting: {
      return '#005BEA';
    }
    default: {
      return;
    }
  }
}

function getCurrentFooter(currentStatus: DisputeStatus, withdrawClick, cancelClick) {
  switch (currentStatus) {
    case DisputeStatus.win: {
      return (
        <View>
          <Text
            style={{
              marginHorizontal: 16,
              textAlign: 'center',
              fontWeight: '600',
            }}
          >
            Congrats, you have won a dispute, Please withdraw the fund from an
            escrow contract
          </Text>
          <Spacer height={16} />
          <WithdrawButton withdrawClick={withdrawClick} />
        </View>
      );
    }
    case DisputeStatus.init: {
      return <CancelButton cancelClick={cancelClick} />;
    }
    case DisputeStatus.fail: {
      return (
        <Text
          style={{
            marginHorizontal: 16,
            textAlign: 'center',
            fontWeight: '600',
            marginBottom: 32,
          }}
        >
          Sorry, your dispute has disapproved by 2 agents, so you got failed for
          this case
        </Text>
      );
    }
    default: {
      return;
    }
  }
}
function CountInfo({ title, value }: CountInfo) {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Text>{title}</Text>
      <Spacer width={2} />
      <Text>{value}</Text>
    </View>
  );
}

function ProductTitle({ value }: SingleValueProp) {
  return <Text style={styles.productTitle}>{value}</Text>;
}

interface TimeInfo {
  title: String;
  value: String;
}

export function TimeInfo({ title, value }: TimeInfo) {
  return (
    <View>
      <Text style={styles.purchaseTitle}>{title}</Text>
      <Text style={styles.purchaseDate}>{value}</Text>
    </View>
  );
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
  return <Image source={{uri: value}} style={styles.productImage}></Image>;
}

function ShopImage({ value }: SingleValueProp) {
  const productImagePath = require('../assets/store.png');
  return <Image source={productImagePath} style={styles.shopImage}></Image>;
}

function WithdrawButton({ withdrawClick }) {
  return (
    <TouchableOpacity onPress={withdrawClick}>
      <View style={styles.purchaseButton}>
        <Text style={styles.buttonText}>Withdraw</Text>
      </View>
    </TouchableOpacity>
  );
}

function CancelButton({ cancelClick }) {
  return (
    <TouchableOpacity onPress={cancelClick}>
      <View style={styles.purchaseButton}>
        <Text style={styles.buttonText}>Cancel</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  productInfoContainer: {
    flex: 1,
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deliveryCountDataRow: {
    justifyContent: 'flex-end',
  },
  timeInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    height: 220,
    width: '100%',
    resizeMode: 'contain',
  },
  purchaseTitle: {},
  purchaseDate: {},
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

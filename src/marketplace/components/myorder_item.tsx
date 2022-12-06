import { NavigationProp, useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { primaryColor } from '../../assets/color';
import { OrderStatus } from '../enums/delivery_status';
import { MyOrderProps } from '../my_orders';
import { Spacer } from './spacer';
import Routes from '@rainbow-me/routes';

const orderStatus = {
  completed: 'Completed',
  in_delivery: 'In Delivery',
  in_dispute: 'Disputed',
  over_delivery: 'Over Delivery',
};
export const MyOrderItem = ({
  id,
  title,
  productImage,
  productPrice,
  soldOutNumber,
  purchasedAt,
  createdAt,
  deliveryTime,
  status,
}: MyOrderProps) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [currentOrderStatus, setCurrentOrderStatus] = React.useState('');

  const getStandardTime = (time: number) => {
    const standardTimestamp =
      new Date(time).getTime() + new Date(time).getTimezoneOffset() * 60 * 1000;
    const standardTime = new Date(standardTimestamp);
    return standardTime;
  };

  React.useEffect(() => {
    if (!deliveryTime) {
      return;
    }
    getOrderStatus();
    // const deadline = getStandardTime(deliveryTime).getTime();
    // const currentTime = new Date().getTime();
    // if (deadline > currentTime) {
    //   setCurrentOrderStatus(OrderStatus.InDelivey);
    // } else {
    //   setCurrentOrderStatus(OrderStatus.OverDelivery);
    // }
  }, [deliveryTime]);

  const getOrderStatus = () => {
    // let { status, deliveryTime } = order;
    deliveryTime = getStandardTime(deliveryTime);

    if (
      status === 'in_delivery' &&
      new Date(deliveryTime).getTime() > new Date().getTime()
    ) {
      status = 'in_delivery';
    }

    if (
      status === 'in_delivery' &&
      new Date(deliveryTime).getTime() < new Date().getTime()
    ) {
      status = 'over_delivery';
    }

    if (
      status === 'over_delivery' &&
      new Date(deliveryTime).getTime() < new Date().getTime()
    ) {
      status = 'over_delivery';
    }

    if (orderStatus[status] === 'over_delivery') {
      status = 'over_delivery';
    }
    setCurrentOrderStatus(status);
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(Routes.ORDER_DETAILS, {
          id,
        } as MyOrderProps);
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
            createdAt={createdAt}
            currentOrderStatus={currentOrderStatus}
          />
        </View>
        <View>
          <ProductPrice value={productPrice} />
          <Text
            style={[
              styles.currentStatusText,
              { color: getOrderStatusColor(currentOrderStatus) },
            ]}
          >
            {currentOrderStatus}
          </Text>
        </View>
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

interface SingleValueProp {
  value: String;
}

export function getOrderStatusColor(currentStatus: OrderStatus | undefined) {
  switch (currentStatus) {
    case OrderStatus.InDelivey: {
      return 'green';
    }
    case OrderStatus.OverDelivery: {
      return '#BA0F30';
    }
    default: {
      return;
    }
  }
}

function ProductPrice({ value }: SingleValueProp) {
  return (
    <View>
      <View style={styles.priceBackground}>
        <Text style={styles.productPriceText}>{`${value} MTO`}</Text>
      </View>
    </View>
  );
}

const parseDate = d => {
  const date = new Date(d).getDate();
  const month = new Date(d).getMonth() + 1;
  const year = new Date(d).getFullYear();

  const hours = new Date(d).getHours();
  const minutes = new Date(d).getMinutes();
  return `${date}/${month}/${year} ${hours}:${minutes}`;
};

function ProductBody({ title, createdAt, currentOrderStatus }: MyOrderProps) {
  return (
    <View style={styles.productBody}>
      <Text style={styles.productTitle}>{title}</Text>
      <Text>{`Purchased at ${parseDate(createdAt)}`}</Text>
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
    paddingHorizontal: 12,
  },
  currentStatusText: {
    textAlign: 'right',
    paddingHorizontal: 12,
  },
});

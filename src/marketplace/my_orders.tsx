import * as React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { backgroundColor } from '../assets/color';
import { MyOrderItem } from '../marketplace/components/myorder_item';
import { OrderStatus } from '../marketplace/enums/delivery_status';
import { LoadingSpinner, LoadingWrapper } from './components/Loader';
export interface MyOrderProps {
  /**
   * Product Title
   *
   * @type {string}
   */
  id: number;
  title: String;
  productImage: String;
  productPrice: String;
  createdAt?: String;
  purchasedAt?: String;
  soldOutNumber?: String;
  currentOrderStatus?: OrderStatus;
}

export const MyOrderScreen = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [orders, setOrders] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [keyword, setKeyword] = React.useState('');
  const [totalCount, setTotalCount] = React.useState(0);
  const bkdDriver = useSelector(state => state.sdkDriver.bkdDriver);
  //   {
  //     title: 'Product 1',
  //     productPrice: '20',
  //     productImage: '',
  //     soldOutNumber: '30',
  //     createdAt: '2021-02-21',
  //     currentOrderStatus: OrderStatus.InDelivey,
  //   },
  //   {
  //     title: 'Product 1',
  //     productPrice: '20',
  //     productImage: '',
  //     soldOutNumber: '30',
  //     createdAt: '2021-02-21',
  //     currentOrderStatus: OrderStatus.InDelivey,
  //   },
  //   {
  //     title: 'Product 1',
  //     productPrice: '20',
  //     productImage: '',
  //     soldOutNumber: '30',
  //     createdAt: '2021-02-21',
  //     currentOrderStatus: OrderStatus.OverDelivery,
  //   },
  //   {
  //     title: 'Product 1',
  //     productPrice: '20',
  //     productImage: '',
  //     soldOutNumber: '30',
  //     createdAt: '2021-02-21',
  //     currentOrderStatus: OrderStatus.OverDelivery,
  //   },
  //   {
  //     title: 'Product 1',
  //     productPrice: '20',
  //     productImage: '',
  //     soldOutNumber: '30',
  //     createdAt: '2021-02-21',
  //     currentOrderStatus: OrderStatus.OverDelivery,
  //   },
  //   {
  //     title: 'Product 1',
  //     productPrice: '20',
  //     productImage: '',
  //     soldOutNumber: '30',
  //     createdAt: '2021-02-21',
  //     currentOrderStatus: OrderStatus.OverDelivery,
  //   },
  //   {
  //     title: 'Product 1',
  //     productPrice: '20',
  //     productImage: '',
  //     soldOutNumber: '30',
  //     createdAt: '2021-02-21',
  //     currentOrderStatus: OrderStatus.OverDelivery,
  //   },
  // ];
  const currentTab = useSelector(state => state.sdkDriver.currentTab);
  const fetchOrders = React.useCallback(async () => {
    try {
      if (!bkdDriver || !bkdDriver.headers) return;

      setIsLoading(true);
      const query = {
        page,
        limit: pageSize,
      };

      const res = await bkdDriver.myorders(query);
      console.log('orders');
      setOrders(res.orders);
      setTotalCount(res.totalCount);
      setIsLoading(false);
    } catch (error) {
      console.log('myorders error', error);
      setOrders([]);
      setTotalCount(0);
      setIsLoading(false);
    }
  }, [page, pageSize, bkdDriver]);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  React.useEffect(() => {
    if (currentTab === 2) {
      fetchOrders();
    }
  }, [currentTab]);

  return (
    <View style={styles.root}>
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          onRefresh={() => fetchOrders()}
          refreshing={isLoading}
          renderItem={({ item }) => (
            <MyOrderItem
              createdAt={item.createdAt}
              deliveryTime={item.deliveryTime}
              id={item?.id}
              productImage={item.product.image}
              productPrice={item.product.price}
              soldOutNumber={item.product.soldOutItems}
              title={item.product.name}
              status={item?.status}
            />
          )}
        />
      ) : (
        <View style={styles.textContainer}>
          <Text style={styles.textStyle}>No product found.</Text>
        </View>
      )}
      {!!isLoading && (
        <LoadingWrapper>
          <LoadingSpinner />
        </LoadingWrapper>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: backgroundColor,
    flex: 1,
  },
  textContainer: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: 20,
  },
});

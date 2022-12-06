import * as React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { backgroundColor } from '../assets/color';
import { ProductProps } from '../marketplace/components/marketplace_item';
import { MyProductItem } from '../marketplace/components/myproduct_item';
import { LoadingSpinner, LoadingWrapper } from './components/Loader';

export const MyProductScreen = () => {
  // const data: ProductProps[] = [
  //   {
  //     title: 'Product 1',
  //     productPrice: '20',
  //     productImage: '',
  //     soldOutNumber: '30',
  //     purchasedAt: '2021-02-21',
  //   },
  //   {
  //     title: 'Product 1',
  //     productPrice: '20',
  //     productImage: '',
  //     soldOutNumber: '30',
  //     purchasedAt: '2021-02-21',
  //   },
  //   {
  //     title: 'Product 1',
  //     productPrice: '20',
  //     productImage: '',
  //     soldOutNumber: '30',
  //     purchasedAt: '2021-02-21',
  //   },
  //   {
  //     title: 'Product 1',
  //     productPrice: '20',
  //     productImage: '',
  //     soldOutNumber: '30',
  //     purchasedAt: '2021-02-21',
  //   },
  //   {
  //     title: 'Product 1',
  //     productPrice: '20',
  //     productImage: '',
  //     soldOutNumber: '30',
  //     purchasedAt: '2021-02-21',
  //   },
  //   {
  //     title: 'Product 1',
  //     productPrice: '20',
  //     productImage: '',
  //     soldOutNumber: '30',
  //     purchasedAt: '2021-02-21',
  //   },
  //   {
  //     title: 'Product 1',
  //     productPrice: '20',
  //     productImage: '',
  //     soldOutNumber: '30',
  //     purchasedAt: '2021-02-21',
  //   },
  //   {
  //     title: 'Product 1',
  //     productPrice: '20',
  //     productImage: '',
  //     soldOutNumber: '30',
  //     purchasedAt: '2021-02-21',
  //   },
  //   {
  //     title: 'Product 1',
  //     productPrice: '20',
  //     productImage: '',
  //     soldOutNumber: '30',
  //     purchasedAt: '2021-02-21',
  //   },
  //   {
  //     title: 'Product 1',
  //     productPrice: '20',
  //     productImage: '',
  //     soldOutNumber: '30',
  //     purchasedAt: '2021-02-21',
  //   },
  //   {
  //     title: 'Product 1',
  //     productPrice: '20',
  //     productImage: '',
  //     soldOutNumber: '30',
  //     purchasedAt: '2021-02-21',
  //   },
  //   {
  //     title: 'Product 1',
  //     productPrice: '20',
  //     productImage: '',
  //     soldOutNumber: '30',
  //     purchasedAt: '2021-02-21',
  //   },
  //   {
  //     title: 'Product 1',
  //     productPrice: '20',
  //     productImage: '',
  //     soldOutNumber: '30',
  //     purchasedAt: '2021-02-21',
  //   },
  //   {
  //     title: 'Product 1',
  //     productPrice: '20',
  //     productImage: '',
  //     soldOutNumber: '30',
  //     purchasedAt: '2021-02-21',
  //   },
  // ];
  const [page, setPage] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [keyword, setKeyword] = React.useState('');
  const [products, setProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const bkdDriver = useSelector(state => state.sdkDriver.bkdDriver);
  const currentTab = useSelector(state => state.sdkDriver.currentTab);

  const fetchMyProducts = React.useCallback(async () => {
    try {
      if (!bkdDriver || !bkdDriver.headers) return;
      setIsLoading(true);
      const query = {
        limit: pageSize,
        order: 'DESC',
        page,
        sortBy: 'id',
      };

      // getMyProducts(query)
      const res = await bkdDriver.completedorders(query);
      console.log('purchased Products');
      if (res) {
        console.log(res);
        setProducts(res.orders);
        setTotalCount(res.totalCount);
      } else {
        setTotalCount(0);
        setProducts([]);
      }
      setIsLoading(false);
    } catch (error) {
      console.log('completedorders error', error);
      setTotalCount(0);
      setProducts([]);
      setIsLoading(false);
    }
  }, [page, pageSize, bkdDriver]);

  React.useEffect(() => {
    fetchMyProducts();
  }, [fetchMyProducts]);

  React.useEffect(() => {
    if (currentTab === 1) {
      fetchMyProducts();
    }
  }, [currentTab]);

  return (
    <View style={styles.root}>
      {products.length > 0 ? (
        <FlatList
          data={products}
          onRefresh={() => fetchMyProducts()}
          refreshing={isLoading}
          renderItem={({ item }) => (
            <MyProductItem
              productImage={item.product.image}
              productPrice={item.product.price}
              soldOutNumber={item.product.soldOutNumber}
              title={item.product.name}
              purchasedAt={item.createdAt}
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
    flex: 1,
    backgroundColor: backgroundColor,
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

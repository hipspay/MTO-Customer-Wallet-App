import * as React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { backgroundColor } from '../assets/color';
import { LoadingSpinner, LoadingWrapper } from './components/Loader';
import {
  ProductItem,
  ProductProps,
} from '../marketplace/components/marketplace_item';

export const MarketPlaceScreen = () => {
  const bkdDriver = useSelector(state => state.sdkDriver.bkdDriver);
  const currentTab = useSelector(state => state.sdkDriver.currentTab);
  const [page, setPage] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [keyword, setKeyword] = React.useState('');
  const [products, setProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchProducts = React.useCallback(async () => {
    if (!bkdDriver || !bkdDriver.headers) return;
    setIsLoading(true);
    const query = {
      limit: pageSize,
      order: 'DESC',
      page,
      sortBy: 'id',
    };

    const res = await bkdDriver.getProducts(query);
    console.log('fetchProducts');
    if (res) {
      setProducts(res.products);
      setTotalCount(res.totalCount);
    } else {
      setProducts([]);
    }
    setIsLoading(false);
  }, [page, pageSize, bkdDriver]);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts, bkdDriver]);

  React.useEffect(() => {
    if (currentTab === 0) {
      fetchProducts();
    }
  }, [currentTab]);

  // React.useEffect(() => {
  //   console.log('index', index);
  // }, [index]);

  // "createdAt": "2022-10-02T07:41:46.759Z",
  // "description": "Good quality product",
  // "id": 4,
  // "image": "https://testuser311.s3-us-west-1.amazonaws.com/7.png",
  // "name": "Product 4",
  // "price": 4,
  // "shopAddress": "Northern stream",
  // "soldOutItems": 0,
  // "updatedAt": "2022-10-02T07:41:46.759Z"
  return (
    <View style={styles.root}>
      {products.length > 0 ? (
        <FlatList
          data={products}
          onRefresh={() => fetchProducts()}
          refreshing={isLoading}
          renderItem={({ item }) => (
            <ProductItem
              id={item.id}
              productImage={item.image}
              productPrice={item.price}
              soldOutNumber={item.soldOutItems}
              title={item.name}
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

import * as React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { backgroundColor } from '../assets/color';
import { LoadingSpinner, LoadingWrapper } from './components/Loader';
import {
  DisputeItem,
  DisputeProps,
} from '../marketplace/components/dispute_item';
import { DisputeStatus } from '../marketplace/enums/dispute_status';
import { useSelector } from 'react-redux';

export const DisputeScreen = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [disputes, setDisputes] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [keyword, setKeyword] = React.useState('');
  const [totalCount, setTotalCount] = React.useState(0);
  const bkdDriver = useSelector(state => state.sdkDriver.bkdDriver);
  const currentTab = useSelector(state => state.sdkDriver.currentTab);

  const fetchDisputes = React.useCallback(async () => {
    if (!bkdDriver || !bkdDriver.headers) return;
    setIsLoading(true);
    const query = {
      limit: pageSize,
      page,
    };

    const res = await bkdDriver.getDisputes(query);
    console.log('disputes');
    if (res?.disputes) {
      setDisputes(res.disputes);
      setTotalCount(res.totalCount);
    } else {
      setDisputes([]);
      setTotalCount(0);
    }

    setIsLoading(false);
  }, [page, pageSize, bkdDriver]);

  React.useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  React.useEffect(() => {
    if (currentTab === 3) {
      fetchDisputes();
    }
  }, [currentTab]);

  return (
    <View style={styles.root}>
      {disputes?.length > 0 ? (
        <FlatList
          data={disputes}
          onRefresh={() => fetchDisputes()}
          refreshing={isLoading}
          renderItem={({ item }) => (
            <DisputeItem
              createdAt={item.createdAt}
              currentDisputeStatus={item.status}
              id={item.id}
              productImage={item.order.product.image}
              productPrice={item.order.product.price}
              soldOutNumber={item.order.product.soldOutItems}
              title={item.order.product.name}
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

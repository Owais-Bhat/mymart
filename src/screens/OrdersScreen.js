import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FadeIn, FadeInDown} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import {useAppSelector} from '../store/hooks';
import {selectOrders} from '../store/slices/ordersSlice';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const OrderCard = ({item, index}) => {
  const navigation = useNavigation();

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'confirmed':
        return '#3b82f6';
      case 'processing':
        return '#8b5cf6';
      case 'shipped':
        return '#6366f1';
      case 'delivered':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <AnimatedTouchableOpacity
      entering={FadeInDown.delay(index * 50).duration(400)}
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderTracking', {orderId: item.id})}
      activeOpacity={0.8}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>Order #{item.id.split('-')[1]}</Text>
          <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: getStatusColor(item.status) + '20'},
          ]}>
          <Text
            style={[styles.statusText, {color: getStatusColor(item.status)}]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <Text style={styles.itemsCount}>
          {item.items.length} item{item.items.length > 1 ? 's' : ''}
        </Text>
        <Text style={styles.totalPrice}>${item.totalPrice.toFixed(2)}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.trackingText}>Tap to track order</Text>
        <Text style={styles.arrow}>→</Text>
      </View>
    </AnimatedTouchableOpacity>
  );
};

const OrdersScreen = () => {
  const navigation = useNavigation();
  const orders = useAppSelector(selectOrders);

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <AnimatedView entering={FadeIn.duration(600)}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyTitle}>No Orders Yet</Text>
          <Text style={styles.emptyText}>
            Your order history will appear here
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('Home')}>
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </AnimatedView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AnimatedView entering={FadeIn.duration(600)} style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <Text style={styles.ordersCount}>{orders.length} order(s)</Text>
      </AnimatedView>

      <FlatList
        data={orders}
        renderItem={({item, index}) => (
          <OrderCard item={item} index={index} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  emptyIcon: {
    fontSize: 80,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  shopButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 12,
  },
  shopButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 5,
  },
  ordersCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  listContent: {
    padding: 15,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  itemsCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  trackingText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
  },
  arrow: {
    fontSize: 18,
    color: '#6366f1',
  },
});

export default OrdersScreen;


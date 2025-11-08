import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {FadeIn, FadeInDown} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import {useAppSelector, useAppDispatch} from '../store/hooks';
import {selectOrderById, updateOrderStatus} from '../store/slices/ordersSlice';

const AnimatedView = Animated.createAnimatedComponent(View);

const TrackingStep = ({step, isLast, index, currentStatus}) => {
  const isCompleted = step.completed;
  const isCurrent = !isCompleted && step.id === currentStatus;

  return (
    <View style={styles.stepContainer}>
      <View style={styles.stepContent}>
        <AnimatedView
          entering={FadeIn.delay(index * 100).duration(400)}
          style={[
            styles.stepCircle,
            isCompleted && styles.stepCircleCompleted,
            isCurrent && styles.stepCircleCurrent,
          ]}>
          {isCompleted ? (
            <Text style={styles.checkmark}>✓</Text>
          ) : (
            <View style={styles.stepDot} />
          )}
        </AnimatedView>
        <View style={styles.stepInfo}>
          <Text
            style={[
              styles.stepLabel,
              isCompleted && styles.stepLabelCompleted,
            ]}>
            {step.label}
          </Text>
          {step.date && (
            <Text style={styles.stepDate}>
              {new Date(step.date).toLocaleString()}
            </Text>
          )}
        </View>
      </View>
      {!isLast && (
        <View
          style={[
            styles.stepLine,
            isCompleted && styles.stepLineCompleted,
          ]}
        />
      )}
    </View>
  );
};

const OrderItem = ({item}) => {
  return (
    <View style={styles.orderItem}>
      <View style={styles.orderItemInfo}>
        <Text style={styles.orderItemTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.orderItemPrice}>
          ${item.price.toFixed(2)} × {item.quantity}
        </Text>
      </View>
      <Text style={styles.orderItemTotal}>
        ${(item.price * item.quantity).toFixed(2)}
      </Text>
    </View>
  );
};

const OrderTrackingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useAppDispatch();
  const {orderId} = route.params;
  const order = useAppSelector((state) => selectOrderById(state, orderId));

  const [demoProgress, setDemoProgress] = useState(0);

  useEffect(() => {
    if (!order) return;

    // Demo: Auto-update order status for demonstration
    const statuses = ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
    let currentIndex = order.tracking.steps.findIndex((s) => s.completed);

    const interval = setInterval(() => {
      if (currentIndex < statuses.length - 1) {
        currentIndex++;
        dispatch(updateOrderStatus({
          orderId: order.id,
          status: statuses[currentIndex],
        }));
        setDemoProgress(currentIndex);
      } else {
        clearInterval(interval);
      }
    }, 5000); // Update every 5 seconds for demo

    return () => clearInterval(interval);
  }, [order, dispatch]);

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Order not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <AnimatedView entering={FadeIn.duration(600)} style={styles.header}>
        <Text style={styles.orderId}>Order #{order.id.split('-')[1]}</Text>
        <Text style={styles.orderDate}>Placed on {formatDate(order.createdAt)}</Text>
      </AnimatedView>

      <AnimatedView
        entering={FadeInDown.delay(100).duration(600)}
        style={styles.trackingContainer}>
        <Text style={styles.sectionTitle}>Tracking</Text>
        <View style={styles.stepsContainer}>
          {order.tracking.steps.map((step, index) => (
            <TrackingStep
              key={step.id}
              step={step}
              isLast={index === order.tracking.steps.length - 1}
              index={index}
              currentStatus={order.tracking.current}
            />
          ))}
        </View>
      </AnimatedView>

      <AnimatedView
        entering={FadeInDown.delay(200).duration(600)}
        style={styles.itemsContainer}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {order.items.map((item, index) => (
          <OrderItem key={index} item={item} />
        ))}
      </AnimatedView>

      <AnimatedView
        entering={FadeInDown.delay(300).duration(600)}
        style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${order.totalPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>Free</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${order.totalPrice.toFixed(2)}</Text>
        </View>
      </AnimatedView>

      <View style={styles.footer}>
        <Text style={styles.footerNote}>
          Estimated delivery: {formatDate(order.estimatedDelivery)}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
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
  orderId: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  trackingContainer: {
    backgroundColor: '#ffffff',
    margin: 15,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  stepsContainer: {
    marginLeft: 10,
  },
  stepContainer: {
    marginBottom: 20,
  },
  stepContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepCircleCompleted: {
    backgroundColor: '#10b981',
  },
  stepCircleCurrent: {
    backgroundColor: '#6366f1',
    borderWidth: 3,
    borderColor: '#818cf8',
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#9ca3af',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  stepInfo: {
    flex: 1,
    paddingTop: 8,
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  stepLabelCompleted: {
    color: '#111827',
  },
  stepDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  stepLine: {
    width: 2,
    height: 30,
    backgroundColor: '#e5e7eb',
    marginLeft: 19,
    marginTop: -10,
  },
  stepLineCompleted: {
    backgroundColor: '#10b981',
  },
  itemsContainer: {
    backgroundColor: '#ffffff',
    margin: 15,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  orderItemInfo: {
    flex: 1,
    marginRight: 10,
  },
  orderItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  orderItemPrice: {
    fontSize: 12,
    color: '#6b7280',
  },
  orderItemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  summaryContainer: {
    backgroundColor: '#ffffff',
    margin: 15,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#e5e7eb',
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerNote: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default OrderTrackingScreen;


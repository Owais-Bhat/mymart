import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FadeIn, FadeInRight, FadeInUp, FadeOutLeft} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {
  selectCartItems,
  selectTotalPrice,
  removeFromCart,
  updateQuantity,
  clearCart,
} from '../store/slices/cartSlice';
import {createOrder} from '../store/slices/ordersSlice';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const CartItem = ({item, index}) => {
  const dispatch = useAppDispatch();

  const handleRemove = () => {
    Alert.alert('Remove Item', 'Are you sure you want to remove this item?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => dispatch(removeFromCart(item.id)),
      },
    ]);
  };

  return (
    
    <AnimatedView
      entering={FadeInRight.delay(index * 50).duration(400)}
      exiting={FadeOutLeft.duration(300)}
      style={styles.cartItem}>
      <Image source={{uri: item.image}} style={styles.cartItemImage} />
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.cartItemPrice}>${item.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() =>
              dispatch(updateQuantity({productId: item.id, quantity: item.quantity - 1}))
            }>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() =>
              dispatch(updateQuantity({productId: item.id, quantity: item.quantity + 1}))
            }>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={handleRemove}
        activeOpacity={0.7}>
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </AnimatedView>
  );
};

const CartScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const totalPrice = useAppSelector(selectTotalPrice);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart Empty', 'Your cart is empty. Add some items first!');
      return;
    }
    // Create order
    dispatch(createOrder({
      items: cartItems,
      totalPrice,
    }));
    
    Alert.alert(
      'Order Placed! 🎉',
      `Total: $${totalPrice.toFixed(2)}\n\nYour order has been placed successfully!`,
      [
        {
          text: 'View Orders',
          onPress: () => {
            dispatch(clearCart());
            navigation.navigate('Orders');
          },
        },
        {
          text: 'Continue Shopping',
          style: 'cancel',
          onPress: () => {
            dispatch(clearCart());
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <AnimatedView entering={FadeIn.duration(600)}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>
            Add some products to get started!
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
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <Text style={styles.itemCount}>{cartItems.length} item(s)</Text>
      </AnimatedView>

      <FlatList
        data={cartItems}
        renderItem={({item, index}) => (
          <CartItem item={item} index={index} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <AnimatedView
        entering={FadeInUp.delay(200).duration(600)}
        style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
          activeOpacity={0.8}>
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </AnimatedView>
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
  itemCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  listContent: {
    padding: 15,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    resizeMode: 'contain',
    backgroundColor: '#f3f4f6',
  },
  cartItemInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  cartItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 5,
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginHorizontal: 15,
    minWidth: 30,
    textAlign: 'center',
  },
  removeButton: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  removeButtonText: {
    fontSize: 24,
    color: '#ef4444',
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  checkoutButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  checkoutButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;


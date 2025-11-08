import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {FadeIn, FadeInUp, FadeInDown} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {addToCart} from '../store/slices/cartSlice';
import {selectIsFavorite, toggleFavorite} from '../store/slices/favoritesSlice';
import {fetchProductById} from '../services/api';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {productId} = route.params;
  const dispatch = useAppDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFavorite = useAppSelector((state) =>
    product ? selectIsFavorite(state, product.id) : false
  );

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await fetchProductById(productId);
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
      Alert.alert('Error', 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product));
      Alert.alert('Success', 'Product added to cart!', [
        {text: 'Continue Shopping', onPress: () => navigation.goBack()},
        {text: 'View Cart', onPress: () => navigation.navigate('Cart')},
      ]);
    }
  };

  const handleToggleFavorite = () => {
    if (product) {
      dispatch(toggleFavorite(product));
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading product...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView showsVerticalScrollIndicator={false}>
      <AnimatedView entering={FadeIn.duration(500)} style={styles.imageContainer}>
        <Image source={{uri: product.image}} style={styles.productImage} />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
          activeOpacity={0.8}>
          <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </AnimatedView>

      <AnimatedView
        entering={FadeInUp.delay(100).duration(600)}
        style={styles.content}>
        <View style={styles.header}>
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{product.category}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {product.rating.rate}</Text>
            <Text style={styles.reviews}>({product.rating.count} reviews)</Text>
          </View>
        </View>

        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>

        <AnimatedTouchableOpacity
          entering={FadeInDown.delay(200).duration(600)}
          style={styles.addToCartButton}
          onPress={handleAddToCart}
          activeOpacity={0.8}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </AnimatedTouchableOpacity>
      </AnimatedView>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6b7280',
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
  imageContainer: {
    width: '100%',
    height: 400,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  favoriteIcon: {
    fontSize: 28,
  },
  content: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginTop: -20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryContainer: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  category: {
    fontSize: 12,
    color: '#6366f1',
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  reviews: {
    fontSize: 14,
    color: '#6b7280',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
    lineHeight: 32,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    marginBottom: 30,
  },
  addToCartButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    shadowColor: '#6366f1',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addToCartText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;

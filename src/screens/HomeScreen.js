import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FadeIn, FadeInDown} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import {useAppSelector, useAppDispatch} from '../store/hooks';
import {selectCartItemCount} from '../store/slices/cartSlice';
import {selectIsFavorite, toggleFavorite} from '../store/slices/favoritesSlice';
import {fetchProducts} from '../services/api';
import DiscountPopup from '../components/DiscountPopup';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const ProductCard = ({item, index}) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((state) => selectIsFavorite(state, item.id));

  const handleFavoritePress = (e) => {
    e.stopPropagation();
    dispatch(toggleFavorite(item));
  };

  return (
    <AnimatedTouchableOpacity
      entering={FadeInDown.delay(index * 100).duration(600)}
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', {productId: item.id})}
      activeOpacity={0.8}>
      <Animated.View
        entering={FadeIn.duration(500)}
        style={styles.imageContainer}>
        <Image source={{uri: item.image}} style={styles.productImage} />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
          activeOpacity={0.8}>
          <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </Animated.View>
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
    </AnimatedTouchableOpacity>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const cartItemCount = useAppSelector(selectCartItemCount);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDiscountPopup, setShowDiscountPopup] = useState(false);

  useEffect(() => {
    loadProducts();
    // Show discount popup after 2 seconds
    const timer = setTimeout(() => {
      setShowDiscountPopup(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DiscountPopup
        visible={showDiscountPopup}
        onClose={() => setShowDiscountPopup(false)}
        discountCode="SAVE20"
        discountPercent={20}
      />
      <Animated.View
        entering={FadeInDown.duration(600)}
        style={styles.header}>
        <Text style={styles.headerTitle}>MyMart</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Favorites')}>
            <Text style={styles.iconText}>❤️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Orders')}>
            <Text style={styles.iconText}>📦</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
            </View>
            <Text style={styles.cartIcon}>🛒</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(100).duration(600)}
        style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Text style={styles.searchIcon}>🔍</Text>
      </Animated.View>

      <FlatList
        data={filteredProducts}
        renderItem={({item, index}) => (
          <ProductCard item={item} index={index} />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
      />
    </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconButton: {
    padding: 5,
  },
  iconText: {
    fontSize: 24,
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  cartBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cartIcon: {
    fontSize: 28,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#111827',
  },
  searchIcon: {
    fontSize: 20,
    marginLeft: 10,
  },
  listContent: {
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#f3f4f6',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    minHeight: 40,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    color: '#6366f1',
    textTransform: 'capitalize',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#9ca3af',
  },
});

export default HomeScreen;

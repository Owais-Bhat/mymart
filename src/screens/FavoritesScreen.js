import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FadeIn, FadeInDown, FadeOutLeft} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {selectFavorites, removeFromFavorites} from '../store/slices/favoritesSlice';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const FavoriteItem = ({item, index}) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const handleRemove = () => {
    dispatch(removeFromFavorites(item.id));
  };

  return (
    <AnimatedView
      entering={FadeInDown.delay(index * 50).duration(400)}
      exiting={FadeOutLeft.duration(300)}
      style={styles.favoriteItem}>
      <TouchableOpacity
        style={styles.itemContent}
        onPress={() => navigation.navigate('ProductDetail', {productId: item.id})}
        activeOpacity={0.8}>
        <Image source={{uri: item.image}} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.itemDetails}>
            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {item.rating.rate}</Text>
            <Text style={styles.reviews}>({item.rating.count})</Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={handleRemove}
        activeOpacity={0.7}>
        <Text style={styles.removeIcon}>❤️</Text>
      </TouchableOpacity>
    </AnimatedView>
  );
};

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const favorites = useAppSelector(selectFavorites);

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <AnimatedView entering={FadeIn.duration(600)}>
          <Text style={styles.emptyIcon}>🤍</Text>
          <Text style={styles.emptyTitle}>No Favorites Yet</Text>
          <Text style={styles.emptyText}>
            Start adding products to your favorites!
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
        <Text style={styles.headerTitle}>My Favorites</Text>
        <Text style={styles.favoritesCount}>
          {favorites.length} item{favorites.length > 1 ? 's' : ''}
        </Text>
      </AnimatedView>

      <FlatList
        data={favorites}
        renderItem={({item, index}) => (
          <FavoriteItem item={item} index={index} />
        )}
        keyExtractor={(item) => item.id.toString()}
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
  favoritesCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  listContent: {
    padding: 15,
  },
  favoriteItem: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    resizeMode: 'contain',
    backgroundColor: '#f3f4f6',
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  categoryBadge: {
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginRight: 4,
  },
  reviews: {
    fontSize: 12,
    color: '#6b7280',
  },
  removeButton: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderLeftWidth: 1,
    borderLeftColor: '#fecaca',
  },
  removeIcon: {
    fontSize: 24,
  },
});

export default FavoritesScreen;


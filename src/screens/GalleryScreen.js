import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GalleryScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('recent');
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');

  // Placeholder data without local image requires to avoid missing asset errors
  const albums = [
    { id: '1', title: 'Camera', count: 887, type: 'recent' },
    { id: '2', title: 'Screenshot', count: 14, type: 'recent' },
    { id: '3', title: 'Favorite', count: 56, type: 'favorite' },
    { id: '4', title: 'Recent', count: 1120, type: 'recent' },
    { id: '5', title: 'Pictures', count: 14, type: 'folder' },
    { id: '6', title: 'Foods', count: 89, type: 'folder' },
    { id: '7', title: 'Videos', count: 45, type: 'videos' },
    { id: '8', title: 'Scenery', count: 23, type: 'folder' },
    { id: '9', title: 'Folder name', count: 67, type: 'folder' },
    { id: '10', title: 'Pictures', count: 12, type: 'folder' },
    { id: '11', title: 'Albums', count: 34, type: 'folder' },
    { id: '12', title: 'Story', count: 8, type: 'folder' },
  ];

  const filtered = useMemo(() => {
    let list = albums;
    if (selectedTab === 'videos') list = list.filter(a => a.type === 'videos');
    else if (selectedTab === 'favorite') list = list.filter(a => a.type === 'favorite');
    else if (selectedTab === 'private') list = [];
    else list = list.filter(a => a.type !== 'videos');

    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(a => a.title.toLowerCase().includes(q));
  }, [albums, selectedTab, query]);

  const tabs = [
    { id: 'recent', icon: 'time-outline', label: 'Recent' },
    { id: 'videos', icon: 'videocam', label: 'Videos' },
    { id: 'favorite', icon: 'heart', label: 'Favorite' },
    { id: 'private', icon: 'lock-closed', label: 'Private' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00BCD4" />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        <Text style={styles.headerTitle}>Albums</Text>
        <Text style={styles.headerSubtitle}>Manage Your Album Fast and Easily</Text>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation?.navigate?.('Add')}>
            <Ionicons name="add" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => setShowSearch(s => !s)}>
            <Ionicons name="search" size={22} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
            <Ionicons name="ellipsis-vertical" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {showSearch && (
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#666" />
          <View style={{ width: 8 }} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Text style={styles.searchText}>{query || 'Type to search...'}</Text>
          </ScrollView>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
          const isActive = selectedTab === tab.id;
          const bg = isActive
            ? '#00BCD4'
            : tab.id === 'favorite'
            ? '#fef2f2'
            : tab.id === 'private'
            ? '#f3f0ff'
            : '#f5f5f5';
          const iconColor = isActive ? '#fff' : '#999';
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              onPress={() => setSelectedTab(tab.id)}
            >
              <View style={[styles.tabIcon, { backgroundColor: bg }]}>
                <Ionicons name={tab.icon} size={20} color={iconColor} />
              </View>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Albums Grid */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {filtered.map((album) => (
            <TouchableOpacity key={album.id} style={styles.albumCard}>
              <View style={styles.albumThumbnail}>
                <View style={styles.placeholderImage}>
                  <Ionicons name="image" size={40} color="#ccc" />
                </View>
              </View>
              <Text style={styles.albumTitle}>{album.title}</Text>
              <Text style={styles.albumCount}>{album.count}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="image-outline" size={24} color="#999" />
          <Text style={styles.navLabel}>Pictures</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="albums" size={24} color="#00BCD4" />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Albums</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="book-outline" size={24} color="#999" />
          <Text style={styles.navLabel}>Story</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#999" />
          <Text style={styles.navLabel}>Creator</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -30,
    right: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  decorativeCircle2: {
    position: 'absolute',
    top: 10,
    right: 60,
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 15,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    alignItems: 'center',
    gap: 5,
  },
  tabIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconActive: {
    backgroundColor: '#00BCD4',
  },
  tabLabel: {
    fontSize: 12,
    color: '#999',
  },
  tabLabelActive: {
    color: '#333',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  albumCard: {
    width: '33.33%',
    padding: 5,
    marginBottom: 10,
  },
  albumThumbnail: {
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 5,
  },
  placeholderImage: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  albumCount: {
    fontSize: 11,
    color: '#999',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 11,
    color: '#999',
  },
  navLabelActive: {
    color: '#00BCD4',
    fontWeight: '600',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  searchText: {
    color: '#333',
  },
});

export default GalleryScreen;
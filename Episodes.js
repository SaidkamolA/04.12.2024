import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Button,
  StyleSheet,
} from 'react-native';
import {fetchEpisodes} from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EpisodesScreen() {
  const [episodes, setEpisodes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadEpisodes();
    loadFavorites();
  }, []);

  const loadEpisodes = async () => {
    const data = await fetchEpisodes();
    setEpisodes(data);
  };

  const loadFavorites = async () => {
    const savedFavorites = await AsyncStorage.getItem('favoritesEpisodes');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  };

  const Favorite = async (episode) => {
    const updatedFavorites = favorites.includes(episode.id)
      ? favorites.filter((id) => id !== episode.id)
      : [...favorites, episode.id];
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem('favoritesEpisodes', JSON.stringify(updatedFavorites));
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.item,
        favorites.includes(item.id) && styles.favoriteItem,
      ]}
      onPress={() => {
        setSelectedEpisode(item);
        setModalVisible(true);
      }}>
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={episodes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      {selectedEpisode && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedEpisode.name}</Text>
            <Text>Дата выхода: {selectedEpisode.air_date}</Text>
            <Button
              title={
                favorites.includes(selectedEpisode.id)
                  ? 'Удалить из избранного'
                  : 'Добавить в избранное'
              }
              onPress={() => Favorite(selectedEpisode)}
            />
            <Button title="Закрыть" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 10,
  },
  item: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 2,
  },
  favoriteItem: {
    backgroundColor: '#ffd700',
  },
  itemText: {
    fontSize: 18,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
});
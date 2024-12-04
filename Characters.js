import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Button, StyleSheet, Image } from 'react-native';
import { fetchCharacters } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CharactersScreen() {
  const [characters, setCharacters] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadCharacters();
    loadFavorites();
  }, []);

  const loadCharacters = async () => {
    const data = await fetchCharacters();
    setCharacters(data);
  };

  const loadFavorites = async () => {
    const savedFavorites = await AsyncStorage.getItem('fv');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  };

  const toggleFavorite = async (character) => {
    const updatedFavorites = favorites.includes(character.id)
      ? favorites.filter((id) => id !== character.id)
      : [...favorites, character.id];
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem('fv', JSON.stringify(updatedFavorites));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.item,
        favorites.includes(item.id) && styles.favoriteItem,
      ]}
      onPress={() => {
        setSelectedCharacter(item);
        setModalVisible(true);
      }}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={characters}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      {selectedCharacter && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Image source={{uri:selectedCharacter.image}} style={styles.modalImage} />
            <Text style={styles.modalTitle}>{selectedCharacter.name}</Text>
            <Text>Status: {selectedCharacter.status}</Text>
            <Text>Species: {selectedCharacter.species}</Text>
            <Text>Location: {selectedCharacter.location.name}</Text>
            <Button
              title={
                favorites.includes(selectedCharacter.id)
                  ? 'Удалить из избранного'
                  : 'Добавить в избранное'
              }
              onPress={() => toggleFavorite(selectedCharacter)}
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
    backgroundColor: '#f0f4f8',
    padding: 10,
  },
  item: {
    flexDirection: 'row',
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 4,
    alignItems: 'center',
  },
  favoriteItem: {
    backgroundColor: '#4CAF50',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  itemText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
});

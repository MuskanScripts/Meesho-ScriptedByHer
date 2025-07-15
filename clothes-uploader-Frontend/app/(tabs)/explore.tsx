import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ChatbotButton from '@/components/ChatbotButton';

const BACKEND_URL = 'https://ff265e29f5d2.ngrok-free.app'; // ✅ Replace with your current backend URL

const ExploreScreen = () => {
  const [clothes, setClothes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const fetchClothes = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/clothes`);
      setClothes(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch clothes:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCloth = async (id: string) => {
    try {
      await axios.delete(`${BACKEND_URL}/clothes/${id}`);
      setClothes((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      Alert.alert('Error', '❌ Failed to delete');
      console.error(err);
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert('Confirm', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteCloth(id) },
    ]);
  };

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      fetchClothes();
    }
  }, [isFocused]);

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.images[0]?.path }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.type} - {item.subType}</Text>
        <Text style={styles.meta}>{item.gender} • {item.season}</Text>
        <Text style={styles.meta}>Color: <Text style={styles.bold}>{item.color}</Text></Text>
        {item.style && <Text style={styles.meta}>Style: <Text style={styles.bold}>{item.style}</Text></Text>}
      </View>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item._id)}>
        <Ionicons name="trash" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#fff" style={{ marginTop: 100 }} />;
  }

  return (
    <LinearGradient
      colors={['#D15B9B', '#9B46E6']}
      style={styles.container}
    >
      <FlatList
        data={clothes}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        numColumns={1}
      />
      <ChatbotButton/>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  list: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  meta: {
    fontSize: 13,
    color: '#666',
  },
  bold: {
    color: '#000',
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: '#E02424',
    padding: 6,
    borderRadius: 8,
    marginLeft: 6,
  },
});

export default ExploreScreen;

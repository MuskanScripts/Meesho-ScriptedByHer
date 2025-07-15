import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
    Alert,
    Button,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const BACKEND_URL = 'https://ff265e29f5d2.ngrok-free.app'; // change this to your real backend

const UploadClothesScreen = () => {
  const [season, setSeason] = useState('');
  const [gender, setGender] = useState('');
  const [type, setType] = useState('');
  const [subType, setSubType] = useState('');
  const [images, setImages] = useState([]);

  const handleImageSelect = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      selectionLimit: 10,
    });

    if (!result.canceled) {
      const selected = result.assets || result.selected || [];
      if (images.length + selected.length > 10) {
        Alert.alert('Limit Reached', 'You can only upload up to 10 images.');
        return;
      }
      setImages([...images, ...selected]);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async () => {
    if (!season || !gender || !type || !subType || images.length === 0) {
      Alert.alert('Error', 'Please fill all fields and upload at least one image.');
      return;
    }

    const formData = new FormData();
    images.forEach((img, idx) => {
      formData.append('images', {
        uri: img.uri,
        type: 'image/jpeg',
        name: `photo_${idx}.jpg`,
      });
    });

    formData.append('season', season);
    formData.append('gender', gender);
    formData.append('type', type);
    formData.append('subType', subType);

    try {
      const res = await axios.post(`${BACKEND_URL}/upload-clothes`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert('Success', 'Clothes uploaded successfully!');
      setImages([]);
      setSeason('');
      setGender('');
      setType('');
      setSubType('');
    } catch (err) {
      console.error(err);
      Alert.alert('Upload Failed', 'Something went wrong.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Upload Clothes</Text>

      <Text style={styles.label}>Season</Text>
      <Picker selectedValue={season} onValueChange={setSeason}>
        <Picker.Item label="Select Season" value="" />
        <Picker.Item label="Summer" value="summer" />
        <Picker.Item label="Winter" value="winter" />
        <Picker.Item label="Rainy" value="rainy" />
        <Picker.Item label="All Season" value="all-season" />
      </Picker>

      <Text style={styles.label}>Gender</Text>
      <Picker selectedValue={gender} onValueChange={setGender}>
        <Picker.Item label="Select Gender" value="" />
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
        <Picker.Item label="Unisex" value="unisex" />
      </Picker>

      <Text style={styles.label}>Type</Text>
      <Picker selectedValue={type} onValueChange={setType}>
        <Picker.Item label="Select Type" value="" />
        <Picker.Item label="Upper Wear" value="upper-wear" />
        <Picker.Item label="Bottom Wear" value="bottom-wear" />
        <Picker.Item label="One Piece" value="one-piece" />
      </Picker>

      <Text style={styles.label}>Sub-Type</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. T-shirt, Jeans, Dress"
        value={subType}
        onChangeText={setSubType}
      />

      <Button title="Select Images" onPress={handleImageSelect} />
      <Text style={{ marginVertical: 10 }}>{images.length} images selected</Text>

      <View style={styles.imageContainer}>
        {images.map((img, idx) => (
          <TouchableOpacity key={idx} onPress={() => handleRemoveImage(idx)}>
            <Image source={{ uri: img.uri }} style={styles.imageThumb} />
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Upload" onPress={handleSubmit} color="#4CAF50" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 8,
    marginTop: 4,
    borderRadius: 6,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  imageThumb: {
    width: 80,
    height: 80,
    margin: 4,
    borderRadius: 6,
  },
});

export default UploadClothesScreen;


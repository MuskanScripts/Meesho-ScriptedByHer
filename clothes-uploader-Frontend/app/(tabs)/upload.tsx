 import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import ChatbotButton from '@/components/ChatbotButton';

const BACKEND_URL = 'https://ff265e29f5d2.ngrok-free.app'; // ✅ Your current backend URL

const UploadScreen = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!imageUri) return;
    setUploading(true);

    const formData = new FormData();
    const filename = imageUri.split('/').pop()!;
    const type = `image/${filename.split('.').pop()}`;

    formData.append('images', {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    try {
      await axios.post(`${BACKEND_URL}/upload-clothes`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('✅ Upload Successful', 'Clothing info detected and uploaded!');
      setImageUri(null);
    } catch (err) {
      console.error(err);
      Alert.alert('❌ Upload Failed', 'Something went wrong.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#D15B9B', '#9B46E6']} // Pink to Purple Gradient
      style={styles.container}
    >
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      
      {/* Pick Image Button */}
      <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an Image</Text>
      </TouchableOpacity>
      
      {/* Upload Button */}
      <TouchableOpacity
        style={[styles.button, styles.uploadButton]}
        onPress={uploadImage}
        disabled={!imageUri || uploading}
      >
        <Text style={styles.buttonText}>Upload</Text>
      </TouchableOpacity>

      {uploading && <ActivityIndicator size="large" style={{ marginTop: 20 }} color="#fff" />}
      <ChatbotButton/>
    </LinearGradient>
   
  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Centering the content
    padding: 16,
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#fff', // White border around image for contrast
  },
  button: {
    backgroundColor: '#fff', // White background for buttons
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  uploadButton: {
    backgroundColor: '#9B46E6', // Purple for upload button
  },
  pickImageButton: {
    backgroundColor: '#D15B9B', // Light pink for the Pick Image button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff', // White text for visibility
    fontSize: 18,
    fontWeight: '600',
  },
});

export default UploadScreen;

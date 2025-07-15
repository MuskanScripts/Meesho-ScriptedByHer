//  import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import ChatbotButton from '@/components/ChatbotButton';

// export default function HomeScreen() {
//   return (
//     <LinearGradient
//       colors={['#D15B9B', '#9B46E6']} // Pink to Purple Gradient
//       style={styles.container}
//     >
//       <Text style={styles.title}>Welcome to ClothesUploaderApp 👕</Text>
//       <Text style={styles.subtitle}>
//         Use the tabs below to upload clothes or explore more.
//       </Text>
//       <ChatbotButton/>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     marginBottom: 12,
//     textAlign: 'center',
//     color: '#fff', // White text to contrast with gradient background
//   },
//   subtitle: {
//     fontSize: 18,
//     color: '#fff', // White text for the subtitle
//     textAlign: 'center',
//     paddingHorizontal: 20,
//   },
// });
// ✅ Place this at the top
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// ✅ Import the chatbot component here
import ChatWidget from '../../components/ChatWidget'; // adjust path if needed

export default function HomeScreen() {
  const [showChat, setShowChat] = useState(true); // or false initially

  return (
    <LinearGradient
      colors={['#D15B9B', '#9B46E6']}
      style={styles.container}
    >
      <Text style={styles.title}>Welcome to ClothesUploaderApp 👕</Text>
      <Text style={styles.subtitle}>
        Use the tabs below to upload clothes or explore more.
      </Text>

      {/* Render Chatbot */}
      {showChat && (
        <View style={styles.chatContainer}>
          <ChatWidget />
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20
  },
  chatContainer: {
    flex: 1,
    width: '100%',
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden'
  },
});

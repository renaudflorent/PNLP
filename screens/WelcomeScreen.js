import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet,Image} from 'react-native';
import { CheckBox } from 'react-native-elements';


const WelcomeScreen = ({ navigation=null }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = () => {
    // Add your authentication logic here
    if (username === 'cdm2024' && password === 'mii2024') {
      navigation.replace('DrawerNavigator');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/headerImage.png')} style={styles.image} />
      <Text style={styles.title}>Bienvenu</Text>
      <Text style={styles.title}>Centre National de lutte contre le Paludisme</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="mot de passe"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
      />
      <CheckBox
        title="afficher le mot de passe"
        checked={showPassword}
        onPress={() => setShowPassword(!showPassword)}
      />
      <Button title="Connexion" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    color:'green',
    fontWeight:'bord'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  image: {
    width: '100%',
    height: 350,
    resizeMode: 'contain',
    marginBottom: 16,
    borderRadius: 300,
  }
});

export default WelcomeScreen;

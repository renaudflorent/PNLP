// DrawerHeader.js
import React from 'react';
import { View, Text, StyleSheet ,Image} from 'react-native';

const DrawerHeader = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/headerImage.png')} // Replace 'headerImage.png' with your image file
        style={styles.image}
      />
      <Text style={styles.text}>Programme Nationnal de Lutte contre le Paludisme</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft:10,
    marginTop:0,
  },
  image: {
    width: 100, // Adjust the width of the image
    height: 100, // Adjust the height of the image
    marginHorizontal: 0,
    marginLeft: 20,
    resizeMode: 'cover', // Set resizeMode to 'cover' to cover the entire container
    borderRadius: 10, // Adjust the borderRadius to create a circular image
  },
});

export default DrawerHeader;

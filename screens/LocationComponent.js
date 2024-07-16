// LocationComponent.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Platform } from 'react-native';
import * as Location from 'expo-location';

const LocationComponent = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } else {
        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }

          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
        } catch (error) {
          setErrorMsg('Failed to get location');
        }
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Location Example</Text>
      {errorMsg ? <Text style={styles.text}>Error: {errorMsg}</Text> : null}
      {location ? (
        <Text style={styles.text}>
          Latitude: {location.coords.latitude}, Longitude: {location.coords.longitude}
        </Text>
      ) : (
        <Text style={styles.text}>Fetching location...</Text>
      )}
      <Button
        title="Refresh Location"
        onPress={async () => {
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default LocationComponent;

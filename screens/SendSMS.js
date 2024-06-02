// SendSMS.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import * as SMS from 'expo-sms';

const SendSMS = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleSendSMS = async () => {
    if (!phoneNumber.trim() || !message.trim()) {
      Alert.alert('Error', 'Phone number and message cannot be empty.');
      return;
    }

    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      const { result } = await SMS.sendSMSAsync(
        [phoneNumber],
        message
      );
      if (result === 'sent') {
        Alert.alert('Success', 'SMS sent successfully.');
      } else {
        Alert.alert('Error', 'Failed to send SMS.');
      }
    } else {
      Alert.alert('Error', 'SMS service is not available on this device.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={[styles.input, styles.messageInput]}
        placeholder="Message"
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <Button title="Send SMS" onPress={handleSendSMS} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  messageInput: {
    height: 100,
  },
});

export default SendSMS;

import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
export default function Draft() {
    // Example operations
    const operations = [
      { title: "Operation 1", date: "2023-01-01", status: "N" },
      { title: "Operation 2", date: "2023-01-02", status: "E" },
      { title: "Operation 3", date: "2023-01-03", status: "N" },
      { title: "Operation 4", date: "2023-01-04", status: "E" },
    ];
  
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.circle} />
          <Text style={styles.headerText}>Malagasy tsy maty ny tazomoka</Text>
        </View>
        <Text style={styles.title}>Historique des opérations</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Prev</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          {operations.map((operation, index) => (
            <View key={index} style={styles.operation}>
              <Text>Titre: {operation.title}</Text>
              <View style={styles.operationRow}>
                <Text>Date: {operation.date}</Text>
                <TouchableOpacity style={styles.infoButton}>
                  <Text style={styles.infoButtonText}>info</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <Text style={operation.status === "N" ? styles.statusN : styles.statusE}>
                  Status: {operation.status}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.syncButton}>
          <Text style={styles.syncButtonText}>Synchroniser</Text>
        </TouchableOpacity>
      </View>
    );
  }
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#333", padding: 20 },
  header: { alignItems: "center", marginBottom: 10 },
  circle: {
    width: 100,
    height: 100,
    backgroundColor: "#fff",
    borderRadius: 50,
  },
  headerText: { color: "#fff", marginTop: 10, marginBottom: 20 },
  title: { color: "#fff", fontWeight: "bold", fontSize: 16, marginBottom: 10 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between" },
  button: { padding: 10, backgroundColor: "grey", borderRadius: 5 },
  buttonText: { color: "#fff" },
  operation: {
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  operationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoButton: { backgroundColor: "green", padding: 5, borderRadius: 5 },
  editButton: { backgroundColor: "red", padding: 5, borderRadius: 5 },
  infoButtonText: { color: "#fff" },
  editButtonText: { color: "#fff" },
  statusN: { color: "green" },
  statusE: { color: "red" },
  syncButton: {
    backgroundColor: "grey",
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  syncButtonText: { textAlign: "center", color: "#fff", fontWeight: "bold" },
});

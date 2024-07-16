import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as SQLite from "expo-sqlite";
import { useFocusEffect } from "@react-navigation/native";

async function openDatabase() {
  return SQLite.openDatabaseAsync("pnlpDB.db");
}

async function showHist(){
  try {
    const db = await openDatabase();
    const rows = await db.getAllAsync("SELECT * FROM historique");
    console.log(rows);
  } catch (error) {
    console.error("Error fetching operations from database:", error);
  }

}

const HomeScreen = ({ navigation }) => {
  const [operationTable, setOperationTable] = useState([]);

  async function getOperation() {
    try {
      const db = await openDatabase();
      const rows = await db.getAllAsync("SELECT * FROM historique ORDER BY SUBSTR(Date, 5, 2) || SUBSTR(Date, 3, 2) || SUBSTR(Date, 1, 2) DESC");
      
      const myMap = rows.map((row) => ({
        title: row.type_OP,
        date: `${row.Date.substr(0, 2)}/${row.Date.substr(2, 2)}/${row.Date.substr(4, 2)}`, // Format DDMMYY as DD/MM/YY
        status: row.Status,
      }));
      return myMap;
    } catch (error) {
      console.error("Error fetching operations from database:", error);
      return [];
    }
  }

  async function fetchData() {
    const op = await getOperation();
    //console.log(op);
    setOperationTable(op);
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      return () => {};
    }, [])
  );

  useEffect(() => {
    //showHist();
    fetchData();
  }, []);

  const exportDatabase = () => {
    // Your exportDatabase logic here
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/headerImage.png")} 
          style={styles.image}
        />
        <Text style={styles.text}>
          Programme Nationnal de Lutte contre le Paludisme
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Text style={styles.title}>Historique des opérations</Text>
        {/* <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity> */}
      </View>
      <ScrollView>
        {operationTable.map((operation, index) => (
          <View key={index} style={styles.operation}>
            <Text style={styles.opertionStyle}>Titre: {operation.title}</Text>
            <View style={styles.operationRow}>
              <Text style={styles.opertionStyle}>Date: {operation.date}</Text>
              <TouchableOpacity style={styles.infoButton}>
                <Text style={styles.infoButtonText}>info</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={operation.status === "N" ? styles.backN : styles.backE}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <Text
                style={
                  operation.status === "N" ? styles.statusN : styles.statusE
                }
              >
                Status: {operation.status}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.syncButton} onPress={showHist}>
        <Text style={styles.syncButtonText}>Synchroniser</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { alignItems: "center", marginBottom: 10 },
  circle: {
    width: 100,
    height: 100,
    backgroundColor: "#333",
    borderRadius: 50,
  },
  headerText: { color: "#333", marginTop: 10, marginBottom: 20 },
  title: { color: "green", fontWeight: "bold", fontSize: 16 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  button: { padding: 10, backgroundColor: "grey", borderRadius: 5 },
  buttonText: { color: "#fff" },
  opertionStyle: { color: "#fff" },
  backN: { backgroundColor: "red" },
  backE: { backgroundColor: "green" },
  operation: {
    backgroundColor: "#333",
    borderColor: "black",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  operationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoButton: { backgroundColor: "green", padding: 5, borderRadius: 5 , marginLeft:60},
  editButton: { backgroundColor: "red", padding: 5, borderRadius: 5 },
  infoButtonText: { color: "#fff" },
  editButtonText: { color: "#fff" },
  statusN: { color: "red" },
  statusE: { color: "green" },
  syncButton: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  syncButtonText: { textAlign: "center", color: "#fff", fontWeight: "bold" },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 0,
  },
  image: {
    width: 100,
    height: 100,
    marginHorizontal: 0,
    marginLeft: 20,
    resizeMode: "cover",
    borderRadius: 10,
  },
});

export default HomeScreen;

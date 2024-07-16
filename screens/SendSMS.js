import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Text,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as SMS from "expo-sms";
import * as SQLite from "expo-sqlite";
import { useFocusEffect } from "@react-navigation/native";

async function openDatabase() {
  return SQLite.openDatabaseAsync("pnlpDB.db");
}
async function getFonkotany(reg, dist, comm, sit) {
  const db = await openDatabase();
  const query =
    "SELECT *  FROM localisation WHERE region=? AND district=? AND commune=? AND site=?";

  const allRows = await db.getAllAsync(query, [reg, dist, comm, sit]);
  //setData(allRows)
  return allRows.map((row) => ({ label: row.fokontany, value: row.fokontany }));
}

const SendSMS = ({ navigation }) => {
  // `execAsync()` is useful for bulk queries when you want to execute altogether.
  // Please note that `execAsync()` does not escape parameters and may lead to SQL injection.

  //Région variables
  const [valueReg, setValueReg] = useState("");

  // District variables
  const [valueDist, setValueDist] = useState("");

  // fkt variables
  const [valueFkt, setValueFkt] = useState();
  const [isFocusFkt, setIsFocusFkt] = useState(false);
  const [fkt, setfkt] = useState([]);

  // variable operations
  const [valueOp, setValueOp] = useState(null);
  const [isFocusOp, setIsFocusOp] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [codeDistrict, setCodeDistrict] = useState();
  const [codeFokontany, setCodeFokontany] = useState();

  const [menage, setMenage] = useState("");
  const [population, setPopulation] = useState("");
  const [mii, setMii] = useState("");
  const [codeOperation, setCodeOperation] = useState("");
  const [chosenDate, setChosenDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const dataOperation = [
    { label: "Acheminement", value: "1" },
    { label: "Authentification", value: "2" },
    { label: "Distribution", value: "3" },
    { label: "Gestion de reliquat", value: "4" },
  ];

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false); // Hide picker
    if (selectedDate) {
      setChosenDate(selectedDate);
    }
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    return `${day}/${month}/${year}`;
  };
  const formatDateToSend = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}${month}${year}`;
  };
  async function updateHistorique() {
    const db = await openDatabase();
    const statement = await db.prepareAsync(
      "INSERT INTO historique (type_OP, Date, Status) VALUES ($type_OP, $date,$status)"
    );
    try {
      let result = await statement.executeAsync({
        $type_OP: "Formatage SMS",
        $date: formatDateToSend(chosenDate),
        $status: "E",
      });
      console.log(
        "Historique mis à jour: ",
        result.lastInsertRowId,
        result.changes
      );
    } finally {
      await statement.finalizeAsync();
    }
  }
  const handleSendSMS = async () => {
    const isAvailable = await SMS.isAvailableAsync();
    const message = `${codeDistrict};${codeFokontany};${codeOperation};${menage};${population};${mii};${formatDateToSend(
      chosenDate
    )}`;

    if (isAvailable) {
      const { result } = await SMS.sendSMSAsync([phoneNumber], message);
      updateHistorique();
      setValueFkt("");
      setValueOp(null);
      setMenage("");
      setPopulation("");
      setMii("");
      navigation.navigate("Page d'acceuil");
      if (result === "sent") {
        Alert.alert("Success", "SMS sent successfully.");
      } else {
        //Alert.alert("Error", "SMS not sent.");
      }
    } else {
      Alert.alert("Error", "SMS service is not available on this device.");
    }
  };

  async function handleFktChange(item) {
    setValueFkt(item.value);
    setIsFocusFkt(false);
    const db = await openDatabase();
    const query =
      "SELECT * FROM localisation WHERE region=? AND district=? AND fokontany=?";
    const rows = await db.getAllAsync(query, [valueReg, valueDist, item.value]);
    const codefk = rows[0].code_fokontany;
    setCodeFokontany(codefk);
    //console.log("query[0].code_district");
    console.log(rows[0].code_district);
    setCodeDistrict(rows[0].code_district);
    console.log(codefk);

    //const firstRow = await db.getFirstAsync("SELECT * FROM parametre");
    //setCodeDistrict(firstRow.code_district);
    //console.log(firstRow);
    //setCodeDistrict(get_codefkt(valueReg,valueDist,item.value));
    //setCodeFokontany(150);
  }
  //cette fonction retour la valeur de code fkt dans la table localisation selon la région, district et le fkt
  async function get_codefkt(region, district, fokontany) {
    const db = await openDatabase();
    const query =
      "SELECT * FROM localisation WHERE region=? AND district=? AND fokontany=?";
    const rows = await db.getAllAsync(query, [region, district, fokontany]);
    console.log(rows[0].code_district);
    code_fktg = rows[0].code_fokontany;
    return code_fktg;
  }

  async function fetchData() {
    const db = await openDatabase();
    const firstRow = await db.getFirstAsync("SELECT * FROM parametre");
    const fktv = await getFonkotany(
      firstRow.region,
      firstRow.district,
      firstRow.commune,
      firstRow.site
    );
    // Fetch sites for the initial region, district, and commune
    //console.log(fktv.value);
    setValueReg(firstRow.region);
    setValueDist(firstRow.district);

    setCodeDistrict(firstRow.code_district);
    //setValueSite(firstRow.site);
    setPhoneNumber(firstRow.numero_sms);
    //Mettre à jour les liste de fkt
    setfkt(fktv);
  }
  useFocusEffect(
    React.useCallback(() => {
      // Code to run when the screen is focused
      fetchData();
      return () => {
        // Code to run when the screen is unfocused
      };
    }, [])
  );

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust behavior based on platform
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.Big_tex, { color: "green" }]}> Fonkotany </Text>
        <Dropdown
          style={[styles.dropdown, isFocusFkt && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={fkt}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocusFkt ? "Choisissez le Fokontany" : "..."}
          searchPlaceholder="Rechercher..."
          value={valueFkt}
          onFocus={() => setIsFocusFkt(true)}
          onBlur={() => setIsFocusFkt(false)}
          onChange={handleFktChange}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocusFkt ? "blue" : "black"}
              name="Safety"
              size={20}
            />
          )}
        />
        <Text style={[styles.Big_tex, { color: "green" }]}> Opération </Text>
        <Dropdown
          style={[styles.dropdown, isFocusOp && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={[styles.selectedTextStyle, { color: "black" }]}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={dataOperation}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocusOp ? "Choisissez le l'Opération" : "..."}
          searchPlaceholder="Rechercher..."
          value={valueOp}
          onFocus={() => setIsFocusOp(true)}
          onBlur={() => setIsFocusOp(false)}
          onChange={(item) => {
            setValueOp(item.value);
            console.log("Selected Opération ID:", item.value);
            //console.log("Selected Opération op:", valueOp);
            setMenage("");
            setPopulation("");
            setMii("");
            switch (item.value) {
              case "1":
                setCodeOperation("RM");
                break;
              case "2":
                setCodeOperation("AU");
                break;
              case "3":
                setCodeOperation("DS");
                break;
              case "4":
                setCodeOperation("RQ");
                break;
              default:
                setCodeOperation("");
            }
            setIsFocusOp(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocusOp ? "blue" : "black"}
              name="Safety"
              size={20}
            />
          )}
        />
        <Text style={[styles.Big_tex, { color: "green" }]}>
          {" "}
          Nombre Menage{" "}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre menage"
          value={menage}
          onChangeText={setMenage}
          keyboardType="numeric"
          editable={valueOp !== "1" && valueOp !== "3" && valueOp !== "4"} // Disable if selected operation is "Authentification"
        />
        <Text style={[styles.Big_tex, { color: "green" }]}>
          Nombre population{" "}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre population"
          value={population}
          onChangeText={setPopulation}
          keyboardType="numeric"
          editable={valueOp !== "1" && valueOp !== "3" && valueOp !== "4"} // Disable if selected operation is "Authentification"
        />
        <Text style={[styles.Big_tex, { color: "green" }]}>Nombre MII</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre MII"
          value={mii}
          onChangeText={setMii}
          keyboardType="numeric"
          editable={valueOp !== "2"} // Disable if selected operation is "Authentification"
        />
        <Text style={[styles.Big_tex, { color: "green" }]}>
          Date de l'opération{" "}
        </Text>
        <View style={styles.innerContainer}>
          <Text style={styles.dateText}>{formatDate(chosenDate)}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Button title="Changer la date" onPress={showDatePicker} />
          {showPicker && (
            <DateTimePicker
              value={chosenDate}
              mode="date"
              display="calendar"
              onChange={handleDateChange}
            />
          )}
        </View>

        <Text style={[styles.Big_tex, { color: "blue" }]}> Destinataire </Text>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        <Button title="Formater le SMS" onPress={handleSendSMS} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  messageInput: {
    height: 100,
  },
  Big_tex: {
    fontSize: 17,
    marginBottom: 10,
    fontWeight: "bold",
    tintColor: "blue",
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 0,
    marginBottom: 0,
    marginLeft: 0,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "darkgray",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "green",
    borderRadius: 5,
  },
});

export default SendSMS;

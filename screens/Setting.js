// SendSMS.js
import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Text,
  Settings,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as SQLite from "expo-sqlite";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";

//import dm from './screen/databaseManager';
async function openDatabase() {
  return SQLite.openDatabaseAsync("pnlpDB.db");
}

async function updateSetting(id, updatedData) {
  const db = await openDatabase();
  const query = `
    UPDATE parametre
    SET region = ?, district = ?, commune = ?, site = ?, numero_sms = ?, code_district = ?
    WHERE id = ?;
  `;  

  const params = [
    updatedData.region,
    updatedData.district,
    updatedData.commune,
    updatedData.site,
    updatedData.numero_sms, 
    updatedData.codeDistrict,
    id,
  ]; 
 
  try {
    await db.runAsync(query, params);
    console.log(`Record with id ${id} updated successfully`);

    Alert.alert("Succès", `Les parapètres sont enregistrés avec succès`, [
      { text: "OK" },
    ]);
  } catch (error) {
    console.error(`Failed to update record with id ${id}:`, error);
    setTimeout(() => {
      Toast.show({
        type: "error",
        text1: `Erreur d'enregistrement des paramètres`,
        text2: error.message,
      });
    }, 3000); // 1000ms = 1 second delay
    Alert.alert(
      "Error",
      `Erreur d'enregistrement des paramètres: ${error.message}`,
      [{ text: "OK" }]
    );
  }
}

async function getRegion() {
  const db = await openDatabase();
  const allRows = await db.getAllAsync(
    "SELECT DISTINCT region  FROM localisation"
  );
  //setData(allRows)
  for (const row of allRows) {
    console.log(row.region);
  }
  return allRows.map((row) => ({ label: row.region, value: row.region }));
}

async function getDistrict(regionSelected) {
  const db = await openDatabase();
  const query = "SELECT DISTINCT district FROM localisation WHERE region = ?";
  const allRows = await db.getAllAsync(query, [regionSelected]);

  for (const row of allRows) {
    console.log(row.district);
  }
  return allRows.map((row) => ({ label: row.district, value: row.district }));
}

async function getCommune(regionSelected, districtSelected) {
  const db = await openDatabase();
  const query =
    "SELECT DISTINCT commune FROM localisation WHERE region = ? AND district = ?";
  const allRows = await db.getAllAsync(query, [
    regionSelected,
    districtSelected,
  ]);

  for (const row of allRows) {
    console.log(row.commune);
  }
  return allRows.map((row) => ({ label: row.commune, value: row.commune }));
}
async function getCsb(regionSelected, districtSelected, communeSelected) {
  const db = await openDatabase();
  const query =
    "SELECT DISTINCT csb FROM localisation WHERE region = ? AND district = ? AND commune = ?";
  const allRows = await db.getAllAsync(query, [
    regionSelected,
    districtSelected,
    communeSelected,
  ]);

  for (const row of allRows) {
    console.log(row.csb);
  }
  return allRows.map((row) => ({ label: row.csb, value: row.csb }));
}

async function getSite(regionSelected, districtSelected, communeSelected) {
  const db = await openDatabase();
  const query =
    "SELECT DISTINCT site FROM localisation WHERE region = ? AND district = ? AND commune = ?";
  const allRows = await db.getAllAsync(query, [
    regionSelected,
    districtSelected,
    communeSelected,
  ]);
  return allRows.map((row) => ({ label: row.site, value: row.site }));
}
async function getCodeDistrict(regionSelected, districtSelected) {
  const db = await openDatabase();
  const query = "SELECT * FROM localisation WHERE region = ? AND district = ? ";
  const firstRow = await db.getFirstAsync(query, [
    regionSelected,
    districtSelected,
  ]);
  console.log("région selected: ", regionSelected, districtSelected);
  console.log("code de district selectionné ", firstRow.code_district);
  return firstRow.code_district;
}

const Setting = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  //Région variables
  const [valueReg, setValueReg] = useState();
  const [isFocusReg, setIsFocusReg] = useState(false);
  const [region, setRegion] = useState([]);

  // District variables
  const [valueDist, setValueDist] = useState();
  const [isFocusDist, setIsFocusDist] = useState(false);
  const [district, setDistrict] = useState([]);
  // Communne variables
  const [valueComm, setValueComm] = useState();
  const [isFocusComm, setIsFocusComm] = useState(false);
  const [commune, setCommune] = useState([]);

  // SIte variables
  const [valueSite, setValueSite] = useState();
  const [isFocusSite, setIsFocusSite] = useState(false);
  const [site, setSite] = useState([]);

  const [codeDistrict, setCodeDistrict] = useState();

  const saveSetting = async () => {
    const updatedData = {
      region: valueReg,
      district: valueDist,
      commune: valueComm,
      site: valueSite,
      numero_sms: phoneNumber,
      code_district: codeDistrict,
    };
    updateSetting(1, updatedData);
    //fetchData();
    navigation.navigate("Page d'acceuil");
  };
  const updateCodeDistrict = async (codeVal, regionSelected,districtSelected) => {
    const db = await openDatabase();
    await db.runAsync('UPDATE parametre SET code_district = ? WHERE region=? AND district = ?',codeVal, regionSelected,districtSelected);
  };

  const handleRegionChange = async (item) => {
    setValueReg(item.value);
    setIsFocusReg(false);
    const districts = await getDistrict(item.value);
    setDistrict(districts);
    setValueDist(null); // Reset district
    setCommune([]); // Clear commune options
    setValueComm(null); // Reset commune
    setSite([]); // Clear site options
    setValueSite(null); // Reset site
  };

  const handleDistrictChange = async (item) => {
    setValueDist(item.value);
    setIsFocusDist(false);
    const communes = await getCommune(valueReg, item.value);
    setCommune(communes);
    const coded = await getCodeDistrict(valueReg, item.value);
    updateCodeDistrict(coded,valueReg,item.value);
    console.log("on doit trouvé:",coded);
    console.log ("la valeur de valueCode",codeDistrict);
    setCodeDistrict(coded);
    setValueComm(null); // Reset commune
    setSite([]); // Clear site options
    setValueSite(null); // Reset site
  };

  const handleCommuneChange = async (item) => {
    setValueComm(item.value);
    setIsFocusComm(false);
    const sites = await getSite(valueReg, valueDist, item.value);
    setSite(sites);
    setValueSite(null); // Reset site
  };

  const handleSiteChange = (item) => {
    setValueSite(item.value);
    setIsFocusSite(false);
  };

  async function fetchData() {
    const db = await openDatabase();
    const firstrow = await db.getFirstAsync("SELECT * FROM parametre");
    //setData(allRows)

    console.log(
      "la valeur actuelle dans parametre sont:",
      firstrow.id,
      firstrow.region,
      firstrow.district,
      firstrow.commune,
      firstrow.csb,
      firstrow.site,
      firstrow.numero_sms,
      firstrow.code_district
    );

    setValueReg(firstrow.region);
    setValueDist(firstrow.district);
    setValueComm(firstrow.commune);
    setValueSite(firstrow.site);
    setCodeDistrict(firstrow.code_district); 
    setPhoneNumber(firstrow.numero_sms);

    const districts = await getDistrict(firstrow.region);
    setDistrict(districts);

    // Fetch communes for the initial region and district
    const communes = await getCommune(firstrow.region, firstrow.district);
    setCommune(communes);
    const code = await getCodeDistrict(firstrow.region, firstrow.district); 
    setCodeDistrict(code);
    //console.log("cici est la vrai valeur de code D: ", code); 
    
    //console.log(codeDistrict); 

    // Fetch sites for the initial region, district, and commune
    const sites = await getSite(
      firstrow.region,
      firstrow.district,
      firstrow.commune
    );
    setSite(sites);
  }
  const loadRegionData = async () => {
    const regionData = await getRegion();
    setRegion(regionData);
  };

  useFocusEffect(
    React.useCallback(() => {
      // Code to run when the screen is focused
      loadRegionData();
      fetchData();
      return () => {
        // Code to run when the screen is unfocused
      };
    }, [])
  );
  useEffect(() => {
    
    loadRegionData();
    
    fetchData();
  }, []);

  return (
    // ANCIEN
    <View style={styles.container}>
      <Text style={styles.Big_tex}> Région </Text>

      <Dropdown
        style={[styles.dropdown, isFocusReg && { borderColor: "blue" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={region}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocusReg ? "Sélectionnez la région" : "..."}
        searchPlaceholder="Rechercher..."
        value={valueReg}
        onFocus={() => setIsFocusReg(true)}
        onBlur={() => setIsFocusReg(false)}
        onChange={handleRegionChange}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocusReg ? "blue" : "black"}
            name="Safety"
            size={20}
          />
        )}
      />

      <Text style={styles.Big_tex}> District </Text>

      <Dropdown
        style={[styles.dropdown, isFocusDist && { borderColor: "blue" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={district}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocusDist ? "Sélectionnez le district" : "..."}
        searchPlaceholder="Rechercher..."
        value={valueDist}
        onFocus={() => setIsFocusDist(true)}
        onBlur={() => setIsFocusDist(false)}
        onChange={handleDistrictChange}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocusDist ? "blue" : "black"}
            name="Safety"
            size={20}
          />
        )}
      />

      <Text style={styles.Big_tex}> Commune </Text>

      <Dropdown
        style={[styles.dropdown, isFocusComm && { borderColor: "blue" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={commune}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocusComm ? "Sélectionnez la commune" : "..."}
        searchPlaceholder="Rechercher..."
        value={valueComm}
        onFocus={() => setIsFocusComm(false)}
        onBlur={() => setIsFocusComm(false)}
        onChange={handleCommuneChange}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocusComm ? "blue" : "black"}
            name="Safety"
            size={20}
          />
        )}
      />
      <Text style={styles.Big_tex}> Site </Text>

      <Dropdown
        style={[styles.dropdown, isFocusSite && { borderColor: "blue" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={site}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocusSite ? "Sélectionnez site de distr..." : "..."}
        searchPlaceholder="Rechercher..."
        value={valueSite}
        onFocus={() => setIsFocusSite(true)}
        onBlur={() => setIsFocusSite(false)}
        onChange={handleSiteChange}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocusSite ? "blue" : "black"}
            name="Safety"
            size={20}
          />
        )}
      />
      <Text style={[styles.textip, { color: "green" }]}>
        Numéro pour l'envoi de SMS
      </Text>

      <TextInput
        placeholder="Numéro téléphone"
        keyboardType="numeric"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <Text style={[styles.textip, { color: "green" }]}></Text>
      <Button
        tyle={[styles.button, { color: "green" }]}
        title="Enregistrer"
        onPress={saveSetting}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
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
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    tintColor: "blue",
  },
  textip: {
    fontSize: 20,
    marginBottom: 10,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
    marginLeft: 20,
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
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  button: {
    marginTop: 20,
  },
});

export default Setting;

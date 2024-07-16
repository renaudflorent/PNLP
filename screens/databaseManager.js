import React, {useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Platform } from "react-native";
import * as SQLite from "expo-sqlite";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
// Open or create the database asynchronously
import { Asset } from 'expo-asset';
import * as MediaLibrary from 'expo-media-library';


async function openDatabase() {
  return SQLite.openDatabaseAsync('pnlpDB.db');
}

async function fetchData() {
  const db = await openDatabase();
  const allRows = await db.getAllAsync("SELECT * FROM parametre");
  //setData(allRows)
  for (const row of allRows) {
    console.log(row.id, row.value, row.intValue);
  }
}

export default function databaseManager() {

}

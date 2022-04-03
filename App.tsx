import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";

export default function App() {
  const [time, setTime] = useState("");
  const [ending, setEnding] = useState(false);

  // * WAITING FOR PLAYERS 4:33
  // * WARUMUP ENDING 0:05
  // * MATCH STARTING IN 1...
  const text1regex = /WAITING FOR PLAYERS/;
  const text2regex = /WARMUP ENDING/;
  const text3regex = /MATCH STARTING/;

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.178.59:2211");

    ws.onmessage = ({ data }) => {
      console.log(data);
      if (text1regex.test(data) || text2regex.test(data) || text3regex.test(data)) {
        if (text2regex.test(data)) {
          setEnding(true);
        }
        setTime(data);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Text style={ending ? styles.warumupEnding : styles.timeInfo}>{time}</Text>
      <Button onPress={() => setEnding(false)} title="remove warning" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  timeInfo: {
    color: "#000",
  },
  warumupEnding: {
    color: "#f00",
    fontWeight: "bold",
  },
});

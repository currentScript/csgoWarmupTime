import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface TimeInterface {
  minutes: number;
  seconds: number;
}

export default function App() {
  const [rerender, callRerender] = useState(false);
  const [time, setTime] = useState<TimeInterface>({ minutes: 0, seconds: 0 });
  const [ending, setEnding] = useState(false);

  const text1regex = /WAITING FOR PLAYERS/;
  const text2regex = /WARMUP ENDING/;
  const text3regex = /MATCH STARTING/;

  useEffect(() => {
    const ws = new WebSocket("");

    ws.onmessage = ({ data }) => {
      if (text1regex.test(data) || text2regex.test(data) || text3regex.test(data)) {
        data = data.replace(/WAITING FOR PLAYERS /i, ""); // only get the time
        let minutes = +data.split(":")[0];
        let seconds = +data.split(":")[1];

        if (minutes == 0) setEnding(true);

        setTime({ minutes, seconds });
      }
    };
  }, [rerender]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Text style={ending ? styles.warumupEnding : styles.timeInfo}>{`${time.minutes}:${time.seconds}`}</Text>
      <Pressable onPress={() => setEnding(false)} style={styles.resetButton}>
        <Text style={styles.buttonText}>remove warning</Text>
      </Pressable>
      <Pressable onPress={() => callRerender(!rerender)} style={styles.resetButton}>
        <Text style={styles.buttonText}>reconnect</Text>
      </Pressable>
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
    marginTop: "auto",
    fontSize: 75,
    fontWeight: "bold",
    color: "#000",
  },
  warumupEnding: {
    marginTop: "auto",
    fontSize: 75,
    fontWeight: "bold",
    color: "#f00",
  },
  resetButton: {
    marginTop: "auto",
    marginBottom: 50,
    padding: 15,
    backgroundColor: "#e83846",
    borderRadius: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
  },
});

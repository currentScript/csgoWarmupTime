import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CountdownComponent } from "./components/CountdownComponent";
import { SvgBubbles } from "./components/SvgBubbles";

interface TimeInterface {
  minutes: number;
  seconds: number;
}

export default function App() {
  const [rerender, callRerender] = useState(false);
  const [time, setTime] = useState<TimeInterface>({ minutes: 0, seconds: 0 });
  const [ending, setEnding] = useState(false);
  const [isCountdownTimeSet, setIsCountdownTimeSet] = useState(false);

  const text1regex = /WAITING FOR PLAYERS/;
  const text2regex = /WARMUP ENDING/;
  const text3regex = /MATCH STARTING/;

  useEffect(() => {
    const ws = new WebSocket("");
    let isTimeSet = false;

    ws.onmessage = ({ data }) => {
      if (text1regex.test(data) || text2regex.test(data) || text3regex.test(data)) {
        data = data.replace(/WAITING FOR PLAYERS /i, ""); // only get the time
        data = data.replace(/ /i, "");
        console.log(data);
        let minutes = +data.split(":")[0];
        let seconds = +data.split(":")[1];

        if (minutes == 0) setEnding(true);

        // set time only once
        if (!isTimeSet) {
          // - 1 second because of delay
          setTime({ minutes, seconds: seconds - 1 });
          setIsCountdownTimeSet(true);
          isTimeSet = true;
        }

        // update time when switching to last minute
        if (minutes === 0 && seconds === 59) {
          // - 1 second because of delay
          setTime({ minutes, seconds: seconds - 1 });
        }
      }
    };
  }, [rerender]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.countdownView}>
        {isCountdownTimeSet && (
          <Text style={styles.timeInfo}>
            <CountdownComponent minutes={time.minutes} seconds={time.seconds} />
          </Text>
        )}
        {!isCountdownTimeSet && <Text style={styles.timeInfo}>00:00:00</Text>}
        <SvgBubbles isEnding={ending} />
      </View>

      <View style={styles.buttonView}>
        <Pressable
          onPress={() => {
            callRerender(!rerender);
            setIsCountdownTimeSet(false);
            setEnding(false);
          }}
          style={[styles.button, styles.reconnectButton]}
        >
          <Text style={styles.buttonText}>Reconnect</Text>
        </Pressable>

        <Pressable onPress={() => setEnding(false)} style={[styles.button, styles.removeWarningButton]}>
          <Text style={styles.buttonText}>Remove Warning</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    backgroundColor: "#191C2B",
    overflow: "hidden",
  },
  countdownView: {
    width: 300,
    height: 300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    position: "relative",
    marginTop: "45%",
  },
  timeInfo: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#fff",
    zIndex: 22,
    borderRadius: 11111,
    backgroundColor: "#191C2B",
    width: 250,
    height: 250,
    textAlign: "center",
    textAlignVertical: "center",
  },
  buttonView: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: "5%",
  },
  button: {
    width: 175,
    padding: 15,
    borderRadius: 15,
  },
  removeWarningButton: {
    backgroundColor: "#E851534D",
    borderColor: "#E85153",
    borderWidth: 2,
  },
  reconnectButton: {
    backgroundColor: "#E85153",
  },
  buttonText: {
    height: "auto",
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    textAlignVertical: "center",
  },
});

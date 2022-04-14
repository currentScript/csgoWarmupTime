import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";
import { SvgBubbles } from "./components/SvgBubbles";
import { Countdown } from "./components/Countdown";

interface TimeInterface {
  minutes: number;
  seconds: number;
}

export default function App() {
  const borderopacityStartValue = 0;

  const borderopacityAnim = useRef(new Animated.Value(borderopacityStartValue)).current;

  const animate = () => {
    Animated.loop(
      Animated.timing(borderopacityAnim, {
        toValue: 1,
        useNativeDriver: false,
        easing: Easing.ease,
        duration: 5000,
      })
    ).start();
  };

  useEffect(() => {
    setTimeout(() => {
      animate();
    }, 200);
  }, []);

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
    let isLastMinuteSet = false;

    ws.onmessage = ({ data }) => {
      if (text1regex.test(data) || text2regex.test(data) || text3regex.test(data)) {
        data = data.replace(/WAITING FOR PLAYERS /i, ""); // only get the time
        data = data.replace(/ /i, "");
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
        if (minutes === 0) {
          if (isLastMinuteSet) {
            return;
          }
          // - 1 second because of delay
          setTime({ minutes, seconds: seconds - 1 });
          isLastMinuteSet = true;
        }
      }
    };
  }, [rerender]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.countdownView}>
        {isCountdownTimeSet && (
          <Animated.Text
            style={[
              styles.timeInfo,
              {
                borderColor: borderopacityAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: ["rgba(232, 81, 83, 0.6)", "rgba(232, 81, 83, 0.8)", "rgba(232, 81, 83, 0.6)"],
                }),
              },
            ]}
          >
            <Countdown startTime={time.minutes * 60 + time.seconds} key={time.minutes * 60 + time.seconds} />
          </Animated.Text>
        )}
        {!isCountdownTimeSet && (
          <Animated.Text
            style={[
              styles.timeInfo,
              {
                borderColor: borderopacityAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: ["rgba(232, 81, 83, 0.6)", "rgba(232, 81, 83, 0.8)", "rgba(232, 81, 83, 0.6)"],
                }),
              },
            ]}
          >
            <Text>0 : 00</Text>
          </Animated.Text>
        )}
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
    borderWidth: 8,
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

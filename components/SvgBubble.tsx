import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

interface SvgBubbleProps {
  isEnding: boolean;
  path: string;
}

export const SvgBubble: React.FC<SvgBubbleProps> = React.memo(({ isEnding, path }) => {
  const rotationStartValue = Math.floor(Math.random() * 360);

  const rotateAnim = useRef(new Animated.Value(rotationStartValue)).current;

  const rotate = () => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 360 + rotationStartValue,
        useNativeDriver: false,
        easing: Easing.linear,
        duration: 10000 * Math.floor(Math.random() * 15),
      })
    ).start();
  };

  useEffect(() => {
    setTimeout(() => {
      rotate();
    }, 200);
  }, []);

  return (
    <Animated.View
      style={[
        styles.svgView,
        {
          transform: [
            {
              rotateZ: rotateAnim.interpolate({
                inputRange: [0, 360, 720],
                outputRange: ["0deg", "360deg", "720deg"],
              }),
            },
          ],
        },
      ]}
    >
      <Svg width={900} height={600} style={styles.svg}>
        <Path d={path} fill={isEnding ? "#E85153" : "#fff"} />
      </Svg>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  svg: {
    position: "absolute",
    opacity: 0.15,
    zIndex: 0,
    top: "-50%",
    left: "-100%",
  },
  svgView: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});

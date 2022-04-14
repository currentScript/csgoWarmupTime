import React, { useEffect, useState } from "react";
import { Text } from "react-native";

interface CountdownProps {
  startTime: number;
}

export const Countdown: React.FC<CountdownProps> = ({ startTime }) => {
  const [countdown, setCountdown] = useState(startTime);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (countdown === 0) {
      setGameStarted(true);
      return;
    }

    const interval = setInterval(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  const to2Digits = (num: number) => {
    return num.toString().padStart(2, "0");
  };

  return (
    <>
      {gameStarted ? (
        <Text>Game Started</Text>
      ) : (
        <Text>
          {Math.floor(countdown / 60)} : {to2Digits(countdown % 60)}
        </Text>
      )}
    </>
  );
};

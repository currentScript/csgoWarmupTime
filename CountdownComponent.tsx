import React from "react";
import Countdown from "react-countdown";

interface TimeInterface {
  minutes: number;
  seconds: number;
}

export const CountdownComponent: React.FC<TimeInterface> = React.memo(({ minutes, seconds }) => {
  return <Countdown date={Date.now() + 1000 * seconds + 60 * 1000 * minutes} daysInHours />;
});

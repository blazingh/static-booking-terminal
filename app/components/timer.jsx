import { useEffect } from "react";

const { useState, useRef } = require("react");

function Timer({ sec = 60, time = "01:00", onTimeout }) {
  const Ref = useRef(null);

  const [timer, setTimer] = useState(time);

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return {
      total,
      minutes,
      seconds,
    };
  };

  const startTimer = (e) => {
    const { total, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(
        `${minutes > 9 ? minutes : `0${minutes}`}:${seconds > 9 ? seconds : `0${seconds}`
        }`
      );
    }
    if (minutes === 0 && seconds === 0 && typeof onTimeout === "function") {
      onTimeout();
    }
  };

  const clearTimer = (e) => {
    setTimer(time);
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    const deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + sec);
    return deadline;
  };

  useEffect(() => {
    clearTimer(getDeadTime());
  }, []);

  return <div>{timer}</div>;
}

export default Timer;

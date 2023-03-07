import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";

export default function App() {
  const [screen, setScreen] = useState("pomodoro");
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState("25:00");
  const [isRunning, setIsRunning] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("Session");

  useEffect(() => {
    if (screen === "pomodoro") {
      document.getElementById("app-container").style.backgroundColor =
        "#ba4949";
    }
  }, [screen]);

  let audio = document?.getElementById("beep");

  const handleChangeBreak = (type) => {
    if (type === "increment" && breakLength !== 60) {
      setBreakLength((prevBreak) => breakLength + 1);
    } else if (type === "decrement" && breakLength !== 1) {
      setBreakLength((prevBreak) => breakLength - 1);
    }
  };

  const handleChangeSession = (type) => {
    if (type === "increment" && sessionLength !== 60) {
      setSessionLength((prevSession) => sessionLength + 1);
    } else if (type === "decrement" && sessionLength !== 1) {
      setSessionLength((prevSession) => sessionLength - 1);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setCurrentStatus("Session");
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  useEffect(() => {
    setTimeLeft(`${sessionLength}:00`);
  }, [sessionLength]);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setTimeLeft((timeLeft) => {
          const [minutes, seconds] = timeLeft.split(":").map(Number);

          if (seconds === 0 && minutes === 0) {
            audio?.play();
            if (currentStatus === "Session") {
              setTimeLeft(`${breakLength}:00`);
              setCurrentStatus("Break");
            } else if (currentStatus === "Break") {
              setTimeLeft(`${sessionLength}:00`);
              setCurrentStatus("Session");
            }
          } else if (seconds === 0) {
            return `${minutes - 1}:59`.padStart(5, "0");
          }

          return `${minutes}:${(seconds - 1)
            .toString()
            .padStart(2, "0")}`.padStart(5, "0");
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning, breakLength, sessionLength, currentStatus]);

  return (
    <div id="app-container" className="App">
      <div id="container">
        <div id="break-label">
          <p>Break Length</p>
        </div>
        <div id="session-label">
          <p>Session Length</p>
        </div>
        <div id="break-controls">
          <div id="break-length">{breakLength}</div>
          <div
            id="break-decrement"
            onClick={() => handleChangeBreak("decrement")}
          >
            button
          </div>
          <div
            id="break-increment"
            onClick={() => handleChangeBreak("increment")}
          >
            button
          </div>
        </div>
        <div id="session-controls">
          <div id="session-length">{sessionLength}</div>
          <div
            id="session-decrement"
            onClick={() => handleChangeSession("decrement")}
          >
            button
          </div>
          <div
            id="session-increment"
            onClick={() => handleChangeSession("increment")}
          >
            button
          </div>
        </div>

        <div id="time-left">
          {timeLeft.toString().padStart(2, "0").padStart(5, "0")}
        </div>
        <div id="timer-label">{currentStatus}</div>

        <button
          id="start_stop"
          onClick={() => setIsRunning((prev) => !isRunning)}
        >
          Start/Stop
        </button>
        <button onClick={handleReset} id="reset">
          Reset
        </button>

        <audio
          id="beep"
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        ></audio>
      </div>
    </div>
  );
}

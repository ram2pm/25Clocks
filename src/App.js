import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState("25:00");
  const [isRunning, setIsRunning] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("Session");

  useEffect(() => {
    if (currentStatus === "Session") {
      document.getElementById("app-container").style.backgroundColor =
        "white";
      document.getElementById("timer-label").style.backgroundColor = "#d0394d";
    } else {
      document.getElementById("app-container").style.backgroundColor =
        "#74C0FC";
      document.getElementById("timer-label").style.backgroundColor = "#74C0FC";
      document.getElementById("start_stop").style.border = "solid 2px #74C0FC";
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
    setTimeLeft("25:00");
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
        <div id="timer-content">
          <div id="timer-label" style={{ userSelect: "none" }}>
            {currentStatus}
          </div>
          <div id="time-left" style={{ userSelect: "none" }}>
            {timeLeft.toString().padStart(2, "0").padStart(5, "0")}
          </div>
          <div
            className="d-flex w-75 justify-content-between"
            style={{ margin: "0 2em" }}
          >
            <div
              id="break-label"
              className="d-flex flex-column justify-content-center align-items-center"
            >
              <div className="d-flex justify-content-center align-items-center">
                <div
                  id="break-decrement"
                  onClick={() => handleChangeBreak("decrement")}
                >
                  <FontAwesomeIcon
                    icon={faMinus}
                    style={{ display: "block" }}
                  />
                </div>
                <div
                  id="break-length"
                  style={{ margin: "0 1em", fontSize: "1.5em" }}
                >
                  {breakLength}
                </div>
                <div
                  id="break-increment"
                  onClick={() => handleChangeBreak("increment")}
                >
                  <FontAwesomeIcon icon={faPlus} style={{ display: "block" }} />
                </div>
              </div>
              <p>Break Length</p>
            </div>
            <div
              id="session-label"
              className="d-flex flex-column justify-content-center align-items-center"
            >
              <div className="d-flex justify-content-center align-items-center">
                <div
                  id="session-decrement"
                  onClick={() => handleChangeSession("decrement")}
                >
                  <FontAwesomeIcon
                    icon={faMinus}
                    style={{ display: "block" }}
                  />
                </div>
                <div
                  id="session-length"
                  style={{ margin: "0 1em", fontSize: "1.5em" }}
                >
                  {sessionLength}
                </div>
                <div
                  id="session-increment"
                  onClick={() => handleChangeSession("increment")}
                >
                  <FontAwesomeIcon icon={faPlus} style={{ display: "block" }} />
                </div>
              </div>
              <p>Session Length</p>
            </div>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <button
              id="start_stop"
              onClick={() => setIsRunning((prev) => !isRunning)}
            >
              <p style={{ userSelect: "none" }}>
                {isRunning ? "Pause" : "Start"}
              </p>
            </button>
            <button onClick={handleReset} id="reset">
              <p style={{ userSelect: "none" }}>Reset</p>
            </button>
          </div>
          <audio
            id="beep"
            src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
          ></audio>
        </div>
      </div>
    </div>
  );
}

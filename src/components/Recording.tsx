import { useEffect, useState } from "react";
import { PrimaryButton } from "./styled";
import PlayAI from "../main.tsx";
import { PlayAIStyles } from "../utils";

interface RecordingProps {
  playAI: PlayAI;
  playAIStyles: PlayAIStyles;
}

const StartIcon = () => (
  <svg className="recording-icon" width="15" height="15" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7.3457" cy="7.31641" r="6.43262" />
    <circle cx="7.3458" cy="7.31562" r="5.0084" />
  </svg>
);

const StopIcon = () => (
  <svg className="recording-icon" width="15" height="15" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
    <rect x="1.58887" y="1.65234" width="11.3291" height="11.3291" rx="2" />
    <rect x="0.663086" y="0.726074" width="13.1807" height="13.1807" rx="2.75" strokeWidth="0.5" />
  </svg>
);

const DashboardLink = ({ dashUrl }: { dashUrl: string }) => (
  <a href={dashUrl} target={"_blank"}>
    <svg
      className="dashboard-icon"
      width="16"
      height="16"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.975098" y="1.24658" width="4.96387" height="4.96387" rx="0.5" />
      <rect x="0.975098" y="8.42236" width="4.96387" height="4.96387" rx="0.5" />
      <rect x="8.02734" y="1.24658" width="4.96387" height="4.96387" rx="0.5" />
      <rect x="8.02734" y="8.42236" width="4.96387" height="4.96387" rx="0.5" />
    </svg>
  </a>
);

const Recording = ({ playAI, playAIStyles }: RecordingProps) => {
  const [recording, setRecording] = useState(false);
  const [time, setTime] = useState(0);

  const toggleRecording = async () => {
    if (recording) {
      await playAI.stopRecording();
    } else {
      await playAI.startRecording();
    }
    setRecording(!recording);
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (recording) {
      const timer = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setTime(0);
    }
  }, [recording]);

  return (
    <div className="wrapper">
      <DashboardLink dashUrl={PlayAI.DASH_URL} />
      <span className="time">{formatTime(time)}</span>
      <PrimaryButton onClick={toggleRecording} $playAIStyles={playAIStyles} $type="recording">
        {recording ? <StopIcon /> : <StartIcon />}
        {recording ? "Stop Recording" : "Start Recording"}
      </PrimaryButton>
    </div>
  );
};

export default Recording;

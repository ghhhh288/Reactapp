"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "../styles/Card.module.css";
import DialPad from "../components/DialPad";
import CallControls from "../components/CallControls";
import CallHistory from "../components/CallHistory";
import StatusBadge from "../components/StatusBadge";
import { WebRTCClient } from "../lib/webrtcClient";

export default function Home() {
  const [number, setNumber] = useState("");
  const [status, setStatus] = useState("idle");
  const [history, setHistory] = useState([]);
  const [remoteStream, setRemoteStream] = useState(null);

  const rtcClient = useMemo(
    () =>
      new WebRTCClient({
        onStatusChange: setStatus,
        onRemoteStream: setRemoteStream,
      }),
    []
  );

  useEffect(() => {
    return () => {
      rtcClient.endCall();
    };
  }, [rtcClient]);

  const handleDigit = (digit) => {
    if (status === "idle" || status === "ended") {
      setStatus("idle");
    }
    setNumber((prev) => (prev + digit).slice(0, 15));
  };

  const handleStartCall = async () => {
    if (!number) return;
    setStatus("ringing");
    setHistory((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        number,
        type: "Outgoing",
        timestamp: Date.now(),
      },
    ]);
    await rtcClient.startCall(number);
  };

  const handleEndCall = async () => {
    await rtcClient.endCall();
  };

  const handleClear = () => setNumber("");

  return (
    <main className={styles.card}>
      <header className={styles.cardHeader}>
        <h1>Skywave Caller</h1>
        <span>Prototype React softphone UI</span>
        <StatusBadge status={status} />
      </header>

      <div className={styles.screen}>{number || "Enter number"}</div>

      <DialPad onDigit={handleDigit} />

      <CallControls
        disabled={!number}
        canHangUp={["ringing", "connecting", "inCall"].includes(status)}
        onStartCall={handleStartCall}
        onEndCall={handleEndCall}
        onClear={handleClear}
      />

      <section>
        <h2 className={styles.sectionTitle}>Call History</h2>
        <CallHistory history={history} />
      </section>

      {remoteStream && (
        <audio
          autoPlay
          controls
          srcObject={remoteStream}
          style={{ marginTop: "12px", borderRadius: "12px" }}
        />
      )}
    </main>
  );
}

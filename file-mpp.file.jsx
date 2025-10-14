export class WebRTCClient {
  constructor({ onStatusChange, onRemoteStream }) {
    this.onStatusChange = onStatusChange;
    this.onRemoteStream = onRemoteStream;
    this.peer = null;
  }

  async startCall(number) {
    this.onStatusChange("connecting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.peer = new RTCPeerConnection();
      stream.getTracks().forEach((track) => this.peer.addTrack(track, stream));

      this.peer.addEventListener("track", (event) => {
        const [remoteStream] = event.streams;
        this.onRemoteStream(remoteStream);
      });

      // TODO: Send offer SDP to your signaling server here.
      // const offer = await this.peer.createOffer();
      // await this.peer.setLocalDescription(offer);
      // await sendOfferToServer(number, offer);

      this.onStatusChange("inCall");
    } catch (error) {
      console.error(error);
      this.onStatusChange("error");
    }
  }

  async endCall() {
    if (this.peer) {
      this.peer.close();
      this.peer = null;
    }
    this.onStatusChange("ended");
  }
}

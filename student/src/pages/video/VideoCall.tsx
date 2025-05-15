import { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface VideoCallProps {
  meetingId: string;
  isHost: boolean;
}

const VideoCall: React.FC<VideoCallProps> = ({ meetingId, isHost }) => {
  const [participants, setParticipants] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket>();
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:4000", {
      transports: ["websocket"],
    });

    socketRef.current.on("user-connected", (userId: string) => {
      setParticipants((prev) => [...prev, userId]);
    });

    socketRef.current.on("user-disconnected", (userId: string) => {
      setParticipants((prev) => prev.filter((id) => id !== userId));
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    });

    socketRef.current.on("offer", async (offer, userId) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        socketRef.current?.emit("answer", answer, meetingId, userId);
      }
    });

    socketRef.current.on("answer", async (answer) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    });

    socketRef.current.on("ice-candidate", async (candidate) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [meetingId]);

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const configuration = {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      };

      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionRef.current = peerConnection;

      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current?.emit(
            "ice-candidate",
            event.candidate,
            meetingId,
            socketRef.current.id
          );
        }
      };

      peerConnection.ontrack = (event) => {
        const remoteStream = new MediaStream();
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      };

      socketRef.current?.emit("join-meeting", meetingId);

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socketRef.current?.emit("offer", offer, meetingId, socketRef.current.id);
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  const endCall = () => {
    // Stop all tracks in local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });
      localStreamRef.current = null;
    }

    // Stop all tracks in remote stream
    if (remoteVideoRef.current?.srcObject) {
      const stream = remoteVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });
      remoteVideoRef.current.srcObject = null;
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    // Emit leave meeting event
    socketRef.current?.emit("leave-meeting", meetingId);
  };

  useEffect(() => {
    startCall();
    return () => {
      endCall();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto rounded-lg shadow-lg"
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            You {isHost && "(Host)"}
          </div>
        </div>
        <div className="relative">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-auto rounded-lg shadow-lg"
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            Participant
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={toggleMute}
          className={`p-2 rounded-full ${
            isMuted ? "bg-red-500" : "bg-gray-200"
          }`}
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
        <button
          onClick={toggleVideo}
          className={`p-2 rounded-full ${
            isVideoOff ? "bg-red-500" : "bg-gray-200"
          }`}
        >
          {isVideoOff ? "📷" : "📹"}
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-medium mb-2">
          Participants ({participants.length + 1})
        </h3>
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            You {isHost && "(Host)"}
          </li>
          {participants.map((participantId) => (
            <li key={participantId} className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              {participantId}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VideoCall;

import {
  FiVideo,
  FiMic,
  FiMicOff,
  FiCamera,
  FiCameraOff,
  FiMessageSquare,
  FiUsers,
  FiShare2,
  FiDownload,
  FiFlag,
  FiFileText,
  FiUser,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import Header from "../components/Header";

const StudentLiveClassPage = () => {
  // Sample class data
  const liveClass = {
    id: "LC-2023-001",
    title: "Algebra Fundamentals - Solving Quadratic Equations",
    instructor: "Prof. Sarah Johnson",
    course: "Mathematics 101",
    schedule: "2023-07-15T10:00:00",
    duration: 60, // minutes
    participants: 24,
    description:
      "Today we'll cover advanced techniques for solving quadratic equations, including factoring, completing the square, and using the quadratic formula.",
  };

  // Student state
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "Prof. Johnson",
      message: "Welcome everyone! We'll start in 2 minutes.",
      time: "09:58 AM",
    },
    {
      id: 2,
      sender: "Alex",
      message: "Good morning professor!",
      time: "09:59 AM",
    },
    {
      id: 3,
      sender: "You",
      message: "Excited for today's lesson!",
      time: "09:59 AM",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [isConnected, setIsConnected] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Simulate connection status
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const raiseHand = () => {
    setIsHandRaised(!isHandRaised);
    // In a real app, this would notify the teacher
    console.log(`Hand ${isHandRaised ? "lowered" : "raised"}`);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: chatMessages.length + 1,
        sender: "You",
        message: newMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatMessages([...chatMessages, newMsg]);
      setNewMessage("");
    }
  };

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs}h ` : ""}${mins}m`;
  };

  return (
    <div>
      <Header title="Live Class" />
      <div className="flex flex-col h-screen bg-gray-100 p-6">
        {/* Top Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">{liveClass.title}</h1>
            <p className="text-gray-600">
              {liveClass.instructor} • {liveClass.course} •{" "}
              {formatTime(timeElapsed)} elapsed
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center ${
                isConnected ? "text-green-600" : "text-red-600"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <FiUsers className="mr-2" />
              <span>{liveClass.participants} participants</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Video & Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Main Video Feed */}
            <div className="flex-1 bg-gray-800 flex flex-col">
              {/* Teacher's Video (Main Screen) */}
              <div className="flex-1 flex items-center justify-center relative">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <FiVideo size={32} />
                  </div>
                  <h2 className="text-xl font-medium">
                    {liveClass.instructor}
                  </h2>
                  <p className="text-gray-300">is presenting</p>
                </div>

                {/* Screen Sharing Overlay (would show actual shared screen) */}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white p-2 rounded-lg">
                  <div className="flex items-center">
                    <FiShare2 className="mr-2" />
                    <span>Screen Sharing: Quadratic Formula Explanation</span>
                  </div>
                </div>
              </div>

              {/* Student's Video Preview */}
              <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-700 rounded-lg border-2 border-white overflow-hidden">
                {isCameraOn ? (
                  <div className="w-full h-full bg-gray-600 flex items-center justify-center text-white">
                    Your Camera Feed
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-700 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <FiUser size={24} />
                      </div>
                      <p className="text-xs">Camera is off</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Class Description */}
            <div className="bg-white p-4 border-t">
              <h3 className="font-medium mb-1">Today's Topic</h3>
              <p className="text-gray-700">{liveClass.description}</p>
            </div>
          </div>

          {/* Sidebar - Chat/Participants/Resources */}
          <div className="w-80 bg-white border-l flex flex-col">
            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex-1 py-3 font-medium ${
                  activeTab === "chat"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setActiveTab("participants")}
                className={`flex-1 py-3 font-medium ${
                  activeTab === "participants"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                Participants
              </button>
              <button
                onClick={() => setActiveTab("resources")}
                className={`flex-1 py-3 font-medium ${
                  activeTab === "resources"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                Resources
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === "chat" && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 p-4 overflow-y-auto">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`mb-3 ${
                          msg.sender === "You" ? "text-right" : ""
                        }`}
                      >
                        <div
                          className={`inline-block px-3 py-2 rounded-lg ${
                            msg.sender === "You"
                              ? "bg-blue-100 text-blue-900"
                              : "bg-gray-100"
                          }`}
                        >
                          {msg.sender !== "You" && (
                            <div className="font-medium text-sm">
                              {msg.sender}
                            </div>
                          )}
                          <div>{msg.message}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {msg.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t">
                    <div className="flex">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      />
                      <button
                        onClick={sendMessage}
                        className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "participants" && (
                <div className="p-4">
                  <div className="font-medium mb-3">Instructor</div>
                  <div className="flex items-center p-2 bg-blue-50 rounded-lg mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <FiUser className="text-blue-600" />
                    </div>
                    <span>{liveClass.instructor}</span>
                  </div>

                  <div className="font-medium mb-3">
                    Students ({liveClass.participants - 1})
                  </div>
                  <div className="space-y-2">
                    {[
                      "Alex Johnson",
                      "Maria Garcia",
                      "James Wilson",
                      "You",
                      "Sarah Lee",
                      "David Kim",
                    ].map((student, index) => (
                      <div
                        key={index}
                        className="flex items-center p-2 hover:bg-gray-50 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <FiUser className="text-gray-600" />
                        </div>
                        <span
                          className={
                            student === "You" ? "font-medium text-blue-600" : ""
                          }
                        >
                          {student}
                        </span>
                        {student === "You" && isHandRaised && (
                          <span className="ml-auto bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                            Hand Raised
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "resources" && (
                <div className="p-4">
                  <div className="font-medium mb-3">Shared in this class</div>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 border rounded-lg hover:shadow-sm cursor-pointer">
                      <FiFileText className="text-red-500 mr-3" />
                      <div>
                        <div>Quadratic_Equations_Notes.pdf</div>
                        <div className="text-xs text-gray-500">
                          Shared by Prof. Johnson
                        </div>
                      </div>
                      <FiDownload className="ml-auto text-gray-400 hover:text-gray-600" />
                    </div>
                    <div className="flex items-center p-3 border rounded-lg hover:shadow-sm cursor-pointer">
                      <FiVideo className="text-blue-500 mr-3" />
                      <div>
                        <div>Solving_Quadratic_Equations.mp4</div>
                        <div className="text-xs text-gray-500">
                          Shared by Prof. Johnson
                        </div>
                      </div>
                      <FiDownload className="ml-auto text-gray-400 hover:text-gray-600" />
                    </div>
                  </div>

                  <div className="font-medium mt-6 mb-3">Class Recordings</div>
                  <div className="flex items-center p-3 border rounded-lg bg-gray-50 text-gray-500">
                    <FiVideo className="mr-3" />
                    <div>
                      <div>Recording will be available after class</div>
                      <div className="text-xs">
                        Typically processed within 1 hour
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white border-t p-3">
          <div className="flex justify-center space-x-4">
            <button
              onClick={toggleMic}
              className={`p-3 rounded-full ${
                isMicOn ? "bg-gray-200 text-gray-700" : "bg-red-500 text-white"
              }`}
              title={isMicOn ? "Mute microphone" : "Unmute microphone"}
            >
              {isMicOn ? <FiMic size={20} /> : <FiMicOff size={20} />}
            </button>

            <button
              onClick={toggleCamera}
              className={`p-3 rounded-full ${
                isCameraOn
                  ? "bg-gray-200 text-gray-700"
                  : "bg-red-500 text-white"
              }`}
              title={isCameraOn ? "Turn off camera" : "Turn on camera"}
            >
              {isCameraOn ? <FiCamera size={20} /> : <FiCameraOff size={20} />}
            </button>

            <button
              onClick={raiseHand}
              className={`p-3 rounded-full ${
                isHandRaised
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              title={isHandRaised ? "Lower hand" : "Raise hand"}
            >
              <FiFlag size={20} />
            </button>

            <button
              className="p-3 rounded-full bg-gray-200 text-gray-700"
              title="Share screen"
            >
              <FiShare2 size={20} />
            </button>

            <button className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700">
              Leave Class
            </button>
          </div>
        </div>

        {/* Connection Warning (example) */}
        {!isConnected && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
            <FiFlag className="mr-2" />
            <span>Connection unstable. Trying to reconnect...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentLiveClassPage;

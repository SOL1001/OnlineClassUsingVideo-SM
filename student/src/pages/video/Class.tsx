import { useState } from "react";
import VideoCall from "./VideoCall";

function Class() {
  const [meetingId, setMeetingId] = useState<string>("");
  const [isInMeeting, setIsInMeeting] = useState<boolean>(false);
  const [isHost, setIsHost] = useState<boolean>(false);

  const createMeeting = () => {
    const newMeetingId = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    setMeetingId(newMeetingId);
    setIsHost(true);
    setIsInMeeting(true);
  };

  const joinMeeting = () => {
    if (meetingId.trim()) {
      setIsHost(false);
      setIsInMeeting(true);
    }
  };

  const leaveMeeting = () => {
    setIsInMeeting(false);
    setIsHost(false);
  };

  // SVG Icons
  const VideoIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );

  const JoinIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
      />
    </svg>
  );

  const CreateIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  const LeaveIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <VideoIcon />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Video Meeting</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
          {!isInMeeting ? (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden p-8 space-y-6">
                <div className="text-center space-y-2">
                  <div className="mx-auto p-4 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                    <VideoIcon />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Start or join a meeting
                  </h2>
                  <p className="text-gray-500">
                    Connect with your team or friends
                  </p>
                </div>

                {/* <button
                  onClick={createMeeting}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <CreateIcon />
                  <span>Create New Meeting</span>
                </button> */}

                <div className="flex items-center space-x-3">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-gray-400 text-sm">OR</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="meetingId"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Meeting ID
                    </label>
                    <input
                      id="meetingId"
                      type="text"
                      value={meetingId}
                      onChange={(e) => setMeetingId(e.target.value)}
                      placeholder="Enter Meeting ID"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={joinMeeting}
                    disabled={!meetingId.trim()}
                    className={`w-full flex items-center justify-center space-x-2 px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                      meetingId.trim()
                        ? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <JoinIcon />
                    <span>Join Meeting</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 bg-white rounded-xl shadow-md overflow-hidden p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <VideoIcon />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Meeting ID:{" "}
                      <span className="text-blue-600">{meetingId}</span>
                    </h2>
                    {isHost && (
                      <p className="text-sm text-blue-500 bg-blue-50 px-2 py-1 rounded-full inline-block">
                        You are the host
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={leaveMeeting}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                  <LeaveIcon />
                  <span>Leave Meeting</span>
                </button>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <VideoCall meetingId={meetingId} isHost={isHost} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Class;

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

// Initialize express app
const app = express();
const server = http.createServer(app);

// Configure CORS
app.use(cors());
app.use(express.json());

// Initialize Socket.IO with CORS configuration
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Store meetings and their participants
const meetings = new Map();

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins a meeting
  socket.on("join-meeting", (meetingId, isHost) => {
    try {
      if (!meetingId) {
        throw new Error("Meeting ID is required");
      }

      if (!meetings.has(meetingId)) {
        meetings.set(meetingId, {
          host: isHost ? socket.id : null,
          participants: new Set(),
          createdAt: new Date(),
        });
      }

      const meeting = meetings.get(meetingId);
      meeting.participants.add(socket.id);

      if (isHost && !meeting.host) {
        meeting.host = socket.id;
      }

      socket.join(meetingId);
      socket.to(meetingId).emit("user-connected", socket.id);
      console.log(
        `User ${socket.id} joined meeting ${meetingId}${
          isHost ? " as host" : ""
        }`
      );
    } catch (error) {
      console.error("Error joining meeting:", error);
      socket.emit("error", error.message);
    }
  });

  // User leaves a meeting
  socket.on("leave-meeting", (meetingId) => {
    try {
      if (!meetingId) {
        throw new Error("Meeting ID is required");
      }

      if (meetings.has(meetingId)) {
        const meeting = meetings.get(meetingId);
        meeting.participants.delete(socket.id);

        // If the host leaves, assign a new host from remaining participants
        if (meeting.host === socket.id && meeting.participants.size > 0) {
          const newHost = Array.from(meeting.participants)[0];
          meeting.host = newHost;
          io.to(newHost).emit("promoted-to-host");
        }

        // If no participants left, delete the meeting
        if (meeting.participants.size === 0) {
          meetings.delete(meetingId);
        }

        socket.to(meetingId).emit("user-disconnected", socket.id);
        socket.leave(meetingId);
        console.log(`User ${socket.id} left meeting ${meetingId}`);
      }
    } catch (error) {
      console.error("Error leaving meeting:", error);
      socket.emit("error", error.message);
    }
  });

  // WebRTC signaling
  socket.on("offer", (offer, meetingId, userId) => {
    try {
      if (!meetingId || !userId) {
        throw new Error("Meeting ID and User ID are required");
      }
      socket.to(meetingId).emit("offer", offer, userId);
    } catch (error) {
      console.error("Error handling offer:", error);
      socket.emit("error", error.message);
    }
  });

  socket.on("answer", (answer, meetingId, userId) => {
    try {
      if (!meetingId || !userId) {
        throw new Error("Meeting ID and User ID are required");
      }
      socket.to(meetingId).emit("answer", answer, userId);
    } catch (error) {
      console.error("Error handling answer:", error);
      socket.emit("error", error.message);
    }
  });

  socket.on("ice-candidate", (candidate, meetingId, userId) => {
    try {
      if (!meetingId || !userId) {
        throw new Error("Meeting ID and User ID are required");
      }
      socket.to(meetingId).emit("ice-candidate", candidate, userId);
    } catch (error) {
      console.error("Error handling ICE candidate:", error);
      socket.emit("error", error.message);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    try {
      // Remove user from all meetings
      for (const [meetingId, meeting] of meetings.entries()) {
        if (meeting.participants.has(socket.id)) {
          meeting.participants.delete(socket.id);

          // If the host disconnects, assign a new host
          if (meeting.host === socket.id && meeting.participants.size > 0) {
            const newHost = Array.from(meeting.participants)[0];
            meeting.host = newHost;
            io.to(newHost).emit("promoted-to-host");
          }

          // If no participants left, delete the meeting
          if (meeting.participants.size === 0) {
            meetings.delete(meetingId);
          }

          socket.to(meetingId).emit("user-disconnected", socket.id);
        }
      }
      console.log("User disconnected:", socket.id);
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", meetings: meetings.size });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

# Video Meeting Backend

This is the backend server for the video meeting application. It handles WebRTC signaling and meeting management.

## Features

- Real-time WebRTC signaling using Socket.IO
- Meeting room management
- Host/participant role management
- Automatic host reassignment
- Health check endpoint
- Error handling

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## API Endpoints

- `GET /health` - Health check endpoint
  - Returns: `{ status: 'ok', meetings: number }`

## Socket.IO Events

### Emitted by Client

- `join-meeting` - Join a meeting room
  - Parameters: `(meetingId: string, isHost: boolean)`
- `leave-meeting` - Leave a meeting room
  - Parameters: `(meetingId: string)`
- `offer` - Send WebRTC offer
  - Parameters: `(offer: RTCSessionDescription, meetingId: string, userId: string)`
- `answer` - Send WebRTC answer
  - Parameters: `(answer: RTCSessionDescription, meetingId: string, userId: string)`
- `ice-candidate` - Send ICE candidate
  - Parameters: `(candidate: RTCIceCandidate, meetingId: string, userId: string)`

### Received by Client

- `user-connected` - New user joined
  - Parameters: `(userId: string)`
- `user-disconnected` - User left
  - Parameters: `(userId: string)`
- `promoted-to-host` - Promoted to host
  - Parameters: none
- `offer` - Received WebRTC offer
  - Parameters: `(offer: RTCSessionDescription, userId: string)`
- `answer` - Received WebRTC answer
  - Parameters: `(answer: RTCSessionDescription, userId: string)`
- `ice-candidate` - Received ICE candidate
  - Parameters: `(candidate: RTCIceCandidate, userId: string)`
- `error` - Error occurred
  - Parameters: `(message: string)`

## Environment Variables

- `PORT` - Server port (default: 5000)

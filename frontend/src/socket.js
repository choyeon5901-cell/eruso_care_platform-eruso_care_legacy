const socket = new WebSocket("ws://localhost:8000/ws");

socket.onmessage = (event) => {
  console.log("🔔 실시간 알림:", event.data);
};

export default socket;

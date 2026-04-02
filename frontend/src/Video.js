import React, { useEffect, useRef } from "react";

function Video() {
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/room1");

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
      ]
    });

    const isCaller = window.location.search.includes("caller=true");

    // 🔥 추가 (핵심)
    const token = localStorage.getItem("token");

    // =========================
    // 📹 카메라 연결
    // =========================
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(stream => {
      console.log("카메라 연결 성공");

      localVideo.current.srcObject = stream;

      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });
    });

    // =========================
    // 📹 상대 영상 받기
    // =========================
    pc.ontrack = (event) => {
      console.log("상대 영상 수신");
      remoteVideo.current.srcObject = event.streams[0];
    };

    // =========================
    // ❄ ICE 후보 전송
    // =========================
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(JSON.stringify({
          type: "ice",
          candidate: event.candidate
        }));
      }
    };

    // =========================
    // 📡 WebSocket 연결
    // =========================
    socket.onopen = () => {
      console.log("웹소켓 연결됨");

      // 🔐 JWT 토큰 전송 (필수)
      socket.send(JSON.stringify({
        token: token
      }));

      // 🔥 caller만 offer 생성
      if (isCaller) {
        setTimeout(async () => {
          console.log("offer 생성 시작");

          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          socket.send(JSON.stringify({
            type: "offer",
            offer: offer
          }));

          console.log("offer 전송 완료");
        }, 2000);
      }
    };

    // =========================
    // 📡 메시지 처리
    // =========================
    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      console.log("메시지 수신:", data.type);

      if (data.type === "offer") {
        console.log("offer 수신");

        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.send(JSON.stringify({
          type: "answer",
          answer: answer
        }));

        console.log("answer 전송");
      }

      if (data.type === "answer") {
        console.log("answer 수신");

        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      }

      if (data.type === "ice") {
        try {
          await pc.addIceCandidate(data.candidate);
        } catch (e) {
          console.error("ICE 에러:", e);
        }
      }
    };

  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>화상진료 테스트</h2>

      <video
        ref={localVideo}
        autoPlay
        playsInline
        muted
        style={{ width: "45%", margin: "10px" }}
      />

      <video
        ref={remoteVideo}
        autoPlay
        playsInline
        style={{ width: "45%", margin: "10px" }}
      />
    </div>
  );
}

export default Video;
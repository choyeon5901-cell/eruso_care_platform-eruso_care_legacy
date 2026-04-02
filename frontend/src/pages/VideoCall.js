import { useEffect, useRef } from 'react';

export default function VideoCall() {
  const videoRef = useRef();

  useEffect(() => {
    console.log('getUserMedia 실행됨');

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: 'user',
        },
        audio: false,
      })
      .then((stream) => {
        console.log('카메라 연결 성공');

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error('카메라 접근 실패:', err.name, err.message);
      });
  }, []);

  return (
    <div>
      <h2>화상진료 테스트</h2>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ width: '400px' }}
      />
    </div>
  );
}

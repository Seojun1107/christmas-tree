import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function KakaoRedirect({ setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code"); // 인가 코드 추출
    if (code) {
      fetch(`http://localhost:3001/auth/kakao?code=${code}`) // 백엔드로 인가 코드 전송
        .then(response => response.json())
        .then(data => {
          console.log("로그인 성공:", data);
          setUser(data.user); // 유저 정보를 부모 컴포넌트로 전달
          navigate("/"); // 로그인 성공 후 메인 페이지로 이동
        })
        .catch(error => {
          console.error("로그인 실패:", error);
        });
    }
  }, [navigate, setUser]);

  return <h1>카카오 로그인 처리 중...</h1>;
}
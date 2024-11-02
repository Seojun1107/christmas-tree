import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function KakaoRedirect({ setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      fetch(`https://tree.seojun.xyz:3001/auth/kakao?code=${code}`, {
        credentials: 'include',  // 쿠키 전송
      })
        .then(response => response.json())
        .then(data => {
          console.log("로그인 성공:", data);
          setUser(data.user);
          navigate(`/${data.user.UserId}`);  // 메인 페이지로 이동
        })
        .catch(error => {
          console.error("로그인 실패:", error);
        });
    }
  }, [navigate, setUser]);

  return (
    <Container>
      <LoadingCircle />
      <Message>로그인 중입니다...</Message>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
`;

const LoadingCircle = styled.div`
  border: 16px solid #f3f3f3; /* 밝은 회색 */
  border-top: 16px solid #3498db; /* 파란색 */
  border-radius: 50%;
  width: 100px;
  height: 100px;
  animation: spin 2s linear infinite; /* 회전 애니메이션 */

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Message = styled.h1`
  margin-top: 20px;
  font-size: 24px;
  color: white; /* 어두운 회색 */
  font-weight: bold;
`;
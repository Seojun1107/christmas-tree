import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function Main({ user, setUser }) {
  const navigate = useNavigate();

  const Rest_api_key = process.env.REACT_APP_REST_API_KEY;
  const redirect_uri = process.env.REACT_APP_REDIRECT_URI;
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('https://tree.seojun.xyz/api/user', {
          method: 'GET',
          credentials: 'include',  // 쿠키를 포함
        });
  
        if (response.ok) {
          const data = await response.json();
          setUser(data.user); // 유저 정보를 상태에 저장
          
          // 유저 정보가 있으면 /userId로 리다이렉트
          if (data.user) {
            navigate(`/${data.user.UserId}`);
          }
        } else if (response.status === 401) {
          console.log("자동 로그인 실패: Unauthorized");
        } else {
          console.log("자동 로그인 실패: ", response.statusText);
        }
      } catch (error) {
        console.error("유저 정보 가져오기 실패:", error);
      }
    };
  
    fetchUser(); // 컴포넌트 마운트 시 유저 정보 가져오기
  }, [setUser, navigate]);

  const handleLogin = () => {
    window.location.href = kakaoURL;
  };

  // eslint-disable-next-line
  const handleLogout = () => {
    fetch('https://tree.seojun.xyz/api/logout', {
      method: 'POST',
      credentials: 'include',  // 쿠키를 포함
    })
      .then(response => response.json())
      .then(() => {
        setUser(null);
        navigate("/");
      })
      .catch(error => console.error("로그아웃 실패:", error));
  };

  return (
    <Container>
      <LoginForm>
        <Title>환영합니다!</Title>
          {/* <>
            <WelcomeMessage>{user.username}님의 트리</WelcomeMessage>
            <Button onClick={handleLogout}>로그아웃</Button>
          </> */}
          <ButtonGroup>
            <Button onClick={handleLogin}>카카오로 로그인하기</Button>
            <Button onClick={() => navigate("/login")} secondary>아이디로 로그인하기</Button>
          </ButtonGroup>
      </LoginForm>
    </Container>
  );
}

// 스타일 컴포넌트는 기존과 동일
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const LoginForm = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 400px;
  padding: 50px;
  background-color: #8b0000;
  border-radius: 20px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.4);
  align-items: center;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #fffacd;
`;
// eslint-disable-next-line
const WelcomeMessage = styled.h2`
  font-size: 24px;
  color: #fff;
`;

const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  margin-bottom: 10px;
  background-color: ${({ secondary }) => (secondary ? "#228b22" : "#d32f2f")};
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ secondary }) => (secondary ? "#006400" : "#b22222")};
  }
`;
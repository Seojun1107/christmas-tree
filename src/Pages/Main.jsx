import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function Main({ user }) {
  const navigate = useNavigate();

  const Rest_api_key = 'f2e8bb4ca54082e203b7ecbcd19beff8'; //REST API KEY
  const redirect_uri = 'http://localhost:3000/auth'; //Redirect URI
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

  const handleLogin = () => {
    window.location.href = kakaoURL;
  };

  const onClickLogin = () => {
    navigate("/login");
  };

  return (
    <Container>
      <LoginForm>
        <Title>환영합니다!</Title>
        {user ? (
          <WelcomeMessage>{user.kakao_account.profile.nickname}님, 어서 오세요!</WelcomeMessage>
        ) : (
          <ButtonGroup>
            <Button onClick={handleLogin}>카카오로 로그인하기</Button>
            <Button onClick={onClickLogin} secondary>아이디로 로그인하기</Button>
          </ButtonGroup>
        )}
      </LoginForm>
    </Container>
  );
}

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
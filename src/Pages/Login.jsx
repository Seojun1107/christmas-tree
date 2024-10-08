import React from "react";
import styled from "styled-components";

export default function Login(props) {
    return (
        <Container>
            <LoginForm>
                <Title>환영합니다!</Title>
                <Subtitle>로그인을 하기 위해 입력해주세요!</Subtitle>
                <Input type="text" placeholder="아이디" />
                <Input type="password" placeholder="비밀번호" />
                
                <ButtonGroup>
                    <Button>로그인</Button>
                    <Button secondary>회원가입 하기</Button>
                </ButtonGroup>
                
                <ForgotPassword>비밀번호를 잊으셨나요?</ForgotPassword>
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
    background: linear-gradient(135deg, #2c3e50 0%, #1c1f25 100%);
`;

const LoginForm = styled.div`
    display: flex;
    flex-direction: column;
    width: 90%;
    max-width: 400px;  /* 최대 너비 설정 */
    padding: 50px;
    background-color: #8b0000;
    border-radius: 20px;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.4);
    align-items: center;

    @media (max-width: 768px) {
        padding: 30px;  /* 패딩 조정 */
    }

    @media (max-width: 480px) {
        padding: 20px;  /* 더 작은 화면을 위한 패딩 조정 */
    }
`;

const Title = styled.h1`
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #fffacd;

    @media (max-width: 768px) {
        font-size: 28px;  /* 태블릿 크기 조정 */
    }

    @media (max-width: 480px) {
        font-size: 24px;  /* 모바일 크기 조정 */
    }
`;

const Subtitle = styled.p`
    font-size: 16px;
    color: #f5deb3;
    margin-bottom: 40px;

    @media (max-width: 768px) {
        font-size: 14px;  /* 태블릿 크기 조정 */
    }

    @media (max-width: 480px) {
        font-size: 12px;  /* 모바일 크기 조정 */
    }
`;

const Input = styled.input`
    width: 100%;
    padding: 15px 20px;
    margin-bottom: 25px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 10px;
    outline: none;
    transition: border-color 0.3s ease;
    background-color: #f5f5f5;
    
    &:focus {
        border-color: #f5deb3;
    }

    @media (max-width: 768px) {
        padding: 12px 15px;  /* 태블릿 크기 조정 */
        font-size: 14px;  /* 태블릿 크기 조정 */
    }

    @media (max-width: 480px) {
        padding: 10px 12px;  /* 모바일 크기 조정 */
        font-size: 12px;  /* 모바일 크기 조정 */
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 20px;

    @media (max-width: 768px) {
        flex-direction: column;  /* 버튼을 세로로 나열 */
    }
`;

const Button = styled.button`
    width: 48%;  /* 좌우 배치를 위해 버튼 너비 조정 */
    padding: 15px;
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

    @media (max-width: 768px) {
        width: 100%;  /* 버튼 너비를 100%로 조정 */
        margin-bottom: 10px;  /* 버튼 사이 간격 조정 */
    }
`;

const ForgotPassword = styled.a`
    margin-top: 30px;
    font-size: 14px;
    color: #f5deb3;
    cursor: pointer;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
        color: #ffd700;
    }

    @media (max-width: 768px) {
        font-size: 12px;  /* 태블릿 크기 조정 */
    }

    @media (max-width: 480px) {
        font-size: 10px;  /* 모바일 크기 조정 */
    }
`;
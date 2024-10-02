import React from "react";
import styled from "styled-components";

export default function Login(props) {
    return(
        <Container>
            <LoginForm>
                <Title>환영합니다!</Title>
                <Subtitle>로그인을 하기위해 입력해주세요!</Subtitle>
                <Input type="text" placeholder="아이디" />
                <Input type="password" placeholder="비밀번호" />
                
                <Button>로그인</Button>
                <Button>회원가입 하기</Button>
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
`;

const LoginForm = styled.div`
    display: flex;
    flex-direction: column;
    width: 400px;
    padding: 40px;
    background-color: #ffffff;
    border-radius: 15px;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
    align-items: center;
`;

const Title = styled.h1`
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
`;

const Subtitle = styled.p`
    font-size: 14px;
    color: #888;
    margin-bottom: 30px;
`;

const Input = styled.input`
    width: 100%;
    padding: 12px 20px;
    margin-bottom: 20px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s ease;

    &:focus {
        border-color: #5a67d8;
    }
`;

const Button = styled.button`
    width: 100%;
    padding: 12px 20px;
    background-color: #5a67d8;
    color: #ffffff;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #434d9b;
    }
`;

const ForgotPassword = styled.a`
    margin-top: 20px;
    font-size: 14px;
    color: #5a67d8;
    cursor: pointer;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
        color: #434d9b;
    }
`;
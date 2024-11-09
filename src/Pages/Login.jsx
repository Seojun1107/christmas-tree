import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function Login(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post("https://tree.seojun.xyz/api/login", {
                id: userId,
                password: password,
            }, { withCredentials: true });
    
            console.log("로그인 성공:", response.data);
            props.setUser(response.data.user);

            const redirectPath = new URLSearchParams(location.search).get('redirect');
            navigate(redirectPath || `/${userId}`);
        } catch (err) {
            console.error("로그인 실패:", err);
            setError("로그인에 실패했습니다.");
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <Container>
            <LoginForm>
                <Title>환영합니다!</Title>
                <Subtitle>로그인을 하기 위해 입력해주세요!</Subtitle>
                <Input 
                    type="text" 
                    placeholder="아이디" 
                    value={userId} 
                    onChange={(e) => setUserId(e.target.value)}
                />
                <Input 
                    type="password" 
                    placeholder="비밀번호" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown} // Enter 키 누르면 handleLogin 실행
                />
                {error && <Error>{error}</Error>}
                <ButtonGroup>
                    <Button onClick={handleLogin}>로그인</Button>
                    <Button secondary onClick={()=>{navigate("/signup");}}>회원가입 하기</Button>
                </ButtonGroup>
                
                <ForgotPassword>비밀번호를 잊으셨나요?</ForgotPassword>
            </LoginForm>
        </Container>
    );
}
const Error = styled.p`
    color: red;
    margin-bottom: 15px;
`;
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
    }

    @media (max-width: 480px) {
        padding: 10px 12px;  /* 모바일 크기 조정 */
    }
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

const ForgotPassword = styled.p`
    margin-top: 20px;
    color: #f5deb3;
    cursor: pointer;
    text-align: center;

    &:hover {
        text-decoration: underline;
    }
`;
import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // axios 임포트 추가

export default function Login(props) {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(""); // 아이디 상태
    const [password, setPassword] = useState(""); // 비밀번호 상태
    const [error, setError] = useState(""); // 오류 메시지 상태

    // 로그인 처리 함수
    /* const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:3001/login", {
                id: userId,
                password: password,
            });
            

            // 로그인 성공 시 처리
            console.log("로그인 성공:", response.data);
            props.setUser(response.data.user); // 로그인 후 사용자 정보를 상태에 저장
            navigate("/"); // 홈으로 이동
        } catch (err) {
            console.error("로그인 실패:", err);
            setError("로그인에 실패했습니다."); // 오류 메시지 설정
        }
    }; */
    const handleLogin = async () => {
        try {
            const response = await axios.post("https://tree.seojun.xyz:3001/login", {
                id: userId,
                password: password,
            }, { withCredentials: true }); // 쿠키 전송 설정
    
            // 로그인 성공 시 처리
            console.log("로그인 성공:", response.data);
            props.setUser(response.data.user); // 로그인 후 사용자 정보를 상태에 저장
            navigate(`/${userId}`); // 홈으로 이동
        } catch (err) {
            console.error("로그인 실패:", err);
            setError("로그인에 실패했습니다."); // 오류 메시지 설정
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
                    onChange={(e) => setUserId(e.target.value)} // 아이디 입력 시 상태 업데이트
                />
                <Input 
                    type="password" 
                    placeholder="비밀번호" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} // 비밀번호 입력 시 상태 업데이트
                />
                {error && <Error>{error}</Error>} {/* 오류 메시지 표시 */}
                <ButtonGroup>
                    <Button onClick={handleLogin}>로그인</Button> {/* 로그인 버튼 클릭 시 로그인 처리 */}
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
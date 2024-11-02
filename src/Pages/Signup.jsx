import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function Signup(props) {
    const [id, setId] = useState("");
    const [idMessage, setIdMessage] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");  // 비밀번호 확인 상태 추가
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");  // 비밀번호 불일치 에러 메시지 상태
    const navigate = useNavigate();

    const handleCheckId = async () => {
        try {
            const response = await axios.get(`https://tree.seojun.xyz:3001/api/check-id`, { params: { id } });
            setIdMessage(response.data.message);
        } catch (error) {
            setIdMessage("아이디 확인 오류");
        }
    };

    const handleSignup = async () => {
        // 비밀번호와 비밀번호 확인이 일치하지 않으면 회원가입을 중단
        if (password !== passwordConfirm) {
            setPasswordErrorMessage("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const response = await axios.post("https://tree.seojun.xyz:3001/api/signup", {
                id,
                username,
                password,
            });
            alert(response.data.message);
            navigate("/login");
        } catch (error) {
            alert("회원가입 실패");
        }
    };

    return (
        <Container>
            <SignupForm>
                <Title>회원가입</Title>
                <Subtitle>아래의 정보를 입력해주세요.</Subtitle>
                <Input
                    type="text"
                    placeholder="닉네임"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                
                <InputGroup>
                    <Input
                        type="text"
                        placeholder="아이디"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                    <CheckButton onClick={handleCheckId}>중복확인</CheckButton>
                </InputGroup>
                {idMessage && <IdMessage>{idMessage}</IdMessage>}

                <Input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordErrorMessage("");  // 비밀번호가 변경되면 에러 메시지 초기화
                    }}
                />
                <Input
                    type="password"
                    placeholder="비밀번호 확인"
                    value={passwordConfirm}
                    onChange={(e) => {
                        setPasswordConfirm(e.target.value);
                        setPasswordErrorMessage("");  // 비밀번호 확인 변경 시 에러 메시지 초기화
                    }}
                />
                {passwordErrorMessage && <PasswordError>{passwordErrorMessage}</PasswordError>}  {/* 비밀번호 불일치 시 메시지 */}

                <PrivacySection>
                    <PrivacyText>
                        개인정보 보호 관련 법에 의거하여 사용자의 정보를 안전하게 처리합니다. 귀하의 정보는
                        서비스 제공과 관련된 목적으로만 사용되며, 사용자의 동의 없이 제3자에게 제공되지 않습니다.
                    </PrivacyText>
                    <CheckboxWrapper>
                        <Checkbox type="checkbox" />
                        <CheckboxLabel>개인정보 보호에 동의합니다.</CheckboxLabel>
                    </CheckboxWrapper>
                </PrivacySection>

                <ButtonGroup>
                    <Button onClick={handleSignup}>회원가입</Button>
                </ButtonGroup>
            </SignupForm>
        </Container>
    );
}

// 스타일 컴포넌트
const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #114b5f 0%, #028090 100%);
    background-image: url('https://example.com/christmas-snow-background.jpg');
    background-size: cover;
    background-position: center;

    @media (max-width: 480px) {
      transform: scale(0.9);
    }
`;

const SignupForm = styled.div`
    display: flex;
    flex-direction: column;
    width: 90%;
    max-width: 400px;
    padding: 40px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 15px;
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.2);
    align-items: center;

    @media (max-width: 768px) {
        padding: 30px;
    }

    @media (max-width: 480px) {
        padding: 20px;
    }
`;

const Title = styled.h1`
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #d32f2f;
    font-family: 'Mountains of Christmas', cursive;

    @media (max-width: 768px) {
        font-size: 28px;
    }

    @media (max-width: 480px) {
        font-size: 24px;
    }
`;

const Subtitle = styled.p`
    font-size: 16px;
    color: #6b705c;
    margin-bottom: 30px;

    @media (max-width: 768px) {
        font-size: 14px;
    }

    @media (max-width: 480px) {
        font-size: 12px;
    }
`;

const Input = styled.input`
    width: 100%;
    padding: 15px 10px;
    margin-bottom: 20px;
    font-size: 15px;
    border: 1px solid #ddd;
    border-radius: 10px;
    outline: none;
    transition: border-color 0.3s ease;
    background-color: #f5f5f5;

    &:focus {
        border-color: #228b22;
    }

    @media (max-width: 768px) {
        padding: 12px 15px;
        font-size: 14px;
    }

    @media (max-width: 480px) {
        padding: 10px 12px;
        font-size: 12px;
    }
`;

const InputGroup = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;

const CheckButton = styled.button`
    width: 100px;
    height: 50px;
    padding: 10px;
    background-color: #ff4500;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-left: 10px;

    &:hover {
        background-color: #c71f1f;
    }

    @media (max-width: 768px) {
        width: 30%;
    }
`;

const IdMessage = styled.p`
    font-size: 14px;
    color: ${props => props.children === "사용 가능한 아이디입니다." ? "#228b22" : "#d32f2f"};
    margin-bottom: 15px;
`;

const PrivacySection = styled.div`
    width: 100%;
    max-height: 150px;
    overflow-y: auto;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 20px;
`;

const PrivacyText = styled.p`
    font-size: 12px;
    color: #333;
`;

const CheckboxWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-top: 10px;
`;

const Checkbox = styled.input`
    margin-right: 10px;
`;

const CheckboxLabel = styled.label`
    font-size: 14px;
    color: #d32f2f;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 20px;
`;

const Button = styled.button`
    width: 100%;
    padding: 15px;
    background-color: #228b22;
    color: #ffffff;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #006400;
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const PasswordError = styled.p`
    font-size: 14px;
    color: #d32f2f;
    margin-bottom: 15px;
`;
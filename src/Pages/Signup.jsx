import React, { useState } from "react";
import styled from "styled-components";

export default function Signup(props) {
    const [id, setId] = useState("");
    const [idMessage, setIdMessage] = useState("");

    const handleCheckId = () => {
        // 예시로 'test' 아이디는 이미 사용 중인 것으로 처리
        if (id === "test") {
            setIdMessage("이미 사용 중인 아이디입니다.");
        } else {
            setIdMessage("사용 가능한 아이디입니다.");
        }
    };

    return (
        <Container>
            <SignupForm>
                <Title>회원가입</Title>
                <Subtitle>아래의 정보를 입력해주세요.</Subtitle>
                <Input type="text" placeholder="닉네임" />
                
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
                
                <Input type="password" placeholder="비밀번호" />
                
                <PrivacySection>
                    <PrivacyText>
                        개인정보 보호 관련 법에 의거하여 사용자의 정보를 안전하게 처리합니다. 귀하의 정보는
                        서비스 제공과 관련된 목적으로만 사용되며, 사용자의 동의 없이 제3자에게 제공되지 않습니다.
                        서비스 이용을 위해 다음과 같은 정보를 수집 및 이용합니다: 아이디, 닉네임, 비밀번호.
                        수집된 정보는 법령에 따라 보관되며, 서비스 탈퇴 시 일정 기간 동안 보관 후 파기됩니다.
                        개인정보 보호법에 따라 귀하는 정보 삭제를 요청할 수 있으며, 관련 내용은 서비스 약관을
                        참조하시기 바랍니다.
                    </PrivacyText>
                    <CheckboxWrapper>
                        <Checkbox type="checkbox" />
                        <CheckboxLabel>개인정보 보호에 동의합니다.</CheckboxLabel>
                    </CheckboxWrapper>
                </PrivacySection>

                <ButtonGroup>
                    <Button>회원가입</Button>
                </ButtonGroup>
            </SignupForm>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column; /* 추가 */
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
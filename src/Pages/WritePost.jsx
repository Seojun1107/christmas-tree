import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';

export default function WritePost({ currentUser, recipient, receiveUser}) { // recipient prop 추가
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  useEffect(() => {
    if (!currentUser) {
      setMessage("로그인이 필요합니다.");
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) {
      setMessage("편지 내용을 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post('https://tree.seojun.xyz/api/letters', {
        nickname: currentUser.username,
        content,
        timestamp: new Date(),
        recipient, // 수신자 정보 사용
        receiveUser
      });
      if (response.status === 200) {
        setSuccessMessage(true);
        setMessage("편지가 성공적으로 전송되었습니다!");
        setTimeout(() => setSuccessMessage(false), 3000);
      }
    } catch (error) {
      setMessage("편지 전송에 실패했습니다.");
      console.error(error);
    }

    setContent('');
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>편지 쓰기</Title>
        {currentUser ? (
          <>
            <Nickname>닉네임: {currentUser.username}</Nickname>
            <Textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              placeholder="편지 내용을 입력하세요..." 
            />
            <Button type="submit">편지 보내기</Button>
            {message && <Message>{message}</Message>}
            {successMessage && <SuccessMessage>전송 완료!</SuccessMessage>}
          </>
        ) : (
          <Message>로그인이 필요합니다.</Message>
        )}
      </Form>
    </Container>
  );
}
// styled-components 및 기타 코드는 이전 코드와 동일하게 유지합니다.

// 애니메이션 정의
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// styled-components 스타일
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
  background-color: #E0F7FA; /* 밝은 하늘색 배경 */
  background-image: url('/path/to/christmas-background.jpg'); /* 크리스마스 배경 이미지 */
  background-size: cover;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.8); /* 반투명 흰색 배경 */
  border: 2px solid #FF6347; /* 토마토 색상 테두리 */
  border-radius: 15px;
  padding: 20px;
  width: 400px;
  animation: ${fadeIn} 0.5s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 그림자 추가 */
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 15px;
  color: #FF4500; /* 오렌지 레드 색상 */
  text-align: center;
  font-family: 'Dancing Script', cursive; /* 손글씨 느낌의 폰트 */
`;

const Nickname = styled.div`
  font-size: 18px;
  color: #FF4500; /* 오렌지 레드 색상 */
  margin-bottom: 10px;
`;

const Textarea = styled.textarea`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #D2B48C;
  font-size: 16px;
  height: 150px;
  resize: none;
  margin-bottom: 15px;
  background-color: #FFF8DC; /* 옅은 크림색 배경 */
`;

const Button = styled.button`
  padding: 10px;
  background-color: #FF6347; /* 토마토 색상 */
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #FF4500; /* 오렌지 레드 색상 */
  }
`;

const Message = styled.p`
  color: red;
  text-align: center;
  margin-top: 10px;
`;

const SuccessMessage = styled.p`
  color: green;
  text-align: center;
  margin-top: 10px;
  animation: ${fadeIn} 1s ease;
`;

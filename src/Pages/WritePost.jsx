import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function WritePost({ currentUser, recipient, receiveUser }) {
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#FFF8DC'); // 기본 배경색 설정

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
        recipient,
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
      <Form onSubmit={handleSubmit} style={{ backgroundColor }}>
        <Title>편지 쓰기</Title>
        <ColorPalette>
          <ColorOption color="#FFF8DC" onClick={() => setBackgroundColor('#FFF8DC')} />
          <ColorOption color="#FFF8DC" onClick={() => setBackgroundColor('#FFF8DC')} />
          <ColorOption color="#FFEB3B" onClick={() => setBackgroundColor('#FFEB3B')} />
          <ColorOption color="#FFCDD2" onClick={() => setBackgroundColor('#FFCDD2')} />
          <ColorOption color="#C8E6C9" onClick={() => setBackgroundColor('#C8E6C9')} />
          <ColorOption color="#BBDEFB" onClick={() => setBackgroundColor('#BBDEFB')} />
        </ColorPalette>
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
          <>
            <Message>로그인 후 작성하기</Message>
            <Link to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}>
              <GoToLogin>로그인 페이지 이동</GoToLogin>
            </Link>
          </>
        )}
      </Form>
    </Container>
  );
}

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

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
  border-radius: 15px;
  border: 5px dashed #493628;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  border: 2px solid #493628;
  border-radius: 15px;
  padding: 20px;
  width: 400px;
  animation: ${fadeIn} 0.5s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 15px;
  color: #493628;
  text-align: center;
`;

const Nickname = styled.div`
  font-size: 18px;
  color: #FF4500;
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
  background-color: #FFF8DC;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #FF6347;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #FF4500;
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

const GoToLogin = styled.div`
  color: white;
  background-color: rgb(73, 54, 40);
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  padding: 10px 5px;
`;

const ColorPalette = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
`;

const ColorOption = styled.div`
  width: 30px;
  height: 30px;
  background-color: ${({ color }) => color};
  border-radius: 50%;
  margin: 0 5px;
  cursor: pointer;
  border: 2px solid #493628;
`;
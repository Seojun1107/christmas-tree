import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import BackgroundImage from '../img/background.jpg'

export default function UserPage({ currentUser }) {
  const { userId } = useParams();  // URL에서 userId 가져오기
  const [userData, setUserData] = useState(null);  // MongoDB에서 불러온 유저 데이터를 저장
  const [error, setError] = useState("");  // 에러 메시지 상태

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/user/${userId}`);  // API 호출
        setUserData(response.data);  // 유저 데이터를 상태에 저장
        console.log("Fetched userId:", userId);  // userId 확인용
      } catch (err) {
        setError("유저 정보를 불러올 수 없습니다.");
      }
    };

    fetchUserData();
  }, [userId]);  // userId가 변경될 때마다 유저 데이터를 다시 불러옴

  // 로그인한 사용자가 현재 페이지의 주인인지 확인
  const isOwner = currentUser && currentUser.UserId === userId;

  if (error) return <ErrorMessage>{error}</ErrorMessage>;  // 에러 발생 시 에러 메시지 출력

  return (
    <Container>
      {userData ? (
        <Content>
          <Title>{userData.username}님의 페이지</Title>
          {isOwner ? (
            <Message>이 페이지는 당신의 트리입니다!</Message>  // 로그인한 사용자의 페이지일 때
          ) : (
            <Message>이 페이지는 {userData.username}님의 트리입니다.</Message>  // 다른 사용자가 접속했을 때
          )}
        </Content>
      ) : (
        <LoadingMessage>로딩 중...</LoadingMessage>  // 데이터를 불러오는 동안 표시
      )}
    </Container>
  );
}

// 스타일 컴포넌트
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url(${BackgroundImage});
  background-size: cover;
`;

const Content = styled.div`
  text-align: center;
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
`;

const Message = styled.p`
  font-size: 18px;
  color: #666;
`;

const LoadingMessage = styled.p`
  font-size: 18px;
  color: #666;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 18px;
  text-align: center;
`;
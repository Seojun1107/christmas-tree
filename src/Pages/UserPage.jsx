import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import BackgroundImage from '../img/background.jpg';
import { faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Letter from './Letter';
import WritePostView from './WritePost';

export default function UserPage({ currentUser }) {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const [postVisible, setPostVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/user/${userId}`);
        setUserData(response.data);
        console.log("Fetched userId:", userId);
      } catch (err) {
        setError("유저 정보를 불러올 수 없습니다.");
      }
    };

    fetchUserData();
  }, [userId]);

  const isOwner = currentUser && currentUser.UserId === userId;

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopyMessage(true);
    setTimeout(() => setShowCopyMessage(false), 2000);
  };

  const togglePostModal = () => {
    setPostVisible(!postVisible);
  };

  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <Container>
      {showCopyMessage && <CopyMessage>링크 복사 되었어요!</CopyMessage>}
      {userData ? (
        <Content style={isOwner ? { height: "750px" } : { height: "550px" }}>
          <BorderContent>
            <Header>
              <Title>{userData.username}님의 페이지</Title>
              {isOwner && <FontAwesomeIcon icon={faShareFromSquare} size='2xl' onClick={handleShareClick} />}
            </Header>
            {isOwner ? (
              <Contents>
                <Letter />
                <Letter />
                <Letter />
                <Letter />
                <Letter />
                <Letter />
              </Contents>
            ) : (
              <Message>이 페이지는 {userData.username}님의 트리입니다.</Message>
            )}
          </BorderContent>
        </Content>
      ) : (
        <LoadingMessage>로딩 중...</LoadingMessage>
      )}
      {!isOwner && (
        <WritePostButton onClick={togglePostModal}>편지 작성하기</WritePostButton>
      )}

      {postVisible && (
        <>
          <Overlay onClick={togglePostModal} />
          <PostModal>
            <CloseButton onClick={togglePostModal}>닫기</CloseButton>
            <WritePostView currentUser={currentUser} />
          </PostModal>
        </>
      )}
    </Container>
  );
}

const slideDown = keyframes`
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  10% {
    transform: translateY(0);
    opacity: 1;
  }
  50% {
    transform: translateY(0);
    opacity: 1;
  }
  85% {
    transform: translateY(-50%);
    opacity: 0.75;
  }
  100% {
    transform: translateY(-100%);
    opacity: 0.5;
  }
`;

const CopyMessage = styled.div`
  position: absolute;
  top: 130px;
  padding: 10px 20px;
  background-color: #228B22;
  color: white;
  border-radius: 10px;
  animation: ${slideDown} 3s ease forwards;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh;
  background: url(${BackgroundImage});
  background-size: cover;
  
  @media (max-width: 768px) {
  
    padding: 0 20px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 700px;
  text-align: center;
  background: #AB886D;
  border-radius: 25px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;

  @media (max-width: 768px) {
    width: 90%;
  }

  @media (max-width: 480px) {
    width: 100%;
    border-radius: 15px;
    padding: 10px;
  }
`;

const BorderContent = styled.div`
  display: flex;
  text-align: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border: 5px dashed #493628;
  border-radius: 15px;
  padding: 15px;

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 10px;
`;

const Title = styled.h1`
  font-size: 35px;
  color: #347928;

  @media (max-width: 768px) {
    font-size: 28px;
  }

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const Contents = styled.div`
  overflow-y: scroll;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
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

const WritePostButton = styled.div`
  width: 700px;
  display: flex;
  justify-content: center;
  background-color: #B8001F;
  padding: 20px;
  margin-top: 20px;
  border-radius: 20px;
  color: white;
  font-size: 28px;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 90%;
    font-size: 24px;
    padding: 15px;
  }

  @media (max-width: 480px) {
    width: 100%;
    font-size: 20px;
    padding: 10px;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 1000;
`;

const PostModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 30px;
  border-radius: 15px;
  z-index: 1001;
  width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 90%;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 20px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff4d4d;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background: #ff0000;
  }
`;
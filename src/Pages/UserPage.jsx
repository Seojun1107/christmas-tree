import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import BackgroundImage from '../img/background.jpg';
import { faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Letter from './Letter';
import WritePostView from './WritePost';
import UserIcon from '../Components/UserIcon';

export default function UserPage({ currentUser }) {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const [postVisible, setPostVisible] = useState(false);
  const [daysUntilChristmas, setDaysUntilChristmas] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://tree.seojun.xyz/api/user/${userId}`);
        setUserData(response.data);
        console.log("Fetched userId:", userId);
      } catch (err) {
        setError("유저 정보를 불러올 수 없습니다.");
      }
    };

    fetchUserData();

    // Calculate days until Christmas
    const today = new Date();
    const christmas = new Date(today.getFullYear(), 11, 25); // December is 11 (0-indexed)
    const differenceInTime = christmas.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    setDaysUntilChristmas(differenceInDays);
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

  const handleIconClick = (letter) => {
    setSelectedLetter(letter);
  };

  const handleBackClick = () => {
    setSelectedLetter(null);
  };

  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <Container>
      {showCopyMessage && <CopyMessage>링크 복사 되었어요!</CopyMessage>}
      {userData ? (
        <Content>
          <BorderContent>
            <Header style={isOwner ? { display: "flex" } : { display: "block" }}>
              <Title>
                {userData.username}님의 페이지
                {daysUntilChristmas !== null && daysUntilChristmas > 0 && isOwner && (
                    <span className='dday'>D - {daysUntilChristmas}</span>
                  )}
              </Title>
              {isOwner && <FontAwesomeIcon icon={faShareFromSquare} size='2xl' onClick={handleShareClick} />}
            </Header>
            {isOwner ? (
              <Contents>
                {!selectedLetter && userData.letters.length > 0 ? (
                  <UserIconGrid>
                    {userData.letters.map((letter, index) => (
                      <UserIcon
                        key={index}
                        letterData={letter}
                        nickName={letter.nickname}
                        isOwner={isOwner}
                        onClick={() => handleIconClick(letter)}
                        daysUntilChristmas={daysUntilChristmas}
                      />
                    ))}
                  </UserIconGrid>
                ) : (
                  <>
                    {userData.letters.length === 0 && (
                      <>
                        <Message>편지를 못 받았어요..</Message>
                        <Message>페이지를 공유하고 싶으면 우측 상단에 있는 공유 아이콘을 클릭해주세요!</Message>
                      </>
                    )}
                  </>
                )}
                {selectedLetter && (
                  <Letter
                    letterData={selectedLetter.postValue}
                    nickName={selectedLetter.nickname}
                    onBack={handleBackClick}
                  />
                )}
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
            <WritePostView currentUser={currentUser} receiveUser={userData.username} />
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
  z-index: 9999999;
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
  align-items: center;
  background: #AB886D;
  border-radius: 25px;
  padding: 20px;
  overflow: hidden;
  backdrop-filter: blur(4px);
  box-shadow: 35px 35px 68px 0px rgba(0, 0, 0, 0.5), inset -9px -9px 16px 0px rgba(0, 0, 0, 0.3), inset 0px 11px 28px 0px rgba(255, 255, 255, 0.3);
  height: ${(isOwner) => (isOwner ? '750px' : '550px')};

  @media (max-width: 768px) {
    width: 90%;
  }
  @media (max-width: 480px) {
    width: 100%;
    border-radius: 15px;
    padding: 10px;
    height: ${(isOwner) => (isOwner ? '680px' : '550px')};
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
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 10px;
`;

const Title = styled.h1`
  font-size: 30px;
  text-align: center;
  
  align-items: center;
  color: rgba(73,54,40,0.9);
  @media (max-width: 768px) {
    font-size: 28px;
  }

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const Contents = styled.div`
  height: 100%;
  overflow-y: scroll;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const UserIconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
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
    box-shadow: 35px 35px 68px 0px rgba(0, 0, 0, 0.5), inset -9px -9px 16px 0px rgba(0, 0, 0, 0.3), inset 0px 11px 28px 0px rgba(255, 255, 255, 0.3);
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
  background-color: #AB886D;
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


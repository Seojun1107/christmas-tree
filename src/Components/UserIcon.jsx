import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const UserIcon = ({ nickName, isOwner }) => {
  const [showMessage, setShowMessage] = useState(false);

  const handleClick = () => {
    if (isOwner) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    }
  };

  return (
    <UserIconWrap onClick={handleClick}>
      <Icon />
      <span>{nickName}</span>
      {showMessage && <CopyMessage>12월 25일 이후 볼 수 있어요</CopyMessage>}
    </UserIconWrap>
  );
};

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
  word-break: keep-all;
`;

const Icon = styled.div`
  width: 80px;
  height: 110px;
  margin-top: 10px;
  margin-left: 22px;
  margin-right: 22px;
  margin-bottom: 7px;
  border-radius: 20px;
  background-image: url("snowman.png");
  background-repeat: no-repeat;
  background-cover: contain;
  background-size: 150%;
  background-position: center center;
`;

const UserIconWrap = styled.div`
  float: left;
  position: relative;
`;

export default UserIcon;
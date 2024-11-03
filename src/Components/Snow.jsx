import React from "react";
import styled, { keyframes } from 'styled-components';

// 눈송이가 아래로 떨어지면서 부드럽게 좌우로 흔들리는 애니메이션
const fall = keyframes`
  0% {
    transform: translateX(0) translateY(-100px); /* 시작 위치 */
    opacity: 0;
  }
  10% {
    opacity: 0.9;
  }
  50% {
    transform: translateX(20px) translateY(50vh); /* 부드럽게 좌우로 흔들림 */
  }
  75% {
    transform: translateX(-15px) translateY(75vh); /* 반대 방향으로 부드럽게 흔들림 */
  }
  100% {
    transform: translateX(10px) translateY(100vh); /* 화면 아래로 부드럽게 사라짐 */
    opacity: 0;
  }
`;

const SnowflakeWrapper = styled.p`
  color: white;
  position: absolute; /* 절대 위치로 설정 */
  top: -100px; /* 시작 위치를 화면 위로 설정 */
  left: ${({ startX }) => startX}; /* 랜덤 X 위치 적용 */
  animation: ${fall} 6s linear infinite;
  font-size: ${({ fontSize }) => fontSize};
  animation-delay: ${({ animationDelay }) => animationDelay};
  user-select: none;
`;

const SnowContainer = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  pointer-events: none;
  z-index: 9999999999;
`;

const Snowflake = ({ style }) => {
  return (
    <SnowflakeWrapper
      fontSize={style.fontSize}
      animationDelay={style.animationDelay}
      startX={style.startX} /* 랜덤 X 위치 전달 */
    >
      {"\u2745"}
    </SnowflakeWrapper>
  );
};

const makeSnowFlakes = () => {
  let animationDelay = "0s";
  let fontSize = "14px";
  let startX = "0px"; // X축의 시작 위치를 위한 변수
  const arr = Array.from("Merry Christmas");

  return arr.map((el, i) => {
    animationDelay = `${(Math.random() * 16).toFixed(2)}s`;
    fontSize = `${Math.floor(Math.random() * 10) + 10}px`;
    startX = `${Math.random() * 100}vw`; // 0~100vw 사이의 랜덤 값
    const style = {
      animationDelay,
      fontSize,
      startX, // 랜덤 X축 값
    };
    return <Snowflake key={i} style={style} />;
  });
};

const Snow = () => (
  <SnowContainer>
    {makeSnowFlakes()}
  </SnowContainer>
);

export default Snow;
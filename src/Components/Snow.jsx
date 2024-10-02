import React from "react";
import styled, { keyframes } from 'styled-components';

const fall = keyframes`
  0% {
    opacity: 0;
  }
  3% {
    opacity: 0.9;
  }
  90% {
    opacity: 0.9;
  }
  100% {
    transform: translateY(100vh); /* 화면 아래로 떨어짐 */
    opacity: 0;
  }
`;

const SnowflakeWrapper = styled.p`
  color: white; /* 눈송이 색상을 흰색으로 변경 */
  animation: ${fall} 3.5s linear infinite; 
  font-size: ${({ fontSize }) => fontSize};
  animation-delay: ${({ animationDelay }) => animationDelay};
  user-select: none; /* 드래그 방지 */
`;

const SnowContainer = styled.div`
  position: relative;
  top: -50px;
  display: flex;
  justify-content: space-between;
  pointer-events: none; /* 마우스 이벤트 차단 (드래그 및 클릭 불가) */
`;

const Snowflake = ({ style }) => {
  return (
    <SnowflakeWrapper fontSize={style.fontSize} animationDelay={style.animationDelay}>
      {"\u2745"}
    </SnowflakeWrapper>
  );
};

const makeSnowFlakes = () => {
  let animationDelay = "0s";
  let fontSize = "14px";
  const arr = Array.from("Merry Christmas");

  return arr.map((el, i) => {
    animationDelay = `${(Math.random() * 16).toFixed(2)}s`;
    fontSize = `${Math.floor(Math.random() * 10) + 10}px`;
    const style = {
      animationDelay,
      fontSize,
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
import React from 'react';
import styled from 'styled-components';

/* ㅅㅂ react router dom으로 navigate했는데 폰트로딩 안되서 그냥 귀찮아서 태그씀 ㅅㄱ */
const NotFound = () => {
  return (
    <Container>
      <Message>404 오류: 페이지를 찾을 수 없습니다.</Message>
      <HomeLink href="/">메인 페이지로 가기</HomeLink>
    </Container>
  );
};

export default NotFound;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: white;
`;

const Message = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
`;

const HomeLink = styled.a`
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;
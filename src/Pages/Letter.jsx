// Letter.js
import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Letter = ({ letterData, nickName, onBack }) => {
  return (
    <Wrap>
      <BackIcon onClick={onBack}>
        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
      </BackIcon>
      <Text>{letterData}</Text>
      <From>From. {nickName}</From>
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 100%;
  padding: 5px 15px;
  border: 2px solid black;
  border-radius: 9px;
  margin-bottom: 35px;
  word-break: break-word;
  user-select: none;

  @media (max-width: 768px) {
    padding: 5px 10px;
  }

  @media (max-width: 480px) {
    padding: 5px 8px;
  }
`;

const Text = styled.p`
  font-size: 22px;
  line-height: 1.5;
  user-select: none;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const From = styled.p`
  font-size: 25px;
  text-align: end;
  user-select: none;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const BackIcon = styled.div`
  display: flex;
  text-align: start;
  position: relative;
  top: 10px;
  /* left: 10px; */
  cursor: pointer;
`;

export default Letter;
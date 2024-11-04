import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Switch from "../Components/Switch";
import BackgroundMusic from "../Components/BackgroundMusic";

export default function Settings({ isOpen, setIsOpen, currentUser, setUser }) {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const [isMusicOn, setIsMusicOn] = useState(false); // 음악 상태 추가

  // 유저 정보 확인 및 자동 로그인 처리
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const response = await fetch("https://tree.seojun.xyz/api/user", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user) setUser(data.user);
        } else {
          console.log("자동 로그인 실패:", response.statusText);
        }
      } catch (error) {
        console.error("유저 정보 확인 오류:", error);
      }
    };

    checkUserLoggedIn();
  }, [setUser]);

  // 로그아웃 처리
  const handleLogout = () => {
    fetch("https://tree.seojun.xyz/api/logout", {
      method: "POST",
      credentials: "include",
    })
      .then(() => {
        setUser(null);
        setIsOpen(false);
        navigate("/");
      })
      .catch((error) => console.error("로그아웃 실패:", error));
  };

  const toggleSettings = () => {
    setIsOpen(!isOpen);
  };

  const handleLoginRedirect = () => {
    setIsOpen(false);
    navigate("/login");
  };

  // 패널 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  return (
    <>
      {isMusicOn && <BackgroundMusic />} {/* 음악 상태에 따라 컴포넌트 렌더링 */}
      <SettingsPanel isOpen={isOpen} ref={panelRef}>
        <CloseButton onClick={toggleSettings}>X</CloseButton>
        <Content>
          <h2>Settings</h2>
          <p>여기서 설정을 변경할 수 있습니다.</p>

          <Section>
            <h3>배경음악</h3>
            <Switch onChange={() => setIsMusicOn(!isMusicOn)} /> {/* 스위치 추가 */}
          </Section>

          {currentUser ? (
            <Button onClick={handleLogout}>로그아웃</Button>
          ) : (
            <Button onClick={handleLoginRedirect}>로그인</Button>
          )}
        </Content>
      </SettingsPanel>
    </>
  );
}

// 스타일 컴포넌트 설정은 기존과 동일
const SettingsPanel = styled.div`
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  position: fixed;
  height: 100%;
  width: 100%;
  max-width: 500px;
  background-color: #323742;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
  z-index: 99999999;

  // 데스크톱 - 오른쪽에서 왼쪽으로 슬라이드
  @media (min-width: 768px) {
    top: 0;
    right: 0;
    transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(100%)')};
    transition: transform 0.3s ease-in-out;
  }

  // 모바일 - 아래에서 위로 슬라이드
  @media (max-width: 767px) {
    bottom: 0;
    transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(100%)')};
    transition: transform 0.3s ease-in-out;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 19px;
  font-weight: bold;
  cursor: pointer;
  background: none;
  border: none;
  color: white;
  z-index: 99999999;
`;

const Content = styled.div`
  padding: 60px 20px;
  h2 {
    margin-bottom: 20px;
    color: white;
  }
  p {
    font-size: 16px;
    color: white;
  }
`;

const Section = styled.div`
  margin-bottom: 20px;
  h3 {
    color: white;
    margin-bottom: 10px;
  }
  p {
    color: #ccc;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #ff6347;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff4500;
  }
`;
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function Settings({ isOpen, setIsOpen, currentUser, setUser }) {
  const navigate = useNavigate();
  const panelRef = useRef(null); // 설정 패널의 DOM 참조 생성

  // 컴포넌트가 마운트될 때 유저 정보를 확인하여 자동 로그인을 처리
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const response = await fetch("https://tree.seojun.xyz:3001/user", {
          method: "GET",
          credentials: "include", // 쿠키 포함
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user); // 유저 정보가 있으면 상태에 저장
          }
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
    fetch("https://tree.seojun.xyz:3001/logout", {
      method: "POST",
      credentials: "include", // 쿠키 포함
    })
      .then(response => response.json())
      .then(() => {
        setUser(null);
        setIsOpen(false); // 로그아웃 후 설정 패널 닫기
        navigate("/");
      })
      .catch(error => console.error("로그아웃 실패:", error));
  };

  const toggleSettings = () => {
    setIsOpen(!isOpen); // 설정 패널 토글
  };

  const handleLoginRedirect = () => {
    setIsOpen(false); // 로그인 버튼 클릭 시 패널 닫기
    navigate("/login");
  };

  // 패널 외부를 클릭하면 설정 패널 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false); // 패널 외부 클릭 시 닫기
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
      <SettingsPanel isOpen={isOpen} ref={panelRef}>
        <CloseButton onClick={toggleSettings}>X</CloseButton>
        <Content>
          <h2>Settings</h2>
          <p>여기서 설정을 변경할 수 있습니다.</p>
          <Section>
            <h3>개인정보 처리방침</h3>
            <p>
              저희 서비스는 사용자의 개인정보를 소중히 다룹니다. 관련 법률을 준수하며,
              안전하게 데이터를 처리합니다.
            </p>
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
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 40%;
  max-width: 500px;
  background-color: #323742;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
  z-index: 999;
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s ease-in-out;
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
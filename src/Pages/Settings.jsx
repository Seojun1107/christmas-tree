import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function Settings({ isOpen, setIsOpen, currentUser, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    fetch('http://localhost:3001/logout', {
      method: 'POST',
      credentials: 'include',  // 쿠키를 포함
    })
      .then(response => response.json())
      .then(() => {
        setUser(null);
        navigate("/");
      })
      .catch(error => console.error("로그아웃 실패:", error));
  };

  const toggleSettings = () => {
    setIsOpen(!isOpen); // 상태를 변경하여 열고 닫기 토글
  };

  const handleLoginRedirect = () => {
    const currentPath = window.location.pathname; // 현재 페이지의 경로를 저장
    navigate("/", { state: { from: currentPath } }); // 로그인 후 리다이렉트 할 경로 저장
  };

  return (
    <>
      <SettingsPanel isOpen={isOpen}>
        <CloseButton onClick={toggleSettings}>X</CloseButton> {/* 닫기 버튼 */}
        <Content>
          <h2>Settings</h2>
          <p>여기서 설정을 변경할 수 있습니다.</p>

          {/* 개인정보 처리방침 섹션 */}
          <Section>
            <h3>개인정보 처리방침</h3>
            <p>
              저희 서비스는 사용자의 개인정보를 소중히 다룹니다. 관련 법률을 준수하며,
              안전한 데이터를 처리합니다.
            </p>
          </Section>

          {/* 로그인 상태에 따른 버튼 표시 */}
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

// 스타일 컴포넌트
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
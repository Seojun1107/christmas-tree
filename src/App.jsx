import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Snow from "./Components/Snow";
import Main from "./Pages/Main";
import KakaoRedirect from "./Components/KakaoRedirect";
import Signup from "./Pages/Signup";
import GlobalStyle from "./GlobalStyle";
import UserPage from "./Pages/UserPage";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Settings from "./Pages/Settings";


function App(props) {
    const [user, setUser] = useState(null); // 유저 상태 관리
    const [isOpen, setIsOpen] = useState(false);  // 메뉴가 열려 있는지 상태로 관리
    
    const toggleSettings = () => {
        setIsOpen(!isOpen);  // 상태를 변경하여 열고 닫기 토글
    };
    return (
        <BrowserRouter>
            <GlobalStyle user={user}/>
            {/* Snow 컴포넌트를 Routes 외부에 배치 */}
            <Snow />
            <FontAwesomeIcon onClick={toggleSettings} icon={faBars} size="xl" />
            <Settings isOpen={isOpen} setIsOpen={setIsOpen} setUser={setUser} currentUser={user}/>
            <Routes>
                <Route path="/" element={<Main user={user} setUser={setUser} />} />
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/auth" element={<KakaoRedirect setUser={setUser} />} />
                <Route path="/:userId" element={<UserPage currentUser={user}/>} />  {/* 동적 라우트 */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
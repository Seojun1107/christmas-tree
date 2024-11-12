import React, { useState, useEffect } from "react";
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
import BackgroundMusic from "./Components/BackgroundMusic";
import NotFound from "./Pages/NotFound";

function App(props) {
    const [user, setUser] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [stats, setStats] = useState({ userCount: 0, letterCount: 0 });

    const toggleSettings = () => {
        setIsOpen(!isOpen); 
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('https://tree.seojun.xyz/api/stats');
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("통계 정보 가져오기 실패:", error);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 60000); // 1분마다 갱신

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
    }, []);

    return (
        <BrowserRouter>
            <BackgroundMusic/>
            <GlobalStyle user={user}/>
            <Snow />
            <FontAwesomeIcon onClick={toggleSettings} icon={faBars} size="xl" />
            <Settings isOpen={isOpen} setIsOpen={setIsOpen} setUser={setUser} currentUser={user}/>
            <div style={{ 
                color: 'white', 
                position: 'absolute', 
                top: '25px', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', 
                textAlign: 'center' 
            }}>
                {stats.userCount}명이 가입했고, {stats.letterCount}개의 편지를 주고받았어요!
            </div>
            <Routes>
                <Route path="/" element={<Main user={user} setUser={setUser} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />} />
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/auth" element={<KakaoRedirect setUser={setUser} />} />
                <Route path="/:userId" element={<UserPage currentUser={user}/>} />
                <Route path="*" element={<NotFound />} />
                <Route path="/error" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
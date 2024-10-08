import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Snow from "./Components/Snow";
import Main from "./Pages/Main";
import KakaoRedirect from "./Components/KakaoRedirect";
import Signup from "./Pages/Signup";

function App(props) {
    const [user, setUser] = useState(null); // 유저 상태 관리
    return (
        <BrowserRouter>
            {/* Snow 컴포넌트를 Routes 외부에 배치 */}
            <Snow />
            <Routes>
                <Route path="/" element={<Main user={user} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/auth" element={<KakaoRedirect setUser={setUser}/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
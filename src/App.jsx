import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./Pages/Login";
import Snow from "./Components/Snow";


function App(props) {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Snow />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}



export default App
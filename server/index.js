const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors()); // CORS 설정

const KAKAO_CLIENT_ID = "f2e8bb4ca54082e203b7ecbcd19beff8";
const KAKAO_CLIENT_SECRET = "5JmokpIKH8fmixwHEtwwo7XALhj3dAvc"; // 카카오 개발자 콘솔에서 발급
const KAKAO_REDIRECT_URI = "http://localhost:3000/auth"; // 프론트엔드에서 지정한 URI와 동일

// 카카오 로그인 처리
app.get("/auth/kakao", async (req, res) => {
  const { code } = req.query;

  try {
    // 카카오 토큰 요청
    const tokenResponse = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: KAKAO_CLIENT_ID,
        client_secret: KAKAO_CLIENT_SECRET,
        redirect_uri: KAKAO_REDIRECT_URI,
        code: code,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = tokenResponse.data;

    // 유저 정보 요청
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const user = userResponse.data;
    console.log("카카오 유저 정보:", user);

    // 여기서 유저 정보를 DB에 저장하거나 세션, JWT 등을 생성하여 관리
    res.json({ message: "로그인 성공", user });
  } catch (error) {
    console.error("카카오 로그인 오류:", error);
    res.status(500).json({ message: "로그인 실패", error });
  }
});

// 서버 실행
app.listen(3001, () => {
  console.log("백엔드 서버가 http://localhost:3001 에서 실행 중입니다.");
});
require('dotenv').config(); // dotenv 모듈로 환경 변수 로드
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors({ origin: true, credentials: true })); // CORS 설정
app.use(cookieParser()); // 쿠키 파서 추가
app.use(express.json()); // JSON 요청 본문을 파싱하는 미들웨어 추가

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/christmas-tree', {
}).then(() => console.log('MongoDB 연결 성공'))
  .catch(err => console.log(err));

// 편지 스키마 정의
const letterSchema = new mongoose.Schema({
  sentAt: { type: Date, default: Date.now, index: true},  // 편지 보낸 시간 (기본값: 현재 시간)
  senderId: { type: String, required: true },  // 편지 보낸 유저의 아이디
  nickname: { type: String, required: true },  // 유저의 닉네임
  postValue: { type: String, required: true },  // 편지 내용
  ip: { type: String, required: true },  // 유저의 IP 주소
});

// 유저 스키마 정의에 편지 객체 추가
const userSchema = new mongoose.Schema({
  UserId: { type: String, required: true },
  username: String,
  password: { type: String },
  kakaoAccount: Object,  // 카카오 유저 정보
  letters: [letterSchema],  // 유저가 보낸 편지들
});


const User = mongoose.model("User", userSchema);

const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;
const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// JWT 토큰 생성
const generateToken = (user) => {
  return jwt.sign({ UserId: user.UserId }, JWT_SECRET, { expiresIn: '1h' });
};

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

    const kakaoUser = userResponse.data;
    console.log("카카오 유저 정보:", kakaoUser);

    // DB에 카카오 유저가 이미 있는지 확인
    let user = await User.findOne({ UserId: kakaoUser.id });

    if (!user) {
      // 유저가 없으면 새로 생성
      user = new User({
        UserId: kakaoUser.id,
        username: kakaoUser.kakao_account.profile.nickname,
        kakaoAccount: kakaoUser.kakao_account,
      });
      await user.save();
      console.log("새 유저 저장:", user);
    } else {
      console.log("기존 유저 로그인:", user);
    }

    // JWT 토큰 발급 및 쿠키에 저장
    const token = generateToken(user);
    res.cookie('auth_token', token, { httpOnly: true, maxAge: 3600000 });  // 1시간 유효

    res.json({ message: "로그인 성공", user });

  } catch (error) {
    console.error("카카오 로그인 오류:", error);
    res.status(500).json({ message: "로그인 실패", error });
  }
});
// 유저 정보 반환 엔드포인트
// 유저 정보 반환 엔드포인트
app.get("/user", (req, res) => {
  const token = req.cookies.auth_token; // 쿠키에서 JWT 토큰 가져오기

  if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
          return res.status(403).json({ message: "Invalid token" });
      }

      try {
          const user = await User.findOne({ UserId: decoded.UserId }); // DB에서 유저 정보 조회
          if (!user) {
              return res.status(404).json({ message: "User not found" });
          }
          res.json({ user }); // 유저 정보 반환
      } catch (error) {
          console.error("유저 정보 조회 오류:", error);
          res.status(500).json({ message: "Server error" });
      }
  });
});


// 아이디 중복 확인 엔드포인트
app.get("/check-id", async (req, res) => {
  const { id } = req.query;

  try {
    // DB에서 아이디 확인
    const existingUser = await User.findOne({ UserId: id });

    if (existingUser) {
      return res.json({ message: "이미 사용 중인 아이디입니다.", available: false });
    }
    res.json({ message: "사용 가능한 아이디입니다.", available: true });
  } catch (error) {
    console.error("아이디 중복 확인 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 일반 회원가입 처리
app.post("/signup", async (req, res) => {
  const { id, username, password } = req.body;

  try {
    // 중복된 아이디가 있는지 확인
    const existingUser = await User.findOne({ UserId: id });
    if (existingUser) {
      return res.status(400).json({ message: "이미 사용 중인 아이디입니다." });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10); // 10은 saltRounds

    // 새로운 유저 생성
    const newUser = new User({
      UserId: id,
      username: username,
      password: hashedPassword, // 해싱된 비밀번호 저장
      kakaoAccount: null, // 일반 회원가입이므로 kakaoAccount는 null
    });

    await newUser.save();
    console.log("새 일반 유저 저장:", newUser);

    res.json({ message: "회원가입 성공", user: newUser });
  } catch (error) {
    console.error("회원가입 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 로그인 처리
app.post("/login", async (req, res) => {
  const { id, password } = req.body;

  try {
    const user = await User.findOne({ UserId: id });

    if (!user) {
      return res.status(401).json({ message: "유효하지 않은 아이디 또는 비밀번호" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "유효하지 않은 아이디 또는 비밀번호" });
    }

    const token = generateToken(user); // JWT 토큰 발급
    res.cookie('auth_token', token, { httpOnly: true, maxAge: 3600000 }); // 쿠키에 저장
    res.json({ message: "로그인 성공", user });
  } catch (error) {
    console.error("로그인 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 백엔드 라우트 예시 (Express.js 기반)
app.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ UserId: userId }); // MongoDB에서 해당 유저아이디로 조회
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user); // 유저 정보를 JSON 형태로 응답
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// POST /letters 엔드포인트: 새 편지 작성 및 저장
app.post("/letters", async (req, res) => {
  const { nickname, content, timestamp,receiveUser } = req.body;

  try {
    // 요청 IP 주소 가져오기
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // 해당 닉네임의 유저 찾기
    const user = await User.findOne({ username: receiveUser });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 새 편지 객체 생성
    const newLetter = {
      sentAt: timestamp,
      senderId: user.UserId,
      nickname,
      postValue: content,
      ip: ipAddress,
    };

    // 유저의 letters 필드에 새 편지 추가
    user.letters.push(newLetter);
    await user.save();

    res.status(200).json({ message: "편지가 성공적으로 저장되었습니다!" });
  } catch (error) {
    console.error("편지 저장 오류:", error);
    res.status(500).json({ message: "편지 저장에 실패했습니다.", error });
  }
});
// 로그아웃 처리
app.post("/logout", (req, res) => {
  res.clearCookie('auth_token');
  res.json({ message: "로그아웃 성공" });
});

// 서버 실행
app.listen(3001, () => {
  console.log("서버가 http://localhost:3001 에서 실행 중입니다.");
});
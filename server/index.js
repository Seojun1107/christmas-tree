require('dotenv').config(); // dotenv 모듈로 환경 변수 로드
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const { type } = require('@testing-library/user-event/dist/type');

const app = express();
app.use(cors({
  origin: 'https://tree.seojun.xyz',  // 프론트엔드 도메인
  credentials: true,  // 쿠키를 포함하기 위한 설정
}));
app.use(cookieParser()); // 쿠키 파서 추가
app.use(express.json()); // JSON 요청 본문을 파싱하는 미들웨어 추가

// 로그 파일 경로 설정
const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const getLogFileName = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return path.join(logDirectory, `${year}${month}${day}.txt`);
};

const logToFile = (message, ip) => {
  const logFileName = getLogFileName();
  fs.appendFileSync(logFileName, `${new Date().toISOString()} - ${ip} - ${message}\n`);
};

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/christmas-tree', {
}).then(() => logToFile('MongoDB 연결 성공', 'SYSTEM'))
  .catch(err => logToFile(err, 'SYSTEM'));

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
  email: {type: String},
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
app.get("/api/auth/kakao", async (req, res) => {
  const { code } = req.query;
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

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
    logToFile(`카카오 유저 정보: ${JSON.stringify(kakaoUser)}`, ip);

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
      logToFile(`새 유저 저장: ${JSON.stringify(user)}`, ip);
    } else {
      logToFile(`기존 유저 로그인: ${JSON.stringify(user)}`, ip);
    }

    // JWT 토큰 발급 및 쿠키에 저장
    const token = generateToken(user);
    res.cookie('auth_token', token, { httpOnly: true, maxAge: 3600000 });  // 1시간 유효

    res.json({ message: "로그인 성공", user });

  } catch (error) {
    logToFile(`카카오 로그인 오류: ${error}`, ip);
    res.status(500).json({ message: "로그인 실패", error });
  }
});
// 유저 정보 반환 엔드포인트
app.get("/api/user", (req, res) => {
  const token = req.cookies.auth_token; // 쿠키에서 JWT 토큰 가져오기
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (!token) {
      logToFile("Unauthorized access attempt", ip);
      return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
          logToFile("Invalid token", ip);
          return res.status(403).json({ message: "Invalid token" });
      }

      try {
          const user = await User.findOne({ UserId: decoded.UserId }); // DB에서 유저 정보 조회
          if (!user) {
              logToFile("User not found", ip);
              return res.status(404).json({ message: "User not found" });
          }
          res.json({ user }); // 유저 정보 반환
      } catch (error) {
          logToFile(`유저 정보 조회 오류: ${error}`, ip);
          res.status(500).json({ message: "Server error" });
      }
  });
});


// 아이디 중복 확인 엔드포인트
app.get("/api/check-id", async (req, res) => {
  const { id } = req.query;
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    // DB에서 아이디 확인
    const existingUser = await User.findOne({ UserId: id });

    if (existingUser) {
      logToFile(`아이디 중복 확인: 이미 사용 중인 아이디입니다. (${id})`, ip);
      return res.json({ message: "이미 사용 중인 아이디입니다.", available: false });
    }
    logToFile(`아이디 중복 확인: 사용 가능한 아이디입니다. (${id})`, ip);
    res.json({ message: "사용 가능한 아이디입니다.", available: true });
  } catch (error) {
    logToFile(`아이디 중복 확인 오류: ${error}`, ip);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 일반 회원가입 처리
app.post("/api/signup", async (req, res) => {
  const { id, username, password, email } = req.body;
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    // 중복된 아이디가 있는지 확인
    const existingUser = await User.findOne({ UserId: id });
    if (existingUser) {
      logToFile(`회원가입 실패: 이미 사용 중인 아이디입니다. (${id})`, ip);
      return res.status(400).json({ message: "이미 사용 중인 아이디입니다." });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10); // 10은 saltRounds

    // 새로운 유저 생성
    const newUser = new User({
      UserId: id,
      email: email,
      username: username,
      password: hashedPassword, // 해싱된 비밀번호 저장
      kakaoAccount: null, // 일반 회원가입이므로 kakaoAccount는 null
    });

    await newUser.save();
    logToFile(`새 일반 유저 저장: ${JSON.stringify(newUser)}`, ip);

    res.json({ message: "회원가입 성공", user: newUser });
  } catch (error) {
    logToFile(`회원가입 오류: ${error}`, ip);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 로그인 처리
app.post("/api/login", async (req, res) => {
  const { id, password } = req.body;
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    const user = await User.findOne({ UserId: id });

    if (!user) {
      logToFile(`로그인 실패: 유효하지 않은 아이디 또는 비밀번호 (${id})`, ip);
      return res.status(401).json({ message: "유효하지 않은 아이디 또는 비밀번호" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      logToFile(`로그인 실패: 유효하지 않은 아이디 또는 비밀번호 (${id})`, ip);
      return res.status(401).json({ message: "유효하지 않은 아이디 또는 비밀번호" });
    }

    const token = generateToken(user); // JWT 토큰 발급
    res.cookie('auth_token', token, { httpOnly: true, maxAge: 3600000 }); // 쿠키에 저장
    logToFile(`로그인 성공: ${JSON.stringify(user)}`, ip);
    res.json({ message: "로그인 성공", user });
  } catch (error) {
    logToFile(`로그인 오류: ${error}`, ip);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 백엔드 라우트 예시 (Express.js 기반)
app.get('/api/user/:id', async (req, res) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  try {
    const userId = req.params.id;
    const user = await User.findOne({ UserId: userId }); // MongoDB에서 해당 유저아이디로 조회
    if (!user) {
      logToFile(`유저 조회 실패: User not found (${userId})`, ip);
      return res.status(404).json({ message: "User not found" });
    }
    logToFile(`유저 조회 성공: ${JSON.stringify(user)}`, ip);
    res.json(user); // 유저 정보를 JSON 형태로 응답
  } catch (error) {
    logToFile(`유저 정보 조회 오류: ${error}`, ip);
    res.status(500).json({ message: "Server error" });
  }
});


// POST /letters 엔드포인트: 새 편지 작성 및 저장
app.post("/api/letters", async (req, res) => {
  const { nickname, content, timestamp, receiveUser } = req.body;
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    // 요청 IP 주소 가져오기
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // 해당 닉네임의 유저 찾기
    const user = await User.findOne({ username: receiveUser });

    if (!user) {
      logToFile(`편지 저장 실패: User not found (${receiveUser})`, ip);
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

    logToFile(`편지 저장 성공: ${JSON.stringify(newLetter)}`, ip);
    res.status(200).json({ message: "편지가 성공적으로 저장되었습니다!" });
  } catch (error) {
    logToFile(`편지 저장 오류: ${error}`, ip);
    res.status(500).json({ message: "편지 저장에 실패했습니다.", error });
  }
});
// 로그아웃 처리
app.post("/api/logout", (req, res) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  res.clearCookie('auth_token');
  logToFile("로그아웃 성공", ip);
  res.json({ message: "로그아웃 성공" });
});

// 사용자 수와 편지 수 반환 엔드포인트
app.get("/api/stats", async (req, res) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  try {
    const userCount = await User.countDocuments(); // 사용자 수
    const letterCount = await User.aggregate([
      { $unwind: "$letters" },
      { $count: "totalLetters" }
    ]);

    logToFile(`통계 조회 성공: 사용자 수 - ${userCount}, 편지 수 - ${letterCount[0] ? letterCount[0].totalLetters : 0}`, ip);
    res.json({
      userCount,
      letterCount: letterCount[0] ? letterCount[0].totalLetters : 0
    });
  } catch (error) {
    logToFile(`통계 조회 오류: ${error}`, ip);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 서버 실행
app.listen(3001, () => {
  logToFile("서버가 http://localhost:3001 에서 실행 중입니다.", 'SYSTEM');
});
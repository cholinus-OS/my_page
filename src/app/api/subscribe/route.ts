import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const subscribersFilePath = path.join(process.cwd(), "src/data/subscribers.json");

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "유효한 이메일 주소를 입력해주세요." }, { status: 400 });
    }

    // 파일이 없으면 생성
    if (!fs.existsSync(subscribersFilePath)) {
      const dir = path.dirname(subscribersFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(subscribersFilePath, "[]", "utf8");
    }

    const fileData = fs.readFileSync(subscribersFilePath, "utf8");
    let subscribers = [];
    
    try {
      subscribers = JSON.parse(fileData);
    } catch (e) {
      subscribers = [];
    }

    // 중복 체크
    if (subscribers.some((sub: any) => sub.email === email)) {
      return NextResponse.json({ error: "이미 구독 중인 이메일입니다." }, { status: 400 });
    }

    subscribers.push({
      email,
      subscribedAt: new Date().toISOString(),
    });

    fs.writeFileSync(subscribersFilePath, JSON.stringify(subscribers, null, 2), "utf8");

    return NextResponse.json({ success: true, message: "구독 완료!" }, { status: 200 });
  } catch (error) {
    console.error("Newsletter Subscription Error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

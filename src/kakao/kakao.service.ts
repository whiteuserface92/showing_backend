import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config(); // .env 파일을 로드하여 환경 변수 사용

@Injectable()
export class KakaoService {
  private readonly apiUrl =
    'https://kapi.kakao.com/v1/api/talk/friends/message/default/send';
  private readonly restApiKey = process.env.KAKAO_REST_API_KEY; // 환경변수에 카카오 REST API Key 저장

  constructor() {}

  async sendVerificationCode(phoneNumber: string, verificationCode: string) {
    const headers = {
      Authorization: `Bearer ${process.env.KAKAO_ACCESS_TOKEN}`, // 발급받은 액세스 토큰
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const templateArgs = {
      phoneNumber: phoneNumber,
      verificationCode: verificationCode,
    };

    const data = {
      template_object: {
        object_type: 'text',
        text: `인증번호는 ${verificationCode} 입니다.`,
        link: {
          web_url: 'http://localhost:5173',
        },
        button_title: '인증 완료',
      },
    };

    try {
      const response = await axios.post(this.apiUrl, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Error sending KakaoTalk message:', error);
      throw new Error('Failed to send KakaoTalk message');
    }
  }
}

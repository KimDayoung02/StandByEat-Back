import React from 'react';
import axios from 'axios';

const KakaoLogin = () => {
  const REST_API_KEY = '985e581069114803f3e8bfbdf03bed3c';
  const REDIRECT_URL = 'http://localhost:3000';
  const KAKAO_AUTH_URL =
    'https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=985e581069114803f3e8bfbdf03bed3c&redirect_uri=$http://localhost:3000';

  const kakaologin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };
  return (
    <React.Fragment>
      <button onClick={kakaologin}>KakaoLogin</button>
    </React.Fragment>
  );
};

export default KakaoLogin;

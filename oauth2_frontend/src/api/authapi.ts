import axios, { AxiosError } from "axios";
import type { SignupRequest, LoginRequest, AuthResponse } from "../types/auth";

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type' : 'application/json',
  },
});

// 요청 interceptor - 특정 요청들이 들어왔을때 사전에 가로챈 다음 그 작업이 수행될수 있도록 함.
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('jwt_token');
    if(token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 응답 interecptor - 401 시 자동 로그아웃 구현예정
api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if(error.response?.status === 401) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_info');
      window.location.href='/login';
    }
    return Promise.reject(error);
  }
);

// 함수 정의

// 일반 회원가입
export const signupApi = async (data: SignupRequest) : Promise<AuthResponse> => {
  // axios 객체를 위에서 구성했기 때문에 axios.post가 아니라 api.post()
  const response = await api.post<AuthResponse>('/api/auth/signup',data);
  return response.data;
}
// 일반 로그인
export const loginApi = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/login',data);
  return response.data;
}

// 구글 로그인 redirecting 적용하기 때문에 일반 username / password 방식과 다르다,
export const googleLogin = () : void => {
  window.location.href = 'http://localhost:8080/oauth2/authorization/google';
};

export default api;

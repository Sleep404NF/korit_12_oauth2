import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { Container, Box, TextField, Button, Typography, Alert, Divider, CircularProgress, Paper } from "@mui/material"
import GoogleIcon from '@mui/icons-material/Google';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { loginApi, googleLogin } from "../api/authapi";
import { useAuth } from "../store/authStore";
import type { LoginFormErrors, LoginRequest } from "../types/auth";
import type { ChangeEvent, FormEvent } from "react";

export default function LoginPages() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [ form, setForm ] = useState<LoginRequest>({
    email: '',
    password: '',
  });

  const [ errors, setErrors ] = useState<LoginFormErrors>({});
  const validate = () : boolean => {
    const newErrors: LoginFormErrors = {};

    if(!form.email.trim()) newErrors.email = '이메일을 입력해주세요.';
    if(!form.password) newErrors.password = '비밀번호를 입력해주세요.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const loginMutation = useMutation({
    mutationFn : loginApi,
    onSuccess : data => {
      login(data.token, {
        email: data.email,
        name: data.name,
        role: data.role
      });
      navigate('/')
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>):void => {
    e.preventDefault();
    if(validate()) {
      loginMutation.mutate(form);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) : void => {
    const { name, value } = e.target;
    setForm(prev => ({...prev, [name]: value}));
    if (errors[name as keyof LoginFormErrors]) {
      setErrors(prev => ({...prev, [name]: ''}));
    }
  }

  return(
    <Container maxWidth="xs">
      <Box sx={{mt: 8, display:'flex', flexDirection: 'column', alignItems:'center'}}>
        <Paper elevation={3} sx={{p: 4, width:'100%'}}>
          <Box sx={{display: 'flex', flexDirection:'column', alignItems:'center', mb: 3}}>
            <LockOpenIcon color="primary" sx={{fontSize: 48, mb: 1}} />
            <Typography>로그인</Typography>
          </Box>
          {loginMutation.isError && (
            <Alert severity="error" sx={{ mb:2 }}>
              {loginMutation.error instanceof Error ? loginMutation.error.message : '이메일 혹은 비밀번호가 틀렸습니다.'}
            </Alert>
          )}

          <Box component='form' onSubmit={handleSubmit}>
            <TextField 
              fullWidth label='이메일' name='email' value={form.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} margin='normal' type='email'
            />
            <TextField 
              fullWidth label='비밀번호' name='password' value={form.password} onChange={handleChange} error={!!errors.password} helperText={errors.password} margin='normal' type='password'
            />
            <Button
              type='submit' fullWidth variant="contained" size="large" sx={{ mt : 2}} disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? <CircularProgress size={24} color="inherit"/> : '로그인'}
            </Button>
          </Box>

          <Divider sx={{my: 3}}>
            <Typography variant="body2" color='text.secondary'>또는</Typography>
          </Divider>

          <Button
            fullWidth variant="contained" size="large"
            startIcon={<GoogleIcon />}
            onClick={googleLogin}
            sx={{borderColor: '#4285f4', color:'#4285f4'}}
          >
            Google로 계속하기
          </Button>

          <Box sx={{mt: 2, textAlign: 'center'}}>
            <Typography variant="body2" color='text.secondary'>
              계정이 없으신가요?{' '}
              <Link to='/signup' style={{ color: '#4285f4'}}>회원가입</Link>
            </Typography>
          </Box>

        </Paper>
      </Box>
    </Container>
  )
}
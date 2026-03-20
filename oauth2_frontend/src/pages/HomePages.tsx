import { Container, Box, Typography, Button, Paper, Chip, Avatar } from "@mui/material"
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function HomePages() {
  // 정의한 useAuth() 를 사용
  const { user, logout } = useAuth(); // 전역관리를 ContextAPI를 통해서 구현
  const navigate = useNavigate();

  const handleLogout = () : void => {
    logout();
    navigate('/login');
  }

  return(
    <Container maxWidth='sm'>
      <Box sx={{mt: 8}}>
        <Paper elevation={3} sx={{p:4, textAlign: 'center'}}>
          <Avatar sx={{width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
            <PersonIcon fontSize='large' />
          </Avatar>
          {/* user?.name : user가  UserInfo 자료형을 따르는 객체거나 null이라는것인데, null이면 name이 없다. 그때 오류발생 없이 undefined를 리턴해준다.*/}
          <Typography variant='h5' fontWeight='bold' gutterBottom>환영합니다. {user?.name}님!</Typography>

          <Box sx={{textAlign: 'left', bgcolor: 'gray.50', p:2, borderRadius: 1, mb: 3}}>
            <Typography variant="body2" color='text.secondary'>이메일</Typography>
            <Typography variant="body1" fontWeight='medium'>{user?.email}</Typography>
            <Typography variant="body2" color='text.secondary'>권한</Typography>
            <Typography variant="body1" fontWeight='medium'>{user?.role}</Typography>
          </Box>

          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon/>}
            onClick={handleLogout}
            fullWidth
          >
            로그아웃
          </Button>
        </Paper>
      </Box>
    </Container>
  )
}
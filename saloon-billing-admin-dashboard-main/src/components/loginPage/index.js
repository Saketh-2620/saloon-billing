import * as React from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { userActions } from '../../store/user';

import { RENDER_BASE_URL } from '../../constants';

const defaultTheme = createTheme();

export default function LoginPage() {

  const dispatch = useDispatch();

  const [isLoginLoading, setIsLoginLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('username');
    const password = data.get('password');
    setIsLoginLoading(true);
    try {
        const loginResponse = await axios.post(RENDER_BASE_URL + 'adminLogin', {
            username: username,
            password: password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const recievedAccessToken = loginResponse.data.accessToken;
        console.log('Access Token:', recievedAccessToken);
        //set access token
        dispatch(userActions.setAccessToken(recievedAccessToken)); 
        
        setIsLoginLoading(false);

    }
    catch (error) {
        setLoginError(error);
        setIsLoginLoading(false);
        console.log('Login Error:', JSON.stringify(error));
        alert('Login Error:', JSON.stringify(error));
    }
  }; 

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            {isLoginLoading && <CircularProgress />}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
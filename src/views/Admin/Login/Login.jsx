import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { api_url } from '../../../env';
import { Loader } from '../../../components';
import { checkSession } from '../functions';

export function Login({ }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const Nav = useNavigate()
    const defaultTheme = createTheme({
        palette: {
            mode: "dark"
        }
    });

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        sessionStorage.getItem("token") && Nav("/admin")
    }, [])

    function submit(data) {
        setLoading(true)

        axios.post(
            `${api_url}/login`,
            data
        ).then(res => {
            sessionStorage.setItem("name", res.data.name)
            sessionStorage.setItem("email", res.data.email)
            sessionStorage.setItem("token", res.data.token)

            Nav("/admin")
        }).catch(err => {
            console.log(err);
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Loader loading={loading} />
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        paddingTop: 8,
                        marginTop: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Log in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(submit)} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            {...register("email")}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            {...register("password")}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2 }}
                        >
                            Log In
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
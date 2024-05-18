import React, { useEffect, useRef, useState } from "react";
import { api_url } from "../../env";
import axios from "axios";
import { redirect, useNavigate } from "react-router-dom";
import { Loader } from "../../components";
import "./Admin.css";
import { checkSession, logout, processGeojson } from "./functions";
import { ThemeProvider } from "@emotion/react";
import { Alert, AlertTitle, Box, Button, Container, CssBaseline, Input, TextField, Typography, createTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import UploadFileIcon from '@mui/icons-material/UploadFile';

const theme = createTheme({
    palette: {
        mode: "dark"
    }
})

export function Admin({}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const [loading, setLoading] = useState(false)
    const [isLogged, setIsLogged] = useState(false)
    const [filename, setFilename] = useState(null)
    const [result, setResult] = useState({
        status: null,
        message: null,
    })
    const Nav = useNavigate()

    useEffect(() => {
        checkSession(setLoading, setIsLogged, Nav)
    }, [])

    function alert(result, setResult) {
        switch(result.status) {
            case "success":
                return <Alert variant="outlined" severity="success" onClose={() => setResult(null)}>
                    <AlertTitle>Success</AlertTitle>
                    {result.message}
                </Alert>
            case "failure":
                return <Alert variant="outlined" severity="error" onClose={() => setResult(null)}>
                    <AlertTitle>Error</AlertTitle>
                    The GeoJSON could not be uploaded.
                </Alert>
            default:
                return null
        }
    }

    return <ThemeProvider theme={theme}>
        <Loader loading={loading} />
        <Container component="main" fixed>
            <CssBaseline />
            <Box
                sx={{
                    paddingTop: 2,
                    marginTop: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Admin
                    <Button
                        variant="text"
                        sx={{
                            ml: 1,
                            textTransform: "none",
                        }}
                        onClick={() => logout(setLoading, Nav)}
                    >
                        Log Out
                    </Button>
                </Typography>
                {alert(result, setResult)}
                <Box component="form" onSubmit={handleSubmit(data => processGeojson(data, setLoading, setResult))} sx={{
                    maxWidth: "60%",
                }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="GeoJSON name"
                        name="name"
                        {...register("name")}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="id"
                        label="GeoJSON id"
                        name="id"
                        {...register("id")}
                    />
                    <Button
                        component="label"
                        variant="outlined"
                        fullWidth
                        startIcon={<UploadFileIcon/>}
                        sx={{
                            mt: 2,
                            mb: 1,
                            textTransform: "none",
                            color: filename === null ? "rgba(255, 255, 255, 0.7)" : "white",
                            borderColor: "rgba(255, 255, 255, 0.23)",
                            padding: 1.5,
                            ":hover": {
                                background: "unset",
                                borderColor: "unset"
                            }
                        }}
                    >
                        {filename !== null ? `(${filename})` : "GeoJSON file *"}
                        <input type="file" hidden {...register("file", { required: true, onChange: (e) => {setFilename(e.target.files[0].name); return e.target.files[0]} })}/>
                    </Button>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, textTransform: "none" }}
                    >
                        Process GeoJSON
                    </Button>
                </Box>
            </Box>
        </Container>
    </ThemeProvider>
}
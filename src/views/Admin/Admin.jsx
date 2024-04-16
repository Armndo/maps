import React, { useEffect, useState } from "react";
import { api_url } from "../../env";
import axios from "axios";
import { redirect, useNavigate } from "react-router-dom";
import { Loader } from "../../components";
import "./Admin.css";
import { checkSession, logout } from "./functions";

export function Admin({}) {

    const [loading, setLoading] = useState(false)
    const [isLogged, setIsLogged] = useState(false)
    const Nav = useNavigate()

    useEffect(() => {
        checkSession(setLoading, setIsLogged, Nav)
    }, [])

    return <div className="admin">
        <Loader loading={loading} /> 
        {isLogged && <div>
            <h3>admin</h3>
            <div>
                <input type="file" onChange={e => {
                    const formData = new FormData()
                    formData.append("name", "test");
                    formData.append("file", e.target.files[0]);

                    axios.post(
                        `${api_url}/process`,
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                            }
                        }
                    ).then(res => {
                        console.log(res);
                    }).catch(err => {
                        console.log(err);
                    })
                }}/>
                <button onClick={() => logout(setLoading, Nav)}>log out</button>
            </div>
        </div>}
    </div>
}
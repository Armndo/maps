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
                <button onClick={() => logout(setLoading, Nav)}>log out</button>
            </div>
        </div>}
    </div>
}
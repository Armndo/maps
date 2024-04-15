import axios from "axios";
import { api_url } from "../../env";

function checkSession(setLoading, setIsLogged, Nav) {
    setLoading(true)

    axios.get(
        `${api_url}/check-session`,
        {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            }
        }
    ).then(res => {
        setIsLogged(true)
    }).catch(err => {            
        if(err && err.response) {
            switch(err.response.status) {
                case 401:
                    sessionStorage.clear()
                    Nav("login")
                    break;
                default:
                    alert("server error")
                    break;
            }

        }
    }).finally(() => {
        setLoading(false)
    })
}

function logout(setLoading, Nav) {
    setLoading(true)

    axios.post(
        `${api_url}/logout`,
        {},
        {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            }
        }
    ).then(res => {
        sessionStorage.clear()

        Nav("login")
    }).catch(err => {
        console.log(err);
        
        if(err && err.response) {
            switch(err.response.status) {
                case 401:
                    sessionStorage.clear()
                    Nav("login")
                    break;
                default:
                    alert("server error")
                    break;
            }

        }
    }).finally(() => {
        setLoading(false)
    })
}

export {
    checkSession,
    logout,
}
import axios from "axios";
import { getContext } from "svelte";

// place files you want to import through the `$lib` alias in this folder.
export function getUser() {
    const token = localStorage.getItem("token");

    if (!token) {
        return "Not signed in"
    } else {
        return axios.get('http://localhost:8080/getUser', {
            headers: { 
                Authorization: `Bearer ${token}`,
            }
        }).then(res => {
            return res.data;
        });
    }
}

export const logout = (token) => {
    axios.get('http://localhost:8080/logout', { headers: { Authorization: 'Bearer ' + token }}).then(res => {
        localStorage.removeItem("token");
        window.location.reload();
    });
}
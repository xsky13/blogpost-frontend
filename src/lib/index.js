import axios from "axios";
import { getContext } from "svelte";
import { PUBLIC_REQUEST_URL } from "$env/static/public"

// place files you want to import through the `$lib` alias in this folder.
export function getUser() {
    const token = localStorage.getItem("token");

    if (!token) {
        return "Not signed in"
    } else {
        return axios.get(`${PUBLIC_REQUEST_URL}/getUser`, {
            headers: { 
                Authorization: `Bearer ${token}`,
            }
        }).then(res => {
            return res.data;
        });
    }
}

export const logout = (token) => {
    axios.get(`${PUBLIC_REQUEST_URL}/logout`, { headers: { Authorization: 'Bearer ' + token }}).then(res => {
        localStorage.removeItem("token");
        window.location.reload();
    });
}
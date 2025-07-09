import axios from "axios"

export async function login(email, password) {
    const res = await axios.post("http://localhost:8080/api/v1/auth/login", {
        email,
        password,
    })

    const token = res.data.token;
    alert("Login successful");
    localStorage.setItem("token", token);
}

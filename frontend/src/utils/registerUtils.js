import axios from "axios"

export async function register(username, password, age) {
    const res = await axios.post("http://localhost:8080/api/v1/auth/register", {
        username,
        password,
        age
    })

    console.log(res.data)
}

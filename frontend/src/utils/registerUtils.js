import axios from "axios"

export async function register(username, password, age) {
    try {
        const res = await axios.post("http://localhost:8080/api/v1/auth/register", {
            username,
            password,
            age
        });

        if (res.status === 200) {
            alert("Register successful");
        } else {
            alert("Error: " + res.data);
        }
    } catch (err) {
        alert("Error: " + (err.response?.data || err.message));
    }
}

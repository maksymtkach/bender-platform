import { useGoogleLogin } from "@react-oauth/google"

const googleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
        const res = await fetch('http://localhost:8080/api/v1/auth/google', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ token: tokenResponse.credential })
        });
        const data = await res.json();
        localStorage.setItem('jwt', data.token);
    },
    flow: 'implicit',
});

export default googleLogin;
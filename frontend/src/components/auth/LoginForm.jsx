import React from 'react';
import {useState} from 'react';

//TODO: add Redux state management for users
//TODO: add JWT tokenization
//TODO: create Login Form
function LoginForm() {
    const [name, setName] = useState('');

    const changeName = (event) => {
        setName(event.target.value);
    }

    return (
        <>
            <label>Your name is {name}
                <br />
                <input name="name" type="text" value={name} onChange={changeName} />
            </label>
        </>
    );
}


export default LoginForm;
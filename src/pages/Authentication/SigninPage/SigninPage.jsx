import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingIndicator from "../../../components/LoadingIndicator/LoadingIndicator";
import {supabase} from "../../../supabase/supabaseClient";
import "./SigninPage.css";

function SignninPage() {
  const [username, setUsername]= useState('');
  const [password, setPassword]= useState('');
  const [loading, setLoading]= useState('');
  // const [error, setError]= useState(null);
  const navigate= useNavigate();
  const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // console.log(username,password);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: username,
                password: password,
            });
            if (error) {
                console.error("Error on signing in :", error.message);
                alert("Error on signing in :" + error.message);
            } else {
                navigate('/', {replace: true});
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };
  return (
    <div className='login'>
      <form onSubmit={handleSubmit} className="form-container">
        <h1>Login</h1>
        <input
          className="form-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          className="form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

        {loading ? <LoadingIndicator /> :
          <button className="form-button" type="submit">
            Login
          </button>
        }
        <div>
          <p>Not registered? <span style={{ cursor: 'pointer' }} onClick={() => navigate('/register')}>Signup please</span></p>
        </div>
        <div>
          <p>Signin as <span style={{ cursor: 'pointer' }} onClick={() => navigate('/guest')}>Guest</span></p>
        </div>
      </form>

    </div>
  );
}

export default SignninPage

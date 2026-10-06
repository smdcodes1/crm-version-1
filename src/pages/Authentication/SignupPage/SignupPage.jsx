import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabase/supabaseClient';
import LoadingIndicator from '../../../components/LoadingIndicator/LoadingIndicator';
import "./SignupPage.css";
function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log(username,password);
    try {
      const { error } = await supabase.auth.signUp({
        email: username,
        password: password,
        // options: {
        //     data: {
        //         username: username.split('@')[0], // or a dedicated username field
        //     },
        // },
      });
      if (error) {
        console.error("Error on signing up :", error.message);
        alert("Error on signing up :" + error.message);
      } else {
        navigate('/login');
      }

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='register'>
      <form onSubmit={handleSubmit} className="form-container">
        <h1>Register</h1>
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
            Sign up
          </button>
        }
        <div>
          <p>Have an account? <span style={{ cursor: 'pointer' }} onClick={() => navigate('/login')}>Sign in please</span></p>
        </div>
      </form>
    </div>
  );
}

export default SignupPage

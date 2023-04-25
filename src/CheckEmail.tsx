import { Navigate, useNavigate } from 'react-router-dom';
import { Link } from '@mui/material';
import React, { useEffect } from 'react';
import '../Register.scss';
import { UoMBlue } from 'src/app/color';

function CheckEmail() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  useEffect(() => {
    if (localStorage.length === 0) {
      navigate('/');
    }
    setEmail(localStorage.getItem('email') || '');
  });
  return (
    <div className="background" style={{ backgroundColor: UoMBlue, height: '100vh' }}>
      <div className="register-form" style={{ height: '100vh' }}>
        <div className="form" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div className="logobox">
            <img className="logo" src="https://d2glwx35mhbfwf.cloudfront.net/v13.4.18/logo-with-padding.svg" alt="" />
          </div>
          <h1 className="title" style={{ color: UoMBlue }}>Check your Email</h1>
          <p>
            An email with verification instructions was sent to
          </p>
          <br />
          <p>
            {email}
          </p>
          <br />
          <p>
            If you don't see the email in your inbox, remember to try your spam folder too.
            Once you verify your email address, you can get started with your contact email and password.
          </p>
          <br />
          <Link href="/" variant="body2">
            Already have an account? Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CheckEmail;

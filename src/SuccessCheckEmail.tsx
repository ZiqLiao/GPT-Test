import { useNavigate } from 'react-router-dom';
import { Link } from '@mui/material';
import React from 'react';
import '../Register.scss';
import { UoMBlue } from 'src/app/color';

function SuccessCheckEmail() {
  localStorage.clear();
  return (
    <div className="background" style={{ backgroundColor: UoMBlue, height: '100vh' }}>
      <div className="register-form" style={{ height: '100vh' }}>
        <div className="form" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div className="logobox">
            <img className="logo" src="https://d2glwx35mhbfwf.cloudfront.net/v13.4.18/logo-with-padding.svg" alt="" />
          </div>
          <h1 className="title" style={{ color: UoMBlue }}>Account created successfully</h1>
          <br />
          <p>
            Your account is verified.
          </p>
          <br />
          <p>
            Thank you for join UoMRecruitED.
            {' '}
            <br />
            {' '}
            Please use your email and password to
            {' '}
            <Link href="/">
              login.
            </Link>

          </p>
        </div>
      </div>
    </div>
  );
}

export default SuccessCheckEmail;

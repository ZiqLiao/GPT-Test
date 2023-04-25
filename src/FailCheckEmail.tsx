import { Button } from '@mui/material';
import React, { useEffect } from 'react';
import '../Register.scss';
import { UoMBlue } from 'src/app/color';
import { resendEmailSchool } from 'src/utils/schoolsApi';
import { resendEmailStudent } from 'src/utils/studentApi';
import { Buffer } from 'buffer';
import { useNavigate } from 'react-router-dom';

function FailCheckEmail() {
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const param = window.location.search.split('=');
    const token = param[1];
    const tokenDecodablePart = token === null ? '' : token.split('.')[1];
    setEmail(JSON.parse(Buffer.from(tokenDecodablePart, 'base64').toString()).email);
    const path = window.location.pathname.split('/');
    setRole(path[1]);
  });
  return (
    <div className="background" style={{ backgroundColor: UoMBlue, height: '100vh' }}>
      <div className="register-form" style={{ height: '100vh' }}>
        <div className="form" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div className="logobox">
            <img className="logo" src="https://d2glwx35mhbfwf.cloudfront.net/v13.4.18/logo-with-padding.svg" alt="" />
          </div>
          <h1 className="title" style={{ color: UoMBlue }}>Link is invalid</h1>
          <br />
          <p>
            Please double check the link and copy it in the browser.
          </p>
          <br />
          <p>
            After 20 minutes, the link will be expiried.
            <br />
            if the link is expired, please click the button to resend an email.
            {' '}
            <br />
            <br />
            <Button
              className="button"
              type="submit"
              variant="contained"
              onClick={() => {
                if (role === 'student') {
                  resendEmailStudent(email);
                } else if (role === 'school') {
                  resendEmailSchool(email);
                }
                localStorage.setItem('email', email);
                navigate('/check-email');
              }}
            >
              resend email
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default FailCheckEmail;

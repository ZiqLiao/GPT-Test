import { useNavigate } from 'react-router-dom';
import { Link } from '@mui/material';
import React, { useEffect } from 'react';
import '../Register.scss';
import { UoMBlue } from 'src/app/color';
import { confirmEmailSchool } from 'src/utils/schoolsApi';
import { confirmEmailStudent } from 'src/utils/studentApi';
import { StatusCodes } from 'http-status-codes';
import SuccessCheckEmail from './SuccessCheckEmail';
import FailCheckEmail from './FailCheckEmail';

async function fetchUserData() {
  if (window.location.search === '') {
    return '';
  }
  const param = window.location.search.split('=');
  const token = param[1];
  const path = window.location.pathname.split('/');
  if (path[1] === 'school') {
    const response = confirmEmailSchool(token.toString());
    return response;
  }
  if (path[1] === 'student') {
    const response = confirmEmailStudent(token.toString());
    return response;
  }
  return '';
}

function ConfirmEmail() {
  const [status, setStatus] = React.useState('');
  const navigate = useNavigate();
  useEffect(() => {
    fetchUserData()
      .then((userData) => {
        if (userData === '') {
          navigate('/');
        }
        setStatus('Success');
      })
      .catch((error) => {
        if (error.response.status >= StatusCodes.NOT_FOUND) {
          setStatus('Fail');
        }
      });
  }, []);
  return (
    <div>
      {status === 'Success' && <SuccessCheckEmail />}
      {status === 'Fail' && <FailCheckEmail />}
    </div>
  );
}

export default ConfirmEmail;

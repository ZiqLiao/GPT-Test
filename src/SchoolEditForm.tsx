import { Box, Button, Card, Checkbox, Container, FormControl, FormControlLabel, Grid, InputLabel, List, ListItem, ListItemText, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import '../../Register/Register';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { INTERNAL_SERVER_ERROR } from 'src/common/constants/ErrorMessages';
import { StatusCodes } from 'http-status-codes';
import ImageUploadV2 from 'src/components/Register/component/ImageUploadV2';
import { UoMBlue } from 'src/app/color';
import axios from 'axios';
import { getProfile, signup, editProfile } from '../../../utils/schoolsApi';
import WarningMessage from '../../Login/components/WarningMessage/WarningMessage';
import SuccessMessage from '../../Register/SuccessMessage/SuccessMessage';
import InputTextField from '../../Form/InputTextField';

interface CheckedState {
  [key: string]: boolean;
}

const checkboxes = [
  { name: 'ELC', label: 'ELC' },
  { name: 'L1', label: 'F to 6' },
  { name: 'L2', label: 'F to 9' },
  { name: 'L3', label: 'F to 12' },
  { name: 'L4', label: '7 to 12' },
  { name: 'L5', label: '7 to 9' },
  { name: 'L6', label: '10 to 12' },
];

async function fetchUserData() {
  const response = getProfile(localStorage.getItem('userId') || '', localStorage.getItem('accessToken') || '');
  const { data } = await response;
  return data;
}

function SchoolEditForm() {
  const navigate = useNavigate();

  // USER STATE
  const [base64Data, setbase64Data] = React.useState('');
  const [checked, setChecked] = React.useState<CheckedState>({
    ELC: false,
    L1: false,
    L2: false,
    L3: false,
    L4: false,
    L5: false,
    L6: false,
  });
  const [warning, setWarning] = useState({
    shown: false,
    message: '',
  });
  const [success, setSucces] = useState({
    shown: false,
    message: '',
  });
  const [values, setValues] = React.useState({
    schoolName: '',
    contactName: '',
    email: '',
    webAddress: '',
    image: '',
  });

  const validationSchema = Yup.object({
    email: Yup.string().trim().email('Enter a valid email'),
    webAddress: Yup.string().url(),
    schoolName: Yup.string(),
    contactName: Yup.string(),
    sector: Yup.string(),
  });

  const submitForm = useCallback(async (value: any) => {
    const id = localStorage.getItem('userId') || '';
    const token = localStorage.getItem('accessToken') || '';
    if (!id) {
      console.error('User ID not found in localStorage');
      return;
    }
    try {
      const jsonObj = {
        image: value.image ? value.image : values.image,
        email: value.email,
        sector: value.sector,
        webAddress: value.webAddress,
        yearLevels: value.yearLevel,
        schoolName: value.schoolName,
        contactName: value.contactName,
      };
      const response = await editProfile(id, jsonObj, token);
      if (response.status === StatusCodes.OK) {
        setWarning({
          shown: false,
          message: '',
        });
        setSucces({
          shown: true,
          message: 'Your account been updated.',
        });
        // navigate('/');
        setTimeout(() => {
          navigate('/profile');
        }, 3000);
      }
      // navigate('/profile');
    } catch (error: any) {
      if (error.response) {
        if (error.response.status >= StatusCodes.INTERNAL_SERVER_ERROR) {
          setWarning({
            shown: true,
            message: INTERNAL_SERVER_ERROR,
          });
        }
      } else {
        setWarning({
          shown: true,
          message: 'Oops! Something went wrong.',
        });
      }
    }
  }, [values]);

  const formik = useFormik({
    initialValues: {
      image: '',
      email: '',
      webAddress: '',
      schoolName: '',
      contactName: '',
      sector: '',
      yearLevel: '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: submitForm,
  });

  const callBack = (childdata:string) => {
    setbase64Data(childdata);
    formik.setFieldValue('image', childdata.toString());
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked({
      ...checked,
      [event.target.name]: event.target.checked,
    });
  };

  const handleChangeAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked({
      ...checked,
      ELC: event.target.checked,
      L1: event.target.checked,
      L2: event.target.checked,
      L3: event.target.checked,
      L4: event.target.checked,
      L5: event.target.checked,
      L6: event.target.checked,
    });
  };

  // USE EFFECT
  useEffect(() => {
    fetchUserData()
      .then((userData) => {
        setValues({
          schoolName: userData.schoolName || '',
          contactName: userData.contactName || '',
          email: userData.email || '',
          webAddress: userData.webAddress || '',
          image: userData.image || '',
        });
        const yearLevelsArr = userData.yearLevels.split('-');
        const newCheckedState = checkboxes.reduce((checkedState, checkbox) => ({
          ...checkedState,
          [checkbox.name]: yearLevelsArr.includes(checkbox.name),
        }), {});
        setChecked(newCheckedState);
        formik.setFieldValue('sector', userData.sector);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const checklist = Object.keys(checked).filter((name) => checked[name]);
    formik.setFieldValue('yearLevel', checklist.join('-'));
  }, [checked]);

  return (
    <Container sx={{ mt: 15 }}>
      <div className="background">
        {/* div for school register form, can copy to school profile overview page */}
        <div className="register-form" style={{ width: '100%' }}>
          <form noValidate className="form" onSubmit={formik.handleSubmit}>
            <h1 className="title" style={{ color: UoMBlue }}>Edit School Profile</h1>
            <InputTextField formik={formik} inputName="schoolName" initValue={values.schoolName} label="School Name" />
            <InputTextField formik={formik} inputName="contactName" initValue={values.contactName} label="Contact Name" />
            <InputTextField formik={formik} inputName="email" initValue={values.email} label="Email" />
            <InputTextField formik={formik} inputName="webAddress" initValue={values.webAddress} label="Web Address" />
            <FormControl
              variant="outlined"
              style={{ width: '100%', margin: 1 }}
            >
              <InputLabel id="test-select-label" style={{ marginTop: '17px' }}>Sector</InputLabel>
              <Select
                id="sector"
                name="sector"
                autoComplete="sector"
                value={formik.values.sector}
                onChange={formik.handleChange}
                error={formik.touched.sector && Boolean(formik.errors.sector)}
                fullWidth
                variant="outlined"
                label="Sector"
                style={{ marginTop: '16px' }}
              >
                <MenuItem value="GOV">Government</MenuItem>
                <MenuItem value="IS">International</MenuItem>
                <MenuItem value="IND">Independent</MenuItem>
                <MenuItem value="CAT">Catholic</MenuItem>
                <MenuItem value="LDC">Long Day Care</MenuItem>
                <MenuItem value="PSK">Pre-School/Kingdergarten</MenuItem>
                <MenuItem value="OSHC">Outside of School Hours Care</MenuItem>
              </Select>
            </FormControl>
            <h3>Year Levels</h3>
            <FormControlLabel
              label="Select All"
              control={(
                <Checkbox
                  checked={Object.values(checked).every((value) => value)}
                  onChange={handleChangeAll}
                />
              )}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
              {checkboxes.map(({ name, label }) => (
                <FormControlLabel
                  key={name}
                  label={label}
                  control={<Checkbox name={name} checked={checked[name]} onChange={handleChange} />}
                />
              ))}
            </Box>
            <div style={{ width: '100%' }}>
              <h3>Upload Photo</h3>
              <p>Hint: School logo or a nice picture of the school </p>
              {/* <ImageUploadV1 handelCallback={callBack} style={{ width: '100%' }} /> */}
              <ImageUploadV2 handelCallback={callBack} style={{ width: '100%' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              {warning.shown ? <WarningMessage content={warning.message} /> : null}
              {success.shown ? <SuccessMessage content={success.message} /> : null}
              <Button
                className="button"
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
}

export default SchoolEditForm;

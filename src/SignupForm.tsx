import {
  Box,
  Grid,
  TextField,
  Checkbox,
  Button,
  FormControlLabel,
  FormGroup,
  FormLabel,
  RadioGroup,
  Radio,
  FormHelperText, Link,
} from '@mui/material';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';
import FormControl from '@mui/material/FormControl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UoMBlue } from '../../app/color';
import InputTextField from '../Form/InputTextField';
import ImageUploadV2 from '../Register/component/ImageUploadV2';
import WarningMessage from '../Login/components/WarningMessage/WarningMessage';
import SuccessMessage from '../Register/SuccessMessage/SuccessMessage';
import SingleSelectField from '../Form/SingleSelectField';
import DoubleRowCheckBox from '../Form/DoubleRowCheckBox';
import { signup } from '../../utils/studentApi';
import {
  EMAIL_EXISTS_ERROR,
  INTERNAL_SERVER_ERROR,
  USERNAME_PASSWORD_MISMATCH_ERROR,
} from '../../common/constants/ErrorMessages';
import {
  availableMatch,
  courseMatch,
  courseProgressMatch,
  learningAreaMatch,
  locationsMatch, skillMatch,
} from '../../common/FieldsMatches/studentProfileFieldsMatch';

const validationSchema = Yup.object({
  firstName: Yup
    .string()
    .required('First Name is required.'),
  lastName: Yup
    .string()
    .required('Last Name is required.'),
  preferredName: Yup
    .string(),
  pronouns: Yup
    .string(),
  studentNumber: Yup
    .number().typeError('Please enter a valid Student Number.')
    .required('Student Number is required'),
  email: Yup
    .string()
    .trim()
    .email('Enter a valid email')
    .required('Email is required')
    .matches(/@student\.unimelb\.edu\.au$/, 'Email must be a UoM student email'),
  course: Yup
    .string().required('Course is required field.'),
  courseProgress: Yup
    .string().required('Course Progress is required field.'),
  currentLocation: Yup
    .string().required('Current Location is required field.'),
  workWithChild: Yup
    .string().required('Please check one of the selection.'),
  skills: Yup
    .string().required('Please select at least one Skill'),
  location: Yup
    .string().required('Please select at least one Location'),
  learningArea: Yup
    .string().required('Please select at least one Learning Area'),
  available: Yup
    .string().required('Please select at least one Skill'),
  image: Yup
    .string().required('Please upload a profile image'),
  password: Yup
    .string()
    .required('Password is required')
    .min(8, 'Password should be of minimum 8 characters length'),
  checkpassword: Yup
    .string()
    .oneOf([Yup.ref('password'), ''], "Passwords don't match!")
    .required('Please repeat your password.'),
});

function SignupForm() {
  const [base64Data, setbase64Data] = React.useState('');
  const navigate = useNavigate();
  const [warning, setWarning] = useState({
    shown: false,
    message: '',
  });
  const [success, setSucces] = useState({
    shown: false,
    message: '',
  });

  const submitForm = useCallback(async (value: any) => {
    try {
      const jsonObj = {
        image: value.image,
        email: value.email,
        password: value.password,
        firstName: value.firstName,
        lastName: value.lastName,
        preferredName: value.preferredName,
        pronouns: value.pronouns,
        studentNumber: value.studentNumber,
        course: value.course,
        courseProgression: value.courseProgress,
        currentLocation: value.currentLocation,
        work_with_children: value.workWithChild === 'Yes',
        otherSkillExperience: value.skills,
        locationOption: value.location,
        learningAreas: value.learningArea,
        available: value.available,
        isPublic: 'True',
      };

      const signupResponse = await signup(
        jsonObj,
      );
      if (signupResponse.status === StatusCodes.OK) {
        localStorage.setItem('email', value.email);
        setWarning({
          shown: false,
          message: '',
        });
        setSucces({
          shown: true,
          message: 'Your account is created.',
        });
        setTimeout(() => {
          navigate('/check-email');
        }, 3000);
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status >= StatusCodes.INTERNAL_SERVER_ERROR) {
          setWarning({
            shown: true,
            message: INTERNAL_SERVER_ERROR,
          });
        }
        if (error.response.status === StatusCodes.CONFLICT) {
          setWarning({
            shown: true,
            message: EMAIL_EXISTS_ERROR,
          });
        }
        if (error.response.status === StatusCodes.UNAUTHORIZED) {
          setWarning({
            shown: true,
            message: USERNAME_PASSWORD_MISMATCH_ERROR,
          });
        }
      } else {
        setWarning({
          shown: true,
          message: 'Oops! Something went wrong.',
        });
      }
    }
  }, [navigate]);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      preferredName: '',
      pronouns: '',
      studentNumber: '',
      email: '',
      course: '',
      courseProgress: '',
      currentLocation: '',
      workWithChild: '',
      skills: '',
      location: '',
      learningArea: '',
      available: '',
      image: '',
      password: '',
      checkpassword: '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: submitForm,
  });

  const callBack = (childdata:string) => {
    setbase64Data(childdata);
    formik.setFieldValue('image', childdata.toString());
  };

  const workWithChildHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue('workWithChild', event.target.value);
  };

  return (
    <form noValidate className="form" onSubmit={formik.handleSubmit}>
      <div className="logobox">
        <img className="logo" src="https://d2glwx35mhbfwf.cloudfront.net/v13.4.18/logo-with-padding.svg" alt="" />
      </div>
      <h1 className="title" style={{ color: UoMBlue }}>Student Register</h1>

      <InputTextField formik={formik} inputName="firstName" label="First Name" required />
      <InputTextField formik={formik} inputName="lastName" label="Last Name" required />
      <InputTextField formik={formik} inputName="preferredName" label="Preferred Name" />
      <InputTextField formik={formik} inputName="pronouns" label="Pronouns" />
      <InputTextField formik={formik} inputName="studentNumber" label="UoM student number" required />
      <InputTextField formik={formik} inputName="email" label="UoM Email Address" required />

      <SingleSelectField required formik={formik} inputName="course" label="course" title="Course" selection={courseMatch} />
      <SingleSelectField required formik={formik} inputName="courseProgress" label="courseProgress" title="Course Progression" selection={courseProgressMatch} />
      <SingleSelectField required formik={formik} inputName="currentLocation" label="currentLocation" title="Current Location" selection={locationsMatch} />

      <Box mt={3}>
        <FormControl onChange={workWithChildHandle} error={formik.touched.workWithChild && Boolean(formik.errors.workWithChild)}>
          <FormLabel required id=" abuttons-group-label">Work With Children Check </FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
          >
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </Box>

      <DoubleRowCheckBox required formik={formik} inputName="skills" title="Skills" selection={skillMatch} />
      <DoubleRowCheckBox required formik={formik} inputName="location" title="Location" selection={locationsMatch} />
      <DoubleRowCheckBox required formik={formik} inputName="learningArea" title="Learning Area" selection={learningAreaMatch} />
      <DoubleRowCheckBox required formik={formik} inputName="available" title="Available To" selection={availableMatch} />

      <div style={{ width: '100%' }}>
        <h3>Upload Photo*</h3>
        <p>Hint: Upload a photo of yourself to personalize your student profile. </p>
        <ImageUploadV2 handelCallback={callBack} style={{ width: '100%' }} />
        <FormHelperText>{formik.touched.image && formik.errors.image}</FormHelperText>
      </div>
      <h3>Set Password*</h3>
      <InputTextField formik={formik} inputName="password" label="Password" type="password" />
      <InputTextField formik={formik} inputName="checkpassword" label="Repeat Password" type="password" />

      <div style={{ textAlign: 'center' }}>
        {warning.shown ? <WarningMessage content={warning.message} /> : null}
        {success.shown ? <SuccessMessage content={success.message} /> : null}
        <Button
          className="button"
          type="submit"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Signup
        </Button>
        <br />
        <Link href="/" variant="body2">
          Already have a student account? Back to Login
        </Link>
      </div>
    </form>
  );
}

export default SignupForm;

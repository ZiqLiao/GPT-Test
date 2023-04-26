import {
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  FormHelperText, Container,
} from '@mui/material';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';
import FormControl from '@mui/material/FormControl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UoMBlue } from '../../../app/color';
import InputTextField from '../../Form/InputTextField';
import ImageUploadV2 from '../../Register/component/ImageUploadV2';
import WarningMessage from '../../Login/components/WarningMessage/WarningMessage';
import SuccessMessage from '../../Register/SuccessMessage/SuccessMessage';
import SingleSelectField from '../../Form/SingleSelectField';
import DoubleRowCheckBox from '../../Form/DoubleRowCheckBox';
import { signup, getProfile, editProfile } from '../../../utils/studentApi';
import {
  EMAIL_EXISTS_ERROR,
  INTERNAL_SERVER_ERROR,
  USERNAME_PASSWORD_MISMATCH_ERROR,
} from '../../../common/constants/ErrorMessages';
import { courseMatch, courseProgressMatch, locationsMatch, availableMatch, skillMatch, learningAreaMatch } from '../../../common/FieldsMatches/studentProfileFieldsMatch';

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
    .string(),
});

async function fetchUserData() {
  const response = getProfile(localStorage.getItem('userId') || '');
  const { data } = await response;
  return data;
}

function StudentEditForm() {
  const [base64Data, setbase64Data] = React.useState('');
  const [initValue, setInitValue] = React.useState({
    firstName: '',
    lastName: '',
    preferredName: '',
    pronouns: '',
    studentNumber: '',
    course: '',
    courseProgress: '',
    currentLocation: '',
    otherSkillExperience: '',
    locationOption: '',
    learningAreas: '',
    available: '',
  });
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
      };
      const signupResponse = await editProfile(
        localStorage.getItem('userId') || '',
        jsonObj,
        localStorage.getItem('accessToken') || '',
      );
      if (signupResponse.status === StatusCodes.OK) {
        setWarning({
          shown: false,
          message: '',
        });
        setSucces({
          shown: true,
          message: 'Your profile had been updated.',
        });
        setTimeout(() => {
          navigate('/');
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
      course: '',
      courseProgress: '',
      currentLocation: '',
      workWithChild: '',
      skills: '',
      location: '',
      learningArea: '',
      available: '',
      image: '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: submitForm,
  });

  useEffect(() => {
    fetchUserData()
      .then((userData) => {
        console.log(userData);
        setInitValue({
          firstName: userData.firstName,
          lastName: userData.lastName,
          preferredName: userData.preferredName || '',
          pronouns: userData.pronouns || '',
          studentNumber: userData.studentNumber,
          course: userData.course,
          courseProgress: userData.courseProgression,
          currentLocation: userData.currentLocation,
          otherSkillExperience: userData.otherSkillExperience,
          locationOption: userData.locationOption,
          learningAreas: userData.learningAreas,
          available: userData.available,
        });
        formik.setFieldValue('image', userData.image);
        formik.setFieldValue('workWithChild', userData.work_with_children ? 'Yes' : 'No');
      })
      .catch((error) => console.error(error));
  }, []);

  const callBack = (childdata:string) => {
    setbase64Data(childdata);
    formik.setFieldValue('image', childdata.toString());
  };

  const workWithChildHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue('workWithChild', event.target.value);
  };

  return (
    <Container sx={{ mt: 15 }}>
      <form noValidate className="form" onSubmit={formik.handleSubmit}>
        <h1 className="title" style={{ color: UoMBlue }}>Profile Edit</h1>

        <InputTextField formik={formik} inputName="firstName" label="First Name" required initValue={initValue.firstName} />
        <InputTextField formik={formik} inputName="lastName" label="Last Name" required initValue={initValue.lastName} />
        <InputTextField formik={formik} inputName="preferredName" label="Preferred Name" initValue={initValue.preferredName} />
        <InputTextField formik={formik} inputName="pronouns" label="Pronouns" initValue={initValue.pronouns} />
        <InputTextField formik={formik} inputName="studentNumber" label="UoM student number" required initValue={initValue.studentNumber} />

        <SingleSelectField required formik={formik} inputName="course" label="course" title="Course" selection={courseMatch} initValue={initValue.course} />
        <SingleSelectField required formik={formik} inputName="courseProgress" label="courseProgress" title="Course Progression" selection={courseProgressMatch} initValue={initValue.courseProgress} />
        <SingleSelectField required formik={formik} inputName="currentLocation" label="currentLocation" title="Current Location" selection={locationsMatch} initValue={initValue.currentLocation} />

        <Box mt={3}>
          <FormControl onChange={workWithChildHandle} error={formik.touched.workWithChild && Boolean(formik.errors.workWithChild)}>
            <FormLabel required id=" abuttons-group-label">Work With Children Check </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={formik.values.workWithChild}
            >
              <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Box>

        <DoubleRowCheckBox required formik={formik} inputName="skills" title="Skills" selection={skillMatch} initValue={initValue.otherSkillExperience} />
        <DoubleRowCheckBox required formik={formik} inputName="location" title="Location" selection={locationsMatch} initValue={initValue.locationOption} />
        <DoubleRowCheckBox required formik={formik} inputName="learningArea" title="Learning Area" selection={learningAreaMatch} initValue={initValue.learningAreas} />
        <DoubleRowCheckBox required formik={formik} inputName="available" title="Available To" selection={availableMatch} initValue={initValue.available} />

        <div style={{ width: '100%' }}>
          <h3>Upload Photo</h3>
          <p>Hint: Upload a photo of yourself to personalize your student profile. </p>
          <FormHelperText>{formik.touched.image && formik.errors.image}</FormHelperText>
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
            SAVE
          </Button>
        </div>
      </form>
    </Container>
  );
}

export default StudentEditForm;

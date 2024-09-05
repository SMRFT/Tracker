import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { DEPARTMENTS } from './constant'; // Import the departments
import Image1 from './Images/Login-Background.jpg';

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: fit-content;
  background-image: url(${Image1});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 15px;
  background-color: rgba(51, 52, 73, 0.8);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  padding: 20px;
`;

const RegisterCard = styled.div`
  padding: 2rem;
  border-radius: 15px;
  backdrop-filter: blur(12px);
  background-color: rgba(51, 52, 73, 0.8);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 500px;
  z-index: 1;
  color: #ffffff;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #ffffff;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Select = styled.select`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 5px;
  font-size: 14px;
`;

const SuccessMessage = styled.div`
  color: green;
  margin-bottom: 15px;
  text-align: center;
`;

const SubmitButton = styled.button`
  background-color: #6B728E;
  color: white;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [employeeDepartment, setEmployeeDepartment] = useState('');
    const [employeeDesignation, setEmployeeDesignation] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    const navigate = useNavigate(); // Initialize useNavigate

    const validatePassword = (pwd) => {
        const passwordCriteria = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordCriteria.test(pwd);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const errors = {};
        if (!employeeId) errors.employeeId = 'Employee ID is required.';
        if (!employeeName) errors.employeeName = 'Employee Name is required.';
        if (!employeeDepartment) errors.employeeDepartment = 'Employee Department is required.';
        if (!employeeDesignation) errors.employeeDesignation = 'Employee Designation is required.';
        if (!email) errors.email = 'Email is required.';
        if (!password) errors.password = 'Password is required.';
        if (!validatePassword(password)) errors.password = 'Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.';

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        } else {
            setValidationErrors({});
        }

        const formData = new FormData();
        formData.append('email', email);
        formData.append('employeeId', employeeId);
        formData.append('employeeName', employeeName);
        formData.append('password', password);
        formData.append('employeeDepartment', employeeDepartment);
        formData.append('employeeDesignation', employeeDesignation);

        try {
            const response = await axios.post('http://127.0.0.1:8000/register/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccess('Registration successful!');
            setError('');

            // Navigate to login page after successful registration
            setTimeout(() => {
                navigate('/');
            }, 1000); // Redirect after 2 seconds
        } catch (error) {
            setError('Registration failed. Please try again.');
            setSuccess('');
        }
    };

    return (
        <RegisterContainer>
            <RegisterCard>
                <Title>Register</Title>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                {success && <SuccessMessage>{success}</SuccessMessage>}
                <StyledForm onSubmit={handleSubmit} autoComplete="off">
                    <Row>
                        <FormGroup>
                            <Label>Employee ID</Label>
                            <Input
                                type="text"
                                className={validationErrors.employeeId ? 'is-invalid' : ''}
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                autoComplete="off"
                                name="employeeId"
                            />
                            {validationErrors.employeeId && <ErrorMessage>{validationErrors.employeeId}</ErrorMessage>}
                        </FormGroup>

                        <FormGroup>
                            <Label>Employee Name</Label>
                            <Input
                                type="text"
                                className={validationErrors.employeeName ? 'is-invalid' : ''}
                                value={employeeName}
                                onChange={(e) => setEmployeeName(e.target.value)}
                                autoComplete="off"
                                name="employeeName"
                            />
                            {validationErrors.employeeName && <ErrorMessage>{validationErrors.employeeName}</ErrorMessage>}
                        </FormGroup>
                    </Row>

                    <Row>
                        <FormGroup>
                            <Label>Employee Department</Label>
                            <Select
                                className={validationErrors.employeeDepartment ? 'is-invalid' : ''}
                                value={employeeDepartment}
                                onChange={(e) => setEmployeeDepartment(e.target.value)}
                                name="employeeDepartment"
                            >
                                <option value="" style={{textAlign: 'center'}} >Select Department</option>
                                {DEPARTMENTS.map((dept) => (
                                    <option style={{textAlign: 'center'}} key={dept} value={dept}>{dept}</option>
                                ))}
                            </Select>
                            {validationErrors.employeeDepartment && <ErrorMessage>{validationErrors.employeeDepartment}</ErrorMessage>}
                        </FormGroup>

                        <FormGroup>
                            <Label>Designation</Label>
                            <Input
                                type="text"
                                className={validationErrors.employeeDesignation ? 'is-invalid' : ''}
                                value={employeeDesignation}
                                onChange={(e) => setEmployeeDesignation(e.target.value)}
                                autoComplete="off"
                                name="employeeDesignation"
                            />
                            {validationErrors.employeeDesignation && <ErrorMessage>{validationErrors.employeeDesignation}</ErrorMessage>}
                        </FormGroup>
                    </Row>

                    <FormGroup>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            className={validationErrors.email ? 'is-invalid' : ''}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="off"
                            name="email"
                        />
                        {validationErrors.email && <ErrorMessage>{validationErrors.email}</ErrorMessage>}
                    </FormGroup>

                    <FormGroup>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            className={validationErrors.password ? 'is-invalid' : ''}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            name="password"
                        />
                        {validationErrors.password && <ErrorMessage>{validationErrors.password}</ErrorMessage>}
                    </FormGroup>

                    <center>
                        <SubmitButton type="submit">Register</SubmitButton>
                    </center>
                </StyledForm>
            </RegisterCard>
        </RegisterContainer>
    );
};

export default Register;

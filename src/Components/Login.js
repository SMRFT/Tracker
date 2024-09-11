import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Image1 from './Images/Login-Background.jpg'; // Import your background image

// LoginWrapper: Ensures the background image covers the entire viewport
const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; // Ensure it covers the full viewport height
  background-image: url(${Image1});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

// FormContainer: Adds blur effect and semi-transparent background to highlight the form
const FormContainer = styled.div`
  padding: 2rem;
  border-radius: 15px;
  backdrop-filter: blur(12px); // Apply blur effect
  background-color: rgba(51, 52, 73, 0.8); // Semi-transparent background with more opacity
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  z-index: 1; // Ensure the form is above the background
  color: #ffffff; // White text color for better contrast
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #ffffff; // Ensure the title is white for readability
`;

const StyledInput = styled.input`
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 5px;
  width: 100%;
  font-size: 1rem;
  background-color: #444761; // Slightly lighter background for input fields
  color: #ffffff;

  &:focus {
    outline: none;
    background-color: #55597a; // Darken the background color on focus
  }
`;

const StyledButton = styled.button`
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

const ErrorMessage = styled.p`
  color: #DC3545;
  text-align: center;
`;

const LogIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Both username and password are required.');
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:8000/login/', {
        email: username,
        password: password,
      });

      if (response.status === 200) {
        const { employeeId, employeeName, email } = response.data;
        localStorage.setItem('employeeId', employeeId);
        localStorage.setItem('employeeName', employeeName);
        localStorage.setItem('email', email);
        navigate('/Board');
      }
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 404) {
        setError('Invalid credentials or user does not exist.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <LoginWrapper>
      <FormContainer>
        <Title>Login</Title>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label htmlFor="username">Username (Email)</label>
            <StyledInput
              type="text"
              className={`form-control ${error && !username ? 'is-invalid' : ''}`}
              id="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="off"
            />
            {error && !username && <div className="invalid-feedback">{error}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <StyledInput
              type="password"
              className={`form-control ${error && !password ? 'is-invalid' : ''}`}
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            {error && !password && <div className="invalid-feedback">{error}</div>}
          </div>
          <center>
            <StyledButton type="submit">Login</StyledButton>
          </center>
        </form>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <div className="mt-3 text-center">
          <p>If not registered, please register.</p>
          <Link to="/Register" className="btn btn-link" style={{ color: '#007BFF' }}>Register</Link>
        </div>
      </FormContainer>
    </LoginWrapper>
  );
};

export default LogIn;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VscAccount } from "react-icons/vsc";
import { Tooltip } from 'react-tooltip';
import styled from 'styled-components';

const SignOut = () => {
  const navigate = useNavigate();
  const [employeeName, setEmployeeName] = useState('');
  const [email, setEmail] = useState('');
  const [showSignOut, setShowSignOut] = useState(false);

  useEffect(() => {
    const storedUserName = localStorage.getItem('employeeName');
    const storedUserEmail = localStorage.getItem('email');
    setEmployeeName(storedUserName || 'User');
    setEmail(storedUserEmail || 'user@example.com');
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('employeeName');
    localStorage.removeItem('email');
    navigate('/'); // Redirect to HomePage after logout
  };

  const handleIconClick = () => {
    setShowSignOut(!showSignOut);
  };

  return (
    <SignOutWrapper>
      <VscAccount
        data-tooltip-id="accountTooltip"
        onClick={handleIconClick}
      />
      <Tooltip id="accountTooltip" place="bottom" effect="solid" className="custom-tooltip">
        <div style={{ fontSize: '0.875rem', padding: '5px 10px' }}>
          <div>{employeeName}</div>
          <div>{email}</div>
        </div>
      </Tooltip>
      {showSignOut && (
        <SignOutContainer>
          <div style={{ fontSize: '1rem', whiteSpace: 'nowrap',color: 'black' }}>Hi, {employeeName}!</div>
          <button style={{ width: "100%", whiteSpace: 'nowrap', fontSize: '1rem' }} onClick={handleSignOut}>Sign Out</button>
        </SignOutContainer>
      )}
    </SignOutWrapper>
  );
};

// Styled components
const SignOutWrapper = styled.div`
  position: fixed;
  bottom: 10px;
  left: 10px;
  cursor: pointer;
  z-index: 1000;

  svg {
    font-size: 2rem;
    color: white;
    transition: color 0.3s ease;
  }

  svg:hover {
    color: #f0f0f0; /* A hover effect for the icon */
  }
`;

const SignOutContainer = styled.div`
  position: absolute;
  bottom: 50px; /* Moves it above the icon */
  left: 0;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 5px;
  z-index: 1001;
`;

export default SignOut;

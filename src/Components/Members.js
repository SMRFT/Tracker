import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
const MembersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative;
`;
const EmployeeCard = styled.div`
  background-color: #F0F0F0;
  color: black;
  border-radius: 8px;
  padding: 10px 20px;
  margin: 10px 0;
  width: 300px;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;
const EmployeeName = styled.span`
  font-weight: bold;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
const Members = ({ cardId, cardName, boardName, closeModal }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/get-employees/');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        setError('Error fetching employee data');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);
  const handleSelect = async (employee) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/add-membername/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId: cardId,
          cardName: cardName,
          boardName: boardName,
          employeeId: employee.employeeId,
          employeeName: employee.employeeName,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to add member');
      }
      console.log('Success:', result);
      // Close the modal after successful selection
      closeModal();
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };
  return (
    <MembersContainer>
      <h2>Members</h2>
      {employees.map(employee => (
        <EmployeeCard key={employee.employeeId} onClick={() => handleSelect(employee)}>
          <EmployeeName>{employee.employeeName}</EmployeeName>
          <span>{employee.employeeId}</span>
        </EmployeeCard>
      ))}
    </MembersContainer>
  );
};
export default Members;
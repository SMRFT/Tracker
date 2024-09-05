import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './Components/Register';
import Board from './Components/Board';
import Todolist from './Components/Todolist';
import Comment from './Components/Comment';
import Sidebar from './Components/Sidebar';
import styled from "styled-components";
import './App.css';
import LogIn from './Components/Login';

const ContentContainer = styled.div`
    margin-left: ${({ sidebarVisible }) => (sidebarVisible ? '220px' : '0')}; /* Adjusted for sidebar width + some spacing */
    padding: 20px;
`;

const AppContent = ({ boards, addBoard }) => {
    const location = useLocation();

    // Determine if the sidebar should be visible based on the current path
    const sidebarVisible = ![ '/', '/Register'].includes(location.pathname);

    return (
        <>
            {sidebarVisible && <Sidebar boards={boards} setBoards={addBoard} />}
            <ContentContainer sidebarVisible={sidebarVisible}>
                <Routes>
                    <Route path="/Board" element={<Board boards={boards} addBoard={addBoard} />} />
                    <Route path="/Register" element={<Register />} />
                    <Route path="/" element={<LogIn />} />
                    <Route path="/Todolist" element={<Todolist />} />
                    <Route path="/comment" element={<Comment />} />
                </Routes>
            </ContentContainer>
        </>
    );
};

const App = () => {
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        // Fetch boards from the database when the component is mounted
        const fetchBoards = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/boards/');
                const data = await response.json();
                setBoards(data);
            } catch (error) {
                console.error('Error fetching boards:', error);
            }
        };
        fetchBoards();
    }, []);

    const addBoard = (newBoard) => {
        const updatedBoards = [...boards, newBoard];
        setBoards(updatedBoards);
        // You may want to POST the new board to your backend to save it in the database
    };

    return (
        <Router>
            <AppContent boards={boards} addBoard={addBoard} />
        </Router>
    );
};

export default App;

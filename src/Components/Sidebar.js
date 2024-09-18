import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import DeleteBoardModal from './DeleteBoardModal';
import EditBoardModal from './EditBoardModal';
import SignOut from './SignOut';
const SidebarContainer = styled.div`
    width: 220px;
    background-color: #19485F; /* Darker background for better contrast */
    padding: 20px;
    height: 100vh; /* Full viewport height */
    position: fixed; /* Fixes the sidebar in place */
    color: white;
    top: 0;
    left: 0;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5); /* Adds a subtle shadow to the right */
`;
const SidebarHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px; /* Increased space for better separation */
`;
const SidebarTitle = styled.h2`
    font-size: 20px;
    margin: 0;
    color: white; /* Light cyan for the title */
    font-family: 'Arial', sans-serif;
    font-weight: 700; /* Bolder title */
`;
const SidebarNav = styled.nav`
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    li {
        margin-bottom: 20px; /* Increased spacing between links */
    }
`;
const StyledNavLink = styled(NavLink)`
    color: white;
    text-decoration: none;
    font-size: 16px;
    font-family: 'Arial', sans-serif;
    font-weight: 500; /* Medium weight for a balanced look */
    padding: 10px;
    border-radius: 4px;
    display: block; /* Makes the entire link area clickable */
    &:hover {
        background-color: white; /* Slight hover effect with color change */
        color: #19485F; /* Darker text on hover */
        text-decoration: none; /* Ensures no underline on hover */
    }
    &.active {
        font-weight: 700;
        background-color: white; /* Highlight the active link */
        color: #19485F; /* Darker text for contrast */
    }
`;
const BoardsSection = styled.div`
    margin-top: 30px;
`;
const BoardsTitle = styled.h3`
    font-size: 18px;
    margin-bottom: 15px;
    color: #F4F9F9;
    font-family: 'Arial', sans-serif;
    font-weight: 600;
`;
const BoardList = styled.ul`
    max-height: 200px;
    overflow-y: auto;
    scrollbar-width: none;
    padding: 0;
    margin: 0;
`;
const BoardItem = styled.li`
    list-style: none;
    padding: 8px 16px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 4px;
    background-color: ${(props) => (props.isSelected ? '#F0F0F0' : 'transparent')};
    &:before {
        content: '';
        display: inline-block;
        width: 20px;
        height: 20px;
        background-color: ${(props) => props.bgColor};
        margin-right: 12px;
    }
`;
const ShowMoreButton = styled.button`
    background: none;
    border: none;
    color: #F4F9F9;
    font-size: 14px;
    cursor: pointer;
    margin-top: 10px;
    display: flex;
    align-items: center;
`;
const OptionsMenu = styled.div`
    position: absolute;
    background: #fff;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    margin-top: 5px;
    right: 10px;
    z-index: 10;
    color: black;
`;
const Option = styled.div`
    padding: 10px;
    cursor: pointer;
    &:hover {
        background-color: #F0F0F0;
    }
`;
const ThreeDotIcon = styled(FontAwesomeIcon)`
    color: #F4F9F9;
    margin-left: 10px;
    cursor: pointer;
`;
const Sidebar = ({ boards, setBoards }) => {
    const [showMore, setShowMore] = useState(false);
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [editingBoardIndex, setEditingBoardIndex] = useState(null);
    const [boardName, setBoardName] = useState('');
    const [boardId, setBoardId] = useState('');
    const navigate = useNavigate();
    const employeeId = localStorage.getItem('employeeId'); // Get employeeId from localStorage
    const filteredBoards = boards.filter(board => board.employeeId === employeeId);
    const displayedBoards = showMore ? filteredBoards : filteredBoards.slice(0, 5);
    const handleBoardClick = (board) => {
        navigate('/Todolist', { state: { boardColor: board.boardColor } });
    };
    const openDeleteModal = (board) => {
        setSelectedBoard(board);
        setBoardName(board.boardName);
        setBoardId(board.boardId);
        setIsDeleteModalOpen(true);
        setActiveMenu(null);
    };
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedBoard(null);
    };
    const openEditModal = (board, index) => {
        setSelectedBoard(board);
        setEditingBoardIndex(index);
        setBoardName(board.boardName);
        setBoardId(board.boardId);
        setIsEditModalOpen(true);
        setActiveMenu(null);
    };
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedBoard(null);
        setEditingBoardIndex(null);
    };
    const saveEditedBoard = async (newTitle) => {
        try {
            const updatedBoard = { ...selectedBoard, boardName: newTitle };
            const response = await fetch(`http://127.0.0.1:8000/boards/${selectedBoard.boardId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    boardName: newTitle,
                    boardColor: selectedBoard.boardColor,
                    employeeId: selectedBoard.employeeId, // Ensure employeeId is sent
                    employeeName: selectedBoard.employeeName // Include employeeName if needed
                }),
            });
    
            if (response.ok) {
                const updatedBoards = filteredBoards.map((board) =>
                    board.boardId === selectedBoard.boardId ? updatedBoard : board
                );
                setBoards(updatedBoards);
                closeEditModal();
            } else {
                console.error('Failed to update board:', await response.json());
            }
        } catch (error) {
            console.error('Error updating board:', error);
        }
    };
    
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeMenu !== null && !event.target.closest(`.menu-${activeMenu}`)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeMenu]);
    const handleDeleteBoard = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/boards/${selectedBoard.boardId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ employeeId }), // Include employeeId
            });
            if (response.ok) {
                const updatedBoards = filteredBoards.filter(
                    (board) => board.boardId !== selectedBoard.boardId
                );
                setBoards(updatedBoards);
                closeDeleteModal();
            } else {
                console.error('Failed to delete board:', await response.json());
            }
        } catch (error) {
            console.error('Error deleting board:', error);
        }
    };
    const toggleMenu = (index) => {
        setActiveMenu(activeMenu === index ? null : index);
    };
    return (
        <SidebarContainer>
            <SidebarHeader>
                <SidebarTitle>Project Tracking</SidebarTitle>
            </SidebarHeader>
            <SidebarNav>
                <ul>
                    <li>
                        <StyledNavLink to="/Board" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Board
                        </StyledNavLink>
                    </li>
                    <li>
                        <StyledNavLink to="/Members" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Members
                        </StyledNavLink>
                    </li>
                </ul>
            </SidebarNav>
            <BoardsSection>
                <BoardsTitle>Your Boards</BoardsTitle>
                <BoardList>
                    {displayedBoards.map((board, index) => (
                        <BoardItem key={board.id} bgColor={board.boardColor} onClick={() => handleBoardClick(board)}>
                            {board.boardName}
                            <ThreeDotIcon icon={faEllipsisH} onClick={() => toggleMenu(index)} />
                            {activeMenu === index && (
                                <OptionsMenu className={`menu-${index}`}>
                                    <Option onClick={() => openEditModal(board, index)}>Edit</Option>
                                    <Option onClick={() => openDeleteModal(board)}>Delete</Option>
                                </OptionsMenu>
                            )}
                        </BoardItem>
                    ))}
                </BoardList>
                <ShowMoreButton onClick={() => setShowMore(!showMore)}>
                    {showMore ? 'Show Less' : 'Show More'}&nbsp;&nbsp;
                    <FontAwesomeIcon icon={showMore ? faChevronUp : faChevronDown} />
                </ShowMoreButton>
            </BoardsSection>
            {isDeleteModalOpen && (
                <DeleteBoardModal
                    boardTitle={boardName} // Pass the board title here
                    onDelete={handleDeleteBoard}
                    onClose={closeDeleteModal}
                />
            )}
            {isEditModalOpen && (
                <EditBoardModal
                    onClose={closeEditModal}
                    onSave={(newTitle) => saveEditedBoard(newTitle)}
                    boardTitle={boardName}
                    setBoardTitle={setBoardName}
                />
            )}
            <SignOut/>
        </SidebarContainer>
    );
};
export default Sidebar;
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import DeleteBoardModal from './DeleteBoardModal';
import EditBoardModal from './EditBoardModal';
// const SidebarContainer = styled.div`
//     width: 220px;
//     background-color: #19485F; /* Darker background for better contrast */
//     padding: 20px;
//     height: 100vh; /* Full viewport height */
//     position: fixed; /* Fixes the sidebar in place */
//     color: #C5C6C7;
//     top: 0;
//     left: 0;
//     box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5); /* Adds a subtle shadow to the right */
// `;

// const SidebarHeader = styled.div`
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     margin-bottom: 30px; /* Increased space for better separation */
// `;

// const SidebarTitle = styled.h2`
//     font-size: 20px;
//     margin: 0;
//     color: #D9E0A4; /* Light cyan for the title */
//     font-family: 'Arial', sans-serif;
//     font-weight: 700; /* Bolder title */
// `;

// const SidebarNav = styled.nav`
//     ul {
//         list-style: none;
//         padding: 0;
//         margin: 0;
//     }
//     li {
//         margin-bottom: 20px; /* Increased spacing between links */
//     }
// `;

// const StyledNavLink = styled(NavLink)`
//     color: #D9E0A4;
//     text-decoration: none;
//     font-size: 16px;
//     font-family: 'Arial', sans-serif;
//     font-weight: 500; /* Medium weight for a balanced look */
//     padding: 10px;
//     border-radius: 4px;
//     display: block; /* Makes the entire link area clickable */

//     &:hover {
//         background-color: #D9E0A4; /* Slight hover effect with color change */
//         color: #0B0C10; /* Darker text on hover */
//         text-decoration: none; /* Ensures no underline on hover */
//     }

//     &.active {
//         font-weight: 700;
//         background-color: #D9E0A4; /* Highlight the active link */
//         color: #0B0C10; /* Darker text for contrast */
//     }
// `;

// const SidebarContainer = styled.div`
//     width: 220px;
//     background-color: #4A7766; /* Darker background for better contrast */
//     padding: 20px;
//     height: 100vh; /* Full viewport height */
//     position: fixed; /* Fixes the sidebar in place */
//     color: #C5C6C7;
//     top: 0;
//     left: 0;
//     box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5); /* Adds a subtle shadow to the right */
// `;

// const SidebarHeader = styled.div`
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     margin-bottom: 30px; /* Increased space for better separation */
// `;

// const SidebarTitle = styled.h2`
//     font-size: 20px;
//     margin: 0;
//     color: #ECE7E2; /* Light cyan for the title */
//     font-family: 'Arial', sans-serif;
//     font-weight: 700; /* Bolder title */
// `;

// const SidebarNav = styled.nav`
//     ul {
//         list-style: none;
//         padding: 0;
//         margin: 0;
//     }
//     li {
//         margin-bottom: 20px; /* Increased spacing between links */
//     }
// `;

// const StyledNavLink = styled(NavLink)`
//     color: #ECE7E2;
//     text-decoration: none;
//     font-size: 16px;
//     font-family: 'Arial', sans-serif;
//     font-weight: 500; /* Medium weight for a balanced look */
//     padding: 10px;
//     border-radius: 4px;
//     display: block; /* Makes the entire link area clickable */

//     &:hover {
//         background-color: #ECE7E2; /* Slight hover effect with color change */
//         color: #74512D; /* Darker text on hover */
//         text-decoration: none; /* Ensures no underline on hover */
//     }

//     &.active {
//         font-weight: 700;
//         background-color: #ECE7E2; /* Highlight the active link */
//         color: #74512D; /* Darker text for contrast */
//     }
// `;

const SidebarContainer = styled.div`
    width: 220px;
    background-color: #222831;
    padding: 20px;
    height: 100vh;
    position: fixed;
    color: #F4F9F9;
    top: 0;
    left: 0;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);       
`;

const SidebarHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
`;

const SidebarTitle = styled.h2`
    font-size: 20px;
    margin: 0;
    color: #F4F9F9;
    font-family: 'Arial', sans-serif;
    font-weight: 700;
`;

const SidebarNav = styled.nav`
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    li {
        margin-bottom: 20px;
    }
`;

const StyledNavLink = styled(NavLink)`
    color: #F4F9F9;
    text-decoration: none;
    font-size: 16px;
    font-family: 'Arial', sans-serif;
    font-weight: 500;
    padding: 10px;
    border-radius: 4px;
    display: block;

    &:hover {
        background-color: #F4F9F9;
        color: #3C3D37;
        text-decoration: none;
    }

    &.active {
        font-weight: 700;
        background-color: #F4F9F9;
        color: #3C3D37;
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
    background-color: ${(props) => (props.isSelected ? '#f0f0f0' : 'transparent')};

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
        background-color: #f0f0f0;
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
    const navigate = useNavigate();

    const displayedBoards = showMore ? boards : boards.slice(0, 5);

    const handleBoardClick = (board) => {
        navigate('/Todolist', { state: { boardColor: board.color } });
    };

    const openDeleteModal = (board) => {
        setSelectedBoard(board);
        setBoardName(board.boardName); 
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
        setIsEditModalOpen(true);
        setActiveMenu(null);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedBoard(null);
        setEditingBoardIndex(null);
    };

    const saveEditedBoard = async (newTitle) => {
        const employeeId = localStorage.getItem('employeeId'); // Get employeeId from localStorage
        const employeeName = localStorage.getItem('employeeName');
        try {
            const updatedBoard = { ...selectedBoard, boardName: newTitle };
            const response = await fetch(`http://127.0.0.1:8000/boards/${selectedBoard.boardName}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ boardName: newTitle, color: selectedBoard.color, employeeId, employeeName }), // Include employeeId
            });
    
            if (response.ok) {
                const updatedBoards = boards.map((board) =>
                    board.boardName === selectedBoard.boardName ? updatedBoard : board
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
        const employeeId = localStorage.getItem('employeeId'); // Get employeeId from localStorage
        try {
          const response = await fetch(`http://127.0.0.1:8000/boards/${selectedBoard.boardName}/`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ employeeId }), // Include employeeId
          });
      
          if (response.ok) {
            const updatedBoards = boards.filter(
              (board) => board.boardName !== selectedBoard.boardName
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
                        <BoardItem key={board.id} bgColor={board.color} onClick={() => handleBoardClick(board)}>
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
        </SidebarContainer>
    );
};

export default Sidebar;
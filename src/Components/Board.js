import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SketchPicker } from 'react-color';
import { FaTimes, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const BoardContainer = styled.div`
    display: flex;
`;

const MainContent = styled.main`
    flex-grow: 1;
    padding: 20px;
`;

const MainHeader = styled.header`
    margin-bottom: 20px;
`;

const HeaderTop = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
`;

const HeaderBottom = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
`;

const HeaderTitle = styled.h1`
    margin: 0;
    margin-right: 20px;
`;

const SortFilter = styled.div`
    select {
        margin-right: 10px;
        padding: 5px;
    }
`;

const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    background: #fff;
    border: 1px solid #dfe1e6;
    border-radius: 4px;
    padding: 5px;
`;

const SearchIcon = styled(FaSearch)`
    color: #aaa;
    margin-right: 10px;
`;

const SearchInput = styled.input`
    border: none;
    outline: none;
    padding: 5px;
    width: 200px;
`;

const BoardsSection = styled.section`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
    flex-wrap: wrap;
`;

const BoardCard = styled.div`
    width: 200px;
    height: 100px;
    background: ${(props) => props.bgColor || 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)'};
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
`;

const CreateNewBoardCard = styled(BoardCard)`
    background: #ebecf0;
    color: black;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:hover {
        background: #dfe1e6;
    }
`;

const DialogOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Dialog = styled.div`
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    position: relative;
`;

const DialogTitle = styled.h2`
    margin-top: 0;
`;

const DialogInput = styled.input`
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 20px;
    border-radius: 4px;
    border: 1px solid #dfe1e6;
`;

const DialogButton = styled.button`
    padding: 10px 20px;
    background: #0079bf;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        background: #026aa7;
    }
`;

const CancelIcon = styled(FaTimes)`
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    color: #aaa;
    &:hover {
        color: #000;
    }
`;

const ColorPickerContainer = styled.div`
    margin-bottom: 20px;
`;

const ColorPreview = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 4px;
    background-color: ${(props) => props.color};
    margin-left: 10px;
`;

const ColorPickerWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const SuccessMessage = styled.div`
    color: green;
    font-weight: bold;
`;

const Board = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [boardName, setBoardName] = useState('');
    const [boardColor, setBoardColor] = useState('#0079bf');
    const [boards, setBoards] = useState([]);
    const [sortOrder, setSortOrder] = useState('A-Z');
    const [searchQuery, setSearchQuery] = useState('');
    const [employeeId, setEmployeeId] = useState(null);
    const [employeeName, setEmployeeName] = useState(null);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const id = localStorage.getItem('employeeId');
        const name = localStorage.getItem('employeeName');

        if (id && name) {
            setEmployeeId(id);
            setEmployeeName(name);
        }
    }, []);

    const navigate = useNavigate();


    
    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/boards/');
                if (response.ok) {
                    const data = await response.json();
                    setBoards(data);
                } else {
                    console.error('Failed to fetch boards');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchBoards();
    }, []);

    const openDialog = () => {
        setIsDialogOpen(true);
        setSuccess('');
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
    };
    const handleBoardClick = (board) => {
        navigate('/Todolist', { state: { boardColor: board.color,employeeId: board.employeeId, employeeName:board.employeeName,boardName:board.boardName } });
    };
    const handleCreateBoard = async () => {
        if (boardName.trim()) {
            const newBoard = { boardName: boardName, color: boardColor, employeeId: employeeId, employeeName: employeeName };
    
            try {
                const response = await fetch('http://127.0.0.1:8000/boards/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newBoard),
                });
    
                if (response.ok) {
                    const savedBoard = await response.json();
                    console.log('Created board:', savedBoard);
    
                    if (savedBoard && savedBoard.boardName) {
                        setBoards((prevBoards) => [...prevBoards, savedBoard]);
    
                        setBoardName('');
                        setBoardColor('#0079bf');
    
                        // Show success message
                        setSuccess('Board created successfully!');
                        console.log('Created Successfully');
    
                        // Close the dialog after a delay
                        setTimeout(() => {
                            closeDialog();
                            setSuccess(''); // Clear the success message after closing the dialog
                        }, 2000); // Adjust the timeout duration (in milliseconds) as needed
                    }
                } else {
                    console.error('Failed to create board');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };
    
    

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const getFilteredAndSortedBoards = () => {
        let filteredBoards = boards
            .filter((board) => board && board.boardName && board.boardName.toLowerCase().includes(searchQuery.toLowerCase()));
    
        if (sortOrder === 'A-Z') {
            filteredBoards = filteredBoards.sort((a, b) => a.boardName.localeCompare(b.boardName));
        } else if (sortOrder === 'Z-A') {
            filteredBoards = filteredBoards.sort((a, b) => b.boardName.localeCompare(a.boardName));
        }
    
        return filteredBoards;
    };
    
    return (
        <BoardContainer>
            <Sidebar boards={boards} setBoards={setBoards} />
            <MainContent>
                <MainHeader>
                    <HeaderTop>
                        <HeaderTitle>Boards</HeaderTitle>
                    </HeaderTop>
                    <HeaderBottom>
                        <HeaderLeft>
                            <SortFilter>
                                <select value={sortOrder} onChange={handleSortChange}>
                                    <option value="A-Z">Alphabetically A-Z</option>
                                    <option value="Z-A">Alphabetically Z-A</option>
                                </select>
                            </SortFilter>
                        </HeaderLeft>
                        <SearchContainer>
                            <SearchIcon />
                            <SearchInput
                                type="search"
                                placeholder="Search boards"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </SearchContainer>
                    </HeaderBottom>
                </MainHeader>
                <BoardsSection>
                    <CreateNewBoardCard onClick={openDialog}>
                        + Create New Board
                    </CreateNewBoardCard>
                    {getFilteredAndSortedBoards().map((board) => (
                        <BoardCard
                            key={board.id}
                            bgColor={board.color}
                            onClick={() => handleBoardClick(board)}
                        >
                            {board.boardName}
                        </BoardCard>
                    ))}
                </BoardsSection>
                {isDialogOpen && (
                    <DialogOverlay>
                        <Dialog>
                            <CancelIcon onClick={closeDialog} />
                            <DialogTitle>Create New Board</DialogTitle>
                            <DialogInput
                                type="text"
                                placeholder="Board Title"
                                value={boardName}
                                onChange={(e) => setBoardName(e.target.value)}
                            />
                            <ColorPickerContainer>
                                <p>Pick a color:</p>
                                <ColorPickerWrapper>
                                    <SketchPicker
                                        color={boardColor}
                                        onChangeComplete={(color) => setBoardColor(color.hex)}
                                    />
                                    <ColorPreview color={boardColor} />
                                </ColorPickerWrapper>
                            </ColorPickerContainer>
                            <DialogButton onClick={handleCreateBoard}>Create</DialogButton>
                            {success && (
                                <SuccessMessage>{success}</SuccessMessage>
                            )}
                        </Dialog>
                    </DialogOverlay>
                )}

            </MainContent>
        </BoardContainer>
    );
};

export default Board;

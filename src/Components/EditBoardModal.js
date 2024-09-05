import React, { useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
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

const ModalContent = styled.div`
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
    text-align: center;
`;

const ModalTitle = styled.h2`
    margin-bottom: 20px;
    font-size: 18px;
    color: black;
`;

const ModalInput = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 4px;
    border: 1px solid #ccc;
`;

const ModalButton = styled.button`
    padding: 10px 20px;
    margin: 0 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    color: white;
    background: ${props => (props.danger ? '#ff4d4d' : '#0079bf')};

    &:hover {
        background: ${props => (props.danger ? '#ff3333' : '#005b9f')};
    }
`;

const EditBoardModal = ({ boardTitle, onSave, onClose }) => {
    const [newTitle, setNewTitle] = useState(boardTitle);

    const handleSave = () => {
        onSave(newTitle);
    };

    return (
        <ModalOverlay>
            <ModalContent>
                <ModalTitle>Edit Board Name</ModalTitle>
                <ModalInput
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                />
                <div>
                    <ModalButton onClick={handleSave}>Save</ModalButton>
                    <ModalButton onClick={onClose} danger>Cancel</ModalButton>
                </div>
            </ModalContent>
        </ModalOverlay>
    );
};

export default EditBoardModal;

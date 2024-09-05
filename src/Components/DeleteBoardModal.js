import React from 'react';
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

const DeleteBoardModal = ({ boardTitle, onDelete, onClose }) => {
    return (
        <ModalOverlay>
            <ModalContent>
                <ModalTitle>Are you sure you want to delete the board "{boardTitle}"?</ModalTitle>
                <div>
                    <ModalButton danger onClick={onDelete}>Delete</ModalButton>
                    <ModalButton onClick={onClose}>Cancel</ModalButton>
                </div>
            </ModalContent>
        </ModalOverlay>
    );
};

export default DeleteBoardModal;

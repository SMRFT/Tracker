import styled, { keyframes } from "styled-components";

// Keyframes for the slide-in animation from right to left
const slideInFromRight = keyframes`
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
`;

// Keyframes for the slide-out animation to the right
const slideOutToRight = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
`;

// Styled component for Notification Modal Container
const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw; /* Full width of the viewport */
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: flex-start; /* Modal dialog will appear from right */
  align-items: center;
  z-index: 1000;
`;

// Styled component for Modal Dialog
const ModalDialog = styled.div`
  background-color: white;
  border-radius: 0px; /* No border radius for full-screen effect */
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  animation: ${(props) => (props.isOpen ? slideInFromRight : slideOutToRight)} 0.4s ease forwards;
`;

// Styled component for Modal Content
const ModalContent = styled.div`
  padding: 20px;
  height: 100%;
  overflow-y: auto; /* Allows scrolling inside the modal if content is too long */
`;

// Styled component for Modal Header
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
`;

// Styled component for Modal Title
const ModalTitle = styled.h5`
  margin: 0;
  font-size: 1.5rem;
`;

// Styled component for Close Button
const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: black;
`;

// Styled component for Modal Body
const ModalBody = styled.div`
  padding-top: 10px;
  font-size: 1rem;
`;

// Styled component for Notification List
const NotificationList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

// Styled component for Notification Item
const NotificationItem = styled.li`
  padding: 10px;
  color: ${(props) => (props.read ? "gray" : "black")};
  font-weight: ${(props) => (props.read ? "normal" : "bold")};
  &:hover {
    background-color: #f9f9f9;
  }
`;

export default function NotificationModal({ isOpen, notifications, toggleNotificationModal }) {
  if (!isOpen) return null;

  return (
    <ModalContainer>
      <ModalDialog isOpen={isOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Notifications</ModalTitle>
            <CloseButton onClick={toggleNotificationModal}>&times;</CloseButton>
          </ModalHeader>
          <ModalBody>
            {notifications.length > 0 ? (
              <NotificationList>
                {notifications.map((notification, index) => (
                  <NotificationItem key={index} read={notification.read}>
                    {notification.content}
                  </NotificationItem>
                ))}
              </NotificationList>
            ) : (
              <p>No notifications.</p>
            )}
          </ModalBody>
        </ModalContent>
      </ModalDialog>
    </ModalContainer>
  );
}

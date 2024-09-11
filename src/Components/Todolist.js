import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useLocation, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const ItemType = {
  CARD: "card",
};

const Card = ({ id, index, columnId, text, moveCard, openModal }) => {
  const [, drag] = useDrag({
    type: ItemType.CARD,
    item: { id, index, columnId },
  });

  return (
    <div ref={drag} style={styles.card} onClick={() => openModal(text)}>
      <div style={styles.cardContent}>
        <span>{text || "No Name"}</span>
        {/* Pen icon on the right */}
      </div>
    </div>
  );
};

const Column = ({
  id,
  title,
  cards = [],
  moveCard,
  openModal,
  addCard,
  columns,
  setColumns,
  backgroundColor,
  showAddCardButton = false,
}) => {
  const [, drop] = useDrop({
    accept: ItemType.CARD,
    hover: (item) => {
      if (!item) return;

      const { id: cardId, index: fromIndex, columnId: fromColumnId } = item;
      const toIndex = cards.findIndex(card => card.id === cardId);

      if (fromColumnId === id) {
        // Moving within the same column
        if (toIndex !== -1 && fromIndex !== toIndex) {
          moveCard(fromIndex, id, toIndex, id);
          item.index = toIndex; // Update item index to reflect new position
        }
      } else {
        // Moving to a different column
        const toIndex = cards.length; // Place at the end of the column
        moveCard(fromIndex, fromColumnId, toIndex, id);
        item.columnId = id; // Update item columnId to reflect new column
      }
    },
  });

  const [inputValue, setInputValue] = useState("");
  const [isAddingCard, setIsAddingCard] = useState(false);


  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddCard = () => {
    if (inputValue.trim()) {
      addCard(id, inputValue);
      setInputValue("");
      setIsAddingCard(false);
    }
  };

  const handleRemoveCard = (cardId) => {
    console.log("Deleting card with ID:", cardId);  // Log the cardId
    fetch(`http://127.0.0.1:8000/cards/${cardId}/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((response) => {
        if (response.ok) {
            const updatedCards = cards.filter((card) => card.cardId !== cardId);
            const updatedColumns = { ...columns, [id]: updatedCards };
            setColumns(updatedColumns);
        } else {
            console.error("Failed to delete the card.");
        }
    })
    .catch((error) => {
        console.error("Error deleting card:", error);
    });
  };

  return (
    <div ref={drop} style={{ ...styles.column, backgroundColor }}>
      <h3 style={styles.columnTitle}>{title}</h3>
      {cards.map((card, index) => (
        <div key={card.cardId} style={styles.cardContainer}>
<Card
  id={card.cardId}
  index={index}
  columnId={id}
  text={card.cardName}
  moveCard={moveCard}
  openModal={(cardName) => openModal(card.cardName, card.cardId)} // Pass the required parameters
/>

          <button
            onClick={() => handleRemoveCard(card.cardId)}
            style={styles.removeCardButton}
          >
            ×
          </button>
        </div>
      ))}
      {showAddCardButton && (
        isAddingCard ? (
          <div style={styles.addCardContainer}>
            <input
              type="text"
              placeholder="Enter a name for this card..."
              value={inputValue}
              onChange={handleInputChange}
              style={styles.input}
            />
            <button onClick={handleAddCard} style={styles.addCardButton}>
              Add card
            </button>
            <button
              onClick={() => setIsAddingCard(false)}
              style={styles.cancelButton}
            >
              ×
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            style={styles.addInitialCardButton}
          >
            + Add a card
          </button>
        )
      )}
    </div>
  );
};

const DragAndDropCards = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { employeeId, employeeName, boardName, boardColor } = location.state || {};


  const [columns, setColumns] = useState({
    do: [],
    doing: [],
    done: [],
    hold: [],
  });
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleNotificationModal = () => {
    setIsNotificationModalOpen(!isNotificationModalOpen);
    setUnreadCount(0); // Reset unread count
  };


  const [modalContent, setModalContent] = useState({ cardName: "", cardId: "", boardName: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [nextCardId, setNextCardId] = useState(1); // Initialize cardId counter
  const [cardId, setCardId] = useState(""); // State for current cardId
  const [cardName, setCardName] = useState(""); // State for current cardName

  useEffect(() => {
    if (boardName) {
      fetchCards(boardName); // Fetch cards only if boardName is available
    }
  }, [boardName]);

  const fetchCards = (boardName) => {
    // Fetch all cards to ensure continuous `nextCardId`
    fetch("http://127.0.0.1:8000/cards/")
      .then((response) => response.json())
      .then((allData) => {
        // Calculate the next card ID
        const maxCardId = Math.max(...allData.map(card => parseInt(card.cardId, 10)), 0);
        setNextCardId(maxCardId + 1);
  
        // Fetch cards filtered by boardName
        fetch(`http://127.0.0.1:8000/cards/?boardName=${boardName}`)
          .then((response) => response.json())
          .then((data) => {
            console.log("Fetched cards for board:", data);
            const updatedColumns = {
              do: data.filter((card) => card.columnId === "do"),
              doing: data.filter((card) => card.columnId === "doing"),
              done: data.filter((card) => card.columnId === "done"),
              hold: data.filter((card) => card.columnId === "hold"),
            };
            setColumns(updatedColumns);
          })
          .catch((error) => {
            console.error("Error fetching board-specific cards:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching all cards:", error);
      });
  };
  

  const moveCard = (fromIndex, fromColumnId, toIndex, toColumnId) => {
    const updatedColumns = { ...columns };
    if (!updatedColumns[fromColumnId] || !updatedColumns[toColumnId]) {
      console.error('Invalid column IDs:', fromColumnId, toColumnId);
      return;
    }
    const [movedCard] = updatedColumns[fromColumnId].splice(fromIndex, 1);
    if (!movedCard) {
      console.error('Card not found:', { fromIndex, fromColumnId });
      return;
    }
    updatedColumns[toColumnId].splice(toIndex, 0, movedCard);
    setColumns(updatedColumns);
    fetch(`http://127.0.0.1:8000/cards/${movedCard.cardId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ columnId: toColumnId }),
    }).catch((error) => {
      console.error("Error updating card column:", error);
    });
  }

  const addCard = async (columnId, text) => {
    const newCard = {
      cardId: `${nextCardId}`,
      cardName: text || `Task ${Date.now()}`,
      columnId,
      employeeId,
      employeeName,
      boardName,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/cards/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCard),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Card added:", data);

        // Store cardId and cardName in localStorage
        localStorage.setItem('cardId', data.cardId);
        localStorage.setItem('cardName', data.cardName);

        const updatedColumns = { ...columns };
        updatedColumns[columnId].push({
          cardId: data.cardId,
          cardName: data.cardName,
        });
        setColumns(updatedColumns);
        setNextCardId(nextCardId + 1); // Increment cardId counter
      } else {
        console.error("Error adding card:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving card:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = (cardName, cardId, boardName) => {
    setCardName(cardName);
    setCardId(cardId);
    setModalContent({ cardName, cardId, boardName });
    setIsModalOpen(true);
  };

  return (
    <TodolistContainer bgColor={boardColor}>
    <DndProvider backend={HTML5Backend}>
    <Employeecontainer>
          {/* Notification Icon with unread count */}
          <NotificationIcon onClick={toggleNotificationModal}>
            <FontAwesomeIcon icon={faBell} />
            {unreadCount > 0 && <span style={styles.notificationBadge}>{unreadCount}</span>}
          </NotificationIcon>
          <div>ID: {employeeId}</div>
          <div>Name: {employeeName}</div>
        </Employeecontainer>
      <div style={styles.board}>
        <Column
          id="do"
          title="Do"
          cards={columns.do}
          moveCard={moveCard}
          openModal={openModal}
          addCard={addCard}
          columns={columns}
          setColumns={setColumns}
          backgroundColor="#F1F2F4"
          showAddCardButton={true}
        />
        <Column
          id="doing"
          title="Doing"
          cards={columns.doing}
          moveCard={moveCard}
          openModal={openModal}
          columns={columns}
          setColumns={setColumns}
          backgroundColor="#F1F2F4"
        />
        <Column
          id="done"
          title="Done"
          cards={columns.done}
          moveCard={moveCard}
          openModal={openModal}
          columns={columns}
          setColumns={setColumns}
          backgroundColor="#F1F2F4"
        />
        <Column
          id="hold"
          title="Hold"
          cards={columns.hold}
          moveCard={moveCard}
          openModal={openModal}
          columns={columns}
          setColumns={setColumns}
          backgroundColor="#F1F2F4"
        />
      </div>

      {isModalOpen && (
        <div className="modal" tabIndex="-1" role="dialog" style={styles.modal}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h5 className="modal-title">{boardName}</h5>
                <div
                  type="button"
                  aria-label="Close"
                  onClick={closeModal}
                  style={{ cursor: 'pointer', marginLeft: 'auto', fontSize: '2rem' }}
                >
                  <span aria-hidden="true">&times;</span>
                </div>
              </div>
              <div className="modal-body">
                <Comment 
                  cardId={cardId} 
                  cardName={cardName} 
                  boardName={boardName} 
                />
              </div>
            </div>
          </div>
        </div>
      )}
              {/* Notification Modal */}
              {isNotificationModalOpen && (
          <div className="modal" tabIndex="-1" role="dialog" style={styles.modal}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Notifications</h5>
                  <button type="button" onClick={toggleNotificationModal} style={{ cursor: 'pointer', fontSize: '2rem' }}>
                    &times;
                  </button>
                </div>
                <div className="modal-body">
                  {notifications.length > 0 ? (
                    <ul>
                      {notifications.map((notification, index) => (
                        <li key={index} style={{ color: notification.read ? 'gray' : 'black' }}>
                          {notification.content}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No notifications.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
    </DndProvider>
     </TodolistContainer>
  );
};
// Styled component for the overall page
const TodolistContainer = styled.div`
    background-color: ${(props) => props.bgColor || '#ffffff'};
    min-height: 100vh;
    padding: 20px;
`;
const ModalContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

// Styled component for the Modal Dialog
const ModalDialog = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 400px;
  max-width: 80%;
  padding: 20px;
`;

// Styled component for the Modal Header
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
`;

// Styled component for the Modal Body
const ModalBody = styled.div`
  padding: 10px 0;
  font-size: 1rem;
`;

// Styled component for the Close Button
const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
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
const Employeecontainer = styled.div`
  background-color: #F1F2F4;
  padding: 16px;
  float: right;
  border-radius: 8px;
  color: pink;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative; /* To position the notification icon */
`;

const NotificationIcon = styled.div`
  position: absolute;
  top: 8px; /* Adjust as needed */
  right: 35px; /* Adjust as needed */
  font-size: 40px;
  color: #81DAE3; /* Color for the icon (you can change this) */
  cursor: pointer;
  
  &:hover {
    color: #ff4500;
  }
`;


const styles = {
  notificationBadge: {
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '50%',
    padding: '5px 10px',
    fontSize: '12px',
  },
  board: {
    display: "flex",
    justifyContent: "space-around",
    padding: "20px",
    marginTop: '80px',
    marginLeft: '20px',
  },
  column: {
    width: "280px",
    padding: "10px",
    borderRadius: "20px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    gap:"10px",
  },
  columnTitle: {
    textAlign: "center",
    marginBottom: "10px",

  },
  card: {
    backgroundColor: "#F1F2F4",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
    textAlign: 'left', // Align text to the left
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    width: "200px",
  },
  cardContent: {
    display: "flex", // Flexbox to align text and icon
    justifyContent: "space-between", // Space between text and icon
    alignItems: "center", // Vertically align items
  },
  penIcon: {
    color: "#6c757d", // Grey color for the pen icon
    cursor: "pointer",
    marginLeft: "10px", // Add space between text and icon
  },
  cardContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  removeCardButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "red",
    fontSize: "18px",
    cursor: "pointer",
  },
  addCardContainer: {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    padding: "5px",
    width: "100%",
    marginBottom: "5px",
  },
  addCardButton: {
    padding: "5px 10px",
    backgroundColor: "#5cb85c",
    color: "#fff",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
    marginBottom: "5px",
  },
  addInitialCardButton: {
    padding: "5px 10px",
    backgroundColor: "#5cb85c",
    color: "#fff",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "red",
    fontSize: "18px",
    cursor: "pointer",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "5px",
    maxWidth: "500px",
    width: "80%",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  modalCloseButton: {
    marginTop: "20px",
    padding: "5px 10px",
    backgroundColor: "#d9534f",
    color: "#fff",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
  },
};


export default DragAndDropCards;

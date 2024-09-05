import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuidv4 } from 'uuid';
import { useLocation, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import styled from "styled-components";

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
      {text || "No Name"}
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
      if (item && item.columnId !== id) {
        const { id: cardId, index: fromIndex } = item;
        const toIndex = cards.length; // Place at the end of the column
        if (cardId !== undefined && fromIndex !== undefined) {
          moveCard(fromIndex, item.columnId, toIndex, id);
        }
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
    const updatedCards = cards.filter((card) => card.id !== cardId);
    const updatedColumns = { ...columns, [id]: updatedCards };
    setColumns(updatedColumns);
  };

  return (
    <div ref={drop} style={{ ...styles.column, backgroundColor }}>
      <h3 style={styles.columnTitle}>{title}</h3>
      {cards.map((card, index) => (
        <div key={card.id} style={styles.cardContainer}>
          <Card
            id={card.id}
            index={index}
            columnId={id}
            text={card.cardName}
            moveCard={moveCard}
            openModal={openModal}
          />
          <button
            onClick={() => handleRemoveCard(card.id)}
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
  const { employeeId, employeeName ,boardName} = location.state || {};

  const [columns, setColumns] = useState({
    column1: [], // Do column
    column2: [], // Doing column
    column3: [], // Done column
    column4: [], // Hold column
  });

  const [modalContent, setModalContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = () => {
    fetch("http://127.0.0.1:8000/cards/")
      .then((response) => response.json())
      .then((data) => {
        // Ensure data has unique IDs
        console.log("Fetched cards:", data);
        const updatedColumns = {
          column1: data.filter((card) => card.columnId === "column1"),
          column2: data.filter((card) => card.columnId === "column2"),
          column3: data.filter((card) => card.columnId === "column3"),
          column4: data.filter((card) => card.columnId === "column4"),
        };
        setColumns(updatedColumns);
      })
      .catch((error) => {
        console.error("Error fetching cards:", error);
      });
  };

  const moveCard = (fromIndex, fromColumnId, toIndex, toColumnId) => {
    const updatedColumns = { ...columns };
    if (!updatedColumns[fromColumnId] || !updatedColumns[toColumnId]) {
      console.error(`Invalid column IDs: ${fromColumnId} or ${toColumnId}`);
      return;
    }
    const [movedCard] = updatedColumns[fromColumnId].splice(fromIndex, 1);
    if (movedCard) {
      if (toIndex === -1) {
        updatedColumns[toColumnId].push(movedCard);
      } else {
        updatedColumns[toColumnId].splice(toIndex, 0, movedCard);
      }
      setColumns(updatedColumns);
      // Update the backend to reflect the move
      fetch(`http://127.0.0.1:8000/cards/${movedCard.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ columnId: toColumnId }),
      }).catch((error) => {
        console.error("Error updating card column:", error);
      });
    } else {
      console.error(`Card could not be moved. Card at index ${fromIndex} is missing.`);
    }
  };

  const addCard = (columnId, text) => {
    const newCard = {
      id: uuidv4(), // Temporarily use a UUID for local state, but the server will provide the final ID
      cardName: text || `Task ${Date.now()}`,
      columnId,
      employeeId,
      employeeName,
      boardName,
    };
    // Send POST request to Django API
    fetch("http://127.0.0.1:8000/cards/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCard),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Card added:", data); // Log new card
        const updatedColumns = { ...columns };
        updatedColumns[columnId].push(data);
        setColumns(updatedColumns);
      })
      .catch((error) => {
        console.error("Error saving card:", error);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = (text) => {
    setModalContent(text);
    setIsModalOpen(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Employeecontainer>
        <div>ID: {employeeId}</div>
        <div>Name: {employeeName}</div>
      </Employeecontainer>
      <div style={styles.board}>
        <Column
          id="column1"
          title="Do"
          cards={columns.column1}                                      
          moveCard={moveCard}
          openModal={openModal}
          addCard={addCard}
          columns={columns}
          setColumns={setColumns}
          backgroundColor="#FFB6C1"
          showAddCardButton={true} // Only "Do" column has the Add Card button
        />
        <Column
          id="column2"
          title="Doing"
          cards={columns.column2}
          moveCard={moveCard}
          openModal={openModal}
          columns={columns}
          setColumns={setColumns}
          backgroundColor="#87CEEB"
        />
        <Column
          id="column3"
          title="Done"
          cards={columns.column3}
          moveCard={moveCard}
          openModal={openModal}
          columns={columns}
          setColumns={setColumns}
          backgroundColor="#98FB98"
        />
        <Column
          id="column4"
          title="Hold"
          cards={columns.column4}
          moveCard={moveCard}
          openModal={openModal}
          columns={columns}
          setColumns={setColumns}
          backgroundColor="#FFDEAD"
        />
      </div>

      {isModalOpen && (
        <div className="modal" tabIndex="-1" role="dialog" style={styles.modal}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h5 className="modal-title">Task Details</h5>
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
                <Comment />
              </div>
            </div>
          </div>
        </div>
      )}
    </DndProvider>
  );
};

const Employeecontainer = styled.div`
  background-color: #F0F1F4;
  padding: 16px;
  float:right;
  border-radius: 8px;
  color: pink;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const styles = {

  board: {
    display: "flex",
    justifyContent: "space-around",
    padding: "20px",
    marginTop:'80px'

  },
  column: {
    width: "200px",
    padding: "10px",
    borderRadius: "5px",
    minHeight: "400px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  columnTitle: {
    textAlign: "center",
    marginBottom: "10px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
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
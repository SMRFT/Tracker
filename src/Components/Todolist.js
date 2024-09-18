import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useLocation, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import styled from "styled-components";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaCalendarAlt } from 'react-icons/fa';
const ItemType = {
  CARD: "card",
};
const localizer = momentLocalizer(moment);
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
  const { employeeId, employeeName,boardId, boardName } = location.state || {};

  const [columns, setColumns] = useState({
    do: [],
    doing: [],
    done: [],
    hold: [],
  });

  const [modalContent, setModalContent] = useState({ cardName: "", cardId: "", boardName: "" ,boardId:''});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedCardName, setEditedCardName] = useState("");
  const [cardId, setCardId] = useState(""); // State for current cardId
  const [cardName, setCardName] = useState(""); // State for current cardName
  const [isCalendarVisible, setIsCalendarVisible] = useState(false); // State to control calendar visibility
  const [events, setEvents] = useState([]); // State for calendar events

  useEffect(() => {
    if (boardId) {
      fetchCards(boardId); // Fetch cards only if boardName is available
    }
  }, [boardId]);

  const fetchCards = (boardId) => {
    fetch(`http://127.0.0.1:8000/cards/?boardId=${boardId}`)
      .then((response) => response.json())
      .then((data) => {
        const updatedColumns = {
          do: data.filter((card) => card.columnId === "do"),
          doing: data.filter((card) => card.columnId === "doing"),
          done: data.filter((card) => card.columnId === "done"),
          hold: data.filter((card) => card.columnId === "hold"),
        };
        setColumns(updatedColumns);

        // Map the data to calendar events
        const calendarEvents = data.map(card => ({
          title: card.cardName,
          start: new Date(card.startdate),
          end: new Date(card.enddate),
          allDay: false, // Set to true if you want all-day events
        }));
        setEvents(calendarEvents);
      })
      .catch((error) => console.error("Error fetching cards:", error));
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
  };
  const handleEditCardName = () => {
    fetch(`http://127.0.0.1:8000/cards/${modalContent.cardId}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardName: editedCardName }),
    })
      .then((response) => {
        if (response.ok) {
          const updatedColumns = { ...columns };
          const updatedCards = updatedColumns[modalContent.boardName].map((card) =>
            card.cardId === modalContent.cardId ? { ...card, cardName: editedCardName } : card
          );
          setColumns({ ...updatedColumns, [modalContent.boardName]: updatedCards });
          setIsModalOpen(false);
        }
      })
      .catch((error) => console.error("Error updating card name:", error));
  };

  const addCard = async (columnId, text) => {
    const newCard = {
      cardId,
      cardName: text || `Task ${Date.now()}`,
      boardId,
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
    
    <DndProvider backend={HTML5Backend}>
      <div style={styles.header}>
      <FaCalendarAlt
        style={styles.calendarIcon}
        onClick={() => setIsCalendarVisible(!isCalendarVisible)}
      />
    </div>
    {isCalendarVisible && (
      <div style={styles.calendarContainer}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={styles.calendar}
          // Add a custom `eventPropGetter` if needed to customize event styles
          // eventPropGetter={(event) => ({ style: { backgroundColor: 'lightblue' } })}
        />
      </div>
    )}
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
          backgroundColor="#FFB6C1"
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
          backgroundColor="#87CEEB"
        />
        <Column
          id="done"
          title="Done"
          cards={columns.done}
          moveCard={moveCard}
          openModal={openModal}
          columns={columns}
          setColumns={setColumns}
          backgroundColor="#98FB98"
        />
        <Column
          id="hold"
          title="Hold"
          cards={columns.hold}
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
               <input
              type="text"
              value={editedCardName}
              onChange={(e) => setEditedCardName(e.target.value)}
              style={styles.input}
              placeholder={modalContent.cardName}
            />
            <button onClick={handleEditCardName} style={styles.addCardButton}>
              Save
            </button>
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
                  employeeId={employeeId}
                  employeeName={employeeName}
                  boardId={boardId}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </DndProvider>
  );
};




const styles = {
  board: {
    display: "flex",
    justifyContent: "space-around",
    padding: "20px",
    marginTop: '80px',
  },
  column: {
    width: "250px",
    padding: "10px",
    borderRadius: "5px",
    minHeight: "400px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    gap:"10px",
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
  calendarIcon: {
    fontSize: '24px',
    cursor: 'pointer',
  },
  calendarContainer: {
    position: 'fixed',
    top: 0,
    left: 250,
    width: '85vw',
    height: '90vh',
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: 0,
    boxShadow: 'none',
    zIndex: 9999, // Ensure the calendar appears above other content
    overflow: 'hidden', // Prevent scrollbars if needed
  },
  calendar: {
    height: '100%', // Ensure the calendar occupies the full height of the container
    width: '100%',  // Ensure the calendar occupies the full width of the container
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
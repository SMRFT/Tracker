import styled from "styled-components";
// import { RiArrowDropDownLine } from "react-icons/ri";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RiArrowDropDownLine, RiCalendarLine } from "react-icons/ri";
import { MdOutlineDateRange } from "react-icons/md";
import React, { useState, useEffect, useRef } from 'react';
import { EmojiKeyboard } from "reactjs-emoji-keyboard";
import { TfiCommentsSmiley } from "react-icons/tfi";
import { FaUsers } from "react-icons/fa";
import Members from './Members';

const CardContainer = styled.div`
  background-color: #F0F1F4;
  padding: 16px;
  border-radius: 8px;
  color: white;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Datebutton = styled.button`
  position: absolute; /* Position relative to CardContainer */
  top: 16px; /* Adjust top positioning as needed */
  right: 16px; /* Adjust right positioning as needed */
  background-color: #9C446E;
  color: black;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
`;

const Memberbutton = styled.button`
  position: absolute; /* Position relative to CardContainer */
  top: 56px; /* Adjust top positioning as needed */
  right: 16px; /* Adjust right positioning as needed */
  background-color: #9C446E;
  color: black;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const MembersContainer = styled.div`
 color:black;
  padding: 16px;
  background-color: #F0F1F4;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const MemberItem = styled.div`
  padding: 8px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;

  &:hover {
    background-color: #ddd;
  }
`;

const Title = styled.h2`
  font-size: 18px;
  color: #ecf0f1;
`;

const Section = styled.div`
  margin-bottom: 16px;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  color: #000000;
  margin-bottom: 8px;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  padding: 8px;
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid #7f8c8d;
`;

const ToolbarButton = styled.button`
  background: none;
  border: none;
  color: #000000;
  margin-right: 8px;
  cursor: pointer;
  font-size: 16px;
  position: relative;

  &:hover {
    color: #ecf0f1;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 24px;
  left: 0;
  background-color: #2c3e50;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 10;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #B692C2;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;
const DropdownItem = styled.div`
  padding: 8px 16px;
  font-size: 14px;
  color: #ecf0f1;
  cursor: pointer;
  display: flex;
  justify-content: space-between;

  &:hover {
    background-color: #34495e;
  }
`;

const DescriptionInputContainer = styled.div`
  position: relative;
`;

const DescriptionInput = styled.div`
  width: 100%;
  height: 100px;
  padding: 12px;
  border-radius: 0 0 4px 4px;
  border: none;
  font-size: 14px;
  background-color: white;
  color: #000000;
  resize: none;
  line-height: 1.5;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow-y: auto;
  white-space: pre-wrap;
`;

const SaveButton = styled.button`
  background-color: #3498db;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  margin-right: 8px;

  &:hover {
    background-color: #2980b9;
  }
`;

const CancelButton = styled.button`
  background-color: transparent;
  color: #bdc3c7;
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    color: #ecf0f1;
  }
`;

const ActivityInput = styled.textarea`
  width: 100%;
  height: 40px;
  padding: 8px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  background-color: white;
  color: #000000;
  resize: none;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #2980b9;
  }
`;

const Comment = ({ cardId, cardName, boardName }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const descriptionRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const applyHeading = (headingType) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.extractContents();
      const headingElement = document.createElement(headingType);
      headingElement.appendChild(selectedText);
      range.insertNode(headingElement);

      const newRange = document.createRange();
      newRange.selectNodeContents(headingElement);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
    setDropdownOpen(false);
  };

  const applyFormat = (format) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.extractContents();
      let formatElement;

      if (format === "bold") {
        formatElement = document.createElement("strong");
      } else if (format === "italic") {
        formatElement = document.createElement("em");
      }

      if (
        formatElement &&
        range.startContainer.parentNode.tagName.toLowerCase() === formatElement.tagName.toLowerCase()
      ) {
        // If already formatted, remove the format by replacing the node with its contents
        const parentNode = range.startContainer.parentNode;
        const fragment = document.createDocumentFragment();
        while (parentNode.firstChild) {
          fragment.appendChild(parentNode.firstChild);
        }
        parentNode.parentNode.replaceChild(fragment, parentNode);
      } else if (formatElement) {
        formatElement.appendChild(selectedText);
        range.insertNode(formatElement);
        const newRange = document.createRange();
        newRange.setStartAfter(formatElement);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }
  };

  const handleFileAttach = () => {
    fileInputRef.current.click();
  };

  const handleImageAttach = () => {
    imageInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      setImage(selectedImage);
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    // Close modal if both dates are selected
    if (date && endDate) {
      closeModal();
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    // Close modal if both dates are selected
    if (date && startDate) {
      closeModal();
    }
  };
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const [isModal1Open, setModal1Open] = useState(false);

  const openMembers = () => {
    setModal1Open(true); // Open modal
  };

  const closeMembers = () => {
    setModal1Open(false); // Close modal
  };
  



  const handleSaveDescription = async () => {
    const text = descriptionRef.current.textContent;

    try {
      const response = await fetch("http://127.0.0.1:8000/save-description/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          cardId,
          cardName,
          boardName
        }),
      });
      const data = await response.json();
      console.log("Description saved successfully:", data);
    } catch (error) {
      console.error("Error saving description:", error);
    }
  };



  const fetchDescription = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/save-description/?cardId=${cardId}&boardName=${boardName}&cardName=${cardName}`);
      const data = await response.json();
      if (data.error) {
        console.error(data.error);
      } else {
        descriptionRef.current.textContent = data.text; // assuming the description field is named 'text'
      }
    } catch (error) {
      console.error("Error fetching description:", error);
    }
  };
  
  useEffect(() => {
    fetchDescription();
  }, [cardId, boardName, cardName]);
  

  const handleSaveFilesImages = async () => {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/upload-content/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Files and images uploaded successfully:", data);
    } catch (error) {
      console.error("Error uploading files and images:", error);
    }
  };

  const handleSave = () => {
    handleSaveDescription(); // Save description text with additional fields
    handleSaveFilesImages();  // Save files and images
  };

  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/add-membername/?cardId=${cardId}&boardName=${boardName}&cardName=${cardName}`);
        const data = await response.json();
        if (response.ok) {
          console.log('Fetched members:', data);
          setMembers(data); // Ensure data is an array
        } else {
          console.error('Error fetching members:', data.error);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, [cardId, boardName, cardName]);
  
  

  const [comments, setComments] = useState([]);
  const activityInputRef = useRef(null);

  const fetchComments = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/get-comments/");
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments(); // Fetch comments when component mounts
  }, []);

  const handleSaveActivity = async () => {
    const commentText = activityInputRef.current.value.trim();

    if (!commentText) {
      alert("Comment cannot be empty!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/save-comment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: commentText,
          cardId,
          cardName,
          boardName
        }),
      });
      const data = await response.json();
      console.log("Comment saved:", data);
      fetchComments(); // Refresh comments
      activityInputRef.current.value = ""; // Clear the input
    } catch (error) {
      console.error("Error saving comment:", error);
    }
  };

  return (
    <center>
      <CardContainer>
      <Header>
          <Datebutton onClick={openModal}><MdOutlineDateRange size={25} color="black" />Dates</Datebutton> {/* Trigger modal */}
          <Memberbutton onClick={openMembers}><FaUsers size={25} color="black" />Members</Memberbutton>
          {isModal1Open && (
          <Modal onClose={closeMembers}>
            <Members
              cardId={cardId} 
              cardName={cardName} 
              boardName={boardName}
              closeModal={closeMembers}  />
          </Modal>
        )}
        </Header>
        <div>
      {/* Add more functionality here */}
      <MembersContainer>
      <h2>Members</h2>
      {members.length > 0 ? (
        members.map((member) => (
          <MemberItem key={member.employeeId}>
            {member.employeeName}
          </MemberItem>
        ))
      ) : (
        <p>No members found.</p>
      )}
    </MembersContainer>
    </div>
        <Section>
          <SectionTitle>Description</SectionTitle>
          <DescriptionInputContainer>
            <Toolbar>
              <ToolbarButton onClick={toggleDropdown}>
                Aa <RiArrowDropDownLine />
                {isDropdownOpen && (
                  <Dropdown>
                    <DropdownItem onClick={() => applyHeading("p")}>
                      Normal text <span>Ctrl+Alt+0</span>
                    </DropdownItem>
                    <DropdownItem onClick={() => applyHeading("h1")}>
                      Heading 1 <span>Ctrl+Alt+1</span>
                    </DropdownItem>
                    <DropdownItem onClick={() => applyHeading("h2")}>
                      Heading 2 <span>Ctrl+Alt+2</span>
                    </DropdownItem>
                    <DropdownItem onClick={() => applyHeading("h3")}>
                      Heading 3 <span>Ctrl+Alt+3</span>
                    </DropdownItem>
                    <DropdownItem onClick={() => applyHeading("h4")}>
                      Heading 4 <span>Ctrl+Alt+4</span>
                    </DropdownItem>
                    <DropdownItem onClick={() => applyHeading("h5")}>
                      Heading 5 <span>Ctrl+Alt+5</span>
                    </DropdownItem>
                    <DropdownItem onClick={() => applyHeading("h6")}>
                      Heading 6 <span>Ctrl+Alt+6</span>
                    </DropdownItem>
                  </Dropdown>
                )}
              </ToolbarButton>
              <ToolbarButton onClick={() => applyFormat("bold")}>B</ToolbarButton>
              <ToolbarButton onClick={() => applyFormat("italic")}>I</ToolbarButton>
              <ToolbarButton onClick={handleFileAttach}>🔗</ToolbarButton>
              <ToolbarButton onClick={handleImageAttach}>🖼️</ToolbarButton>
            </Toolbar>
            <DescriptionInput
              contentEditable
              ref={descriptionRef}
              placeholder="Add a more detailed description..."
            />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt"
            />
            <input
              type="file"
              ref={imageInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
              accept="image/*"
            />
          </DescriptionInputContainer>
          <Actions>
            <SaveButton onClick={handleSave}>Save</SaveButton>
            <CancelButton>Cancel</CancelButton>
          </Actions>
        </Section>

        <Section>
          <SectionTitle>Activity</SectionTitle>
          <ActivityInput
            placeholder="Add a comment or activity..."
            ref={activityInputRef}
          />
          <Actions>
            <Button onClick={handleSaveActivity}>Comment</Button>
          </Actions>
        </Section>
      </CardContainer>
    </center>
  );
};

export default Comment;

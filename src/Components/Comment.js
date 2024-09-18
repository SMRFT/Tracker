import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useLocation } from "react-router-dom";

const CardContainer = styled.div`
  background-color: #F0F1F4;
  padding: 16px;
  border-radius: 8px;
  color: white;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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

const FileImageContainer = styled.div`
  margin-top: 16px;
`;

const FileImageItem = styled.div`
  margin-bottom: 8px;
`;
const CommentsSection = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
`;

const CommentItem = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  p {
    margin: 0;
    color: #333;
  }

  .comment-author {
    font-weight: bold;
    color: #0073e6;
  }

  .comment-date {
    font-size: 0.85em;
    color: #999;
  }
`;
const Comment = ({ cardId, cardName, boardName,employeeId,employeeName ,boardId}) => {

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const descriptionRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  console.log(employeeId,"employeeId")
  console.log(employeeName,"employeeName")

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
          boardName,


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
    fetchFileImage(); // Call this function to fetch file and image URLs
  }, [cardId, boardName, cardName]);
  



  
  

  const handleSaveFilesImages = async () => {
    const formData = new FormData();
  
    if (file) {
      formData.append("file", file);
    }
    if (image) {
      formData.append("image", image);
    }
  
    formData.append("cardId", cardId);
    formData.append("cardName", cardName);
    formData.append("boardName", boardName);
    formData.append("employeeId", employeeId);
    formData.append("employeeName", employeeName);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/upload-content/", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      console.log("Files, images, and card details uploaded successfully:", data);
  
      // Construct filenames based on the format used for storing
      const fileFilename = `${cardId}_${cardName}_${boardName}`;
      const imageFilename = `${cardId}_${cardName}_${boardName}`;
  
      setFileUrl(`http://127.0.0.1:8000/get-file/${fileFilename}/`);
      setImageUrl(`http://127.0.0.1:8000/get-file/${imageFilename}/`);
    } catch (error) {
      console.error("Error uploading files and images:", error);
    }
  };
  
  
  
  

  const handleSave = () => {
    handleSaveDescription(); // Save description text with additional fields
    handleSaveFilesImages();  // Save files and images
  };

  const [comments, setComments] = useState([]);
  const activityInputRef = useRef(null);

  const fetchComments = async () => {
    try {
      const queryParams = new URLSearchParams({ cardId, boardId }).toString();
      const response = await fetch(
        `http://127.0.0.1:8000/get_comments/?${queryParams}`
      );
      const data = await response.json();
      setComments(data.comments); // Correctly accessing the comments array
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments(); // Fetch comments when component mounts
    fetchFileImage();
  }, []);

  const handleSaveActivity = async () => {
    const commentText = activityInputRef.current.value.trim();
  
    if (!commentText) {
      alert("Comment cannot be empty!");
      return;
    }
  
    const currentDate = new Date();
    const date = currentDate.toISOString().split('T')[0];  // Format date as YYYY-MM-DD
    const time = currentDate.toTimeString().split(' ')[0];  // Format time as HH:MM:SS
  
    try {
      const response = await fetch("http://127.0.0.1:8000/save_comment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: commentText,
          cardId,      // Assuming this is already defined in your component
          boardId,     // Assuming this is already defined in your component
          employeeId,  // Assuming this is already defined in your component
          employeeName,// Assuming this is already defined in your component
          date,        // Current date
          time         // Current time
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Comment saved:", data);
        
        fetchComments(); // Assuming this function refreshes the comments
        activityInputRef.current.value = ""; // Clear the input field
      } else {
        console.error("Failed to save comment. Status:", response.status);
      }
    } catch (error) {
      console.error("Error saving comment:", error);
    }
  };
  
  

  // const filename=cardId+'_'+cardName+'_'+boardName;
  // console.log("filename:",filename)

  const fetchFileImage = async () => {
    try {
      // Construct filenames based on the format used for storing
      const fileFilename = `${boardName}_${cardId}_${cardName}`+'.'+'pdf';
      const imageFilename = `${boardName}_${cardId}_${cardName}`+'.'+'jpg';
      // Fetch file URL
      const fileResponse = await fetch(`http://127.0.0.1:8000/get-file/${fileFilename}/`);
      if (fileResponse.ok) {
        setFileUrl(`http://127.0.0.1:8000/get-file/${fileFilename}/`);
      } else {
        console.error("Error fetching the file:", fileResponse.statusText);
      }
  
      // Fetch image URL
      const imageResponse = await fetch(`http://127.0.0.1:8000/get-file/${imageFilename}/`);
      if (imageResponse.ok) {
        setImageUrl(`http://127.0.0.1:8000/get-file/${imageFilename}/`);
      } else {
        console.error("Error fetching the image:", imageResponse.statusText);
      }
    } catch (error) {
      console.error("Error fetching file/image:", error);
    }
  };

  
  return (
    <center>
      <CardContainer>
        <Header>
          <Title>Admin Work</Title>
        </Header>
        <div>

      <p>Card ID: {cardId}</p>
      <p>Card Name: {cardName}</p>
      <p>Board Name: {boardName}</p>
      {/* Add more functionality here */}
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
        <CommentsSection>
  {comments.length > 0 ? (
    comments.map((comment, index) => (
      <CommentItem key={index}>
        <p>
          <span className="comment-author">
            {comment.empname ? comment.empname : "Anonymous"}
          </span>{" "}
          posted:
        </p>
        <p>{comment.commenttext}</p>
        <small className="comment-date">
          {comment.date} at {comment.time}
        </small>
      </CommentItem>
    ))
  ) : (
    <p>No comments yet.</p>
  )}
</CommentsSection>

        <FileImageContainer>
  {fileUrl && (
    <FileImageItem>
      <p>File:</p>
      <a href={fileUrl} target="_blank" rel="noopener noreferrer">View File</a>
    </FileImageItem>
  )}
  {imageUrl && (
    <FileImageItem>
      <p>Image:</p>
      <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "100%" }} />
    </FileImageItem>
  )}
</FileImageContainer>


      </CardContainer>
    </center>
  );
};

export default Comment;

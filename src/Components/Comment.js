import React, { useState, useRef ,useEffect} from "react";
import styled from "styled-components";
import { RiArrowDropDownLine } from "react-icons/ri";
import { EmojiKeyboard } from "reactjs-emoji-keyboard";

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
  background-color: #e74c3c;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #c0392b;
  }
`;

const Comment = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
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

  const handleSave = () => {
    const description = descriptionRef.current.textContent;
  
    const formData = new FormData();
    formData.append("description", description);
    if (file) {
      formData.append("file", file);
    }
    if (image) {
      formData.append("image", image);
    }
  
    fetch("http://127.0.0.1:8000/upload-content/", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Content uploaded successfully:", data);
      })
      .catch((error) => {
        console.error("Error uploading content:", error);
      });
  };
  const [comments, setComments] = useState([]);
  const activityInputRef = useRef(null);

  const fetchComments = () => {
    fetch("http://127.0.0.1:8000/get-comments/")
      .then((response) => response.json())
      .then((data) => {
        setComments(data);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  };

  useEffect(() => {
    fetchComments(); // Fetch comments when component mounts
  }, []);

  const handleSaveActivity = () => {
    const commentText = activityInputRef.current.value;

    fetch("http://127.0.0.1:8000/save-comment/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: commentText }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Comment saved:", data);
        fetchComments(); // Fetch comments after saving
        activityInputRef.current.value = ""; // Clear input after saving
      })
      .catch((error) => {
        console.error("Error saving comment:", error);
      });
  };

  return (
    <center>
      <CardContainer>
        <Header>
          <Title>Admin Work</Title>
        </Header>

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
           {/* <EmojiKeyboard
      height={320}
      width={350}
      theme="dark"
      searchLabel="Procurar emoji"
      searchDisabled={false}
      onEmojiSelect={(emoji) =>console.log(emoji)}          
      categoryDisabled={false}
    /> */}
          <Actions>
            <Button onClick={handleSaveActivity}>Comment</Button>
          </Actions>
          <div style={{color:"black"}}>
            {comments.map((comment) => (
              <div key={comment.id}>
                <p>{comment.text}</p>
                <small>{new Date(comment.created_at).toLocaleString()}</small>
              </div>
            ))}
          </div>
        </Section>
      </CardContainer>
    </center>
  );
};

export default Comment;

"use client";

import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Typography,
  Grow,
} from "@mui/material";
import { useRef, useEffect, useState } from "react";
import BotIcon from "../BotIcon";
import { AccountCircle, Logout, Send } from "@mui/icons-material";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import withAuth from "../protectedRoute";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm DrugGuard. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);
    setMessage(""); // Clear the input field
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message }, // Add the user's message to the chat
      { role: "assistant", content: "" }, // Add a placeholder for the assistant's response
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: message }]),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content:
            "I'm sorry, but I encountered an error. Please try again later.",
        },
      ]);
    }
    setIsLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail("");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background:
            "linear-gradient(45deg, rgba(255, 255, 255, 0.6), rgba(50, 50, 50, 0.8))",
          backdropFilter: "blur(14px)",
          transition: "all 0.8s ease-in-out",
          boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
        }}
      >
        <Toolbar>
          <BotIcon />
          <Typography variant="h6" sx={{ flexGrow: 1, marginLeft: 1 }}>
            DrugGuard
          </Typography>

          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <AccountCircle fontSize="large" sx={{ color: "#afafaf" }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            sx={{
              "& .MuiPaper-root": {
                backgroundColor: "#fff",
                boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
                color: "#1e1e1e",
              },
            }}
          >
            <MenuItem>
              <Typography variant="body2">{userEmail}</Typography>
            </MenuItem>
            <MenuItem onClick={async () => await signOut(auth)}>
              <Logout fontSize="small" />
              <Typography variant="body2" sx={{ marginLeft: 1 }}>
                Sign Out
              </Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: 2,
        }}
      >
        <Stack spacing={2}>
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                maxWidth: "80%",
                borderRadius: "20px",
                backdropFilter: "blur(14px)",
                boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
                padding: 2,
                marginBottom: 1,
                color: "#000",
                backgroundColor:
                  message.role === "assistant"
                    ? "rgba(255, 255, 255, 0.55)"
                    : "rgba(255, 255, 255, 0.3)",
                alignSelf:
                  message.role === "assistant" ? "flex-start" : "flex-end",
                overflowWrap: "break-word",
              }}
            >
              {message.content}
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
      </Box>

      <Box
        sx={{
          padding: 2,
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          position: "sticky",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          color: "#000",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Ask me anything about your Drugs..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={3}
          fullWidth
          InputProps={{
            endAdornment: (
              <IconButton onClick={sendMessage} disabled={isLoading}>
                <Send style={{ color: "#000" }} />
              </IconButton>
            ),
          }}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
            color: "#000",
            borderRadius: "25px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "25px",
              "& fieldset": {
                borderColor: "#555",
              },
              "&:hover fieldset": {
                borderColor: "#777",
              },
              "&.Mui-focused fieldset": {
                borderColor: "white",
              },
            },
            "& .MuiInputBase-input": {
              color: "#000",
            },
            "& .MuiInputLabel-root": {
              color: "#000",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#000",
            },
          }}
          ref={inputRef}
        />
      </Box>
    </Box>
  );
};

export default withAuth(ChatPage);

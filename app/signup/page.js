"use client";
// import Image from "next/image";
// import OrangeBot from "../../public/orangeBot.png"; // Adjust the path if necessary
import BotIcon from "../BotIcon";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  AppBar,
  Toolbar,
  CssBaseline,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { auth, provider } from "../../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";

const theme = createTheme({
  palette: {
    primary: {
      main: "#121212",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#1e1e1e",
    },
    background: {
      default: "#121212",
    },
    text: {
      primary: "#ffffff",
      secondary: "#e94560",
    },
  },
  typography: {
    h3: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 500,
    },
    body1: {
      fontWeight: 300,
    },
  },
});

// Functional component to render a custom Bot Icon using SVG

const SignUpPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [value, setValue] = useState("");

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (password.length <= 5) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/chat");
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/weak-password":
          errorMessage =
            "Password is too weak. Please choose a stronger password.";
          break;
        case "auth/email-already-in-use":
          errorMessage = "An account already exists with this email address.";
          break;
        default:
          errorMessage =
            "Failed to sign up. Please check your details and try again.";
      }
      setError(errorMessage);
    }
  };

  const handleGoogleSignIn = async () => {
    signInWithPopup(auth, provider)
      .then((data) => {
        setValue(data.user.email);
        localStorage.setItem("email", data.user.email);
        router.push("/chat");
      })
      .catch((error) => {
        setError("Google sign-in failed. Please try again.");
      });
  };

  useEffect(() => {
    setValue(localStorage.getItem("email"));
  }, []);

  const handleSignIn = () => {
    router.push("/signin");
  };

  const ToHome = () => {
    router.push("/");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="static"
        sx={{
          background:
            "linear-gradient(45deg, rgba(255, 255, 255, 0.6), rgba(50, 50, 50, 0.8))",
          backdropFilter: "blur(14px)",
          transition: "all 0.8s ease-in-out",
          boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
        }}
        elevation={"0"}
      >
        <Toolbar>
          <BotIcon />

          {/* <Image
            src={OrangeBot} // Use the imported image with the alias BotIcon
            alt="Bot Icon" // Alt text describing the image
            width={30} // Specify the width
            height={30} // Specify the height
            layout="responsive" // Optional: Use responsive layout
          /> */}
          <Typography
            variant="h6"
            color="inherit"
            style={{ marginLeft: "10px" }}
          >
            <a
              href="/"
              onClick={ToHome}
              style={{ color: "#000", textDecoration: "none" }}
            >
              DrugGuard
            </a>
          </Typography>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "flex-end",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "40%" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(14px)",
            marginTop: "20px",
            borderRadius: "1rem",
            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
            padding: "20px",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Sign Up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSignUp}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ style: { color: theme.palette.text.primary } }}
              InputProps={{
                style: { color: theme.palette.text.primary },
                sx: {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.secondary.main,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.text.primary,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.text.primary,
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ style: { color: theme.palette.text.primary } }}
              InputProps={{
                style: { color: theme.palette.text.primary },
                sx: {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.secondary.main,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.text.primary,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.text.primary,
                  },
                },
              }}
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{
                mt: 3,
                mb: 2,
                borderRadius: "20px",
                backgroundColor: "#1e1e1e",
                textTransform: "none",
              }}
            >
              Sign Up
            </Button>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary, textAlign: "center" }}
            >
              or
            </Typography>
            <Button
              fullWidth
              variant="conatined"
              color="secondary"
              sx={{
                mt: 2,
                mb: 2,
                borderRadius: "20px",
                backgroundColor: "#1e1e1e",
                color: "#ffffff",
                textTransform: "none",
              }}
              onClick={handleGoogleSignIn}
            >
              Sign up with Gmail
            </Button>
            <Button
              fullWidth
              variant="text"
              sx={{
                color: theme.palette.text.primary,
                mt: 3,
                borderRadius: "20px",
                textTransform: "none",
              }}
              onClick={handleSignIn}
            >
              Already have an account? Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignUpPage;

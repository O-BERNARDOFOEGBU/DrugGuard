"use client";
import BotIcon from "../BotIcon";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

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

const SignInPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [value, setValue] = useState("");

  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/chat");
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password.";
          break;
        case "auth/user-not-found":
          errorMessage = "No user found with this email.";
          break;
        default:
          errorMessage =
            "Failed to sign in. Please check your credentials and try again.";
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

  const handleSignUp = () => {
    router.push("/signup");
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
        elevation={0}
      >
        <Toolbar>
          <BotIcon />
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
              Drug Guard
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
            padding: "20px",
            marginTop: "20px",
            borderRadius: "1rem",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(14px)",
            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Sign In
          </Typography>
          <Box
            component="form"
            onSubmit={handleSignIn}
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
              autoComplete="current-password"
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
              Sign In
            </Button>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary, textAlign: "center" }}
            >
              or
            </Typography>
            <Button
              fullWidth
              variant="contained"
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
              Sign in with Gmail
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
              onClick={handleSignUp}
            >
              Don&apos;t have an account? Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignInPage;

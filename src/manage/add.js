import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { ref, uploadBytes } from "firebase/storage";
import Navbar from "../navbar";
import { storage } from "../firebase"; // import Firebase storage instance
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  Card,
  CardContent,
  Divider,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  RadioGroup,
  Radio,
  FormControl,
  MenuItem,
  IconButton, // Import IconButton component
  InputAdornment // Import InputAdornment component
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Import Visibility and VisibilityOff icons

function Add() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!e.target.value) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (!e.target.value) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const handleSave = async () => {
    if (!email) {
      setEmailError(true);
      return;
    }
    if (!password) {
      setPasswordError(true);
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        const userData = { email: user.email }; // Additional user data to store in Firestore
        await firestore.collection("admins").doc(user.uid).set(userData);
        // Perform any additional actions after user creation
      }
    } catch (error) {
      console.error("Error creating user:", error.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ marginLeft: 200 }}>
        <Grid container spacing={0}>
          <Grid item lg={12} md={12} xs={12}>
            <Card variant="outlined">
              <Box
                sx={{
                  padding: "15px 30px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box flexGrow={1}>
                  <Typography
                    variant="h5"
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      fontFamily: "Arial, sans-serif",
                      color: "#4a5568",
                    }}
                  >
                    เพิ่มข้อมูล
                  </Typography>
                </Box>
              </Box>
              <Divider />
              <CardContent sx={{ padding: "30px" }}>
                <form>
                  <Grid container spacing={2}>
                    <Grid item lg={6}>
                      {/* ตำแหน่ง TextField ที่ 1 */}
                      <TextField
                        id="email"
                        label="Email"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={email}
                        onChange={handleEmailChange}
                        error={emailError}
                        helperText={emailError && "กรุณากรอกอีเมล"}
                      />
                    </Grid>
                    <Grid item lg={6}>
                      {/* ตำแหน่ง TextField ที่ 2 */}
                      <TextField
                        id="password"
                        label="Password"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handlePasswordChange}
                        error={passwordError}
                        helperText={passwordError && "กรุณากรอกรหัสผ่าน"}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Box textAlign={"right"}>
                    <Button
                      color="primary"
                      variant="contained"
                      type="button"
                      onClick={handleSave}
                    >
                      บันทึก
                    </Button>
                    <Button
                      color="primary"
                      variant="contained"
                      type="button"
                      style={{marginLeft: '8px'}}
                    >
                      ยกเลิก
                    </Button>
                  </Box>
                  
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Add;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { ref, uploadBytes } from "firebase/storage";
import Navbar from "../navbar";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  addDoc,
  setDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
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
  IconButton, 
  InputAdornment, 
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material"; 
import { margins } from '../styles/margin'
function Add() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const navigate = useNavigate();
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

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
    if (!emailRegex.test(email)) {
      alert("โปรดกรอกอีเมลให้ถูกต้อง");
      return;
    }

    if (!email) {
      setEmailError(true);
      return;
    }
    if (!password) {
      setPasswordError(true);
      return;
    }
    if (password.length < 6) {
      alert("รหัสผ่านต้องมากกว่า 6 ตัว");
      return;
    }
    try {
      
      const querySnapshot = await getDocs(
        query(collection(firestore, "admins"), where("email", "==", email))
      );
      if (!querySnapshot.empty) {
        alert("มีอีเมลนี้อยู่แล้วในระบบ");
        return;
      }

      
      const docRef = await addDoc(collection(firestore, "admins"), {
        email,
        password,
      });
      alert("เพิ่มข้อมูลเสร็จสิ้น");
      navigate("/manage");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleBack = async () => {
    navigate("/manage");
  };

  return (
    <div>
      <Navbar />
      <div style={{ marginLeft:margins.editMargin }}>
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
                        type="email"
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
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
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
                      style={{ marginLeft: "8px" }}
                      onClick={handleBack}
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

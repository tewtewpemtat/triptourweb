import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ListItemIcon } from "@material-ui/core";
import { firestore } from "../firebase";
import "./edittimeline.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Navbar from "../navbar";
import { storage } from "../firebase";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import PhotoIcon from "@mui/icons-material/Photo";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { margins } from "../styles/margin";
import {
  Card,
  CardContent,
  InputLabel,
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
} from "@mui/material";

function EditTimeLine() {
  const { userId } = useParams();
  const [userData, setUserData] = useState({});
  const [intime, setIntime] = useState(new Date());
  const [outtime, setOuttime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = doc(firestore, "timelinestamp", userId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data());
          if (userSnapshot.data().intime) {
            setIntime(new Date(userSnapshot.data().intime.seconds * 1000));
          }
          if (userSnapshot.data().outtime) {
            if (typeof userSnapshot.data().outtime === "string") {
              setOuttime(null);
            } else {
              setOuttime(new Date(userSnapshot.data().outtime.seconds * 1000));
            }
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleUpdateUser = async () => {
    try {
      const userDoc = doc(firestore, "timelinestamp", userId);
      await updateDoc(userDoc, userData);
      console.log("User updated successfully!");
      alert("แก้ไขข้อมูลสำเร็จ");
    } catch (error) {
      console.error("Error updating user: ", error);
    }
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [id]: id === 'distance' ? parseInt(value, 10) : value,
    }));
  };
  


  const handleSubmit = () => {
    handleUpdateUser();
  };

  return (
    <div>
      <Navbar />
      <div style={{ marginLeft: margins.editMargin }}>
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
                <Link to={`/timelines`}>
                  <ArrowBackIosIcon style={{ color: "#4a5568" }} />
                </Link>
                <Typography
                  variant="h5"
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    fontFamily: "Arial, sans-serif",
                    color: "#4a5568",
                  }}
                >
                  เเก้ไขข้อมูล
                </Typography>
              </Box>
              <Divider />
              <CardContent sx={{ padding: "30px" }}>
                <form>
                  <Grid container spacing={2}>
                    <Grid item lg={6}>
                      <TextField
                        id="placeid"
                        label="placeId"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={userData.placeid || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item lg={6}>
                      <TextField
                        id="placetripid"
                        label="placeTripId"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={userData.placetripid || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item lg={6}>
                      <TextField
                        id="useruid"
                        label="userUid"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={userData.useruid || ""}
                        onChange={handleChange}
                      />
                    </Grid>{" "}
                    <Grid item lg={6}>
                      <TextField
                        id="distance"
                        label="distance"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={userData.distance || ""}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item lg={6}>
                      <label htmlFor="inTime">inTime : </label>
                      <DatePicker
                        id="inTime"
                        selected={intime}
                        onChange={(date) => {
                          setIntime(date);
                          setUserData((prevData) => ({
                            ...prevData,
                            intime: date,
                          }));
                        }}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="dd/MM/yyyy HH:mm"
                        className="input"
                        customInput={
                          <TextField
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        }
                      />
                    </Grid>

                    <Grid item lg={6}>
                      <label htmlFor="outtime">outTime : </label>
                      <DatePicker
                        id="outtime"
                        selected={outtime}
                        onChange={(date) => {
                          setOuttime(date);
                          setUserData((prevData) => ({
                            ...prevData,
                            outtime: date,
                          }));
                        }}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="dd/MM/yyyy HH:mm"
                        className="input"
                        customInput={
                          <TextField
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                          />
                        }
                      />
                    </Grid>
                  </Grid>
                  <Box textAlign="right">
                    <Button
                      color="primary"
                      variant="contained"
                      type="button"
                      onClick={handleSubmit}
                    >
                      บันทึก
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

export default EditTimeLine;

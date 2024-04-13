import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker CSS
import "./editplace.css"; // Import CSS file for styling
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; // import Firebase storage instance
import Navbar from "../navbar";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import PhotoIcon from '@mui/icons-material/Photo';

import {
  Card,
  InputLabel,
  CardContent,
  Divider,
  Box,
  Select,
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

function EditPlace() {
  const { userId, placeId } = useParams();
  const [userData, setUserData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [placestatus, setplaceStatus] = useState("");
  const [placerun, setrunStatus] = useState("");
  const [placeadd, setaddStatus] = useState("");
  const [placetimestart, setplacetimestart] = useState(new Date()); // State for trip start date
  const [placetimeend, setplacetimeend] = useState(new Date()); // State for trip end date
  const [placestart, setPlaceStart] = useState({ latitude: 0, longitude: 0 });
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file


  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = doc(firestore, "places", userId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data());
          setplaceStatus(userSnapshot.data().placestatus || "");
          setrunStatus(userSnapshot.data().placerun || "");
          setaddStatus(userSnapshot.data().placeadd || "");
          setPlaceStart({
            latitude: userSnapshot.data().placestart
              ? userSnapshot.data().placestart.latitude || 0
              : 0,
            longitude: userSnapshot.data().placestart
              ? userSnapshot.data().placestart.longitude || 0
              : 0,
          });
          // Set trip start and end dates if available
          if (userSnapshot.data().placetimestart) {
            setplacetimestart(
              new Date(userSnapshot.data().placetimestart.seconds * 1000)
            );
          }
          if (userSnapshot.data().placetimeend) {
            setplacetimeend(
              new Date(userSnapshot.data().placetimeend.seconds * 1000)
            );
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

  const handlePlaceStartChange = (e) => {
    const { name, value } = e.target;
    setPlaceStart((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Update userData with the new placestart value
    setUserData((prevUserData) => ({
      ...prevUserData,
      placestart: {
        ...prevUserData.placestart,
        [name]: value,
      },
    }));
  };

  const handleUpdateUser = async () => {
    try {
      if (selectedFile) {
        const profileLink = await uploadProfileImageToStorage(selectedFile,userId);
        setUserData((prevData) => ({
          ...prevData,
          placepicUrl: profileLink,
        }));
        console.log(profileLink);
      }
      const userDoc = doc(firestore, "places", userId);
      await updateDoc(userDoc, userData);
      alert("แก้ไขข้อมูลสำเร็จ");
      console.log("User updated successfully!");
    } catch (error) {
      console.error("Error updating user: ", error);
    }
  };

  function generateRandomNumber() {
    const min = 100000000;
    const max = 999999999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber.toString();
  }

  const uploadProfileImageToStorage = async (imageFile,userId) => {
    try {
      const randomImg = generateRandomNumber();
      const filePath = `trip/places/profilepicedit/${placeId}/${userId}${randomImg}.jpg`;
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, imageFile);
      console.log("Image uploaded successfully!");

      // Generate the download URL
      const downloadURL = await getDownloadURL(storageRef);

      console.log("Profile image URL:", downloadURL);
      return downloadURL; // Return the download URL of the image
    } catch (error) {
      console.error("Error uploading image:", error);
      return null; // Return null in case of error
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handlePlaceChange3 = (e) => {
    const value = e.target.value;
    setplaceStatus(value);
    setUserData((prevData) => ({
      ...prevData,
      placestatus: value,
    }));
  };
  const handlePlaceChange2 = (e) => {
    const value = e.target.value;
    setaddStatus(value);
    setUserData((prevData) => ({
      ...prevData,
      placeadd: value,
    }));
  };
  const handlePlaceChange = (e) => {
    const value = e.target.value;
    setrunStatus(value);
    setUserData((prevData) => ({
      ...prevData,
      placerun: value,
    }));
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
                <Link to={`/place/${placeId}`}>
                  <ArrowBackIosIcon style={{ color: "#4a5568" }} />
                </Link>

                <Typography
                  variant="h5"
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    fontFamily: "Arial, sans-serif",
                    color: "#4a5568",
                    marginLeft: "5px", // เพิ่มการเยื้องเพื่อให้ข้อความอยู่ในบรรทัดเดียวกับไอคอน
                  }}
                >
                  แก้ไขข้อมูล
                </Typography>
              </Box>

              <Divider />
              <CardContent sx={{ padding: "30px" }}>
                <form>
                  <Grid style={{ marginBottom: "20px" }} container spacing={2}>
                    <Grid item lg={6}>
                      <TextField
                        label="placeName"
                        name="placename"
                        value={userData.placename || ""}
                        onChange={handleChange}
                        variant="outlined"
                        className="input"
                      />
                    </Grid>
                    <Grid item lg={6}>
                      <TextField
                        label="placeAddress"
                        name="placeaddress"
                        value={userData.placeaddress || ""}
                        onChange={handleChange}
                        variant="outlined"
                        className="input"
                      />
                    </Grid>
                  </Grid>
                  <Grid style={{ marginBottom: "20px" }} container spacing={2}>
                    <Grid item lg={6}>
                      <TextField
                        label="placeProvince"
                        name="placeprovince"
                        value={userData.placeprovince || ""}
                        onChange={handleChange}
                        variant="outlined"
                        className="input"
                      />
                    </Grid>
                    <Grid item lg={6}>
                      <TextField
                        label="placeTripid"
                        name="placetripid"
                        value={userData.placetripid || ""}
                        onChange={handleChange}
                        variant="outlined"
                        className="input"
                      />
                    </Grid>
                  </Grid>
                  <Grid style={{ marginBottom: "25px" }} container spacing={2}>
                    <Grid item lg={6}>
                      <TextField
                        label="placeLatitude"
                        name="placeLatitude"
                        value={userData.placeLatitude || ""}
                        onChange={handleChange}
                        variant="outlined"
                        className="input"
                      />
                    </Grid>
                    <Grid item lg={6}>
                      <TextField
                        label="placeLongitude"
                        name="placeLongitude"
                        value={userData.placeLongitude || ""}
                        onChange={handleChange}
                        variant="outlined"
                        className="input"
                      />
                    </Grid>
                  </Grid>
                  <Grid style={{ marginBottom: "25px" }} container spacing={2}>
                    <Grid item lg={6}>
                      <TextField
                        label="startLatitude"
                        name="latitude"
                        value={placestart.latitude || ""}
                        onChange={handlePlaceStartChange}
                        variant="outlined"
                        className="input"
                      />{" "}
                    </Grid>{" "}
                    <Grid item lg={6}>
                      <TextField
                        label="startLongitude"
                        name="longitude"
                        value={placestart.longitude || ""}
                        onChange={handlePlaceStartChange}
                        variant="outlined"
                        className="input"
                      />{" "}
                    </Grid>
                  </Grid>
                  <Grid style={{ marginBottom: "20px" }} container spacing={2}>
                    <Grid item lg={4}>
                      <label htmlFor="placetimestart">placeTimeStart : </label>
                      <DatePicker
                        selected={placetimestart}
                        onChange={(date) => {
                          setplacetimestart(date);
                          setUserData((prevData) => ({
                            ...prevData,
                            placetimestart: date,
                          }));
                        }}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="time"
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
                    <Grid item lg={4}>
                      <label htmlFor="placetimeend">placeTimeEnd : </label>
                      <DatePicker
                        selected={placetimeend}
                        onChange={(date) => {
                          setplacetimeend(date);
                          setUserData((prevData) => ({
                            ...prevData,
                            placetimeend: date,
                          }));
                        }}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="time"
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
                    <Grid item lg={4}>
                      <TextField
                        label="userUid"
                        name="useruid"
                        value={userData.useruid || ""}
                        onChange={handleChange}
                        variant="outlined"
                        className="input"
                      />
                    </Grid>
                  </Grid>
                  <Grid style={{ marginBottom: "20px" }} container spacing={2}>
                    <Grid item lg={6}>
                      <label htmlFor="placewhogo">placeWhogo : </label>
                      <ul>
                        {userData.placewhogo &&
                          userData.placewhogo.map((item, index) => (
                            <div key={index}>
                              <Grid container spacing={2} key={index}>
                                <Grid item xs={10}>
                                  <TextField
                                    type="text"
                                    style={{ marginBottom: "8px" }}
                                    value={item}
                                    onChange={(e) => {
                                      const updatedPlacewhogo = [
                                        ...userData.placewhogo,
                                      ];
                                      updatedPlacewhogo[index] = e.target.value;
                                      setUserData((prevData) => ({
                                        ...prevData,
                                        placewhogo: updatedPlacewhogo,
                                      }));
                                    }}
                                    variant="outlined"
                                    className="input"
                                  />
                                </Grid>
                                <Grid item xs={2}>
                                  <Button
                                    type="button"
                                    style={{
                                      marginTop: "10px",
                                      marginLeft: "-25px",
                                      marginBottom: "5px",
                                      backgroundColor: "red",
                                    }}
                                    onClick={() => {
                                      const updatedPlacewhogo = [
                                        ...userData.placewhogo,
                                      ];
                                      updatedPlacewhogo.splice(index, 1);
                                      setUserData((prevData) => ({
                                        ...prevData,
                                        placewhogo: updatedPlacewhogo,
                                      }));
                                    }}
                                    variant="contained"
                                  >
                                    ลบ
                                  </Button>
                                </Grid>
                              </Grid>
                            </div>
                          ))}
                      </ul>
                      <Button
                        type="button"
                        variant="contained"
                        onClick={() => {
                          setUserData((prevData) => ({
                            ...prevData,
                            placewhogo: [...prevData.placewhogo, ""],
                          }));
                        }}
                      >
                        เพิ่ม
                      </Button>
                    </Grid>
                  </Grid>

                  <Grid style={{ marginBottom: "25px" }} container spacing={2}>
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <InputLabel
                          htmlFor="placeadd"
                          sx={{
                            marginLeft: "5px",
                            background: "white",
                            paddingLeft: "5px",
                          }}
                        >
                          placeAdd
                        </InputLabel>
                        <Select
                          id="placeadd"
                          name="placeadd"
                          value={placeadd}
                          onChange={handlePlaceChange2}
                          variant="outlined"
                          className="input"
                        >
                          <MenuItem value="Yes">Yes</MenuItem>
                          <MenuItem value="No">No</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <InputLabel
                          htmlFor="placerun"
                          sx={{
                            marginLeft: "5px",
                            background: "white",
                            paddingLeft: "5px",
                          }}
                        >
                          placeRun
                        </InputLabel>
                        <Select
                          id="placerun"
                          name="placerun"
                          value={placerun}
                          onChange={handlePlaceChange}
                          variant="outlined"
                          className="input"
                        >
                          <MenuItem value="Start">Start</MenuItem>
                          <MenuItem value="Running">Running</MenuItem>
                          <MenuItem value="End">End</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <InputLabel
                          htmlFor="placestatus"
                          sx={{
                            marginLeft: "5px",
                            background: "white",
                            paddingLeft: "5px",
                          }}
                        >
                          placeStatus
                        </InputLabel>
                        <Select
                          id="placestatus"
                          name="placestatus"
                          value={placestatus}
                          onChange={handlePlaceChange3}
                          variant="outlined"
                          className="input"
                        >
                          <MenuItem value="Added">Added</MenuItem>
                          <MenuItem value="Wait">Wait</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <TextField
                    id="upload-file"
                    type="file"
                    inputProps={{ accept: ".jpg, .jpeg, .png" }}
                    onChange={handleImageChange}
                    style={{ display: "none" }} // Hide the input field
                  />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                
                      marginBottom: "20px",
                    }}
                  >
                    <InputLabel htmlFor="upload-file" sx={{ cursor: "pointer" }}>
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={<PhotoIcon />}
                      >
                        เปลี่ยนรูปสถานที่  
                      </Button>
                    </InputLabel>
                    <Typography variant="body1" sx={{ marginLeft: "10px" }}>
                      {selectedFile ? selectedFile.name : "ไม่ได้เลือกไฟล์"}
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Button
                      color="primary"
                      variant="contained"
                      type="button"
                      onClick={handleUpdateUser}
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

export default EditPlace;

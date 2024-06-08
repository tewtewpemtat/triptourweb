import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import "./editplace.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Navbar from "../navbar";
import { useParams } from "react-router-dom";
import { query, where } from "firebase/firestore";
import {
  Typography,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Card,
  CardContent,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { margins } from "../styles/margin";
const useStyles = makeStyles((theme) => ({
  table: {
    borderCollapse: "collapse",
    width: "100%",

    "& th": {
      borderBottom: "1px solid #ddd",
      background: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      padding: theme.spacing(1, 2),
      textAlign: "left",
    },
    "& td": {
      borderBottom: "1px solid #ddd",
      padding: theme.spacing(1, 2),
      textAlign: "left",
    },
  },
}));

function ShowPlace() {
  const { userId } = useParams();
  const [tripData, setUserData] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersRef = collection(firestore, "places");
        const querySnapshot = await getDocs(
          query(
            collection(firestore, "places"),
            where("placetripid", "==", userId)
          )
        );
        const userDataArray = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          data.uid = doc.id;
          return data;
        });
        setUserData(userDataArray);
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };
  const filteredTrips = tripData.filter((place) => {
    const placeStartDate = place.placetimestart?.toDate();
    const placeEndDate = place.placetimeend?.toDate();

    const matchesSearchTerm =
      place.uid?.toLowerCase().includes(searchTerm) ||
      place.placename?.toLowerCase().includes(searchTerm) ||
      place.placeaddress?.toLowerCase().includes(searchTerm) ||
      place.placeLatitude.toString().toLowerCase().includes(searchTerm) ||
      place.placeLongitude.toString().toLowerCase().includes(searchTerm) ||
      place.placeadd?.toLowerCase().includes(searchTerm) ||
      place.placerun?.toLowerCase().includes(searchTerm) ||
      place.placestatus?.toLowerCase().includes(searchTerm) ||
      place.placetripid?.toLowerCase().includes(searchTerm) ||
      place.useruid?.toLowerCase().includes(searchTerm) ||
      place.province?.toLowerCase().includes(searchTerm);
    const matchesDateRange =
      (!startDate || (placeStartDate && placeStartDate >= startDate)) &&
      (!endDate || (placeEndDate && placeEndDate <= endDate));

    return matchesSearchTerm && matchesDateRange;
  });
  const handleDeleteUser = async (uid) => {
    const confirmed = window.confirm("โปรดยืนยันการลบข้อมูล");
    if (confirmed) {
      try {
        await deleteDoc(doc(firestore, "places", uid));
        const updatedUserData = tripData.filter((user) => user.uid !== uid);
        setUserData(updatedUserData);
        alert("ลบข้อมูลสำเร็จ");
      } catch (error) {
        console.error("Error deleting user: ", error);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <Box sx={{ marginLeft: margins.showMargin }}>
        <Card variant="outlined">
          <CardContent>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gridColumnGap: 10,
                marginBottom: "15px",
                "& .MuiTextField-root": {
                  height: "50px",
                },
              }}
            >
              <TextField
                label="ค้นหา ID"
                variant="outlined"
                name="uid"
                fullWidth
                margin="normal"
                onChange={handleSearch}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
              />
              <TextField
                label="ค้นหา NAME"
                variant="outlined"
                name="placename"
                fullWidth
                margin="normal"
                onChange={handleSearch}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
              />
              <TextField
                label="ค้นหา ADDRESS"
                variant="outlined"
                name="placeaddress"
                fullWidth
                margin="normal"
                onChange={handleSearch}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
              />
              <TextField
                label="ค้นหา PROVINCE"
                variant="outlined"
                name="placeprovince"
                fullWidth
                margin="normal"
                onChange={handleSearch}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
              />
              <TextField
                label="ค้นหา LATITUDE"
                variant="outlined"
                name="placeLatitude"
                fullWidth
                margin="normal"
                onChange={handleSearch}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
              />
              <TextField
                label="ค้นหา LONGITUDE"
                variant="outlined"
                name="placeLongitude"
                fullWidth
                margin="normal"
                onChange={handleSearch}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
              />
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel
                  id="status-select-label"
                  style={{ fontSize: "14px" }}
                >
                  ค้นหา PLACEADD
                </InputLabel>
                <Select
                  labelId="status-select-label"
                  label="ค้นหา PLACEADD"
                  variant="outlined"
                  name="placeadd"
                  fullWidth
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value.toLowerCase())
                  }
                >
                  <MenuItem value="">-- เลือกสถานะ --</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                  <MenuItem value="Yes">Yes</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel
                  id="status-select-label"
                  style={{ fontSize: "14px" }}
                >
                  ค้นหา PLACERUN
                </InputLabel>
                <Select
                  labelId="status-select-label"
                  label="ค้นหา PLACERUN"
                  variant="outlined"
                  name="placerun"
                  fullWidth
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value.toLowerCase())
                  }
                >
                  <MenuItem value="">-- เลือกสถานะ --</MenuItem>
                  <MenuItem value="Start">Start</MenuItem>
                  <MenuItem value="Running">Running</MenuItem>
                  <MenuItem value="End">End</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel
                  id="status-select-label"
                  style={{ fontSize: "14px" }}
                >
                  ค้นหา STATUS
                </InputLabel>
                <Select
                  labelId="status-select-label"
                  label="ค้นหา STATUS"
                  variant="outlined"
                  name="placestatus"
                  fullWidth
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value.toLowerCase())
                  }
                >
                  <MenuItem value="">-- เลือกสถานะ --</MenuItem>
                  <MenuItem value="Wait">Wait</MenuItem>
                  <MenuItem value="Added">Added</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="ค้นหา TRIPID"
                variant="outlined"
                name="placetripid"
                fullWidth
                margin="normal"
                onChange={handleSearch}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
              />
              <TextField
                label="ค้นหา USERUID"
                variant="outlined"
                name="useruid"
                fullWidth
                margin="normal"
                onChange={handleSearch}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 3.5 , marginBottom : '15px'}}>
              <DatePicker
                id="placetimestart"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="dd/MM/yyyy HH:mm"
                locale="th"
                className="input"
                customInput={
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="ค้นหา TIMESTART"
                    InputLabelProps={{ shrink: true }}
                    style={{ width: "120%", marginRight: "33px" }}
                  />
                }
              />
              <DatePicker
                id="placetimeend"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
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
                    label="ค้นหา TIMEEND"
                    InputLabelProps={{ shrink: true }}
                    style={{ width: "120%", marginLeft: "33px" }}
                  />
                }
              />
            </Box>
            <Box sx={{ overflow: { xs: "auto", sm: "unset" } }}>
              <TableContainer>
                <Table staria-label="simple table" className={classes.table}>
                  <TableHead>
                    <TableCell style={{ backgroundColor: "transparent" }}>
                      <Typography
                        variant="subtitle1"
                        style={{
                          fontSize: "13px",
                          fontWeight: "bold",
                          fontFamily: "Arial, sans-serif",
                          color: "#4a5568",
                        }}
                      >
                        ID
                      </Typography>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "transparent" }}>
                      <Typography
                        variant="subtitle1"
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          fontFamily: "Arial, sans-serif",
                          color: "#4a5568",
                        }}
                      >
                        NAME
                      </Typography>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "transparent" }}>
                      <Typography
                        variant="subtitle1"
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          fontFamily: "Arial, sans-serif",
                          color: "#4a5568",
                        }}
                      >
                        ADDRESS
                      </Typography>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "transparent" }}>
                      <Typography
                        variant="subtitle1"
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          fontFamily: "Arial, sans-serif",
                          color: "#4a5568",
                        }}
                      >
                        PROVINCE
                      </Typography>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "transparent" }}>
                      <Typography
                        variant="subtitle1"
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          fontFamily: "Arial, sans-serif",
                          color: "#4a5568",
                        }}
                      >
                        TRIPID
                      </Typography>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "transparent" }}>
                      <Typography
                        variant="subtitle1"
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          fontFamily: "Arial, sans-serif",
                          color: "#4a5568",
                        }}
                      >
                        LATITUDE
                      </Typography>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "transparent" }}>
                      <Typography
                        variant="subtitle1"
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          fontFamily: "Arial, sans-serif",
                          color: "#4a5568",
                        }}
                      >
                        LONGITUDE
                      </Typography>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "transparent" }}>
                      <Typography
                        variant="subtitle1"
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          fontFamily: "Arial, sans-serif",
                          color: "#4a5568",
                        }}
                      >
                        PLACESTART
                      </Typography>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "transparent" }}>
                      <Typography
                        variant="subtitle1"
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          fontFamily: "Arial, sans-serif",
                          color: "#4a5568",
                        }}
                      >
                        TIMESTART
                      </Typography>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "transparent" }}>
                      <Typography
                        variant="subtitle1"
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          fontFamily: "Arial, sans-serif",
                          color: "#4a5568",
                        }}
                      >
                        TIMEEND
                      </Typography>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "transparent" }}>
                      <Typography
                        variant="subtitle1"
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          fontFamily: "Arial, sans-serif",
                          color: "#4a5568",
                        }}
                      >
                        USERID
                      </Typography>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "transparent" }}>
                      <Typography
                        variant="subtitle1"
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          fontFamily: "Arial, sans-serif",
                          color: "#4a5568",
                        }}
                      >
                        PLACEADD
                      </Typography>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "transparent" }}>
                      <Typography
                        variant="subtitle1"
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          fontFamily: "Arial, sans-serif",
                          color: "#4a5568",
                        }}
                      >
                        PLACERUN
                      </Typography>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "transparent" }}>
                      <Typography
                        variant="subtitle1"
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          fontFamily: "Arial, sans-serif",
                          color: "#4a5568",
                        }}
                      >
                        STATUS
                      </Typography>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "transparent" }}>
                      <Typography
                        variant="subtitle1"
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          fontFamily: "Arial, sans-serif",
                          color: "#4a5568",
                        }}
                      >
                        WHOGO
                      </Typography>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "transparent" }}>
                      <Typography
                        variant="subtitle1"
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          fontFamily: "Arial, sans-serif",
                          color: "#4a5568",
                        }}
                      >
                        PLACEPIC
                      </Typography>
                    </TableCell>
                    <TableCell style={{ backgroundColor: "transparent" }}>
                      <Typography
                        variant="subtitle1"
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          fontFamily: "Arial, sans-serif",
                          color: "#4a5568",
                          paddingLeft: "20px",
                          width: "90px",
                        }}
                      >
                        ACTION
                      </Typography>
                    </TableCell>
                  </TableHead>
                  <TableBody>
                    {filteredTrips.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell>{user.uid || "N/A"}</TableCell>
                        <TableCell>{user.placename || "N/A"}</TableCell>
                        <TableCell>{user.placeaddress || "N/A"}</TableCell>
                        <TableCell>{user.placeprovince || "N/A"}</TableCell>
                        <TableCell>{user.placetripid || "N/A"}</TableCell>
                        <TableCell>{user.placeLatitude || "N/A"}</TableCell>
                        <TableCell>{user.placeLongitude || "N/A"}</TableCell>
                        <TableCell>
                          Latitude: {user.placestart.latitude ?? "N/A"},
                          Longitude: {user.placestart.longitude ?? "N/A"}
                        </TableCell>
                        <TableCell>
                          {user.placetimestart
                            ? `${user.placetimestart
                                .toDate()
                                .toLocaleDateString(
                                  "th-TH"
                                )} ${user.placetimestart
                                .toDate()
                                .toLocaleTimeString("th-TH")}`
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {user.placetimeend
                            ? `${user.placetimeend
                                .toDate()
                                .toLocaleDateString(
                                  "th-TH"
                                )} ${user.placetimeend
                                .toDate()
                                .toLocaleTimeString("th-TH")}`
                            : "N/A"}
                        </TableCell>
                        <TableCell>{user.useruid || "N/A"}</TableCell>
                        <TableCell>{user.placeadd || "N/A"}</TableCell>
                        <TableCell>{user.placerun || "N/A"}</TableCell>
                        <TableCell>{user.placestatus || "N/A"}</TableCell>
                        <TableCell>{user.placewhogo.length || "0"}</TableCell>
                        <TableCell>
                          {user.placepicUrl ? (
                            <img
                              src={user.placepicUrl}
                              alt="Profile"
                              style={{
                                width: 50,
                                height: 50,
                                borderRadius: "50%",
                              }}
                            />
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell>
                          <Link to={`/editplace/${userId}/${user.uid}`}>
                            <IconButton>
                              <CreateIcon />
                            </IconButton>
                          </Link>
                          <IconButton
                            onClick={() => handleDeleteUser(user.uid)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}

export default ShowPlace;

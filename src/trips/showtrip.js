import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import "./showtrip.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Navbar from "../navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Typography,
  Box,
  Chip,
  Table,
  TextField,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { margins } from '../styles/margin'
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
function ShowTrip() {
  const [tripData, setTripData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const classes = useStyles();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const tripsRef = collection(firestore, "trips");
        const tripsSnapshot = await getDocs(tripsRef);
        const tripDataArray = tripsSnapshot.docs.map((doc) => {
          const data = doc.data();
          data.uid = doc.id;
          return data;
        });
        setTripData(tripDataArray);
      } catch (error) {
        console.error("Error fetching trip data: ", error);
      }
    };

    fetchTripData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredTrips = tripData.filter((trip) => {
    return (
      trip.uid?.toLowerCase().includes(searchTerm) ||
      trip.tripCreate?.toLowerCase().includes(searchTerm) ||
      trip.tripName?.toLowerCase().includes(searchTerm) ||
      trip.tripStartDate
        ?.toDate()
        .toLocaleDateString("th-TH")
        .toLowerCase()
        .includes(searchTerm) ||
      trip.tripEndDate
        ?.toDate()
        .toLocaleDateString("th-TH")
        .toLowerCase()
        .includes(searchTerm) ||
      trip.tripStatus?.toLowerCase().includes(searchTerm)
    );
  });

  const handleDeleteUser = async (uid) => {
    const confirmed = window.confirm("โปรดยืนยันการลบข้อมูล");
    if (confirmed) {
      try {
        await deleteDoc(doc(firestore, "trips", uid));
        const updatedUserData = tripData.filter((user) => user.uid !== uid);
        setTripData(updatedUserData);
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
                gridTemplateColumns: "repeat(4, 1fr)",
                gridColumnGap: 10,
            
                marginBottom: "10px",
              }}
            >
              <TextField
                label="ค้นหา ID"
                variant="outlined"
                name="uid"
                fullWidth
                margin="normal"
                onChange={handleSearch}
              />
              <TextField
                label="ค้นหา TripCreate"
                variant="outlined"
                name="tripCreate"
                fullWidth
                margin="normal"
                onChange={handleSearch}
              />
              <TextField
                label="ค้นหา Name"
                variant="outlined"
                name="tripName"
                fullWidth
                margin="normal"
                onChange={handleSearch}
              />
              <TextField
                label="ค้นหา Status"
                variant="outlined"
                name="tripStatus"
                fullWidth
                margin="normal"
                onChange={handleSearch}
              />
              <DatePicker
                id="tripStart"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
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
                    label="Start Date"
                    InputLabelProps={{ shrink: true }}
                  />
                }
              />
              <DatePicker
                id="tripEnd"
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
                    label="End Date"
                    InputLabelProps={{ shrink: true }}
                  />
                }
              />
            </Box>
            <Box sx={{ overflow: { xs: "auto", sm: "unset" } }}>
              <Table aria-label="simple table" className={classes.table}>
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
                      TRIPCREATE
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
                      STARTDATE
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
                      ENDDATE
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
                      LIMIT
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
                      TRIPJOIN
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
                      TRIPPROFILE
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
                        width: "90px",
                        paddingLeft: "20px",
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
                      <TableCell>{user.tripCreate || "N/A"}</TableCell>
                      <TableCell>{user.tripName || "N/A"}</TableCell>
                      <TableCell>
                        {user.tripStartDate
                          ? `${user.tripStartDate
                              .toDate()
                              .toLocaleDateString("th-TH")} ${user.tripStartDate
                              .toDate()
                              .toLocaleTimeString("th-TH")}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {user.tripEndDate
                          ? `${user.tripEndDate
                              .toDate()
                              .toLocaleDateString("th-TH")} ${user.tripEndDate
                              .toDate()
                              .toLocaleTimeString("th-TH")}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>{user.tripLimit || "N/A"}</TableCell>
                      <TableCell>{user.tripJoin.length || "N/A"}</TableCell>
                      <TableCell>{user.tripStatus || "N/A"}</TableCell>
                      <TableCell>
                        {user.tripProfileUrl ? (
                          <img
                            src={user.tripProfileUrl}
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
                        <Link to={`/edittrip/${user.uid}`}>
                          <IconButton>
                            <CreateIcon />
                          </IconButton>
                        </Link>
                        <IconButton onClick={() => handleDeleteUser(user.uid)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}

export default ShowTrip;

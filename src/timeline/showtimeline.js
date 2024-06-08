import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
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
  Card,
  CardContent,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
} from "@mui/material";
import Navbar from "../navbar";
import "./showtimeline.css";
import { Link, useNavigate } from "react-router-dom";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import IconButton from "@mui/material/IconButton";
import { makeStyles } from "@material-ui/core/styles";
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
function ShowTimeLine() {
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersRef = collection(firestore, "timelinestamp");
        const usersSnapshot = await getDocs(usersRef);
        const userDataArray = usersSnapshot.docs.map((doc) => {
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
  }, []);

  const isDate = (value) => {
    return value instanceof Date && !isNaN(value);
  };
  const getDateTimeString = (firebaseTimestamp) => {
    if (!firebaseTimestamp) return "N/A";
    const dateObj = firebaseTimestamp.toDate();
    return `${dateObj.toLocaleDateString("th-TH")} ${dateObj.toLocaleTimeString(
      "th-TH"
    )}`;
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredTrips = userData.filter((place) => {
    const placeStartDate = place.intime?.toDate();
    const placeEndDate =
      place.outtime && place.outtime.toDate ? place.outtime.toDate() : null;
    const matchesSearchTerm =
      place.uid?.toLowerCase().includes(searchTerm) ||
      place.placeid?.toLowerCase().includes(searchTerm) ||
      place.placetripid?.toLowerCase().includes(searchTerm) ||
      place.useruid?.toLowerCase().includes(searchTerm) ||
      place.distance?.toString().toLowerCase().includes(searchTerm);
    const matchesDateRange =
      (!startDate || (placeStartDate && placeStartDate >= startDate)) &&
      (!endDate || (placeEndDate && placeEndDate <= endDate));

    return matchesSearchTerm && matchesDateRange;
  });

  const handleDeleteUser = async (uid) => {
    const confirmed = window.confirm("โปรดยืนยันการลบข้อมูล");
    if (confirmed) {
      try {
        await deleteDoc(doc(firestore, "timelinestamp", uid));
        const updatedUserData = userData.filter((user) => user.uid !== uid);
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
                gridTemplateColumns: "repeat(5, 1fr)",
                gridColumnGap: 10,
                marginBottom: "20px",
                "& .MuiTextField-root": {
                  height: "45px",
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
                label="ค้นหา PLACEID"
                variant="outlined"
                name="placeid"
                fullWidth
                margin="normal"
                onChange={handleSearch}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
              />
              <TextField
                label="ค้นหา PLACETRIPID"
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

              <TextField
                label="ค้นหา DISTANCE"
                variant="outlined"
                name="distance"
                fullWidth
                margin="normal"
                onChange={handleSearch}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
              />
              <Box sx={{ display: "flex", gap: 1.5, marginTop: "16px" }}>
                <DatePicker
                  id="intime"
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
                      label="ค้นหา INTIME"
                      InputLabelProps={{ shrink: true }}
                      style={{ width: "150%", marginRight: "56px" }}
                    />
                  }
                />
                <DatePicker
                  id="outtime"
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
                      label="ค้นหา OUTTIME"
                      InputLabelProps={{ shrink: true }}
                      style={{ width: "150%", marginLeft: "56px" }}
                    />
                  }
                />
              </Box>
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
                      PLACEID
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
                      PLACETRIPID
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
                      USERUID
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
                      DISTANCE
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
                      INTIME
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
                      OUTTIME
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
                      <TableCell>{user.placeid || "N/A"}</TableCell>
                      <TableCell>{user.placetripid || "N/A"}</TableCell>
                      <TableCell>{user.useruid || "N/A"}</TableCell>
                      <TableCell>{user.distance || "N/A"}</TableCell>
                      <TableCell>
                        {user.intime
                          ? `${user.intime
                              .toDate()
                              .toLocaleDateString("th-TH")} ${user.intime
                              .toDate()
                              .toLocaleTimeString("th-TH")}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {typeof user.outtime === "string" &&
                        user.outtime === "Wait"
                          ? "Wait"
                          : user.outtime
                          ? `${user.outtime
                              .toDate()
                              .toLocaleDateString("th-TH")} ${user.outtime
                              .toDate()
                              .toLocaleTimeString("th-TH")}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Link to={`/edittimeline/${user.uid}`}>
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

export default ShowTimeLine;

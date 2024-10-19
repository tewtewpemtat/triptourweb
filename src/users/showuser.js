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
  MenuItem,
  Select,
  InputLabel,
  TextField,
  FormControl,
} from "@mui/material";
import Navbar from "../navbar";
import "./showuser.css";
import { Link, useNavigate } from "react-router-dom";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
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
function ShowUser() {
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
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
        const usersRef = collection(firestore, "users");
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

  const handleDeleteUser = async (uid) => {
    const confirmed = window.confirm("โปรดยืนยันการลบข้อมูล");
    if (confirmed) {
      try {
        await deleteDoc(doc(firestore, "users", uid));
        const updatedUserData = userData.filter((user) => user.uid !== uid);
        setUserData(updatedUserData);
        alert("ลบข้อมูลสำเร็จ");
      } catch (error) {
        console.error("Error deleting user: ", error);
      }
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredTrips = userData.filter((user) => {
    const matchesSearchTerm =
      user.uid?.toLowerCase().includes(searchTerm) ||
      user.firstName?.toLowerCase().includes(searchTerm) ||
      user.lastName?.toLowerCase().includes(searchTerm) ||
      user.nickname?.toLowerCase().includes(searchTerm) || 
    user.contactNumber?.toLowerCase().includes(searchTerm) || 
    user.gender?.toLowerCase().includes(searchTerm) ||
    user.profileStatus?.includes(searchTerm);

    return matchesSearchTerm;
  });

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
                marginBottom: "10px",
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
                label="ค้นหา FIRSTNAME"
                variant="outlined"
                name="firstName"
                fullWidth
                margin="normal"
                onChange={handleSearch}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
              />
              <TextField
                label="ค้นหา LASTNAME"
                variant="outlined"
                name="lastName"
                fullWidth
                margin="normal"
                onChange={handleSearch}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
              />
              <TextField
                label="ค้นหา NICKNAME"
                variant="outlined"
                name="nickname"
                fullWidth
                margin="normal"
                onChange={handleSearch}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
              />
              <TextField
                label="ค้นหา CONTACTNUMBER"
                variant="outlined"
                name="contactNumber"
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
                  ค้นหา GENDER
                </InputLabel>
                <Select
                  labelId="status-select-label"
                  label="ค้นหา GENDER"
                  variant="outlined"
                  name="gender"
                  fullWidth
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value.toLowerCase())
                  }
                >
                  <MenuItem value="">-- เลือกเพศ --</MenuItem>
                  <MenuItem value="ชาย">ชาย</MenuItem>
                  <MenuItem value="หญิง">หญิง</MenuItem>
                  <MenuItem value="เพศทางเลือก">เพศทางเลือก</MenuItem>
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
                  name="profileStatus"
                  fullWidth
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                >
                  <MenuItem value="">-- เลือกสถานะ --</MenuItem>
                  <MenuItem value="None">None</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
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
                      FIRSTNAME
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
                      LASTNAME
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
                      NICKNAME
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
                      CONTACTNUMBER
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
                      GENDER
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
                      FRIENDLIST
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
                      PROFILEIMAGE
                    </Typography>
                  </TableCell>
                  {/* <TableCell style={{ backgroundColor: "transparent" }}>
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
                  </TableCell> */}
                </TableHead>
                <TableBody>
                  {filteredTrips.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.uid || "N/A"}</TableCell>
                      <TableCell>{user.firstName || "N/A"}</TableCell>
                      <TableCell>{user.lastName || "N/A"}</TableCell>
                      <TableCell>{user.nickname || "N/A"}</TableCell>
                      <TableCell>{user.contactNumber || "N/A"}</TableCell>
                      <TableCell>{user.gender || "N/A"}</TableCell>
                      <TableCell>{user.friendList ? user.friendList.length : "0"}</TableCell>
                      <TableCell>{user.profileStatus || "N/A"}</TableCell>
                      <TableCell>
                        {user.profileImageUrl ? (
                          <img
                            src={user.profileImageUrl}
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
                      {/* <TableCell>
                        <Link to={`/edituser/${user.uid}`}>
                          <IconButton>
                            <CreateIcon />
                          </IconButton>
                        </Link>
                        <IconButton onClick={() => handleDeleteUser(user.uid)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell> */}
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

export default ShowUser;

import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { getAuth, deleteUser } from "firebase/auth";
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
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import Navbar from "../navbar";
import { Link, useNavigate } from "react-router-dom";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import { margins } from "../styles/margin";
import bcrypt from "bcryptjs-react";
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
function Manage() {
  const [userData, setUserData] = useState([]);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedUid, setSelectedUid] = useState(null);
  const navigate = useNavigate();
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersRef = collection(firestore, "admins");
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
  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredTrips = userData.filter((user) => {
    const matchesSearchTerm =
      user.uid?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm);

    return matchesSearchTerm;
  });
  const handleAddUser = () => {
    navigate("/manage/add");
  };
  const handleOpenDialog = async (uid) => {
    const adminDocRef = doc(firestore, "admins", uid);
    const adminDocSnapshot = await getDoc(adminDocRef);
    if (adminDocSnapshot.exists()) {
      const adminData = adminDocSnapshot.data();
      if (adminData.level === "high") {
        alert("ไม่สามารถลบข้อมูลนี้ได้");
        return;
      }
    }
    setSelectedUid(uid);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setPassword("");
    setSelectedUid(null);
  };

  const handleConfirmDelete = async () => {
    if (!password) {
      alert("โปรดใส่รหัสผ่าน");
      return;
    }

    try {
      const currentEmail = localStorage.getItem("email");

      const adminDocRef = doc(firestore, "admins", selectedUid);
      const adminDocSnapshot = await getDoc(adminDocRef);
      if (adminDocSnapshot.exists()) {
        const adminData = adminDocSnapshot.data();
        const passwordMatch = await bcrypt.compare(
          password,
          adminData.password
        );
        if (passwordMatch) {
          if (currentEmail === adminData.email) {
            await deleteDoc(adminDocRef);
            localStorage.removeItem("authToken");
            localStorage.removeItem("email");
            alert("ลบข้อมูลสำเร็จ");
            navigate("/login");
          } else {
            await deleteDoc(doc(firestore, "admins", selectedUid));
            alert("ลบข้อมูลสำเร็จ");
            window.location.reload();
          }
        } else {
          alert("รหัสผ่านผิดพลาด");
        }
      } else {
        alert("ไม่พบข้อมูลผู้ใช้");
      }
    } catch (error) {
      console.error("Error deleting user: ", error);
    }

    handleCloseDialog();
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
                label="ค้นหา EMAIL"
                variant="outlined"
                name="email"
                fullWidth
                margin="normal"
                onChange={handleSearch}
                InputLabelProps={{
                  style: { fontSize: "14px" },
                }}
              />
            </Box>
            <form>
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
                        EMAIL
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
                        ACTION
                      </Typography>
                    </TableCell>
                  </TableHead>
                  <TableBody>
                    {filteredTrips.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell>{user.uid || "N/A"}</TableCell>
                        <TableCell>{user.email || "N/A"}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleOpenDialog(user.uid)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>{" "}
              <Box textAlign="left">
                <Button
                  style={{ marginTop: "8px" }}
                  color="primary"
                  variant="contained"
                  type="button"
                  onClick={handleAddUser}
                >
                  เพิ่ม
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>โปรดยืนยันการลบข้อมูล</DialogTitle>
        <DialogContent>
          <DialogContentText>
            โปรดใส่รหัสผ่านเพื่อยืนยันการลบข้อมูล
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            type="password"
            fullWidth
            variant="standard"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>ยกเลิก</Button>
          <Button onClick={handleConfirmDelete}>ยืนยัน</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Manage;

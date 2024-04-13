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
} from "@mui/material";
import Navbar from "../navbar";
import { Link, useNavigate } from "react-router-dom";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { makeStyles } from "@material-ui/core/styles";

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

  const handleAddUser = () => {
    navigate("/manage/add");
  };

  const handleDeleteUser = async (uid) => {
    if (uid === "Syo5nn3QB0RxgRTwSN34ImkMMKp1") {
      alert("ไม่สามารถลบข้อมูลนี้ได้");
      return;
    }

    const confirmed = window.confirm("โปรดยืนยันการลบข้อมูล");
    if (confirmed) {
      try {
        const currentEmail = localStorage.getItem("email");

        const adminDocRef = doc(firestore, "admins", uid);
        const adminDocSnapshot = await getDoc(adminDocRef);
        if (adminDocSnapshot.exists()) {
          const adminData = adminDocSnapshot.data();
          if (currentEmail === adminData.email) {
            await deleteDoc(adminDocRef);
            localStorage.removeItem("authToken");
            localStorage.removeItem("email");
            alert("ลบข้อมูลสำเร็จ");
            navigate("/login");
          } else {
            await deleteDoc(doc(firestore, "admins", uid));
            alert("ลบข้อมูลสำเร็จ");
            window.location.reload();
          }
        } else {
          alert("ไม่พบข้อมูลผู้ใช้");
        }
      } catch (error) {
        console.error("Error deleting user: ", error);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <Box sx={{ marginLeft: 25 }}>
        <Card variant="outlined">
          <CardContent>
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
                    {userData.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell>{user.uid || "N/A"}</TableCell>
                        <TableCell>{user.email || "N/A"}</TableCell>
                        <TableCell>
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
    </div>
  );
}

export default Manage;

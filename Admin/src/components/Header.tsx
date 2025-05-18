import {
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  Box,
  Typography,
  Badge,
  Divider,
  Chip,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import apiRequest from "./utils/apiRequest";

interface UserData {
  username: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin: string;
  updatedAt: string;
}

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 12,
    minWidth: 220,
    boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.10)",
    "& .MuiMenuItem-root": {
      padding: "10px 18px",
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
      },
      "& .MuiSvgIcon-root": {
        color: theme.palette.text.secondary,
      },
    },
  },
}));

type HeaderProps = {
  title: React.ReactNode;
  onMenuClick?: () => void; // Optional: for mobile sidebar toggling
};

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const open = Boolean(anchorEl);

  useEffect(() => {
    // Simulate fetching notifications (can be replaced with real API)
    setTimeout(() => setNotificationsCount(3), 800);

    // Fetch user data from localStorage
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        setUser(null);
      }
    }
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const getInitials = () => {
    if (!user?.username) return "";
    const names = user.username.split(" ");
    return names[0][0].toUpperCase() + (names[1]?.[0]?.toUpperCase() || "");
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const handleLogout = async () => {
    await apiRequest.post("/auth/logout");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    window.location.href = "/login";
    handleMenuClose();
  };
  // const handleLogout = () => {
  //   localStorage.removeItem("userData");
  //   localStorage.removeItem("token");
  //   window.location.href = "/login";
  //   handleMenuClose();
  // };

  return (
    <header
      className="bg-white shadow-sm p-[10px] flex justify-between items-center  top-0 left-[259px] right-0 z-10 border-b border-gray-100"
      style={{ minHeight: 64, backdropFilter: "blur(4px)" }}
    >
      <div className="flex items-center gap-2">
        <Typography
          variant="h6"
          component="h1"
          sx={{
            fontWeight: 900,
            color: "#00A16A",
            fontSize: { xs: "1.1rem", md: "1.25rem" },
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Typography>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 mr-2">
        {/* Notifications */}
        <Tooltip title="Notifications" arrow>
          <IconButton
            color="inherit"
            aria-label={`You have ${notificationsCount} new notifications`}
            sx={{
              position: "relative",
              color: "text.secondary",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "action.hover",
                transform: "scale(1.05)",
              },
            }}
          ></IconButton>
        </Tooltip>

        {/* User Menu */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Account menu">
            <IconButton
              onClick={handleMenuOpen}
              size="medium"
              sx={{
                ml: 1,
                p: 1,
                "&:hover": { backgroundColor: "action.hover" },
              }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "#00A16A",
                  color: "primary.contrastText",
                  fontWeight: 600,
                  fontSize: 18,
                }}
              >
                AD {/* {getInitials()} */}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
        <p className="text-[#00A16A] font-bold text-sm ">Admin</p>

        {/* Account Menu */}
        <StyledMenu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle1" fontWeight={600} noWrap>
              {user?.username || "Admin"}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user?.email}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
              <Chip
                size="small"
                label={user?.role || "Role"}
                sx={{
                  height: 22,
                  fontSize: 11,
                  bgcolor: "primary.light",
                  color: "primary.dark",
                  mr: 1,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {user?.status === "active" ? "Active" : user?.status}
              </Typography>
            </Box>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Member since {user ? formatDate(user.createdAt) : ""}
            </Typography>
          </Box>
          <Divider sx={{ my: 0.5 }} />

          {/* <MenuItem
            component={Link}
            to="/profile"
            onClick={handleMenuClose}
            sx={{ borderRadius: "8px", my: 0.5 }}
          >
            <ListItemIcon>
              <Avatar sx={{ width: 24, height: 24, fontSize: 14 }}>
                {getInitials()}
              </Avatar>
            </ListItemIcon>
            My Profile
          </MenuItem> */}

          {/* <MenuItem
            component={Link}
            to="/settings"
            onClick={handleMenuClose}
            sx={{ borderRadius: "8px", my: 0.5 }}
          >
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem> */}

          <Divider sx={{ my: 0.5 }} />

          <MenuItem
            onClick={handleLogout}
            sx={{ borderRadius: "8px", my: 0.5 }}
          >
            <ListItemIcon>
              <Logout fontSize="small" color="error" />
            </ListItemIcon>
            <Typography color="error.main">Logout</Typography>
          </MenuItem>
        </StyledMenu>
      </div>
    </header>
  );
};

export default Header;

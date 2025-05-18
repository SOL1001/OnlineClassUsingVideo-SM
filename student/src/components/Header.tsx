import {
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  Box,
  Typography,
  // Badge,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";

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
    borderRadius: "12px",
    minWidth: 200,
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    "& .MuiMenuItem-root": {
      padding: "10px 16px",
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
      },
      "& .MuiSvgIcon-root": {
        color: theme.palette.text.secondary,
      },
    },
  },
}));

const Header: React.FC<{ title: React.ReactNode }> = ({ title }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  // const [notificationsCount] = useState(0);
  const open = Boolean(anchorEl);

  const fetchAvatar = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        "http://localhost:5000/api/users/get/avatar",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAvatarUrl(url);
      }
    } catch (error) {
      console.error("Error fetching avatar:", error);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        fetchAvatar();
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    return () => {
      if (avatarUrl) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    window.location.href = "/login";
    handleMenuClose();
  };

  const getInitials = () => {
    if (!user?.username) return "";
    const names = user.username.split(" ");
    const firstInitial = names[0]?.[0]?.toUpperCase() || "";
    const lastInitial =
      names.length > 1 ? names[names.length - 1][0]?.toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <header className="bg-white shadow-sm p-4 hidden md:flex justify-between items-center fixed top-0 left-[259px] right-0 z-10 border-b border-gray-100">
      <div className="flex items-center">
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{
            color: "text.primary",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="h1"
          sx={{
            ml: 2,
            fontWeight: 600,
            color: "text.primary",
            fontSize: "1.25rem",
          }}
        >
          {title}
        </Typography>
      </div>

      <div className="flex items-center gap-2 mr-4">
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Account menu">
            <IconButton
              onClick={handleMenuOpen}
              size="medium"
              sx={{
                ml: 1,
                p: 1,
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: avatarUrl ? "transparent" : "primary.main",
                  color: "primary.contrastText",
                }}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="User Avatar"
                    onError={() => setAvatarUrl(null)}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  getInitials()
                )}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        <StyledMenu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle1" fontWeight={500}>
              {user?.username || "User"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
            >
              Member since {user ? formatDate(user.createdAt) : ""}
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />

          <MenuItem
            component={Link}
            to="/profile"
            onClick={handleMenuClose}
            sx={{ borderRadius: "8px", my: 0.5 }}
          >
            <ListItemIcon>
              <Avatar sx={{ width: 24, height: 24 }}>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="User"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    onError={() => setAvatarUrl(null)}
                  />
                ) : (
                  getInitials()
                )}
              </Avatar>
            </ListItemIcon>
            My Profile
          </MenuItem>

          <Divider sx={{ my: 1 }} />

          <MenuItem
            onClick={handleLogout}
            sx={{ borderRadius: "8px", my: 0.5 }}
          >
            <ListItemIcon>
              <Logout fontSize="small" color="error" />
            </ListItemIcon>
            <Typography color="error">Logout</Typography>
          </MenuItem>
        </StyledMenu>
      </div>
    </header>
  );
};

export default Header;

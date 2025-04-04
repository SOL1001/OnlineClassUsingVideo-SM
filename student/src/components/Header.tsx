// Header.tsx
import React from "react";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";

const Header: React.FC<{ title: React.ReactNode }> = ({ title }) => {
  return (
    <header className="bg-white shadow p-4 hidden md:flex justify-between items-center fixed top-0 left-[259px] right-0 z-10">
      <div className="flex items-center">
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <h1 className="text-2xl font-bold ml-2">{title}</h1>
      </div>
      <div className="flex items-center">
        <IconButton color="inherit" aria-label="notifications">
          <NotificationsIcon />
        </IconButton>
        <IconButton color="inherit" aria-label="profile">
          <AccountCircle fontSize="large" />
        </IconButton>
      </div>
    </header>
  );
};

export default Header;

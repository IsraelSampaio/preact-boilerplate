import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import {
  Home,
  FormatListBulleted,
  Favorite,
  Settings,
  Info,
} from "@mui/icons-material";
import { useAppSelector } from "@features/shared/hooks/useAppDispatch.js";
import { useTranslation } from "@features/i18n/hooks/useTranslation.js";

/**
 * Component Sidebar
 */
export const Sidebar = ({ width = 240 }) => {
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const { t } = useTranslation();

  const menuItems = [
    { text: t("navigation.home"), icon: <Home />, path: "/" },
    {
      text: t("navigation.pokemon"),
      icon: <FormatListBulleted />,
      path: "/pokemon",
    },
    { text: t("navigation.favorites"), icon: <Favorite />, path: "/favorites" },
    { text: t("navigation.settings"), icon: <Settings />, path: "/settings" },
    { text: t("navigation.about"), icon: <Info />, path: "/about" },
  ];

  return (
    <Drawer
      variant="temporary"
      open={sidebarOpen}
      sx={{
        width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width,
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" noWrap component="div">
          Menu
        </Typography>
      </Box>

      <Divider />

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

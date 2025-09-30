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
} from '@mui/material';
import {
  Home,
  FormatListBulleted,
  Favorite,
  Settings,
  Info,
} from '@mui/icons-material';
import { useAppSelector } from '@features/shared/hooks/useAppDispatch.js';

/**
 * Component Sidebar
 */
export const Sidebar = ({ width = 240 }) => {
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  const menuItems = [
    { text: 'Início', icon: <Home />, path: '/' },
    { text: 'Pokémon', icon: <FormatListBulleted />, path: '/pokemon' },
    { text: 'Favoritos', icon: <Favorite />, path: '/favorites' },
    { text: 'Configurações', icon: <Settings />, path: '/settings' },
    { text: 'Sobre', icon: <Info />, path: '/about' },
  ];

  return (
    <Drawer
      variant="temporary"
      open={sidebarOpen}
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
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
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

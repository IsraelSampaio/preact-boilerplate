import { Box, CssBaseline } from "@mui/material";
import { Header } from "./Header.jsx";
import { Sidebar } from "./Sidebar.jsx";

/**
 * Component MainLayout
 */
export const MainLayout = ({ children, title }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header title={title} />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          mt: 8, // para compensar o AppBar fixo
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

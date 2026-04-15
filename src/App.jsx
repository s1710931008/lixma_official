import { BrowserRouter } from "react-router-dom";
import Box from "@mui/material/Box";

// components
import Nav from "./components/Nav";
import Footer from "./components/Footer";

// routes
import AppRoutes from "./routes";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Nav />

        <Box component="main" sx={{ flex: 1 }}>
          <AppRoutes />
        </Box>

        <Footer />
      </Box>
    </BrowserRouter>
  );
}

export default App;
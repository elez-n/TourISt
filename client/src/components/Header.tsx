import { AppBar, Toolbar, Button, Box } from "@mui/material";
import logo from "../assets/logooo.png";

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{ height: 80 }} // visina loga
          />
        </Box>


        <Box>
          <Button color="inherit">Početna</Button>
          <Button color="inherit">Lista objekata</Button>
          <Button color="inherit">Mapa</Button>
          <Button color="inherit">Kontakt</Button>
          <Button color="inherit">Login</Button>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Header;

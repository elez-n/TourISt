import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  GridLegacy as Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

type Objekat = {
  id: number;
  naziv: string;
  vrsta: string;
  opstina: string;
  kategorija: string;
  status: string;
  slike: string[]; // URL slika
};

const mockObjekti: Objekat[] = [
  {
    id: 1,
    naziv: "Hotel Romanija",
    vrsta: "Hotel",
    opstina: "Istočno Novo Sarajevo",
    kategorija: "3*",
    status: "Aktivan",
    slike: [
      "https://picsum.photos/300/200?random=1",
      "https://picsum.photos/300/200?random=2",
    ],
  },
  {
    id: 2,
    naziv: "Apartmani Jahorina",
    vrsta: "Apartman",
    opstina: "Pale",
    kategorija: "2*",
    status: "Aktivan",
    slike: ["https://picsum.photos/300/200?random=3"],
  },
];

const ListaObjekata = () => {
  const [objekti, setObjekti] = useState<Objekat[]>([]);
  const [filterVrsta, setFilterVrsta] = useState("");
  const [filterOpstina, setFilterOpstina] = useState("");

useEffect(() => {
  const loadObjekte = async () => {
    // kasnije fetch sa backend-a
    setObjekti(mockObjekti);
  };
  loadObjekte();
}, []);


  // filtriranje
  const filtrirani = objekti.filter(
    (o) =>
      (filterVrsta === "" || o.vrsta === filterVrsta) &&
      (filterOpstina === "" || o.opstina === filterOpstina)
  );

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Turistički objekti
      </Typography>

      {/* Filteri */}
      <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Vrsta</InputLabel>
          <Select
            value={filterVrsta}
            onChange={(e) => setFilterVrsta(e.target.value)}
            label="Vrsta"
          >
            <MenuItem value="">Sve</MenuItem>
            <MenuItem value="Hotel">Hotel</MenuItem>
            <MenuItem value="Apartman">Apartman</MenuItem>
            <MenuItem value="Pansion">Pansion</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Opština</InputLabel>
          <Select
            value={filterOpstina}
            onChange={(e) => setFilterOpstina(e.target.value)}
            label="Opština"
          >
            <MenuItem value="">Sve</MenuItem>
            <MenuItem value="Istočno Novo Sarajevo">Istočno Novo Sarajevo</MenuItem>
            <MenuItem value="Pale">Pale</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Lista kartica */}
      <Grid container spacing={3}>
        {filtrirani.map((o) => (
          <Grid item xs={12} sm={6} md={4} key={o.id}>
            <Card>
              {o.slike.length > 0 && (
                <CardMedia
                  component="img"
                  height="200"
                  image={o.slike[0]}
                  alt={o.naziv}
                />
              )}
              <CardContent>
                <Typography variant="h6">{o.naziv}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {o.vrsta} | {o.opstina} | {o.kategorija}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {o.status}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" variant="outlined">
                  Detalji
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ListaObjekata;

import {
  Container,
  GridLegacy as Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

const objects = [
  { id: 1, name: "Hotel Romanija", type: "Hotel", municipality: "Pale" },
  { id: 2, name: "Apartmani Jahorina", type: "Apartman", municipality: "Pale" },
  { id: 3, name: "Pansion Trebević", type: "Pansion", municipality: "Istočni Stari Grad" },
];

const FeaturedObjects = () => {
  return (
    // FULL WIDTH SEKCIJA
    <Box sx={{ width: "100%", py: { xs: 6, md: 8 } }}>
      {/* CENTRIRANI SADRŽAJ */}
      <Container maxWidth="lg">
        <Typography variant="h5" gutterBottom>
          Izdvojeni objekti
        </Typography>

        <Grid container spacing={4}>
          {objects.map((obj) => (
            <Grid item xs={12} sm={6} md={4} key={obj.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="160"
                  image="https://source.unsplash.com/400x300/?hotel"
                />
                <CardContent>
                  <Typography variant="h6">{obj.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {obj.type} • {obj.municipality}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturedObjects;

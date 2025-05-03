import { Grid, CircularProgress, Typography } from "@mui/material";
import ProductCard from "./ProductCard";

function ProductList({ products, loading, onAddToCart }) {
  if (loading) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "300px" }}
      >
        <CircularProgress />
      </Grid>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "300px" }}
      >
        <Typography>No products available</Typography>
      </Grid>
    );
  }

  return (
    <Grid container spacing={2} mt={1}>
      {products.map((product) => (
        <Grid key={product.productid} item xs={6} md={4} lg={3}>
          <ProductCard product={product} onAddToCart={onAddToCart} />
        </Grid>
      ))}
    </Grid>
  );
}

export default ProductList;

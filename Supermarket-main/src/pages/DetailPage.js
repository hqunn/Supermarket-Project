import { useEffect, useState } from "react";
import {
  Card,
  Grid,
  Container,
  Typography,
  Box,
  Stack,
  Divider,
  Breadcrumbs,
  Link,
  Alert,
  Button,
  Chip,
  Paper,
  Rating,
  Badge,
  Fade,
  Grow,
  useTheme,
  alpha,
} from "@mui/material";

import { Link as RouterLink, useParams, useNavigate, useLocation } from "react-router-dom";

import { 
  Home, 
  ArrowBack, 
  ShoppingCart, 
  LocalShipping, 
  Warehouse, 
  Category, 
  Info,
  CheckCircle
} from "@mui/icons-material";
import apiService from "../app/apiService";
import LoadingScreen from "../components/LoadingScreen";
import { fCurrency } from "../utils";

function DetailPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // Get cart from localStorage or location.state
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return location.state?.cart || (savedCart ? JSON.parse(savedCart) : []);
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await apiService.get(`/todos/products/${id}`);
        setProduct(res.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to fetch product.");
      }
      setLoading(false);
    };

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(
      (item) => item.id === product.id
    );
    
    let updatedCart;
    
    // If product exists, update quantity (max 10)
    if (existingProductIndex !== -1) {
      updatedCart = [...cart];
      const currentProduct = updatedCart[existingProductIndex];
      
      // Only update if less than maximum quantity (10)
      if (currentProduct.quantity < 10) {
        updatedCart[existingProductIndex] = {
          ...currentProduct,
          quantity: currentProduct.quantity + 1
        };
      }
    } else {
      // If product doesn't exist, add it with quantity 1
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }
    
    // Update cart state
    setCart(updatedCart);
    
    // Show feedback animation
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    // Navigate to payment page with this product
    navigate(`/payment/${product.id}`, { 
      state: { 
        product: { ...product, quantity: 1 } 
      } 
    });
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        my: 5, 
        position: 'relative',
        animation: 'fadeIn 0.5s ease-in-out',
        '@keyframes fadeIn': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      }}
    >
      {/* Back button */}
      <Button
        startIcon={<ArrowBack />}
        variant="text"
        color="inherit"
        onClick={() => navigate(-1)}
        sx={{ 
          mb: 2,
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateX(-5px)',
            bgcolor: 'transparent'
          }
        }}
      >
        Back
      </Button>

      {/* Breadcrumbs */}
      <Breadcrumbs 
        aria-label="breadcrumb" 
        sx={{ 
          mb: 4,
          '& .MuiBreadcrumbs-separator': {
            mx: 1.5,
            color: 'text.secondary'
          },
          py: 1,
          px: 2,
          borderRadius: 1,
          bgcolor: theme => alpha(theme.palette.primary.light, 0.05)
        }}
      >
        <Link 
          underline="hover" 
          color="inherit" 
          component={RouterLink} 
          to="/"
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            fontWeight: 500,
            transition: 'all 0.2s',
            '&:hover': {
              color: 'primary.main',
              transform: 'translateX(-3px)'
            }
          }}
        >
          <Home sx={{ mr: 0.5, fontSize: 20 }} />
          Home page
        </Link>
        <Typography color="text.primary" fontWeight="medium">
          {product?.name || "Product"}
        </Typography>
      </Breadcrumbs>

      <Stack direction="row" spacing={2} mb={3} justifyContent="flex-end">
        <Button 
          variant="outlined"
          onClick={() => navigate("/profile")}
          sx={{
            borderRadius: 2,
            px: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            transition: 'all 0.3s',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 6px 15px rgba(0,0,0,0.1)'
            }
          }}
        >
          Profile
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate("/orders", { state: { cart } })}
          sx={{
            borderRadius: 2,
            px: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            position: 'relative',
            transition: 'all 0.3s',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 6px 15px rgba(0,0,0,0.15)'
            }
          }}
        >
          Orders
          <Badge
            badgeContent={cart.reduce((sum, item) => sum + item.quantity, 0)}
            color="error"
            sx={{
              position: "absolute",
              top: -5,
              right: -5,
              borderRadius: "50%",
              width: 20,
              height: 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              '& .MuiBadge-badge': {
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }
            }}
          />
        </Button>
      </Stack>

      {/* Product Details */}
      <Box sx={{ position: "relative", minHeight: "60vh" }}>
        {loading ? (
          <LoadingScreen />
        ) : error ? (
          <Alert severity="error" 
            sx={{ 
              borderRadius: 2, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              '& .MuiAlert-icon': { alignItems: 'center' }
            }}
          >
            {error}
          </Alert>
        ) : product ? (
          <Fade in={!loading} timeout={800}>
            <Card 
              elevation={0} 
              sx={{ 
                borderRadius: 4, 
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                }
              }}
            >
              <Grid container>
                {/* Product Image */}
                <Grid item xs={12} md={6}>
                  <Box 
                    sx={{
                      p: 4,
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(theme.palette.primary.main, 0.03),
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        width: '300px',
                        height: '300px',
                        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 70%)`,
                        top: '-100px',
                        left: '-100px',
                        borderRadius: '50%'
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '200px',
                        height: '200px',
                        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
                        bottom: '-50px',
                        right: '-50px',
                        borderRadius: '50%'
                      }
                    }}
                  >
                    <Grow in={!loading} timeout={1000}>
                    <Paper 
                      elevation={4} 
                      sx={{ 
                        borderRadius: 4, 
                        overflow: 'hidden',
                        width: '100%',  // Changed from 80% to 100%
                        height: '450px', // Changed from 350px to 450px
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 2,
                        position: 'relative',
                        zIndex: 1,
                        boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                        transform: 'perspective(1000px) rotateY(5deg)',
                        transition: 'all 0.5s',
                        '&:hover': {
                          transform: 'perspective(1000px) rotateY(0deg) translateY(-10px)',
                        }
                      }}
                    >
                      <Box
                        component="img"
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: "contain",
                          filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))',
                          transition: 'transform 0.5s',
                          '&:hover': {
                            transform: 'scale(1.08)', // Increased scale effect on hover
                          }
                        }}
                        src={product.image}
                        alt={product.name}
                      />
                    </Paper>
                    </Grow>
                  </Box>
                </Grid>

                {/* Product Details */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: { xs: 3, md: 5 } }}>
                    {/* Product category tag */}
                    <Chip 
                      label={product.type} 
                      color="primary" 
                      variant="outlined" 
                      size="small" 
                      icon={<Category fontSize="small" />}
                      sx={{ 
                        mb: 2, 
                        borderRadius: 5,
                        fontWeight: 500,
                        px: 1,
                        '& .MuiChip-icon': {
                          color: 'primary.main'
                        }
                      }}
                    />
                    
                    {/* Product title */}
                    <Typography 
                      variant="h3" 
                      fontWeight="700"
                      sx={{ 
                        mb: 1,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.5px'
                      }}
                    >
                      {product.name}
                    </Typography>
                    
                    {/* Product ID */}
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ mb: 2, fontWeight: 500 }}
                    >
                      Product ID: {product.id}
                    </Typography>
                    
                    {/* Dummy Rating */}
                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                      <Rating 
                        value={4} 
                        readOnly 
                        precision={0.5} 
                        sx={{
                          '& .MuiRating-iconFilled': {
                            color: theme.palette.primary.main,
                          }
                        }}
                      />
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          ml: 1, 
                          border: '1px solid',
                          borderColor: 'divider',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem'
                        }}
                      >
                        24 reviews
                      </Typography>
                    </Box>
                    
                    {/* Price */}
                    <Typography 
                      variant="h4" 
                      fontWeight="800"
                      sx={{ 
                        mb: 3,
                        color: 'primary.main',
                        display: 'inline-block',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          width: '100%',
                          height: '8px',
                          bottom: '5px',
                          left: 0,
                          backgroundColor: alpha(theme.palette.primary.main, 0.2),
                          zIndex: -1,
                          borderRadius: 4
                        }
                      }}
                    >
                      {fCurrency(product.price)}
                    </Typography>

                    <Divider sx={{ 
                      mb: 3, 
                      borderColor: alpha(theme.palette.primary.main, 0.1),
                      borderStyle: 'dashed'
                    }} />

                    {/* Product Specs */}
                    <Stack spacing={2.5} sx={{ mb: 4 }}>
                      {/* Stock Status */}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 2,
                            mr: 2,
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                          }}
                        >
                          <Info sx={{ color: 'info.main' }} />
                        </Box>
                        <Typography variant="subtitle1" sx={{ mr: 1, fontWeight: 500 }}>
                          Stock Status:
                        </Typography>
                        <Chip 
                          label={product.remaining > 0 ? "In Stock" : "Out of Stock"} 
                          color={product.remaining > 0 ? "success" : "error"} 
                          size="small"
                          sx={{ 
                            fontWeight: 600,
                            borderRadius: 1,
                            height: 24
                          }}
                        />
                      </Box>

                      {/* Remaining */}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 2,
                            mr: 2,
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                          }}
                        >
                          <Info sx={{ color: 'info.main' }} />
                        </Box>
                        <Typography variant="subtitle1" sx={{ mr: 1, fontWeight: 500 }}>
                          Remaining:
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {product.remaining} units
                        </Typography>
                      </Box>
                      
                      {/* Warehouse */}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 2,
                            mr: 2,
                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                          }}
                        >
                          <Warehouse sx={{ color: 'warning.main' }} />
                        </Box>
                        <Typography variant="subtitle1" sx={{ mr: 1, fontWeight: 500 }}>
                          Warehouse:
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {product.warehouse}
                        </Typography>
                      </Box>
                      
                      {/* Shipping */}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 2,
                            mr: 2,
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                          }}
                        >
                          <LocalShipping sx={{ color: 'success.main' }} />
                        </Box>
                        <Typography variant="subtitle1" sx={{ mr: 1, fontWeight: 500 }}>
                          Shipping:
                        </Typography>
                        <Typography variant="body1" fontWeight={600} color="success.main">
                          Free Delivery
                        </Typography>
                      </Box>
                    </Stack>
                    
                    <Divider sx={{ 
                      mb: 3, 
                      borderColor: alpha(theme.palette.primary.main, 0.1),
                      borderStyle: 'dashed'
                    }} />
                    
                    {/* Action Buttons */}
                    <Stack direction="row" spacing={2}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        size="large" 
                        fullWidth
                        onClick={handleBuyNow}
                        disabled={product.remaining <= 0}
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 600,
                          boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`,
                          transition: 'all 0.3s',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: `0 12px 20px ${alpha(theme.palette.primary.main, 0.35)}`
                          }
                        }}
                      >
                        Buy Now
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        size="large" 
                        fullWidth
                        startIcon={addedToCart ? <CheckCircle /> : <ShoppingCart />}
                        onClick={handleAddToCart}
                        disabled={product.remaining <= 0}
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          borderWidth: '2px',
                          fontWeight: 600,
                          transition: 'all 0.3s',
                          bgcolor: addedToCart ? alpha(theme.palette.success.main, 0.1) : 'transparent',
                          borderColor: addedToCart ? 'success.main' : 'primary.main',
                          color: addedToCart ? 'success.main' : 'primary.main',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            bgcolor: addedToCart ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.primary.main, 0.05),
                            borderColor: addedToCart ? 'success.main' : 'primary.main',
                            borderWidth: '2px'
                          }
                        }}
                      >
                        {addedToCart ? 'Added to Cart' : 'Add to Cart'}
                      </Button>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>

              {/* Product Description */}
              <Box 
                sx={{ 
                  p: { xs: 3, md: 5 },
                  bgcolor: alpha(theme.palette.primary.main, 0.02), 
                  borderTop: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography 
                  variant="h5" 
                  fontWeight="700" 
                  gutterBottom
                  sx={{
                    position: 'relative',
                    display: 'inline-block',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '40%',
                      height: '4px',
                      bottom: '-4px',
                      left: 0,
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: 2
                    }
                  }}
                >
                  Description
                </Typography>
                <Divider sx={{ mb: 3, borderColor: alpha(theme.palette.primary.main, 0.1) }} />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    lineHeight: 1.8,
                    color: alpha(theme.palette.text.primary, 0.85),
                    textAlign: 'justify'
                  }}
                >
                  {product.description || "No description available for this product."}
                </Typography>
              </Box>
            </Card>
          </Fade>
        ) : (
          <Fade in={!loading} timeout={800}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 5, 
                textAlign: 'center', 
                borderRadius: 4,
                bgcolor: alpha(theme.palette.error.main, 0.05),
                border: '1px solid',
                borderColor: alpha(theme.palette.error.main, 0.2)
              }}
            >
              <Typography variant="h5" color="error" fontWeight={600} mb={2}>
                404 Product not found
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate("/")} 
                sx={{ 
                  mt: 2,
                  borderRadius: 2,
                  boxShadow: `0 6px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: `0 10px 16px ${alpha(theme.palette.primary.main, 0.3)}`
                  }
                }}
              >
                Back to Products
              </Button>
            </Paper>
          </Fade>
        )}
      </Box>

      {/* Success Toast for Add to Cart */}
      <Fade in={addedToCart}>
        <Box
          sx={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            bgcolor: 'success.main',
            color: 'white',
            py: 2,
            px: 3,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
            zIndex: 9999,
          }}
        >
          <CheckCircle sx={{ mr: 1 }} />
          <Typography>Added to cart successfully!</Typography>
        </Box>
      </Fade>
    </Container>
  );
}

export default DetailPage;
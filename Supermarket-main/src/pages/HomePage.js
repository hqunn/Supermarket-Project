import React, { useState, useEffect } from "react";
import { 
  Alert, 
  Badge, 
  Box, 
  Button, 
  Container, 
  Stack, 
  Typography,
  Paper,
  alpha,
  useTheme,
  Fade
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ProductFilter from "../components/ProductFilter";
import ProductSearch from "../components/ProductSearch";
import ProductSort from "../components/ProductSort";
import ProductList from "../components/ProductList";
import { FormProvider } from "../components/form";
import { useForm } from "react-hook-form";
import apiService from "../app/apiService";
import orderBy from "lodash/orderBy";
import LoadingScreen from "../components/LoadingScreen";
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import TuneIcon from '@mui/icons-material/Tune';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const theme = useTheme();

  const navigate = useNavigate();
  const location = useLocation();

  const defaultValues = {
    category: "",
    priceRange: "",
    sortBy: "featured",
    searchQuery: "",
  };

  const methods = useForm({ defaultValues });
  const { watch } = methods;
  const filters = watch();
  const filterProducts = applyFilter(products, filters);
  const reset = () => {
    methods.reset(defaultValues);
  };
  
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return location.state?.cart || (savedCart ? JSON.parse(savedCart) : []);
  });

  const [showAddAnimation, setShowAddAnimation] = useState(false);
  const [addedProductId, setAddedProductId] = useState(null);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item.id === product.id
      );
      
      if (existingProductIndex !== -1) {
        const updatedCart = [...prevCart];
        const currentProduct = updatedCart[existingProductIndex];
        
        if (currentProduct.quantity < 10) {
          updatedCart[existingProductIndex] = {
            ...currentProduct,
            quantity: currentProduct.quantity + 1
          };
        }
        
        return updatedCart;
      }
      
      return [...prevCart, { ...product, quantity: 1 }];
    });
    
    // Show animation feedback
    setAddedProductId(product.id);
    setShowAddAnimation(true);
    setTimeout(() => setShowAddAnimation(false), 1500);
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    const searchValue = methods.getValues("searchQuery");
    
    setLoading(true);
    try {
      const response = await apiService.get(`/todos/products/search?q=${encodeURIComponent(searchValue)}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to search products:", error);
      setError("Failed to search products");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const res = await apiService.get("/todos/products");
        setProducts(res.data);
        setError("");
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header with page title */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          fontWeight="700"
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            position: 'relative',
            display: 'inline-block',
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '30%',
              height: '4px',
              bottom: '-4px',
              left: 0,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 2
            }
          }}
        >
          Welcome to CoderStore
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Discover our wide range of high-quality products at great prices
        </Typography>
      </Box>

      {/* Main content with filters and products */}
      <Box sx={{ display: "flex", minHeight: "80vh", gap: 4 }}>
        {/* Sidebar Filters */}
        <Paper
          elevation={2}
          sx={{
            width: 280,
            minWidth: 280,
            borderRadius: 3,
            p: 3,
            height: 'fit-content',
            position: 'sticky',
            top: 20,
            display: { xs: 'none', md: 'block' },
            transition: 'all 0.3s',
            border: '1px solid',
            borderColor: 'divider',
            '&:hover': {
              boxShadow: 4
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TuneIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight={600}>
              Filters
            </Typography>
          </Box>
          
          <FormProvider methods={methods}>
            <ProductFilter resetFilter={reset} />
          </FormProvider>
        </Paper>

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1 }}>
          {/* Navigation and Search Bar in a Paper container */}
          <Paper
            elevation={2}
            sx={{
              mb: 4,
              p: 2,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ sm: 'center' }}
            >
              {/* Search Area */}
              <FormProvider methods={methods}>
                <Box component="form" onSubmit={handleSearch} sx={{ flexGrow: 1 }}>
                  <TextField
                    fullWidth
                    placeholder="Search products..."
                    name="searchQuery"
                    value={methods.watch("searchQuery")}
                    onChange={(e) => methods.setValue("searchQuery", e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton type="submit" color="primary" sx={{ 
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.2),
                            }
                          }}>
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 2,
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        '&:hover': {
                          backgroundColor: theme.palette.background.paper,
                        },
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                      }
                    }}
                  />
                </Box>
              </FormProvider>

              {/* Action Buttons */}
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="outlined"
                  startIcon={<PersonIcon />}
                  onClick={() => navigate("/profile")}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      borderColor: theme.palette.primary.main
                    }
                  }}
                >
                  Profile
                </Button>
                
                <Button
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => navigate("/orders", { state: { cart } })}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    boxShadow: '0 4px 10px rgba(255, 130, 67, 0.3)',
                    position: 'relative',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 15px rgba(255, 130, 67, 0.4)'
                    }
                  }}
                >
                  Cart
                  {cartItemCount > 0 && (
                    <Badge
                      badgeContent={cartItemCount}
                      color="error"
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        '& .MuiBadge-badge': {
                          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                        }
                      }}
                    />
                  )}
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {/* Sort Controls */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={500} color="text.secondary">
              {filterProducts.length} Products {filters.category && `in ${filters.category}`}
            </Typography>
            
            <FormProvider methods={methods}>
              <ProductSort />
            </FormProvider>
          </Box>

          {/* Product List */}
          <Box sx={{ position: "relative", minHeight: "60vh" }}>
            {loading ? (
              <LoadingScreen />
            ) : error ? (
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: 2, 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  '& .MuiAlert-icon': { alignItems: 'center' }
                }}
              >
                {error}
              </Alert>
            ) : (
              <Fade in={!loading} timeout={800}>
                <div>
                  <ProductList
                    products={filterProducts}
                    onAddToCart={handleAddToCart}
                    highlightId={addedProductId}
                  />
                </div>
              </Fade>
            )}
          </Box>
        </Box>
      </Box>
      
      {/* Success Toast for Add to Cart */}
      <Fade in={showAddAnimation}>
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
          <CheckCircleIcon sx={{ mr: 1 }} />
          <Typography>Added to cart successfully!</Typography>
        </Box>
      </Fade>
    </Container>
  );
}

function applyFilter(products, filters) {
  const { category, priceRange, sortBy, searchQuery } = filters;
  
  // Return empty array if products is undefined or null
  if (!products) return [];
  
  let filteredProducts = [...products];

  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter(
      (product) => product.type === category
    );
  }

  // Filter by price range
  if (priceRange) {
    if (priceRange === "below") {
      filteredProducts = filteredProducts.filter((product) => product.price < 25);
    }
    if (priceRange === "between") {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= 25 && product.price <= 75
      );
    }
    if (priceRange === "above") {
      filteredProducts = filteredProducts.filter((product) => product.price > 75);
    }
  }

  // Filter by search query
  if (searchQuery) {
    const lowercasedQuery = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercasedQuery) ||
        (product.description && product.description.toLowerCase().includes(lowercasedQuery))
    );
  }
  
  // Sort products
  if (sortBy === "featured") {
    filteredProducts = orderBy(filteredProducts, ["sold"], ["desc"]);
  }
  if (sortBy === "newest") {
    filteredProducts = orderBy(filteredProducts, ["created"], ["desc"]);
  }
  if (sortBy === "priceDesc") {
    filteredProducts = orderBy(filteredProducts, ["price"], ["desc"]);
  }
  if (sortBy === "priceAsc") {
    filteredProducts = orderBy(filteredProducts, ["price"], ["asc"]);
  }

  return filteredProducts;
}

export default HomePage;
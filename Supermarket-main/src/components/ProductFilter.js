import { useEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import FRadioGroup from "./form/FRadioGroup"; // Adjust the import path as needed
import ClearAllIcon from "@mui/icons-material/ClearAll";
import apiService from "../app/apiService";

export const FILTER_PRICE_OPTIONS = [
  { value: "below", label: "Below $25" },
  { value: "between", label: "Between $25 - $75" },
  { value: "above", label: "Above $75" },
];

function ProductFilter({ resetFilter }) {
  const [categoryOptions, setCategoryOptions] = useState([
    { value: "", label: "All" }, // Đồng bộ với defaultValues
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Gọi API để lấy danh sách các categories
        const response = await apiService.get("/todos/categories");

        // Kiểm tra nếu không có dữ liệu nào trả về
        if (response.data.length === 0) {
          console.log("No categories found");
          setCategoryOptions([{ value: "", label: "All" }]);
          return;
        }

        // Chuyển đổi danh sách categories thành định dạng phù hợp với select component
        const categories = response.data.map((category) => ({
          value: category.name ? category.name : "",
          label: category.name || "Unknown",
        }));

        // Thêm mục "All" vào đầu danh sách
        setCategoryOptions([{ value: "", label: "All" }, ...categories]);

        console.log("Fetched categories:", categories);
      } catch (error) {
        // Xử lý lỗi nếu có sự cố khi gọi API
        console.error("Failed to load categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Stack spacing={3} sx={{ p: 3, width: 250 }}>
      {/* Category Filter */}
      <Stack spacing={1}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Category
        </Typography>
        <FRadioGroup
          name="category"
          options={categoryOptions}
          getOptionLabel={(option) => option.label}
          keyExtractor={(option) => option.value}
        />
      </Stack>

      {/* Price Filter */}
      <Stack spacing={1}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Price
        </Typography>
        <FRadioGroup
          name="priceRange"
          options={FILTER_PRICE_OPTIONS}
          getOptionLabel={(option) => option.label}
          keyExtractor={(option) => option.value}
        />
      </Stack>

      {/* Clear All Button */}
      <Box>
        <Button
          size="large"
          type="button"
          color="inherit"
          variant="outlined"
          onClick={resetFilter}
          startIcon={<ClearAllIcon />}
        >
          Clear All
        </Button>
      </Box>
    </Stack>
  );
}

export default ProductFilter;

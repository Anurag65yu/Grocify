import React, { useState } from "react";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import FilterSidebar from "../components/FilterSidebar";
import SortDropdown from "../components/SortDropdown";
import { useCatalog } from "../context/CatalogContext";
import categories from "../data/categories";
import "./Home.css";

function Home({ search }) {
  const { products } = useCatalog();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [price, setPrice] = useState(2000);
  const [sort, setSort] = useState("default");

  let filteredProducts = products.filter((product) => {
    const categoryMatch =
      selectedCategory === "All" || product.category === selectedCategory;
    const priceMatch = product.price <= price;
    const searchMatch = product.name
      .toLowerCase()
      .includes((search || "").toLowerCase());
    return categoryMatch && priceMatch && searchMatch;
  });

  if (sort === "low") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sort === "name") {
    filteredProducts = [...filteredProducts].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  return (
    <div className="home-container">
      <h1>Fresh Groceries Delivered Fast</h1>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="product-section">
        <FilterSidebar price={price} setPrice={setPrice} />

        <div className="products-area">
          <SortDropdown sort={sort} setSort={setSort} />

          {filteredProducts.length === 0 ? (
            <h2
              style={{
                textAlign: "center",
                marginTop: "50px",
                color: "gray",
              }}
            >
              No Products Found
            </h2>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;

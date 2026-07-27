import React from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useCatalog } from "../context/CatalogContext";
import "./CategoryPage.css";

function CategoryPage() {
  const { category } = useParams();
  const { products } = useCatalog();

  const categoryProducts = products.filter(
    (product) => product.category === category
  );

  return (
    <div className="category-page">
      <h1>{category}</h1>

      {categoryProducts.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: 40, color: "#777" }}>
          No products in this category.
        </p>
      ) : (
        <div className="product-grid">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryPage;

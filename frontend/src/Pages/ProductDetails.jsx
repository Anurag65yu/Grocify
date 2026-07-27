import React from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductDetails.css";

function ProductDetails() {

    const { id } = useParams();

    const products = [

        {
            id: 1,
            name: "Fresh Apple",
            category: "Fruits",
            price: 120,
            description: "Fresh and juicy apples directly from the farm.",
            image: "https://via.placeholder.com/300"
        },

        {
            id: 2,
            name: "Banana",
            category: "Fruits",
            price: 50,
            description: "Fresh bananas rich in potassium and energy.",
            image: "https://via.placeholder.com/300"
        },

        {
            id: 3,
            name: "Milk",
            category: "Dairy",
            price: 60,
            description: "Pure and healthy dairy milk.",
            image: "https://via.placeholder.com/300"
        },

        {
            id: 4,
            name: "Tomato",
            category: "Vegetables",
            price: 40,
            description: "Fresh red tomatoes for daily cooking.",
            image: "https://via.placeholder.com/300"
        },

        {
            id: 5,
            name: "Bread",
            category: "Bakery",
            price: 45,
            description: "Soft and freshly baked bread.",
            image: "https://via.placeholder.com/300"
        },

        {
            id: 6,
            name: "Orange Juice",
            category: "Beverages",
            price: 80,
            description: "Refreshing orange juice with natural taste.",
            image: "https://via.placeholder.com/300"
        }

    ];

    const product = products.find(
        (item) => item.id === Number(id)
    );

    if (!product) {

        return (

            <h2 className="not-found">
                Product Not Found
            </h2>

        );

    }

    return (

        <div className="details-container">

            <img
                src={product.image}
                alt={product.name}
            />

            <div className="details-content">

                <h1>{product.name}</h1>

                <p>
                    <strong>Category:</strong> {product.category}
                </p>

                <h2>₹{product.price}</h2>

                <p>{product.description}</p>

                <button>
                    Add To Cart
                </button>

                <br /><br />

                <Link to="/products">
                    ← Back to Products
                </Link>

            </div>

        </div>

    );

}

export default ProductDetails;
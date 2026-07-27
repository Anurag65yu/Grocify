import React from "react";
import { Link } from "react-router-dom";
import "./ProductListing.css";

function ProductListing() {

    const products = [

        {
            id: 1,
            name: "Fresh Apple",
            category: "Fruits",
            price: 120,
            image: "https://via.placeholder.com/200"
        },

        {
            id: 2,
            name: "Banana",
            category: "Fruits",
            price: 50,
            image: "https://via.placeholder.com/200"
        },

        {
            id: 3,
            name: "Milk",
            category: "Dairy",
            price: 60,
            image: "https://via.placeholder.com/200"
        },

        {
            id: 4,
            name: "Tomato",
            category: "Vegetables",
            price: 40,
            image: "https://via.placeholder.com/200"
        },

        {
            id: 5,
            name: "Bread",
            category: "Bakery",
            price: 45,
            image: "https://via.placeholder.com/200"
        },

        {
            id: 6,
            name: "Orange Juice",
            category: "Beverages",
            price: 80,
            image: "https://via.placeholder.com/200"
        }

    ];

    return (

        <div className="listing-page">

            <h1>All Products</h1>

            <div className="listing-container">

                {

                    products.map((product) => (

                        <div
                            className="listing-card"
                            key={product.id}
                        >

                            <img
                                src={product.image}
                                alt={product.name}
                            />

                            <h3>{product.name}</h3>

                            <p>{product.category}</p>

                            <h4>₹{product.price}</h4>

                            <Link to={`/product/${product.id}`}>

                                <button>
                                    View Details
                                </button>

                            </Link>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}

export default ProductListing;
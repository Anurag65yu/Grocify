import React, { useContext } from "react";

import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

import "./ProductCard.css";


function ProductCard({product}){


const { addToCart } = useContext(CartContext);


const { 
    toggleWishlist,
    isInWishlist
} = useContext(WishlistContext);



return(

<div className="product-card">


    <div className="wishlist-icon"

        onClick={()=>toggleWishlist(product)}

    >

        {
            isInWishlist(product.id)
            ? "❤️"
            : "🤍"
        }

    </div>



    <img

        src={product.image}

        alt={product.name}

        className="product-image"

    />



    <div className="product-details">


        <h3>
            {product.name}
        </h3>



        <p className="category">

            {product.category}

        </p>



        <p className="price">

            ₹{product.price}

        </p>



        <button

            onClick={()=>addToCart(product)}

        >

            Add To Cart

        </button>


    </div>


</div>

)

}


export default ProductCard;
import React, { useContext } from "react";

import { WishlistContext } from "../context/WishlistContext";

import { CartContext } from "../context/CartContext";

import "./ProductCard.css";


function Wishlist(){


const {

    wishlistItems,

    toggleWishlist

} = useContext(WishlistContext);



const {

    addToCart

} = useContext(CartContext);



return(

<div className="wishlist-container">


    <h2>
        My Wishlist ❤️
    </h2>



    {

    wishlistItems.length === 0

    ?

    (

        <p>
            No items in wishlist
        </p>

    )

    :

    (

        <div className="wishlist-grid">


        {

        wishlistItems.map((product)=>(


            <div 
                className="product-card"
                key={product.id}
            >


                <div

                    className="wishlist-icon"

                    onClick={()=>toggleWishlist(product)}

                >

                    ❤️

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


        ))

        }


        </div>

    )

    }


</div>

)

}


export default Wishlist;
import React, { createContext, useState } from "react";


export const WishlistContext = createContext();



export function WishlistProvider({children}){


const [wishlistItems,setWishlistItems] = useState([]);





// Add / Remove wishlist item

const toggleWishlist = (product)=>{


const exists = wishlistItems.find(

    item=>item.id === product.id

);



if(exists){


    setWishlistItems(

        wishlistItems.filter(

            item=>item.id !== product.id

        )

    );


}

else{


    setWishlistItems([

        ...wishlistItems,

        product

    ]);


}


};






// Check wishlist item

const isInWishlist = (id)=>{


return wishlistItems.some(

    item=>item.id === id

);


};






return(

<WishlistContext.Provider


value={{

    wishlistItems,

    toggleWishlist,

    isInWishlist

}}


>


{children}


</WishlistContext.Provider>


)


}
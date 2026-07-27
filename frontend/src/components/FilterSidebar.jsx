import React from "react";

import "./FilterSidebar.css";


function FilterSidebar({price, setPrice}){


return(

<aside className="filter-sidebar">


    <h3>
        Filter Products
    </h3>



    <div className="filter-section">


        <label>
            Maximum Price: ₹{price}
        </label>



        <input

            type="range"

            min="50"

            max="2000"

            value={price}

            onChange={(e)=>setPrice(e.target.value)}

        />


    </div>



    <div className="filter-section">


        <h4>
            Availability
        </h4>


        <label>

            <input type="checkbox"/>

            In Stock

        </label>


    </div>



</aside>

)

}


export default FilterSidebar;
import React from "react";

import "./SortDropdown.css";


function SortDropdown({sort, setSort}){


return(

<div className="sort-dropdown">


    <label>
        Sort By:
    </label>



    <select

        value={sort}

        onChange={(e)=>setSort(e.target.value)}

    >

        <option value="default">
            Default
        </option>


        <option value="low">
            Price: Low to High
        </option>


        <option value="high">
            Price: High to Low
        </option>


        <option value="name">
            Name
        </option>


    </select>


</div>

)

}


export default SortDropdown;
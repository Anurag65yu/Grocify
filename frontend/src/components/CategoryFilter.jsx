import React from "react";

import "./CategoryFilter.css";


function CategoryFilter({ categories = [], selectedCategory, setSelectedCategory }){


return(

<div className="category-filter">


    <h3>Categories</h3>


    <div className="category-list">


        <button

            className={
                selectedCategory === "All" 
                ? "active-category" 
                : ""
            }

            onClick={()=>setSelectedCategory("All")}

        >

            All

        </button>



        {

        categories.map((category,index)=>(

            <button

                key={index}

                className={
                    selectedCategory === category
                    ? "active-category"
                    :""
                }

                onClick={()=>setSelectedCategory(category)}

            >

                {category}

            </button>


        ))

        }


    </div>


</div>

)

}


export default CategoryFilter;
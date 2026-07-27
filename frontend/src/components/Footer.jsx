import React from "react";

import "./Footer.css";


function Footer(){

return(

<footer className="footer">


    <div className="footer-container">


        <div className="footer-section">

            <h3>Grocify</h3>

            <p>
                Fresh groceries delivered to your doorstep.
            </p>

        </div>


        <div className="footer-section">

            <h4>Customer Support</h4>

            <ul>

                <li>Help Center</li>

                <li>Delivery Information</li>

                <li>Return Policy</li>

            </ul>

        </div>



        <div className="footer-section">

            <h4>Follow Us</h4>

            <div className="social-links">

                <span>Facebook</span>

                <span>Instagram</span>

                <span>Twitter</span>

            </div>

        </div>


    </div>



    <div className="copyright">

        © 2026 Grocify. All Rights Reserved.

    </div>


</footer>

)

}


export default Footer;
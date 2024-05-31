
import logo3 from "./time-tracking.png"
import logo4 from "./proj-planning1.png"
import React, { useState, useEffect } from 'react';
import logo6 from "./tasks-management.png"
import logo7 from "./about-banner.png"
function Rightdiv(){
  
//transition of image
const [imagePosition, setImagePosition] = useState('hidden');
useEffect(() => {
    // After the component mounts, set a timeout to display the image after a delay
    const timeoutId = setTimeout(() => {
      setImagePosition('visible');
    }, 1000); // Delay in milliseconds (adjust as needed)

    // Cleanup function to clear the timeout if the component unmounts before it fires
    return () => clearTimeout(timeoutId);
  }, []);

    return <>
    <div id="full">

    
    <div id="img-conatainer">

       
     </div>
     
     
  
     <div id="logo-cont5">
    <img src={logo7} id="logo4"  className={imagePosition === 'visible' ? 'slide-in' : 'hidden'}></img>
     </div>
     </div>
   
     </>
 
 }
 export default Rightdiv;
import React, { useContext, useRef, useState } from 'react'
import Card from '../components/Card'
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.png"
import image3 from "../assets/image3.png"
import image4 from "../assets/image4.png"
import image5 from "../assets/image5.png"
import { IoMdArrowBack } from "react-icons/io";
import { FaFileUpload } from "react-icons/fa";
import { userDataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'

const Customize = () => {
   const {serverUrl,userData,setUserData,frontendImage,setFontendImage,backendImage,setBackendImage,selectedImage,setSelectedImage} = useContext(userDataContext)

    const inputImage =useRef();
    const navigate = useNavigate();

    const handleImage = (e)=>{
        const file = e.target.files[0]
        setBackendImage(file);
        setFontendImage(URL.createObjectURL(file))

    }

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] relative'>
        <IoMdArrowBack  className='absolute top-[30px] left-[30px] cursor-pointer text-white w-[25px] h-[25px]' onClick={()=>navigate("/")}/>

       <h1 className='text-white mb-[40px] text-[30px] text-center'>
  Select Your <span className='text-blue-200 '>Assistant Image</span>
</h1>


       <div className='w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px]'>
         <Card image={image1}/>
         <Card image={image2}/>
         <Card image={image3}/>
         <Card image={image4}/>
         <Card image={image5}/>

         <div className={`w-[80px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#30326] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover: shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center ${selectedImage=="input"?"border-4 border-white shadow-2xl shadow-blue-950":null}`} onClick={()=>{
            inputImage.current.click()
            setSelectedImage("input")
            }}>

            {!frontendImage &&  <FaFileUpload className='text-white w-[25px] h-[25px]  ' />}

            {frontendImage && <img src={frontendImage} className='h-full object-cover'/>}


           

      
    </div>
   
  <input type='file'accept='image/*' ref={inputImage} hidden onChange={handleImage}/>

       </div>

       {selectedImage &&  <button className='min-w-[150px] h-[60px] cursor-pointer bg-white mt-[30px] text-black text-[19px] rounded-full' onClick={()=>navigate("/customize2")} >Next</button>
       }
       
    </div>
  )
}

export default Customize

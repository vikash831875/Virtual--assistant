import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from 'axios';
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const Customize2 = () => {
    const {userData,backendImage,selectedImage,serverUrl,setUserData} = useContext(userDataContext)
    const[assistantName, setAssistantName]= useState(userData?.assistantName || "");

    const navigate = useNavigate();

    const handleUpdateAssistant = async ()=>{
        try {
            let formData = new FormData();
            formData.append("assistantName", assistantName);
            if(backendImage){
                 formData.append("assistantImage", backendImage)

            }else{
                formData.append("imageUrl",selectedImage)
            }

            const result = await axios.post(`${serverUrl}/api/user/update`, formData,{withCredentials:true});

            console.log(result.data);
            setUserData(result.data);
            navigate("/")
            
        } catch (error) {
            console.log(error);
            
        }
    }
     
  return (
    <div  className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] relative '>

   <IoMdArrowBack  className='absolute top-[30px] left-[30px] cursor-pointer text-white w-[25px] h-[25px]' onClick={()=>navigate("/customize")}/>

         <h1 className='text-white mb-[40px] text-[30px] text-center'>
  Enter Your <span className='text-blue-200 '>Assistant Name</span>
</h1>

<input
                    type="text"
                    placeholder='eg. shifra'
                    className='w-full h-[60px] max-w-[600px] border-2 border-white bg-transparent text-white px-[20px] rounded-full text-[18px] ' required onChange={(e)=>{
                        setAssistantName(e.target.value)
                    }} value={assistantName}
                   
                />

                {assistantName && <button className='min-w-[200px] h-[60px] cursor-pointer bg-white mt-[30px] text-black text-[19px] rounded-full' onClick={()=>{
                    
                    handleUpdateAssistant();
                    }} >Create Your Assistant</button>}

                
      
    </div>
  )
}

export default Customize2

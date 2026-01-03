import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

function Recruiterlogin(){

    const [State,setState] = useState('login');
    const [Name,setName] = useState('');
    const [Email,setEmail] = useState('');
    const [Password,setPassword] = useState('');
    
    const [Image,setImage] = useState(false);
    const [isTextDataSubmited,setisTextDataSubmited] = useState(false);

    const {setisRecruiterLogin} = useContext(AppContext);

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        if(State === "sing up" && !isTextDataSubmited){
            setisTextDataSubmited(true);
        }
    }
    useEffect(() => {
        document.body.style.overflow = "hidden"

        return () => {
            document.body.style.overflow = "unset"
        }
    },[])

    return(
        <div className = " absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center ">
            <form  onSubmit = {onSubmitHandler} className = " relative bg-white p-10 rounded-xl text-slate-500">

                <h1 className = " text-center text-2xl text-neutral-700 font-medium">Recruiter Login</h1>
                <p className = " text-sm">Welcome back! Please sign in to continue</p>
                {State === "sing up" && isTextDataSubmited 
                    ?<>
                        <div className = "flex items-center py-10 gap-2">
                            <label htmlFor = "image" className = "cursor-pointer">
                                <img className = "rounded-full w-16 " src = {Image ? URL.createObjectURL(Image): assets.upload_area} alt="" />
                                <input onChange = {e => setImage(e.target.files[0])} type = "file" id = "image" hidden />
                            </label>
                            <p>Uplode Company <br />logo</p>
                        </div>
                    </>
                    :<>
                    {State === 'sing up' && (
                        <div className = " border px-4 py-2 flex items-center gap-2 rounded-full mt-5 ">
                            <img src = {assets.person_icon} alt="" />
                            <input className = " outline-none text-sm" onChange = {e => setName(e.target.value)} value = {Name} type="text" placeholder = "Company Name" required/>
                        </div>
                    )}

                    <div className = " border px-4 py-2 flex items-center gap-2 rounded-full mt-5 ">
                        <img src = {assets.email_icon} alt="" />
                        <input className = " outline-none text-sm" onChange = {e => setEmail(e.target.value)} value = {Email} type="email" placeholder = "Email Id" required/>
                    </div>

                    <div className = " border px-4 py-2 flex items-center gap-2 rounded-full mt-5 ">
                        <img src = {assets.lock_icon} alt="" />
                        <input className = " outline-none text-sm" onChange = {e => setPassword(e.target.value)} value = {Password} type = "password" placeholder = "password" required/>
                    </div>

                    </>
                } 
                
                {State === 'login' &&
                    <p className = " text-sm text-blue-600 my-2 cursor-pointer">Forgot password?</p>
                }

                <button type = "submit" className = " border rounded-full text-white bg-blue-500 w-full py-2 mt-2 ">{State === 'login' ? 'login' : isTextDataSubmited ? 'create account' : 'next'}</button>

                {State === 'login' 
                    ? <p className = "text-center mt-5" >Don't have an account ? <span className = " text-blue-600 cursor-pointer " onClick = {() => setState('sing up')}>Sing up</span></p> 
                    : <p className = "text-center mt-5" >Alredy have an account ? <span className = " text-blue-600 cursor-pointer " onClick = {() => setState('login')}>Login</span></p>
                }
                <img onClick = {e => setisRecruiterLogin(false) } className = "absolute top-5 right-5 cursor-pointer " src = {assets.cross_icon} alt="" />
            </form>
        </div>
    );
}

export default Recruiterlogin;
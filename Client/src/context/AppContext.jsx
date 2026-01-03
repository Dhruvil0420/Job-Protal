import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const [SerachFilter,setSerachFilter] = useState({
        title:'',
        location:''
    }); 

    const [isSearch,setIsSerached] = useState(false);

    const [jobs,setJobs] = useState([]);

    const [isRecruiterLogin,setisRecruiterLogin] = useState(false);


    const fetchJobs  = async() =>{
        setJobs(jobsData);
    }

    useEffect(() => {
        fetchJobs(); 
    },[])
    const value = {
        isSearch,setIsSerached,
        SerachFilter,setSerachFilter,
        jobs,setJobs,
        isRecruiterLogin,setisRecruiterLogin,
    }

    return (
    <AppContext.Provider value = {value}>
        {props.children}
    </AppContext.Provider>
    )
} 
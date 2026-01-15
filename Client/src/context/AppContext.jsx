import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [SerachFilter, setSerachFilter] = useState({
        title: '',
        location: ''
    });

    const [isSearch, setIsSerached] = useState(false);

    const [jobs, setJobs] = useState([]);

    const [isRecruiterLogin, setisRecruiterLogin] = useState(false);

    const [companyToken, setcompanyToken] = useState(null);
    const [companyData, setcompanyData] = useState(null);

    const [userData, setUserData] = useState(null);
    const [userApplications, setUserApplication] = useState([]);

    const { user } = useUser();
    const { getToken } = useAuth();

    // fetch ALL Job 
    const fetchJobs = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/jobs/');
            if (data.success) {
                console.log("This is All Job-list form Appcontext")
                console.log(data);
                setJobs(data.jobs);
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // function to fetchData

    const fetchCompanyData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/company/getdata', { headers: { token: companyToken } });

            if (data.success) {
                setcompanyData(data.company);
            }
            else {
                toast.error(data.message);
            }
        }
        catch (error) {
            toast.error(data.message);
        }
    }

    // fetch UserData 
    const fetchUserData = async () => {

        try {

            const token = await getToken();
            if (!token) return; 

            const { data } = await axios.get(backendUrl + '/api/users/getuserdata'
                , { headers: { Authorization: `Bearer ${token}` } });


            if (data.success) {
                setUserData(data.user)
            }
            else {
                toast.error(data.message);
            }
        }
        catch (error) {
            toast.error(error.message);
        }
    }

    //fetch user Applied Job

    const fetchAppliedJob = async () => {

        try {
            
            const token = await getToken();
            if (!token) return;
            
            const {data} = await axios.get(backendUrl + '/api/users/application'
                ,{headers: {Authorization: `Bearer ${token}`}});

            if(data.success){
                setUserApplication(data.applications);
            }
            else{
                toast.error(data.message);
            }

        } 
        catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        fetchJobs();

        const storedCompanyToken = localStorage.getItem('companyToken')
        if (storedCompanyToken) {
            setcompanyToken(storedCompanyToken);
        }

    }, [])

    useEffect(() => {
        if (companyToken) {
            fetchCompanyData();
        }
    }, [companyToken]);

    useEffect(() => {
        if (user) {
            fetchUserData();
            fetchAppliedJob();
        } else {
            setUserData(null);
        }
    }, [user]);

    const value = {
        isSearch, setIsSerached,
        SerachFilter, setSerachFilter,
        jobs, setJobs,
        isRecruiterLogin, setisRecruiterLogin,
        companyData, setcompanyData,
        companyToken, setcompanyToken,
        backendUrl,
        userApplications,setUserApplication,
        userData,setUserData,
        fetchUserData,
        fetchAppliedJob
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
} 
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import kconvert from "k-convert"
import moment from 'moment'
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";
function Applyjob() {

    const { id } = useParams()

    const [jobData, setJobData] = useState(null);

    const [isAlreadyApplied, setisAlreadyApplied] = useState(false);

    const { jobs, backendUrl, userData ,userApplications,fetchAppliedJob} = useContext(AppContext);

    const { getToken } = useAuth();

    const navigate = useNavigate();

    const fetchJob = async () => {
        try {
            const { data } = await axios.get(backendUrl + `/api/jobs/${id}`)
            if (data.success) {
                setJobData(data.job);
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }


    // Apply For Job 
    const applyHandler = async () => {

        try {

            if (!userData) {
                return toast.error("login for apply job");
            }

            if (!userData.resume) {
                navigate('/application');
                return toast.error("upload Resume for apply job");
            }

            const token = await getToken();

            const { data } = await axios.post(backendUrl + '/api/users/apply-job'
                , { jobId: jobData._id },
                { headers: { Authorization: `Bearer ${token}` } });

            if (data.success) {
                toast.success(data.message);
                fetchAppliedJob();
            }
            else {
                toast.error(data.message)
            }

        }
        catch (error) {
            console.log("This is Cath Block");
            toast.error(error.message);
        }
    }

    // checke User is Applied or Not 
    const checkAlreadyApplied = () => {
        const hasApplied = userApplications.some( item => item.jobId && item.jobId._id === jobData._id);
        
        setisAlreadyApplied(hasApplied);

    }

    useEffect(() => {
        if (jobs.length > 0) {
            fetchJob();
        }
    }, [id, jobs])

    useEffect(() => {
        if (jobData && userApplications.length > 0) {
            checkAlreadyApplied();
        }
    }, [jobData, id, userApplications])
    return jobData ?
        <>
            <Navbar />
            {/* main div */}
            <div className=" min-h-screen flex flex-col container py-10 px-4 2xl:px-20 mx-auto">

                <div className="bg-white text-black rounded-lg w-full">

                    {/* left part */}
                    <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl ">
                        <div className=" flex flex-col items-center md:flex-row">
                            <img className=" h-24 rounded-lg bg-white p-4 mr-4 border max-md:mb-4" src={jobData.companyId.image} alt="" />

                            <div className=" text-center md:text-left text-neutral-700 ">
                                <h1 className=" text-2xl sm:text-4xl font-medium ">{jobData.title}</h1>

                                <div className=" flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center mt-2 text-gray-600 ">
                                    <span className=" flex gap-1 items-center">
                                        <img src={assets.suitcase_icon} alt="" />
                                        {jobData.companyId.name}
                                    </span>
                                    <span className=" flex gap-1 items-center">
                                        <img src={assets.location_icon} alt="" />
                                        {jobData.location}
                                    </span>
                                    <span className=" flex gap-1 items-center">
                                        <img src={assets.person_icon} alt="" />
                                        {jobData.level}
                                    </span>
                                    <span className=" flex gap-1 items-center">
                                        <img src={assets.money_icon} alt="" />
                                        CTC : {kconvert.convertTo(jobData.salary)}
                                    </span>
                                </div>

                            </div>

                        </div>

                        <div className=" flex flex-col justify-center text-end text-sm max-md:text-center max-md:mx-auto ">
                            <button onClick={applyHandler} className=" bg-blue-600 p-2.5 px-10 text-white rounded cursor-pointer">{isAlreadyApplied ? "Already Applied" : "Apply now"}</button>
                            <p className=" mt-1 text-gray-600">Posted {moment(jobData.date).fromNow()} </p>
                        </div>

                    </div>

                    <div className=" flex flex-col lg:flex-row justify-between items-start">
                        <div className=" w-full lg:w-2/3">
                            <h2 className=" text-xl mb-4 font-bold ">Job description</h2>
                            <div className=" rich-text " dangerouslySetInnerHTML={{ __html: jobData.description }}></div>
                            <button onClick={applyHandler} className=" bg-blue-600 p-2.5 px-10 text-white rounded mt-10 cursor-pointer">{isAlreadyApplied ? "Already Applied" : "Apply now"}</button>
                        </div>
                        {/*Right part */}
                        <div className=" w-full lg:w-1/4 mt-8 lg:mt-0 lg:ml-8 space-y-5">
                            <h2>More jobs from {jobData.companyId.title}</h2>
                            {jobs.filter(job => job._id !== jobData._id && job.companyId._id === jobData.companyId._id)
                                .filter(job => {
                                    // Set Of All Applyed Job 
                                    const appliedJobIds = new Set(userApplications.map(app => app.jobId._id))
                                    // return true if the user has not already applied for this job
                                    return !appliedJobIds.has(job._id);
                                })
                                .slice(0, 4)
                                .map((job, index) => (
                                    <JobCard key={index} job={job} />
                                ))}
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </>
        : (<Loading />);
}

export default Applyjob;
import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { assets, jobsApplied } from "../assets/assets";
import moment from "moment";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";

function Application(){

    const [isEdit,setisEdit] = useState(false);

    const [resume,setResume] = useState(null);

    const {backendUrl , userData, fetchUserData,userApplications,fetchAppliedJob} = useContext(AppContext);

    const {user} = useUser();
    const {getToken} = useAuth();


    // update User Resume 
    const updateResume = async () => {

        try {
            
            const formData = new FormData();
            formData.append('resume',resume);

            const token = await getToken();
            if (!token) throw new Error("Authentication failed");
            
            const {data} = await axios.post(backendUrl + '/api/users/update-resume'
                ,formData
                ,{ headers : {Authorization: `Bearer ${token}`}});

            if(data.success){
                toast.success(data.message);
                await fetchUserData()
                setResume(null);
                setisEdit(false);
            }
            else{
                toast.error(data.message);
            }

        } 
        catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (user) {
            fetchAppliedJob();
        }
    }, [user]);




    return ( 
    <>
        <Navbar/>
        <div className = " container px-4 min-h-[65vh] 2xl:px-20 mx-auto mt-10">
            <h2 className = " text-xl font-semibold">Your Resume</h2>
            <div className = " flex gap-2 mb-6 mt-3">
                {
                    isEdit || !userData?.resume 
                    ?<>
                        <label className = " flex items-center cursor-pointer" htmlFor="resumeUpload">
                            <p className = " bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2 ">{resume ? resume.name : "Select Resume" } </p>
                            <input id = "resumeUpload" onChange = {e => setResume(e.target.files[0])} accept = 'application/pdf' type = "file" hidden/>
                            <img src = {assets.profile_upload_icon} alt="" />
                        </label>
                        <button onClick = {updateResume} className = " bg-green-100 border border-green-400 px-4 py-2 rounded-lg cursor-pointer">Save</button>
                    </>
                    :<div className = " flex gap-2">
                        <a className = ' bg-blue-100 text-blue-600 px-4 py-2 rounded-lg cursor-pointer ' 
                        target = "_blank"
                        href = {userData.resume}>Resume</a>
                        <button onClick = {() => setisEdit(true)} className = " text-gray-400 border border-gray-300 rounded-lg px-4 py-2 cursor-pointer">Edit</button>
                    </div>
                }
            </div>
            <div>
                <h2 className = "text-xl font-semibold mb-4">Jobs Applied</h2>
                <table className = " min-w-full bg-white border rounded-lg">
                    <thead>
                        <tr>
                            <th className = " px-4 py-3 border-b text-left">Company</th>
                            <th className = " px-4 py-3 border-b text-left">job title</th>
                            <th className = " px-4 py-3 border-b text-left max-sm:hidden ">Location</th>
                            <th className = " px-4 py-3 border-b text-left max-sm:hidden ">Data</th>
                            <th className = " px-4 py-3 border-b text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {userApplications.map((job,index) => true ? (
                        <tr key = {job._id}>
                            <td className = " flex px-4 py-3 items-center border-b gap-2 ">
                                <img className = " w-8 h-8 "src = {job.companyId.image} alt="" />
                                {job.companyId.name}
                            </td>
                            <td className = " px-4 py-2 border-b">{job.jobId.title}</td>
                            <td className = " px-4 py-2 border-b max-sm:hidden ">{job.jobId.location}</td>
                            <td className = " px-4 py-2 border-b max-sm:hidden ">{moment(job.date, 'DD MMM, YYYY').format('ll')}</td>
                            <td className = " px-4 py-2 border-b">
                                <span className = {`${job.status === 'Accepted' ? 'bg-green-100' : job.status === 'Rejected' ? 'bg-red-100' : 'bg-blue-100'} px-4 py-1.5 rounded`}>{job.status}</span>
                            </td>
                        </tr>
                    ) : (null))}
                    </tbody>
                </table>
            </div>
        </div>
        <Footer/>
    </>
    );
}

export default Application; 
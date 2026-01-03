import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { assets, jobsApplied } from "../assets/assets";
import moment from "moment";
import Footer from "../components/Footer";

function Application(){

    const [isEdit,setisEdit] = useState(false);

    const [Resume,setResume] = useState(null);

    return ( 
    <>
        <Navbar/>
        <div className = " container px-4 min-h-[65vh] 2xl:px-20 mx-auto mt-10">
            <h2 className = " text-xl font-semibold">Your Resume</h2>
            <div className = " flex gap-2 mb-6 mt-3">
                {
                    isEdit 
                    ?<>
                        <label className = " flex items-center" htmlFor="resumeUpload">
                            <p className = " bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2 ">Select Resume </p>
                            <input id = "resumeUpload" onChange = {e => setResume(e.target.files[0])} accept = 'application/pdf' type = "file" hidden/>
                            <img src = {assets.profile_upload_icon} alt="" />
                        </label>
                        <button onClick = {() => setisEdit(false)} className = " bg-green-100 border border-green-400 px-4 py-2 rounded-lg ">Save</button>
                    </>
                    :<div className = " flex gap-2">
                        <a className = ' bg-blue-100 text-blue-600 px-4 py-2 rounded-lg'href="">Resume</a>
                        <button onClick = {() => setisEdit(true)} className = " text-gray-400 border border-gray-300 rounded-lg px-4 py-2">Edit</button>
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
                    {jobsApplied.map((job,index) => true ? (
                        <tr key = {index}>
                            <td className = " flex px-4 py-3 items-center border-b gap-2 ">
                                <img className = " w-8 h-8 "src = {job.logo} alt="" />
                                {job.company}
                            </td>
                            <td className = " px-4 py-2 border-b">{job.title}</td>
                            <td className = " px-4 py-2 border-b max-sm:hidden ">{job.location}</td>
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
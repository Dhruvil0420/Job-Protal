import { useContext, useEffect } from 'react'
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

function ManageJobs() {

  const navigate = useNavigate();

  const [jobs, setJobs] = useState(false);

  const { backendUrl, companyToken } = useContext(AppContext);

  const feathCompanyJobs = async () => {

    try {
      const { data } = await axios.get(backendUrl + '/api/company/list-job', { headers: { token: companyToken } });

      if (data.success) {
        console.log(data.jobData);
        setJobs(data.jobData.reverse());
      }
      else {
        toast.error(data.message)
      }
    }
    catch (error) {
      toast.error(error.message)
    }
  }


  // Function For Change Job Visibility

  const changeJobVisibility = async (id) => {

    try {

      const { data } = await axios.post(backendUrl + '/api/company/change-visiblity', 
        { id },{ headers : {token: companyToken}});

      if(data.success){
        toast.success(data.message);
        feathCompanyJobs()
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
    if (companyToken) {
      feathCompanyJobs();
    }
  }, [companyToken])
  return jobs ? jobs.length === 0 ? (
  <div className = 'flex items-center justify-center h-[70vh]'>
    <p className='text-xl sm:text-2xl'>No Jobs Availabel or posted</p>
  </div>
  ) : (
    <div className='container p-4 max-w-5xl'>
      <div className='overflow-x-auto'>
        <table className='min-w-full border bg-white border-gray-400 max-sm:text-sm'>

          <thead>

            <tr>
              <th className='px-4 py-2 border-b text-left max-sm:hidden'>#</th>
              <th className='px-4 py-2 border-b text-left'>Job Title</th>
              <th className='px-4 py-2 border-b text-left max-sm:hidden'>Date</th>
              <th className='px-4 py-2 border-b text-left max-sm:hidden'>Location</th>
              <th className='px-4 py-2 border-b text-center'>Applicants</th>
              <th className='px-4 py-2 border-b text-left'>Visible</th>
            </tr>

          </thead>

          <tbody>

            {jobs.map((job, index) => (
              <tr
                key={index}
                className='text-gray-700'>
                <td className='px-4 py-2 border-b max-sm:hidden' >{index + 1}</td>
                <td className='px-4 py-2 border-b ' >{job.title}</td>
                <td className='px-4 py-2 border-b max-sm:hidden' >{moment(job.date).format('ll')}</td>
                <td className='px-4 py-2 border-b max-sm:hidden' >{job.location}</td>
                <td className='px-4 py-2 border-b text-center' >{job.applicants}</td>
                <td className='px-4 py-2 border-b ' >
                  <input
                    onChange={() => changeJobVisibility(job._id)}
                    type="checkbox"
                    checked = {job.visible}
                    className='scale-125 ml-4' />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='mt-4 flex justify-end'>
        <button onClick={() => navigate('/dashboard/add-job')} className='bg-black text-white px-4 py-2 rounded'>Add new job</button>
      </div>
    </div>
  ): <Loading/>
}

export default ManageJobs;
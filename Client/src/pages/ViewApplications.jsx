import { useContext, useEffect, useState } from 'react'
import { assets, viewApplicationsPageData } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

function ViewApplications() {

  const { backendUrl, companyToken } = useContext(AppContext);

  const [applictions, setApplictions] = useState();


  // Featch Applied User For This comapny
  const featchCompanyJobApplications = async () => {

    try {
      const { data } = await axios.get(backendUrl + '/api/company/applicants', {
        headers: { token: companyToken }
      });
  
      if (data.success) {
        setApplictions(data.applications);
      }
      else {
        toast.error(data.message);
      }
    }
    catch (error) {
      toast.error(error.message)
    }
  }

  // Fuction for change JobApplictions status 

  const changeApplictionStatus = async (id, status) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/company/change-status'
        , { id, status },
        { headers: { token: companyToken } });

      if (data.success) {
        toast.success(data.message);
        featchCompanyJobApplications();
      }
      else {
        toast.error(data.message);
      }

    }
    catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (companyToken) {
      featchCompanyJobApplications();
    }
  }, [companyToken])

  return applictions ? applictions.lenth === 0 ? (
    <div className='flex items-center justify-center h-[70vh]'>
      <p className='text-xl sm:text-2xl'>No Jobs Availabel or posted</p>
    </div>
  ) : (
    <div className='container mx-auto p-4'>

      <div>

        <table className='w-full bg-white border border-gray-200 max-sm:text-sm'>

          <thead>

            <tr className='border-b'>
              <th className='py-2 px-4 text-left'>#</th>
              <th className='py-2 px-4 text-left'>User name</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Job Title</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Location</th>
              <th className='py-2 px-4 text-left'>Resume</th>
              <th className='py-2 px-4 text-left'>Action</th>
            </tr>

          </thead>

          <tbody>
            {applictions.map((applicant, index) => (
              <tr
                key={index}
                className='text-gray-700'>
                <td className='px-4 py-2 border-b text-center'>{index + 1}</td>
                <td className='px-4 py-2 border-b text-center flex items-center'>
                  <img
                    className='w-10 h-10 rounded-full mr-3 max-sm:hidden '
                    src={applicant.userId.image} alt="" />
                  <span >{applicant.userId.name}</span>
                </td>
                <td className='px-4 py-2 border-b max-sm:hidden' >{applicant.jobId.title}</td>
                <td className='px-4 py-2 border-b max-sm:hidden' >{applicant.jobId.location}</td>
                <td className='px-4 py-2 border-b '>
                  <a href={applicant.userId.resume}
                    target='_blank'
                    className='text-blue-400 bg-blue-50 px-3 py-2 rounded inline-flex gap-2 items-center'>
                    Resume <img src={assets.resume_download_icon} alt="" />
                  </a>
                </td>
                <td className='px-4 py-2 border-b relative'>
                  {applicant.status === "Pending"
                    ? <div className='relative text-left inline-block group '>
                      <button className='text-gray-400 action-button'>...</button>
                      <div className='z-10 hidden absolute right-0 top-0 sm:left-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block'>
                        <button onClick={() => changeApplictionStatus(applicant._id, 'Accepted')} className='w-full block text-left px-4 py-2 text-blue-500 hover:bg-gray-100'>Accept</button>
                        <button onClick={() => changeApplictionStatus(applicant._id, 'Rejected')} className='w-full block text-left px-4 py-2 text-red-500 hover:bg-gray-100'>Reject</button>
                      </div>
                    </div>
                    : <div>{applicant.status}</div>
                  }

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : <Loading />
}

export default ViewApplications; 

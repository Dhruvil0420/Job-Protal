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
    <div className='max-w-7xl mx-auto p-4'>

      <div className='overflow-x-auto rounded-xl border bg-white shadow-sm'>

        <table className="min-w-[900px] w-full text-sm">

          <thead className="bg-gray-50 border-b" >

            <tr className='border-b'>
              <th className='py-3 px-5 text-left text-gray-600 font-semibold whitespace-nowrap'>#</th>
              <th className='py-3 px-5 text-left text-gray-600 font-semibold whitespace-nowrap'>User name</th>
              <th className='py-3 px-5 text-left text-gray-600 font-semibold whitespace-nowrap max-sm:hidden'>Job Title</th>
              <th className='py-3 px-5 text-left text-gray-600 font-semibold whitespace-nowrap max-sm:hidden'>Location</th>
              <th className='py-3 px-5 text-left text-gray-600 font-semibold whitespace-nowrap'>Resume</th>
              <th className='py-3 px-5 text-left text-gray-600 font-semibold whitespace-nowrap'>Action</th>
            </tr>

          </thead>

          <tbody>
            {applictions.map((applicant, index) => (
              <tr
                key={index}
                className='className="border-b hover:bg-gray-50 transition'>
                <td className="px-5 py-4 border-b text-center font-medium">{index + 1}</td>

                <td className="px-5 py-4 border-b">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-10 h-10 rounded-full max-sm:hidden"
                      src={applicant.userId.image}
                      alt=""
                    />
                    <span className="whitespace-nowrap">
                      {applicant.userId.name}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-4 border-b max-sm:hidden whitespace-nowrap">{applicant.jobId.title}</td>
                <td className='px-5 py-4 border-b max-sm:hidden' >{applicant.jobId.location}</td>
                <td className='px-5 py-4 border-b '>
                  <a href={applicant.userId.resume}
                    target='_blank'
                    className="px-3 py-1.5 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition inline-flex items-center gap-2 whitespace-nowrap">
                    Resume <img src={assets.resume_download_icon} alt="" />
                  </a>
                </td>
                <td className='px-4 py-2 border-b relative'>
                  {applicant.status === "Pending"
                    ? <div className='relative text-left inline-block group '>
                      <button className='text-gray-500 px-2 py-1 rounded hover:bg-gray-100 transition'>...</button>
                      <div className='z-20 hidden absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-md group-hover:block'>
                        <button onClick={() => changeApplictionStatus(applicant._id, 'Accepted')} className='w-full block text-left px-4 py-2 text-blue-500 hover:bg-gray-100'>Accept</button>
                        <button onClick={() => changeApplictionStatus(applicant._id, 'Rejected')} className='w-full block text-left px-4 py-2 text-red-500 hover:bg-gray-100'>Reject</button>
                      </div>
                    </div>
                    : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${
                            applicant.status === "Accepted"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                      >
                        {applicant.status}
                      </span>
                    )
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

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
        { id }, { headers: { token: companyToken } });

      if (data.success) {
        toast.success(data.message);
        feathCompanyJobs()
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
      feathCompanyJobs();
    }
  }, [companyToken])
  return jobs ? jobs.length === 0 ? (
  <div className="flex items-center justify-center h-[70vh]">
    <p className="text-lg sm:text-2xl text-gray-500">
      No jobs available or posted
    </p>
  </div>
) : (
  <div className="max-w-7xl mx-auto p-3 sm:p-4">

    {/* Table Wrapper */}
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
      <table className="min-w-[800px] w-full text-xs sm:text-sm">

        {/* Table Head */}
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left font-semibold text-gray-600 max-sm:hidden">#</th>
            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left font-semibold text-gray-600">Job Title</th>
            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left font-semibold text-gray-600 max-sm:hidden">Date</th>
            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left font-semibold text-gray-600 max-sm:hidden">Location</th>
            <th className="px-3 sm:px-5 py-2 sm:py-3 text-center font-semibold text-gray-600">Applicants</th>
            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left font-semibold text-gray-600">Visible</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {jobs.map((job, index) => (
            <tr
              key={job._id}
              className="border-b hover:bg-gray-50 active:bg-gray-100 transition"
            >
              <td className="px-3 sm:px-5 py-2 sm:py-4 max-sm:hidden font-medium text-gray-600">
                {index + 1}
              </td>

              <td className="px-3 sm:px-5 py-2 sm:py-4 text-gray-800 font-medium">
                {job.title}
              </td>

              <td className="px-3 sm:px-5 py-2 sm:py-4 text-gray-600 max-sm:hidden">
                {moment(job.date).format('ll')}
              </td>

              <td className="px-3 sm:px-5 py-2 sm:py-4 text-gray-600 max-sm:hidden">
                {job.location}
              </td>

              <td className="px-3 sm:px-5 py-2 sm:py-4 text-center font-semibold text-gray-700">
                {job.applicants}
              </td>

              <td className="px-3 sm:px-5 py-2 sm:py-4">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={job.visible}
                    onChange={() => changeJobVisibility(job._id)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition relative">
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full transition peer-checked:translate-x-4 sm:peer-checked:translate-x-5" />
                  </div>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Footer Action */}
    <div className="mt-4 flex justify-end">
      <button
        onClick={() => navigate('/dashboard/add-job')}
        className="px-5 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-900 transition"
      >
        Add New Job
      </button>
    </div>

  </div>
) : <Loading />;

}

export default ManageJobs;
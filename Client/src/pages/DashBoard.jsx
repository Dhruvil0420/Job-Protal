import { useContext, useEffect } from 'react';
import { NavLink, Outlet, useNavigate,Navigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

function DashBoard() {
  const navigate = useNavigate();
  const { companyData, setcompanyData, setcompanyToken ,companyToken } = useContext(AppContext);

  if (!companyToken) {
    return <Navigate to="/" replace />;
  }

  const logout = () => {
    navigate('/', { replace: true });
    localStorage.removeItem('companyToken');
    setcompanyData(null);
    setcompanyToken(null);
  };

  useEffect(() => {
    navigate('/dashboard/add-job')
  },[companyToken])
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="flex justify-between items-center px-6 py-4">
          <img
            onClick={() => navigate('/')}
            className="w-36 cursor-pointer"
            src={assets.logo}
            alt="logo"
          />

          {companyData && (
            <div className="flex items-center gap-3">
              <p className="hidden sm:block text-gray-700 font-medium">
                Welcome, {companyData.name}
              </p>

              <div className="relative group">
                <img
                  className="w-9 h-9 rounded-full border object-cover"
                  src={companyData.image}
                  alt="profile"
                />

                <div className="absolute hidden group-hover:block right-0 pt-12">
                  <ul className="bg-white border rounded-md shadow-md text-sm overflow-hidden">
                    <li
                      onClick={logout}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition"
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white border-r">
          <ul className="flex flex-col pt-6 text-sm font-medium">
            <NavLink
              to="/dashboard/add-job"
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 transition
                hover:bg-blue-50
                ${
                  isActive
                    ? 'bg-blue-100 text-blue-600 border-r-4 border-blue-600'
                    : 'text-gray-600'
                }`
              }
            >
              <img src={assets.add_icon} alt="" />
              Add Job
            </NavLink>

            <NavLink
              to="/dashboard/manage-job"
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 transition
                hover:bg-blue-50
                ${
                  isActive
                    ? 'bg-blue-100 text-blue-600 border-r-4 border-blue-600'
                    : 'text-gray-600'
                }`
              }
            >
              <img src={assets.home_icon} alt="" />
              Manage Jobs
            </NavLink>

            <NavLink
              to="/dashboard/view-applications"
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 transition
                hover:bg-blue-50
                ${
                  isActive
                    ? 'bg-blue-100 text-blue-600 border-r-4 border-blue-600'
                    : 'text-gray-600'
                }`
              }
            >
              <img src={assets.person_tick_icon} alt="" />
              View Applications
            </NavLink>
          </ul>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashBoard;

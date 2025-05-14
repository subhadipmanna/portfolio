import React, { useEffect, useState } from "react";
import axios from "axios";

const Timeline = () => {
  const [user, setUser] = useState({});
  const [timeline, setTimeline] = useState([]);

  // Fetch user avatar only
  useEffect(() => {
    const getMyProfile = async () => {
      try {
        const { data } = await axios.get(
          "https://amit-cackend.vercel.app/api/v1/user/me/portfolio",
          { withCredentials: true }
        );
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    getMyProfile();
  }, []);

  // Fetch timeline data
  useEffect(() => {
    const getMyTimeline = async () => {
      try {
        const { data } = await axios.get(
          "https://amit-cackend.vercel.app/api/v1/timeline/getall",
          { withCredentials: true }
        );
        setTimeline(data.timelines);
      } catch (error) {
        console.error("Error fetching timeline:", error);
      }
    };
    getMyTimeline();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Section (Profile Image) - Ratio 1 */}
          <div className="w-full md:w-1/3 p-8 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Profile</h2>
            <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-blue-500 dark:border-blue-700 shadow-lg">
              <img
                src={user?.avatar?.url || "/default-avatar.png"}
                alt="Profile"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Right Section (Timeline Table) - Ratio 2 */}
          <div className="w-full md:w-2/3 p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Timeline</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Period
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {timeline.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {item.timeline.from} - {item.timeline.to || "Present"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {item.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
import axios from "axios";
import React, { useEffect, useState } from "react";

const Skills = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const getMySkills = async () => {
      const { data } = await axios.get(
        "amit-cackend-7at3838oe-subhadip-mannas-projects.vercel.app/api/v1/skill/getall",
        { withCredentials: true }
      );
      setSkills(data.skills);
    };
    getMySkills();
  }, []);

  const ProficiencyBar = ({ proficiency }) => {
    return (
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${proficiency}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="mt-8">
         <h2 className="text-xl text-gray-800 dark:text-gray-200 font-semibold mb-6">
              My Skills
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((skill) => (
                <div
                  key={skill._id}
                  className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <div className="flex-shrink-0 mr-4">
                    <img
                      src={skill.svg?.url}
                      alt={skill.title}
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {skill.title}
                      </span>
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        {skill.proficiency}%
                      </span>
                    </div>
                    <ProficiencyBar proficiency={skill.proficiency} />
                  </div>
                </div>
              ))}
            </div>
          </div>
      
    </div>
  );
};

export default Skills;
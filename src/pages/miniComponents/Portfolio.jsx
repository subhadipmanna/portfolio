import { Card } from "@/components/ui/card";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const getMyProjects = async () => {
      try {
        const { data } = await axios.get(
          "https://amit-cackend-7at3838oe-subhadip-mannas-projects.vercel.app/api/v1/projrct/getall",
          { withCredentials: true }
        );
        setProjects(data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    getMyProjects();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatDescription = (description) => {
    return description.split(". ").filter(item => item.trim() !== "");
  };

  return (
    <div className="w-full flex flex-col gap-8 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Simplified Heading */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">
        Projects
      </h1>

      {/* Projects Container */}
      <div className="px-4 sm:px-8 md:px-12 lg:px-24 space-y-8">
        {projects.map((project) => (
          <Card 
            key={project._id} 
            className="overflow-hidden shadow-lg dark:shadow-md"
          >
            <div className={`flex ${isMobile ? "flex-col" : "flex-row"}`}>
              {/* Left Section */}
              <div className={`${isMobile ? "w-full" : "w-1/2"} p-4`}>
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                  {project.title}
                </h2>
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={project.projectBanner?.url || "/placeholder-project.jpg"}
                    alt={project.title}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>
              </div>

              {/* Right Section */}
              <div className={`${isMobile ? "w-full" : "w-1/2"} p-4`}>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      Description
                    </h3>
                    <ul className="list-disc pl-4 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {formatDescription(project.description).map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.split(", ").map((tech, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      Stack
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{project.stack}</p>
                  </div>

                  <div className="space-y-1">
                    <div>
                      <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">
                        Github Repository
                      </h3>
                      <Link 
                        to={project.gitRepoLink} 
                        target="_blank"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
                      >
                        {project.gitRepoLink}
                      </Link>
                    </div>
                    {project.projectLink && (
                      <div>
                        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">
                          Project Link
                        </h3>
                        <Link 
                          to={project.projectLink} 
                          target="_blank"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
                        >
                          {project.projectLink}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
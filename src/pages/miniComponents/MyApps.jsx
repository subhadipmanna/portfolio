import { Card } from "@/components/ui/card";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const MyApps = () => {
  const [apps, setApps] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const getMyApps = async () => {
      const { data } = await axios.get(
        "https://amit-cackend.vercel.app/api/v1/softwareapplication/getall",
        { withCredentials: true }
      );
      setApps(data.softwareApplications);
    };
    getMyApps();
  }, []);

  // Auto-rotate every 10 seconds
  useEffect(() => {
    if (apps.length > 1) {
      intervalRef.current = setInterval(() => {
        goToNext();
      }, 10000);

      return () => clearInterval(intervalRef.current);
    }
  }, [apps.length, currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? apps.length - 1 : prevIndex - 1
    );
    resetInterval();
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === apps.length - 1 ? 0 : prevIndex + 1
    );
    resetInterval();
  };

  const resetInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      goToNext();
    }, 10000);
  };

  if (apps.length === 0) return null;

  return (
    // Reduced main container height
    <div className="w-full py-4 md:py-8 bg-white dark:bg-gray-900 flex flex-col items-center">
      {/* Achievement Heading */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 md:mb-8 text-center">
        ACHIEVEMENTS
      </h1>

      {/* Certificate Carousel */}
      <div className="relative w-full max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-center gap-2 md:gap-6">
          {/* Left Arrow - Hidden on mobile if only one item */}
          {apps.length > 1 && (
            <button
              onClick={goToPrevious}
              className="p-2 md:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Previous certificate"
            >
              <FiChevronLeft className="w-5 h-5 md:w-8 md:h-8 text-gray-700 dark:text-gray-300" />
            </button>
          )}

          {/* Current Certificate - Reduced height */}
          <div className="flex-1 w-full max-w-xs sm:max-w-md md:max-w-2xl">
            <Card className="p-1 md:p-2 bg-white dark:bg-gray-800 shadow-sm md:shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
              <img
                src={apps[currentIndex].svg?.url}
                alt="certificate"
                className="h-40 sm:h-48 md:h-56 w-auto object-contain mx-auto"  // Further reduced heights
              />
              <p className="text-sm md:text-lg font-medium text-gray-700 dark:text-gray-300 text-center mt-1 md:mt-2">
                {apps[currentIndex].name}
              </p>
            </Card>
          </div>

          {/* Right Arrow - Hidden on mobile if only one item */}
          {apps.length > 1 && (
            <button
              onClick={goToNext}
              className="p-2 md:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Next certificate"
            >
              <FiChevronRight className="w-5 h-5 md:w-8 md:h-8 text-gray-700 dark:text-gray-300" />
            </button>
          )}
        </div>

        {/* Indicator dots */}
        {apps.length > 1 && (
          <div className="flex justify-center mt-3 md:mt-6 gap-1 md:gap-2">
            {apps.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  resetInterval();
                }}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
                  index === currentIndex
                    ? "bg-blue-600 dark:bg-blue-500"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                aria-label={`Go to certificate ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApps;
import {
  ExternalLink,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Mail,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import { Button } from "@/components/ui/button";
import axios from "axios";

const Hero = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMyProfile = async () => {
      try {
        const { data } = await axios.get(
          "https://vercel.com/subhadip-mannas-projects/amit-cackend/4ubu35QcykAmYXMe4pYXnY3vwp76/api/v1/user/me/portfolio",
          { withCredentials: true }
        );
        setUser(data.user);
      } catch (err) {
        setError("Failed to load profile data");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    getMyProfile();
  }, []);

  const socialLinks = [
    { 
      url: user?.linkedInURL, 
      icon: Linkedin, 
      color: "text-blue-600 dark:text-blue-400",
      isMail: false
    },
    { 
      url: user?.email ? `mailto:${user.email}` : null, 
      icon: Mail, 
      color: "text-red-500 dark:text-red-400",
      isMail: true
    },
    { 
      url: "#", 
      icon: Youtube, 
      color: "text-red-600 dark:text-red-500",
      isMail: false
    },
    { 
      url: user?.instagramURL, 
      icon: Instagram, 
      color: "text-pink-600 dark:text-pink-400",
      isMail: false
    },
    { 
      url: user?.facebookURL, 
      icon: Facebook, 
      color: "text-blue-800 dark:text-blue-600",
      isMail: false
    },
  ].filter(social => social.url);

  if (loading) return (
    <div className="w-full space-y-8 px-4 sm:px-6 lg:px-8 animate-pulse">
      {/* Skeleton loader remains same */}
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center p-8">
      Error loading profile: {error}
    </div>
  );

  return (
    <div className="w-full space-y-8 px-4 sm:px-6 lg:px-8">
      {/* Main Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 transition-all duration-300">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          {/* Left Content */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-green-400 w-2 h-2 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Available for opportunities
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Hi! I'm {user.fullName}
            </h1>

            <div className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 h-12 mb-4">
              <Typewriter
                words={[
                  "Full Stack Developer",
                  "Mobile Developer",
                  "UI/UX Designer",
                  "Data Analyst",
                  "IoT Engineer",
                ]}
                loop={true}
                cursor
                cursorStyle="|"
                typeSpeed={50}
                deleteSpeed={65}
                delaySpeed={2000}
              />
            </div>

            <div className="mt-4 md:mt-8 lg:mt-10 flex gap-3">
              <Link to={user.githubURL} target="_blank">
                <Button className="rounded-[30px] flex items-center gap-2 flex-row">
                  <span>
                    <Github />
                  </span>
                  <span>Github</span>
                </Button>
              </Link>
              <Link to={user.resume && user.resume.url} target="_blank">
                <Button className="rounded-[30px] flex items-center gap-2 flex-row">
                  <span>
                    <ExternalLink />
                  </span>
                  <span>Resume</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Social Links Section - Updated with better styling */}
          <div className="flex justify-center items-center mt-6 lg:mt-0">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <div className="absolute w-full h-full border-2 border-gray-300 dark:border-gray-600 rounded-full animate-spin-slow"></div>
              
              {socialLinks.slice(0, 5).map((social, index) => {
                const Icon = social.icon;
                const angle = (index * 90) - 45; // Position at 45° intervals
                const radius = 80; // Distance from center
                const x = radius * Math.cos(angle * Math.PI / 180);
                const y = radius * Math.sin(angle * Math.PI / 180);
                
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bg-white dark:bg-gray-700 shadow-md rounded-full p-2 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    style={{
                      transform: `translate(${x}px, ${y}px) rotate(-${angle}deg)`,
                      width: "3.5rem",
                      height: "3.5rem",
                    }}
                  >
                    <Icon className={`w-full h-full ${social.color}`} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* About Me Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          About Me
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {user.aboutme || "Professional developer with a passion for creating impactful digital solutions."}
        </p>
      </div>
    </div>
  );
};

export default Hero;


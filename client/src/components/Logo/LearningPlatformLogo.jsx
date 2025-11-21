import React from 'react';
import { BookOpen, Code, GraduationCap } from 'lucide-react';

const LearningPlatformLogo = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg`}>
        <GraduationCap className="w-5 h-5" />
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
           EduPro
          </span>
          <span className="text-xs text-gray-500 font-medium">
            Learning Platform
          </span>
        </div>
      )}
    </div>
  );
};

export default LearningPlatformLogo;

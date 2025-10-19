import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '../../lib/utils';

const ProgressBar = ({ 
  progress = 0, 
  total = 100, 
  completed = 0,
  showDetails = true,
  size = 'default',
  className = "" 
}) => {
  const percentage = total > 0 ? Math.round((progress / total) * 100) : 0;
  
  const sizeClasses = {
    small: 'h-2',
    default: 'h-3',
    large: 'h-4'
  };

  const iconSizes = {
    small: 'w-3 h-3',
    default: 'w-4 h-4',
    large: 'w-5 h-5'
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Progress Bar */}
      <div className="relative">
        <Progress 
          value={percentage} 
          className={cn("w-full", sizeClasses[size])}
        />
        
        {/* Progress Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(
            "text-xs font-medium",
            percentage > 50 ? "text-white" : "text-gray-700"
          )}>
            {percentage}%
          </span>
        </div>
      </div>

      {/* Details */}
      {showDetails && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <CheckCircle className={cn("text-green-500", iconSizes[size])} />
              <span className="text-gray-600">
                {completed} hoàn thành
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className={cn("text-gray-400", iconSizes[size])} />
              <span className="text-gray-600">
                {total - completed} còn lại
              </span>
            </div>
          </div>
          
          <Badge variant="secondary" className="text-xs">
            {progress}/{total}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
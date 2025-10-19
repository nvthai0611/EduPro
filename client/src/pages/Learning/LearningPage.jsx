import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize,
  Settings,
  Download,
  BookOpen,
  Clock,
  CheckCircle
} from 'lucide-react';
import VideoPlayer from '../../components/Video/VideoPlayer';
import LessonSidebar from '../../components/Lesson/LessonSidebar';
import CommentSection from '../../components/Comment/CommentSection';
import ProgressBar from '../../components/Progress/ProgressBar';
import { lessonService } from '../../services/lessonService';
import { progressService } from '../../services/progressService';
import { useAuth } from '../../hooks/useAuth';
import { useParams } from 'react-router-dom';

const LearningPage = () => {
  const { courseId, lessonId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showComments, setShowComments] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  useEffect(() => {
    if (lessonId && lessons.length > 0) {
      fetchLessonData();
    }
  }, [lessonId, lessons]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      // Fetch course with modules and lessons
      const courseResponse = await fetch(`/api/v1/courses/${courseId}`);
      const courseData = await courseResponse.json();
      setCourse(courseData.data);

      // Flatten all lessons for navigation
      const allLessons = courseData.data.modules.flatMap(module => 
        module.lessons.map(lesson => ({
          ...lesson,
          moduleTitle: module.title,
          moduleId: module._id
        }))
      );
      setLessons(allLessons);

      // Fetch user progress
      if (user) {
        const progressResponse = await progressService.getCourseProgress(courseId);
        setUserProgress(progressResponse.data);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLessonData = async () => {
    try {
      const lesson = lessons.find(l => l._id === lessonId);
      if (lesson) {
        setCurrentLesson(lesson);
        
        // Fetch lesson comments
        const commentsResponse = await lessonService.getLessonComments(lessonId);
        setComments(commentsResponse.data || []);
      }
    } catch (error) {
      console.error('Error fetching lesson data:', error);
    }
  };

  const handleLessonSelect = (lesson) => {
    window.location.href = `/learn/${courseId}/${lesson._id}`;
  };

  const handleVideoProgress = (progress) => {
    // Update progress in real-time
    if (userProgress) {
      setUserProgress(prev => ({
        ...prev,
        progress: progress.percentage
      }));
    }
  };

  const handleVideoComplete = async () => {
    if (!currentLesson || !user) return;

    try {
      // Mark lesson as completed
      await lessonService.markLessonCompleted(currentLesson._id);
      
      // Update local state
      setUserProgress(prev => ({
        ...prev,
        completedLessons: [...(prev.completedLessons || []), {
          lessonId: currentLesson._id,
          completedAt: new Date()
        }],
        progress: ((prev.completedLessons?.length || 0) + 1) / lessons.length * 100
      }));

      // Move to next lesson
      const currentIndex = lessons.findIndex(l => l._id === currentLesson._id);
      if (currentIndex < lessons.length - 1) {
        const nextLesson = lessons[currentIndex + 1];
        window.location.href = `/learn/${courseId}/${nextLesson._id}`;
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  const handleAddComment = async (commentData) => {
    try {
      const response = await lessonService.addComment(currentLesson._id, commentData.content, commentData.parentComment);
      setComments(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await lessonService.likeComment(commentId);
      // Update local state
      setComments(prev => prev.map(comment => 
        comment._id === commentId 
          ? { ...comment, likes: (comment.likes || 0) + 1, isLiked: true }
          : comment
      ));
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleReplyComment = async (replyData) => {
    try {
      const response = await lessonService.addComment(currentLesson._id, replyData.content, replyData.parentComment);
      // Update local state
      setComments(prev => prev.map(comment => 
        comment._id === replyData.parentComment
          ? { ...comment, replies: [...(comment.replies || []), response.data] }
          : comment
      ));
    } catch (error) {
      console.error('Error replying to comment:', error);
    }
  };

  const getCurrentLessonIndex = () => {
    return lessons.findIndex(l => l._id === currentLesson?._id);
  };

  const getNextLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    return currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  };

  const getPreviousLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    return currentIndex > 0 ? lessons[currentIndex - 1] : null;
  };

  const navigateToLesson = (lesson) => {
    if (lesson) {
      window.location.href = `/learn/${courseId}/${lesson._id}`;
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy bài học</h2>
          <Button onClick={() => window.history.back()}>
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = `/courses/${course.slug}`}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Quay lại khóa học
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {course.title}
              </h1>
              <p className="text-sm text-gray-600">
                {currentLesson.moduleTitle} • {currentLesson.title}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <BookOpen className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar */}
        {!sidebarCollapsed && (
          <div className="w-80 bg-white border-r overflow-y-auto">
            <LessonSidebar
              modules={course.modules}
              currentLessonId={currentLesson._id}
              completedLessons={userProgress?.completedLessons || []}
              onLessonSelect={handleLessonSelect}
              userProgress={userProgress}
              className="h-full"
            />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Video Player */}
          <div className="flex-1 bg-black">
            <VideoPlayer
              videoUrl={currentLesson.videoUrl}
              onProgress={handleVideoProgress}
              onComplete={handleVideoComplete}
              autoPlay={true}
              allowSkip={true}
              className="h-full"
            />
          </div>

          {/* Video Controls */}
          <div className="bg-white border-t px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateToLesson(getPreviousLesson())}
                  disabled={!getPreviousLesson()}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Bài trước
                </Button>
                
                <div className="text-sm text-gray-600">
                  {getCurrentLessonIndex() + 1} / {lessons.length}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateToLesson(getNextLesson())}
                  disabled={!getNextLesson()}
                >
                  Bài tiếp
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDuration(currentLesson.videoDuration || 0)}
                </Badge>
                {currentLesson.resources && currentLesson.resources.length > 0 && (
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Tài liệu
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Comments */}
        {showComments && (
          <div className="w-80 bg-white border-l overflow-y-auto">
            <CommentSection
              comments={comments}
              onAddComment={handleAddComment}
              onLikeComment={handleLikeComment}
              onReplyComment={handleReplyComment}
              lessonId={currentLesson._id}
              className="h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPage;

"use client"

import { useState } from "react"
import Header from "./Header"
import MainContent from "./MainContent"
import Sidebar from "./Sidebar"
import { courseData } from "../data/courseData"

// eslint-disable-next-line react/prop-types
const CoursePlatform = ({ onBackToOutline }) => {
  const [currentLesson, setCurrentLesson] = useState({
    moduleId: 1,
    lessonId: 1,
    title: "Thông tin tài nguyên trong khóa học",
  })

  const handleLessonSelect = (moduleId, lessonId, title) => {
    setCurrentLesson({ moduleId, lessonId, title })
  }

  const handleNextLesson = () => {
    // Find current lesson and move to next
    const currentModule = courseData.find((m) => m.id === currentLesson.moduleId)
    const currentLessonIndex = currentModule.lessons.findIndex((l) => l.id === currentLesson.lessonId)

    if (currentLessonIndex < currentModule.lessons.length - 1) {
      // Next lesson in same module
      const nextLesson = currentModule.lessons[currentLessonIndex + 1]
      setCurrentLesson({
        moduleId: currentLesson.moduleId,
        lessonId: nextLesson.id,
        title: nextLesson.title,
      })
    } else {
      // First lesson of next module
      const nextModule = courseData.find((m) => m.id === currentLesson.moduleId + 1)
      if (nextModule) {
        setCurrentLesson({
          moduleId: nextModule.id,
          lessonId: nextModule.lessons[0].id,
          title: nextModule.lessons[0].title,
        })
      }
    }
  }

  const handlePrevLesson = () => {
    // Find current lesson and move to previous
    const currentModule = courseData.find((m) => m.id === currentLesson.moduleId)
    const currentLessonIndex = currentModule.lessons.findIndex((l) => l.id === currentLesson.lessonId)

    if (currentLessonIndex > 0) {
      // Previous lesson in same module
      const prevLesson = currentModule.lessons[currentLessonIndex - 1]
      setCurrentLesson({
        moduleId: currentLesson.moduleId,
        lessonId: prevLesson.id,
        title: prevLesson.title,
      })
    } else {
      // Last lesson of previous module
      const prevModule = courseData.find((m) => m.id === currentLesson.moduleId - 1)
      if (prevModule) {
        const lastLesson = prevModule.lessons[prevModule.lessons.length - 1]
        setCurrentLesson({
          moduleId: prevModule.id,
          lessonId: lastLesson.id,
          title: lastLesson.title,
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-900" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <Header onBackToOutline={onBackToOutline} />
      <div className="flex h-[calc(100vh-4rem)]">
        <MainContent currentLesson={currentLesson} onNextLesson={handleNextLesson} onPrevLesson={handlePrevLesson} />
        <Sidebar courseData={courseData} currentLesson={currentLesson} onLessonSelect={handleLessonSelect} />
      </div>
    </div>
  )
}

export default CoursePlatform

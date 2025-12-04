import mongoose, { ObjectId } from "mongoose";
import Section from "./section.model";

class SectionRepository {
  async create(data: Partial<any>): Promise<any> {
    return Section.create(data);
  }
  async getSectionsByCourseId(courseId: string): Promise<any[]> {
    return Section.find({ courseId: courseId }).sort({ order: 1 });
  }
  async getSectionById(sectionId: string): Promise<any | null> {
    return Section.findById(sectionId);
  }
  // update section
  async updateSection(sectionId: string, data: Partial<any>): Promise<any | null> {
    return Section.findByIdAndUpdate(sectionId, data, { new: true });
  }
  // delete section (soft delete)
  async deleteSection(sectionId: string): Promise<any | null> {
    return Section.findByIdAndUpdate(
      sectionId,
      { isDeleted: true },
      { new: true }
    );
  }
  // add lesson to section
  async addLessonToSection(sectionId: string, lessonId: mongoose.Types.ObjectId): Promise<any | null> {
    const section = await Section.findById(sectionId);
    if (section) {
      section.addLesson(lessonId);
      await section.save();
      return section;
    }
    return null;
  }
  // remove lesson from section
  async removeLessonFromSection(sectionId: string, lessonId: mongoose.Types.ObjectId): Promise<any | null> {
    const section = await Section.findById(sectionId);
    if (section) {
      section.removeLesson(lessonId);
      await section.save();
      return section;
    }
    return null;
  }

  // reorder lessons in section
  async reorderLessonsInSection(sectionId: string, lessonIds: mongoose.Types.ObjectId[]): Promise<any | null> {
    const section = await Section.findById(sectionId);
    if (section) {
      section.reorderLessons(lessonIds);
      await section.save();
      return section;
    }
    return null;
  }

  // reorder sections in a course
  async reorderSectionsInCourse(courseId: string, sectionOrders: { sectionId: string; order: number }[]): Promise<void> {
    for (const { sectionId, order } of sectionOrders) {
      await Section.findByIdAndUpdate(sectionId, { order: order });
    }
  }

}

export default new SectionRepository();

import Section from "./section.model";
import SectionRepository from "./section.repository";
import { Types } from "mongoose";


class SectionService {
  // create a new section
  async createSection(data: Partial<any>): Promise<any> {
    const section = new Section(data);
    return section.save();
  }
  // get sections by courseId
  async getSectionsByCourseId(courseId: string): Promise<any[]> {
    return SectionRepository.getSectionsByCourseId(courseId);
  }
    // get section by id
    async getSectionById(sectionId: string): Promise<any | null> {
      return SectionRepository.getSectionById(sectionId);
    }
    // update section
    async updateSection(sectionId: string, data: Partial<any>): Promise<any | null> {
        return SectionRepository.updateSection(sectionId, data);
    }
    // delete section (soft delete)
    async deleteSection(sectionId: string): Promise<any | null> {
        return SectionRepository.deleteSection(sectionId);
    }
    // add lesson to section
    async addLessonToSection(sectionId: string, lessonId: Types.ObjectId): Promise<any | null> {
        return SectionRepository.addLessonToSection(sectionId, lessonId);
    }
    // remove lesson from section
    async removeLessonFromSection(sectionId: string, lessonId: Types.ObjectId): Promise<any | null> {
        return SectionRepository.removeLessonFromSection(sectionId, lessonId);
    }
}

export default new SectionService();
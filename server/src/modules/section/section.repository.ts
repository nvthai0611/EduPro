import Section from "./section.model";

class SectionRepository {
  async create(data: Partial<any>): Promise<any> {
    return Section.create(data);
  }
  async getSectionsByCourseId(courseId: string): Promise<any[]> {
    return Section.find({ courseId: courseId }).sort({ order: 1 });
  }
}

export default new SectionRepository();

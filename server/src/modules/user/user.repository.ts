import User, { IUser } from "./user.model";

class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return User.findById(id)
      .populate({
        path: "purchasedCourses.courseId",
        select: "title slug description thumbnail totalDuration totalLessons",
      });
  }

  async create(data: Partial<IUser>): Promise<IUser> {
    return User.create(data);
  }

  async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, data, { new: true });
  }

  async findAll(): Promise<IUser[]> {
    return User.find();
  }

  async delete(id: string): Promise<IUser | null> {
    return User.findByIdAndDelete(id);
  }

  async revokePaidCourse(userId: string, courseId: string): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      userId,
      { $pull: { purchasedCourses: { courseId } } },
      { new: true }
    );
  }
}

export default new UserRepository();

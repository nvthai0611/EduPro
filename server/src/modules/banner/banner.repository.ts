import Banner, { IBanner } from "./banner.model";

class BannerRepository {
  // get all with param
  async findAll(): Promise<IBanner[]> {
     return Banner.find({ isDeleted: false, isActive: true })
    .select('title description imageUrl linkUrl')
    .sort({ createdAt: -1 });
  }
  async findAllAdmin(): Promise<IBanner[]> {
    return Banner.find()
    .sort({ createdAt: -1 });
  }
  async findById(id: string): Promise<IBanner | null> {
    return Banner.findById(id);
  }
  async create(data: Partial<IBanner>): Promise<IBanner> {
    return Banner.create(data);
  }
  async update(id: string, data: Partial<IBanner>): Promise<IBanner | null> {
    return Banner.findByIdAndUpdate(id, data, { new: true });
  }
  // Note: Changed delete method to perform a soft delete by setting isDeleted to true
  async delete(id: string, data: Partial<IBanner>): Promise<IBanner | null> {
    return Banner.findByIdAndUpdate(id, data, { new: true });
  }
}

export default new BannerRepository();

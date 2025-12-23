import bannerSchema, { IBanner } from "./banner.model";

class BannerRepository {
    async findAll(): Promise<IBanner[]> {
        return bannerSchema.find().sort({ order: 1 });
    }
    async findById(id: string): Promise<IBanner | null> {
        return bannerSchema.findById(id);
    }
    async create(data: Partial<IBanner>): Promise<IBanner> {
        return bannerSchema.create(data);
    }
    async update(id: string, data: Partial<IBanner>): Promise<IBanner | null> {
        return bannerSchema.findByIdAndUpdate(id, data, { new: true });
    }
    // Note: Changed delete method to perform a soft delete by setting isDeleted to true
    async delete(id: string, data: Partial<IBanner>): Promise<IBanner | null> {
        return bannerSchema.findByIdAndUpdate(id, data, { new: true });
    }

}

export default new BannerRepository();
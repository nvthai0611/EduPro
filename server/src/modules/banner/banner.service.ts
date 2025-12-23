import { IBanner } from './banner.model';
import BannerRepository from './banner.repository';


class BannerService {
    async getAllBanners() {
        return BannerRepository.findAll();
    }
    async getBannerById(id: string) {
        return BannerRepository.findById(id);
    }
    async createBanner(data: Partial<IBanner>) {
        return BannerRepository.create(data);
    }
    async updateBanner(id: string, data: Partial<IBanner>) {
        return BannerRepository.update(id, data);
    }
    async deleteBanner(id: string, data: Partial<IBanner>) {
        return BannerRepository.delete(id, data);
    }
}

export default new BannerService();
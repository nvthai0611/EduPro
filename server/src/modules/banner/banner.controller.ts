import BannerService from "./banner.service";

class BannerController {
  async getAllBanners(req: any, res: any) {
    try {
      const banners = await BannerService.getAllBanners();
      res
        .status(200)
        .json({ message: "Banners fetched successfully", data: banners });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async getBannerById(req: any, res: any) {
    try {
      const banner = await BannerService.getBannerById(req.params.id);
      res
        .status(200)
        .json({ message: "Banner fetched successfully", data: banner });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async createBanner(req: any, res: any) {
    try {
      const newBanner = await BannerService.createBanner(req.body);
      res.status(201).json(newBanner);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async updateBanner(req: any, res: any) {
    try {
      const updatedBanner = await BannerService.updateBanner(
        req.params.id,
        req.body
      );
      res
        .status(200)
        .json({ message: "Banner updated successfully", data: updatedBanner });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async deleteBanner(req: any, res: any) {
    try {
      const deletedBanner = await BannerService.deleteBanner(req.params.id, {
        isDeleted: true,
      });
      res
        .status(200)
        .json({ message: "Banner deleted successfully", data: deletedBanner });
    } catch {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new BannerController();

import { clientAxios } from '@/utils/clientAxios';

const bundleService = {
  // Get all bundles
  getAllBundles: async (params = {}) => {
    try {
      const response = await clientAxios.get('/bundles', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get bundle detail by slug or ID
  getBundleDetail: async (slug) => {
    try {
      const response = await clientAxios.get(`/bundles/${slug}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Purchase bundle
  purchaseBundle: async (bundleId, couponCode = null) => {
    try {
      const response = await clientAxios.post('/purchase/bundle', {
        bundleId,
        couponCode
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check if user has purchased bundle
  checkBundlePurchase: async (bundleId) => {
    try {
      const response = await clientAxios.get(`/purchase/check-bundle/${bundleId}`);
      return response.data.hasPurchased;
    } catch (error) {
      return false;
    }
  },

  // Get featured bundles
  getFeaturedBundles: async () => {
    try {
      const response = await clientAxios.get('/bundles?featured=true&limit=6');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export { bundleService };

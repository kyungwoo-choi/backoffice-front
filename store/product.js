'use strict';
export const state = () => {
};
export const mutations = {};
export const actions = {
  async getAll({}, params) {
    return await this.$axios.get('/products', {
      params: params
    })
  },
  async getCategories({}, params) {
    return await this.$axios.get('/categories', {
      params
    })
  },
  async createCategory({}, data) {
    return await this.$axios.post('/categories', data);
  },
  async deleteCategory({}, category_id) {
    return await this.$axios.delete(`/categories/${category_id}`);
  },
  async updateCategory({}, data) {
    return await this.$axios.put(`/categories/${data.category_id}`, data);
  },
  async createProduct({}, data) {
    return await this.$axios.post('/products', data);
  },
  async saveProductImages({}, {product_id, formData}) {
    return await this.$axios.post(`/products/${product_id}/images`, formData);
  },
  async deleteProduct({}, product_id) {
    return await this.$axios.post(`/products/${product_id}/images`);
  },
  async getDetail({}, product_id) {
    return await this.$axios.get(`/products/${product_id}`);
  },
  async deleteDetailImage({}, imageInfo) {
    return await this.$axios.delete(`/products/${imageInfo.product_id}/images/${imageInfo.image_idx}`)
  },
  async updateProduct({}, data) {
    return await this.$axios.put(`/products/${data.product_id}`, data);
  }
};
export const getters = {};

'use strict';

export const state = () => {
};

export const mutations = {};
export const actions = {
  async getAll({}, params) {
    return await this.$axios.get('/promotions', {
      params: params
    })
  },
  async show({}, promotion_idx) {
    return await this.$axios.get(`/promotions/${promotion_idx}`);
  },
  async post({}, data) {
    return await this.$axios.post(`/promotions`, data)
  },
  async delete({}, promotion_idx) {
    return await this.$axios.delete(`/promotions/${promotion_idx}`)
  }
};
export const getters = {};

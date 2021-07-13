'use strict';
export const state = () => {
};
export const mutations = {};
export const actions = {
  async getAll({}, params) {
    return await this.$axios.get('/orders', {
      params: params
    })
  },
  async getDetail({}, order_id) {
    return await this.$axios.get(`/orders/${order_id}`)
  }
};
export const getters = {};

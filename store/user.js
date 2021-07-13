'use strict';
export const state = () => {
};
export const mutations = {};
export const actions = {
  async getAll({}, params) {
    return await this.$axios.get('/users', {
      params: params
    });
  },
  async getDetail({}, user_id) {
    return await this.$axios.get(`/users/${user_id}`);
  }
};
export const getters = {};

'use strict';

export const state = () => {
};
export const mutations = {};
export const actions = {
  async getAll({}, params) {
    return await this.$axios.get('/payments')
  }
};
export const getters = {};

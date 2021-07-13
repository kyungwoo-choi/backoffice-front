'use strict';
export const state = () => {

};
export const mutations = {};
export const actions = {
  async getAll({}) {
    return this.$axios.get('/brands');
  }
};
export const getters = {};

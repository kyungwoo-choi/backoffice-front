'use strict';
export const state = () => {

};
export const mutations = {};
export const actions = {
  async fetchUserInquiries({}, params) {
    return this.$axios.get('/user-inquiries', {
      params: params
    })
  },
  async fetchProductInquiries({}, params) {
    return this.$axios.get('/product-inquiries', {
      params: params
    })
  }
};
export const getters = {};

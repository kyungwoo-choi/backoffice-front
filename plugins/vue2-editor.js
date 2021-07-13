'use strict';
import Vue from "vue";


let VueEditor;
if (process.client) {
  VueEditor = require('vue2-editor').VueEditor;

  Vue.component('vue-editor', VueEditor);
}

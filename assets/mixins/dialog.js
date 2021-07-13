'use strict';
export default {
  data() {
    return {

    }
  },
  methods: {
    closeDialog(modal) {
      this.$data[modal] = false;
    },
    showDialog(modal) {
      this.$data[modal] = true;
    }
  }
}

import moment from "moment";

const dateMixin = {
  methods: {
    formatCreatedAt(date) {
      return moment(date).format("MMMM D, YYYY, h:mm A");
    },

    formatDate(date) {
      return moment(date).format("MMMM D, YYYY");
    },
  },
};

export default dateMixin;

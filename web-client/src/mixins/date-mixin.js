import moment from "moment";

const dateMixin = {
  methods: {
    formatCreatedAt(date) {
      return moment(date).format("MMMM D,YYYY, h:mm A");
    },
  },
};

export default dateMixin;

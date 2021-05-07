<template>
  <v-text-field
    :append-icon="isPasswordShow ? 'mdi-eye-off' : 'mdi-eye'"
    :type="isPasswordShow ? 'text' : 'password'"
    @click:append="isPasswordShow = !isPasswordShow"
    :outlined="outlined"
    :label="label"
    :placeholder="placeholder"
    v-model="passwordLocal"
    :error="error"
    :error-messages="errorMessages"
    @keyup.enter="action"
    :disabled="disabled"
    :rounded="rounded"
    :filled="filled"
    :prepend-inner-icon="prependInnerIcon"
  ></v-text-field>
</template>

<script>
export default {
  name: "custom-password-input",
  props: {
    outlined: {
      type: Boolean,
      required: false,
    },
    rounded: {
      type: Boolean,
      required: false,
    },
    filled: {
      type: Boolean,
      required: false,
    },
    label: {
      type: String,
      required: false,
    },
    placeholder: {
      type: String,
      required: false,
    },
    password: {
      required: true,
    },
    error: {
      type: Boolean,
      required: false,
    },
    errorMessages: {
      type: String,
      required: false,
    },
    action: {
      type: Function,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
    prependInnerIcon: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      isPasswordShow: false,
      passwordLocal: "",
    };
  },
  watch: {
    password(val) {
      this.passwordLocal = val;
    },
    passwordLocal(val) {
      this.$emit("update:password", val);
    },
  },
};
</script>

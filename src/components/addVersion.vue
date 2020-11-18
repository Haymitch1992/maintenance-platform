<template>
  <a-modal
    title="创建版本"
    :visible="showModal"
    v-if="showModal"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
      <a-form-item label="版本号">
        <a-input
          v-decorator="[
            'note',
            {
              rules: [
                { required: true, message: '请输入版本号!' },
                { validator: checkContent },
              ],
            },
          ]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { POST_VERSIONS_CHECK, POST_VERSIONS_SAVE } from "../api/url";

export default {
  name: "addVersion",
  props: {
    showModal: Boolean,
  },
  data() {
    return {
      confirmLoading: false,
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" }),
    };
  },
  methods: {
    checkContent(rule, value, callback) {
      this.$axios
        .get(POST_VERSIONS_CHECK, {
          params: {
            name: value,
          },
        })
        .then((res) => {
          if (res.data.resultCode !== 200) {
            callback(new Error(res.data.message));
          } else {
            callback();
          }
        })
        .catch(() => {
          callback(new Error("校验失败"));
        });
    },
    handleOk() {
      // 提交参数名
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          this.confirmLoading = true;
          this.$axios
            .post(POST_VERSIONS_SAVE, {
              name: values.note,
            })
            .then((res) => {
              this.confirmLoading = false;
              this.$emit("closeVersion");
              console.log(res);
            });
        }
      });
    },
    handleCancel() {
      this.$emit("closeVersion");
    },
  },
};
</script>

<style scoped></style>

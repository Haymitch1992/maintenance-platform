<template>
  <a-modal
    title="创建参数"
    :visible="showModal"
    v-if="showModal"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
      <a-form-item label="参数模板">
        <a-select
          @change="handleSelectChange"
          v-decorator="[
            'type',
            { rules: [{ required: true, message: '请选择参数模板!' }] },
          ]"
        >
          <a-select-option
            :key="item"
            :value="item"
            v-for="item in $store.state.paramlist"
          >
            {{ item }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="类型" v-if="showType">
        <a-select
          v-decorator="[
            'midType',
            { rules: [{ required: true, message: '请输入类型!' }] },
          ]"
        >
          <a-select-option
            :key="item"
            :value="item"
            v-for="item in $store.state.typeList"
          >
            {{ item }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="参数名">
        <a-input
          v-decorator="[
            'note',
            {
              rules: [
                { required: true, message: '请输入参数名!' },
                { validator: checkContent },
              ],
            },
          ]"
        />
      </a-form-item>
      <a-form-item label="注释说明">
        <a-input
          v-decorator="[
            'description',
            {
              rules: [
                { required: true, message: '请输入参数名!' },
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
import { POST_PARAM_CHECK, POST_PARAM_SAVE } from "../api/url";

export default {
  name: "addOptions",
  props: {
    showModal: Boolean,
  },
  data() {
    return {
      confirmLoading: false,
      formLayout: "horizontal",
      showType: false,
      form: this.$form.createForm(this, { name: "coordinated" }),
    };
  },
  methods: {
    handleSelectChange(value) {
      if (value === "中间件") {
        this.showType = true;
      } else {
        this.showType = false;
      }
    },
    checkContent(rule, value, callback) {
      this.$axios
        .get(POST_PARAM_CHECK, {
          params: {
            name: value,
            type: this.form.getFieldValue("type"),
            midType: this.form.getFieldValue("midType")
              ? this.form.getFieldValue("midType")
              : "",
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
            .post(POST_PARAM_SAVE, {
              name: values.note,
              type: values.type,
              midType: values.midType,
              description: values.description,
            })
            .then((res) => {
              this.confirmLoading = false;
              this.$emit("closeOptions");
              console.log(res);
            });
        }
      });
    },
    handleCancel() {
      this.$emit("closeOptions");
    },
  },
};
</script>

<style scoped></style>

<template>
  <a-modal
    title="查看日志"
    :visible="showModal"
    v-if="showModal"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div v-html="paramsObj"></div>
  </a-modal>
</template>

<script>
export default {
  name: "viewLog",
  props: {
    showModal: Boolean,
    paramsObj: String,
  },
  data() {
    return {
      cloumns: [
        {
          title: "序号",
          dataIndex: "index",
        },
        {
          title: "参数名",
          dataIndex: "key",
        },
        {
          title: "参数值",
          dataIndex: "value",
        },
      ],
    };
  },
  methods: {
    handleOk() {
      // 提交参数名
      this.$emit("closeView");
    },
    handleCancel() {
      this.$emit("closeView");
    },
  },
};
</script>

<style scoped></style>

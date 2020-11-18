<template>
  <a-modal
    title="查看参数"
    :visible="showModal"
    v-if="showModal"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <p>
      参数模板 : {{ paramType }}
      <span style="margin-left: 24px;" v-if="paramType === '中间件'"
        >类型 : {{ paramMidType }}</span
      >
    </p>

    <a-table :columns="cloumns" :data-source="paramsObj" bordered> </a-table>
  </a-modal>
</template>

<script>
export default {
  name: "viewOptions",
  props: {
    showModal: Boolean,
    paramsObj: Array,
    paramType: String,
    paramMidType: String,
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

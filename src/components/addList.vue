<template>
  <div>
    <a-modal
      :title="raskInfo.id ? '修改任务' : '添加任务'"
      :visible="showModal"
      v-if="showModal"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div>
        <a-form
          ref="test"
          :form="form"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-form-item label="任务名称">
            <a-input
              placeholder="请输入系统名称"
              v-decorator="[
                'taskName',
                {
                  rules: [{ required: true, message: '请输入任务名称！' }],
                  initialValue: raskInfo.taskName,
                },
              ]"
            />
          </a-form-item>
          <a-form-item label="系统名称">
            <a-input
              placeholder="请输入系统名称"
              v-decorator="[
                'projectName',
                {
                  rules: [{ required: true, message: '请输入系统名称！' }],
                  initialValue: raskInfo.projectName,
                },
              ]"
            />
          </a-form-item>
          <a-form-item label="版本号">
            <a-select
              v-decorator="[
                'version',
                {
                  rules: [{ required: true, message: '请选择版本号!' }],
                  initialValue: raskInfo.version ? raskInfo.version : null,
                },
              ]"
              placeholder="请选择版本"
            >
              <a-select-option
                :value="item.name"
                :key="item.id"
                v-for="item in versionData"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="参数模板">
            <a-select
              v-decorator="[
                'paramType',
                {
                  rules: [{ required: true, message: '请选择参数模板!' }],
                  initialValue: raskInfo.paramType,
                },
              ]"
              placeholder="请选择版本"
              @change="paramModel"
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
              @change="changeMidType"
              v-decorator="[
                'midType',
                {
                  rules: [{ required: true, message: '请输入类型!' }],
                  initialValue: raskInfo.paramMidType,
                },
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
          <div
            :key="index"
            v-for="(domain, index) in dynamicValidateForm.domains"
            style="position: relative"
          >
            <a-form-item
              v-bind="
                index === 0
                  ? formItemLayout
                  : {
                      labelCol: {
                        xs: { span: 5 },
                        sm: { span: 5 },
                      },
                      wrapperCol: {
                        xs: { span: 12, push: 5 },
                        sm: { span: 12, push: 5 },
                      },
                    }
              "
              :label="index === 0 ? '参数名' : ''"
              :prop="'domains.' + index + '.value'"
              :rules="{
                required: true,
                message: 'domain can not be null',
                trigger: 'blur',
              }"
            >
              <a-select
                placeholder="请选择参数名"
                disabled=""
                v-decorator="[
                  `key[${index}]`,
                  {
                    rules: [{ required: true, message: '请选择参数名！' }],
                    initialValue: raskInfo.arr1[index],
                  },
                ]"
                style="width: 138px;margin-right: 10px;"
              >
                <a-select-option
                  :value="item.name"
                  :key="item.id"
                  v-for="item in paramData"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              style="position: absolute;top: 0px;left:242px;width: 250px;"
            >
              <a-input
                style="width: 94px;margin-right: 10px;"
                :placeholder="
                  raskInfo.arr4[index] ? raskInfo.arr4[index] : '参数名'
                "
                v-decorator="[
                  `value[${index}]`,
                  {
                    rules: [{ required: true, message: '请输入参数值！' }],
                    initialValue: raskInfo.arr2[index],
                  },
                ]"
              />
              <a-icon
                v-if="dynamicValidateForm.domains.length > 1 && false"
                class="dynamic-delete-button"
                type="minus-circle-o"
                :disabled="dynamicValidateForm.domains.length === 1"
                @click="removeDomain(domain)"
              />
            </a-form-item>
          </div>
          <a-form-model-item v-bind="formItemLayoutWithOutLabel">
            <a-button
              type="dashed"
              style="width: 60%"
              @click="addDomain"
              v-if="false"
            >
              <a-icon type="plus" /> 增加参数
            </a-button>
          </a-form-model-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script>
// import {POST_PARAM_SAVE} from "../api/url";

import {
  POST_PARAM_LIST,
  POST_TASK_ADD,
  POST_TASK_CHECK,
  POST_TASK_UPDATE,
} from "../api/url";

export default {
  name: "addList",
  props: {
    showModal: Boolean,
    // paramData:Array,
    versionData: Array,
    raskInfo: Object,
  },
  data() {
    return {
      ModalText: "Content of the modal",
      checkNum: 0,
      confirmLoading: false,
      showType: false,
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" }),
      paramData: [],
      formItemLayout: {
        labelCol: {
          xs: { span: 5 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 12 },
          sm: { span: 12 },
        },
      },
      formItemLayoutWithOutLabel: {
        labelCol: {
          xs: { span: 5 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 12, push: 5 },
          sm: { span: 12, push: 5 },
        },
      },
      dynamicValidateForm: {
        domains: [{ value: "", key: "" }],
      },
    };
  },
  watch: {
    showModal: function(val, oldVal) {
      console.log(val, oldVal);
      this.dynamicValidateForm.domains = this.raskInfo.arr3;
      if (this.raskInfo.paramType === "中间件") {
        this.showType = true;
      } else {
        this.showType = false;
      }
    },
  },
  methods: {
    changeMidType(value) {
      this.paramData = [];
      this.raskInfo.arr1 = [];
      this.raskInfo.arr2 = [];
      this.raskInfo.arr4 = [];
      this.$axios
        .get(POST_PARAM_LIST, {
          params: {
            type: this.form.getFieldValue("paramType"),
          },
        })
        .then((res) => {
          console.log(res);
          // 过滤处理
          let arr = [];
          res.data.data.forEach((item) => {
            if (item.midType === value) {
              arr.push(item);
            }
          });
          // 如果没有值 注入一个空对象
          if (arr.length === 0) {
            arr.push({ name: "", type: "" });
          }
          this.paramData = arr;
          let paramDataLength = arr.length;
          this.dynamicValidateForm.domains = [];
          for (let i = 0; i < paramDataLength; i++) {
            this.addDomain();
            this.raskInfo.arr1.push(this.paramData[i].name);
            this.raskInfo.arr4.push(this.paramData[i].description);
          }
        })
        .catch((result) => {
          console.log(result);
        });
    },
    paramModel(value) {
      // 如果选择的是 中间件
      if (value === "中间件") {
        this.showType = true;
        this.raskInfo.arr1 = [];
        this.raskInfo.arr2 = [];
        this.raskInfo.arr4 = [];
        this.dynamicValidateForm.domains = [{ value: "", key: "" }];
      } else {
        this.showType = false;
        this.changeParamType(value);
      }
    },
    changeParamType(value) {
      this.paramData = [];
      this.raskInfo.arr1 = [];
      this.raskInfo.arr2 = [];
      this.raskInfo.arr4 = [];
      this.$axios
        .get(POST_PARAM_LIST, {
          params: {
            type: value,
          },
        })
        .then((res) => {
          console.log(res);
          this.paramData = res.data.data;
          let paramDataLength = res.data.data.length;
          this.dynamicValidateForm.domains = [];
          for (let i = 0; i < paramDataLength; i++) {
            this.addDomain();
            this.raskInfo.arr1.push(this.paramData[i].name);
            this.raskInfo.arr4.push(this.paramData[i].description);
          }
        })
        .catch((result) => {
          console.log(result);
        });
    },
    remove(k) {
      const { form } = this;
      // can use data-binding to get
      const keys = form.getFieldValue("keys");
      // We need at least one passenger
      if (keys.length === 1) {
        return;
      }
      // can use data-binding to set
      form.setFieldsValue({
        keys: keys.filter((key) => key !== k),
      });
      console.log(this.dynamicValidateForm.domains);
    },
    handleOk() {
      this.ModalText = "The modal will be closed after two seconds";
      this.confirmLoading = true;
      this.form.validateFields((err, values) => {
        this.confirmLoading = false;
        if (!err) {
          this.$axios
            .get(POST_TASK_CHECK, {
              params: {
                projectName: values.projectName,
                version: values.version,
                taskName: values.taskName,
              },
            })
            .then((res) => {
              if (res.data.resultCode === 200) {
                let obj = {};
                values.key.forEach((item, index) => {
                  obj[item] = values.value[index];
                });
                // 判断是否是修改
                this.$axios({
                  headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                  },
                  method: "post",
                  url: this.raskInfo.id ? POST_TASK_UPDATE : POST_TASK_ADD,
                  data: {
                    projectName: values.projectName,
                    version: values.version,
                    taskName: values.taskName,
                    params: JSON.stringify(obj),
                    paramType: values.paramType,
                    id: this.raskInfo.id,
                    paramMidType: values.midType,
                  },
                }).then((res) => {
                  console.log(res);
                  this.confirmLoading = false;
                  this.$emit("closeRask");
                });
              } else {
                this.$message.info("该任务已创建 无需重复提交");
                this.confirmLoading = false;
                this.$emit("closeRask");
              }
            });
        }
      });
    },
    handleCancel() {
      console.log("Clicked cancel button");
      this.$emit("closeRask");
    },
    removeDomain(item) {
      let index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: "",
        key: "",
      });
    },
  },
};
</script>

<style scoped></style>

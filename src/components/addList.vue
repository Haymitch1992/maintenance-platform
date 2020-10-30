<template>
    <div>
        <a-modal
                title="添加任务"
                :visible="showModal"
                :confirm-loading="confirmLoading"
                @ok="handleOk"
                @cancel="handleCancel"
        >
            <div>
                <a-form ref="test" :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
                    <a-form-item label="系统名称">
                        <a-input
                                placeholder="请输入系统名称"
                                v-decorator="['note', { rules: [{ required: true, message: '请输入系统名称！' }] }]"
                        />
                    </a-form-item>
                    <a-form-item label="版本号">
                        <a-select
                                v-decorator="[
                                      'gender',
                                      { rules: [{ required: true, message: '请选择版本号!' }] },
                                    ]"
                                placeholder="请选择版本"
                                @change="handleSelectChange"
                        >
                            <a-select-option value="male">
                                1.0.0.0
                            </a-select-option>
                            <a-select-option value="female">
                                1.0.0.1
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item
                            v-for="(k, index) in form.getFieldValue('keys')"
                            :key="k"
                            v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel"
                            :label="index === 0 ? 'Passengers' : ''"
                            :required="false"
                    >
                        <a-input
                                v-decorator="[
                                      `names[${k}]`,
                                      {
                                        validateTrigger: ['change', 'blur'],
                                        rules: [
                                          {
                                            required: true,
                                            whitespace: true,
                                            message: 'Please input passenger\'s name or delete this field.',
                                          },
                                        ],
                                      },
                                    ]"
                                placeholder="passenger name"
                                style="width: 60%; margin-right: 8px"
                        />
                        <a-icon
                                v-if="form.getFieldValue('keys').length > 1"
                                class="dynamic-delete-button"
                                type="minus-circle-o"
                                :disabled="form.getFieldValue('keys').length === 1"
                                @click="() => remove(k)"
                        />
                    </a-form-item>
                    <a-form-item v-bind="formItemLayoutWithOutLabel">
                        <a-button type="dashed" style="width: 60%" @click="add">
                            <a-icon type="plus" /> Add field
                        </a-button>
                    </a-form-item>
                    <a-form-item label="参数名">
                        <a-select
                                style="width: 120px;margin-right: 10px;"
                                v-decorator="[
                                      'key',
                                      { rules: [{ required: true, message: '请选择参数名!' }] },
                                    ]"
                                placeholder="请选择参数"
                                @change="handleSelectChange"
                        >
                            <a-select-option value="male">
                                1.0.0.0
                            </a-select-option>
                            <a-select-option value="female">
                                1.0.0.1
                            </a-select-option>
                        </a-select>
                        <a-input
                                style="width: 104px"
                                placeholder="参数值"
                                v-decorator="['value', { rules: [{ required: true, message: '请输入参数值!' }] }]"
                        />
                    </a-form-item>
                    <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
                        <a-button type="primary" html-type="submit">
                            Submit
                        </a-button>
                    </a-form-item>
                </a-form>
            </div>
        </a-modal>
    </div>
</template>

<script>
    export default {
        name: "addList",
        props:{
            showModal:Boolean
        },
        data() {
            return {
                ModalText: 'Content of the modal',
                visible: false,
                confirmLoading: false,
                formLayout: 'horizontal',
                form: this.$form.createForm(this, { name: 'coordinated' }),
                formItemLayout: {
                    labelCol: {
                        xs: { span: 24 },
                        sm: { span: 4 },
                    },
                    wrapperCol: {
                        xs: { span: 24 },
                        sm: { span: 20 },
                    },
                },
                formItemLayoutWithOutLabel: {
                    wrapperCol: {
                        xs: { span: 24, offset: 0 },
                        sm: { span: 20, offset: 4 },
                    },
                },
            };
        },
        beforeCreate() {
            this.form = this.$form.createForm(this, { name: 'coordinated' });
            this.form.getFieldDecorator('keys', { initialValue: [], preserve: true });
        },
        methods: {
            remove(k) {
                const { form } = this;
                // can use data-binding to get
                const keys = form.getFieldValue('keys');
                // We need at least one passenger
                if (keys.length === 1) {
                    return;
                }

                // can use data-binding to set
                form.setFieldsValue({
                    keys: keys.filter(key => key !== k),
                });
            },

            add() {
                const { form } = this;
                // can use data-binding to get
                const keys = form.getFieldValue('keys');
                const nextKeys = keys.concat(id++);
                // can use data-binding to set
                // important! notify form to detect changes
                form.setFieldsValue({
                    keys: nextKeys,
                });
            },

            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        console.log('Received values of form: ', values);
                    }
                });
            },
            handleSelectChange(value) {
                console.log(value);
                this.form.setFieldsValue({
                    note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
                });
            },
            showModal() {
                this.visible = true;
            },
            handleOk(e) {
                this.ModalText = 'The modal will be closed after two seconds';
                this.confirmLoading = true;
                setTimeout(() => {
                    this.showModal = false;
                    this.confirmLoading = false;
                }, 2000);
            },
            handleCancel(e) {
                console.log('Clicked cancel button');
                this.showModal = false;
            },
        }
    }
</script>

<style scoped>

</style>

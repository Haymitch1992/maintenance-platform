<template>
    <a-modal
            title="创建参数"
            :visible="showModal"
            v-if="showModal"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            @cancel="handleCancel"
    >
        <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" >
            <a-form-item label="参数类型">
                <a-select v-decorator="['type', { rules: [{ required: true, message: '请输入参数名!' },{ validator:this.checkContent.bind(this) }] }]">
                    <a-select-option value="中间件">
                        中间件
                    </a-select-option>
                    <a-select-option value="前端">
                        前端
                    </a-select-option>
                    <a-select-option value="自研服务">
                        自研服务
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="参数名">
                <a-input
                        v-decorator="['note', { rules: [{ required: true, message: '请输入参数名!' },{ validator:this.checkContent.bind(this) }] }]"
                />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
    import {POST_PARAM_CHECK, POST_PARAM_SAVE} from "../api/url";

    export default {
        name: "addOptions",
        props:{
            showModal:Boolean
        },
        data(){
            return{
                confirmLoading: false,
                formLayout: 'horizontal',
                form: this.$form.createForm(this, { name: 'coordinated' }),
            }
        },
        methods: {
            checkContent(rule,value,callback){
                this.$axios.get(POST_PARAM_CHECK,{
                    params: {
                        name:value,
                    }
                }).then((res)=>{
                    if(res.data.resultCode!==200){
                        callback(new Error(res.data.message))
                    }else{
                        callback()
                    }
                })
            },
            handleOk() {
                // 提交参数名
                this.form.validateFields((err, values) => {
                    if (!err) {
                        console.log('Received values of form: ', values);
                        this.confirmLoading = true
                        this.$axios.post(POST_PARAM_SAVE,{
                            name:values.note,
                            type:values.type
                        }).then((res)=>{
                            this.confirmLoading = false
                            this.$emit('closeOptions')
                            console.log(res)
                        })
                    }
                });
            },
            handleCancel() {
                this.$emit('closeOptions')
            },
        }
    }
</script>

<style scoped>

</style>

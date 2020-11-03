<template>
    <a-modal
            title="创建参数"
            :visible="showModal"
            v-if="showModal"
            @ok="handleOk"
            @cancel="handleCancel"
    >
        <a-table :columns="cloumns" :data-source="paramsObj" bordered>

        </a-table>
    </a-modal>
</template>

<script>

    export default {
        name: "viewOptions",
        props:{
            showModal:Boolean,
            paramsObj:Array
        },
        data(){
            return{
                cloumns:[
                    {
                        title: '序号',
                        dataIndex: 'index',
                    },
                   {
                       title: '参数名',
                       dataIndex: 'key',
                   },
                   {
                       title: '参数值',
                       dataIndex: 'value',
                   },
               ],
            }
        },
        methods:{
            handleOk() {
                // 提交参数名
                this.$emit('closeView')
            },
            handleCancel() {
                this.$emit('closeView')
            },
        }
    }
</script>

<style scoped>

</style>

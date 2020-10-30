<template>
    <div>
        <a-layout>
            <a-layout-header class="maintenance-header">
                可视化运维平台
            </a-layout-header>
            <a-layout class="maintenance-container">
                <a-layout-sider class="menu-list">
                    <a-menu  mode="vertical">
                        <a-menu-item key="1">
                            <a-icon type="desktop" />
                            部署任务列表
                        </a-menu-item>
                        <a-menu-item key="2">
                            <a-icon type="pie-chart" />
                            参数模板
                        </a-menu-item>
                        <a-menu-item key="3">
                            <a-icon type="calendar" />
                            版本号
                        </a-menu-item>
                    </a-menu>
                </a-layout-sider>
                <a-layout-content>
                    <div class="maintenance-box">
                        <ul class="project-info">
                            <li>
                                <p>项目名称</p>
                                <p>南宁地铁4号线</p>
                            </li>
                            <li>
                                <p>当前版本号</p>
                                <p>1.0.1</p>
                            </li>
                            <li>
                                <p>当前版本号</p>
                                <p>1.0.1</p>
                            </li>
                        </ul>
                    </div>
                    <div class="maintenance-box">

                        <div class="btn-line">
                            <a-button type="primary">
                                添加任务
                            </a-button>
                            <a-button>
                                创建参数
                            </a-button>
                            <a-button>
                                创建版本
                            </a-button>
                        </div>
                        <div>
                            <a-table :columns="columns" :data-source="dataList" bordered>
                                <template slot="name" slot-scope="name">
                                    <a>{{ text }}</a>
                                </template>
                                <template slot="options" slot-scope="text, record">
                                    <a>查看</a>
                                </template>
                                <template slot="operation" slot-scope="text, record">
                                    <a class="btn-margin-right">修改</a>
                                    <a>执行</a>
                                </template>
                            </a-table>

                        </div>
                    </div>
                    <div>
                        copyright © 2020交控科技股份有限公司 & 可视化运维平台
                    </div>
                </a-layout-content>

            </a-layout>

        </a-layout>
        <addList :showModal="true"></addList>
    </div>
</template>

<script>
    import addList from "../components/addList";
    export default {
        components:{
            addList
        },
        name: "maintenance-list",
        data(){
            return{
                current: 2,
                columns : [
                    {
                        title: '任务号Id',
                        dataIndex: 'key',
                    },
                    {
                        title: '版本号',
                        dataIndex: 'versions',
                    },
                    {
                        title: '系统名称-组件名',
                        dataIndex: 'name',
                    },

                    {
                        title: '执行结果',
                        dataIndex: 'status',
                    },
                    {
                        title: '执行时间',
                        dataIndex: 'runTime',
                    },
                    {
                        title: '参数',
                        className: 'column-money',
                        dataIndex: 'money',
                        scopedSlots: {customRender: 'options'}
                    },
                    {
                        title: '操作',
                        dataIndex: 'address',
                        scopedSlots: { customRender: 'operation' },
                    },
                ],
                dataList : [
                    {
                        key: '1',
                        versions: '1.0.0.1',
                        name:'system',
                        money: '￥300,000.00',
                        status: '未执行',
                        runTime: '2020-10-30 16:20:12'
                    },
                    {
                        key: '2',
                        versions: '1.0.0.1',
                        name:'system',
                        money: '￥1,256,000.00',
                        status: '已执行',
                        runTime: '2020-10-30 16:20:12'
                    },
                    {
                        key: '3',
                        versions: '1.0.0.1',
                        name:'system',
                        money: '￥120,000.00',
                        status: '未执行',
                        runTime: '2020-10-30 16:20:12'
                    },
                ]
            }
        },
        methods:{
            onDelete(){}
        }
    }
</script>

<style scoped>
    .maintenance-header{
        height: 50px;
        line-height: 50px;
        text-align: left;
        color: #ffffff;
    }
    .menu-list{
        background: #ffffff;
        text-align: left;
        padding:20px 0 0 14px;
    }
    .maintenance-footer{
        line-height: 40px;
        box-sizing: border-box;
    }
    .maintenance-container{
        height: calc(100vh - 50px);
    }
    .maintenance-container .maintenance-box{
        margin: 20px;
        background: #fff;
        text-align: left;
        box-sizing: border-box;
        padding: 20px;
    }
    .btn-line{
        padding-bottom: 20px;
    }
    .btn-line button{
        margin-right: 10px;
    }
    .project-info{
        display: flex;
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .project-info li{
        flex: 1;
        text-align: center;
    }
    .btn-margin-right{
        margin-right: 20px;
    }
</style>

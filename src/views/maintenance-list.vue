<template>
  <div>
    <a-layout>
      <a-layout-header class="maintenance-header">
        <a-icon type="highlight" />
        可视化运维平台
      </a-layout-header>
      <a-layout class="maintenance-container">
        <a-layout-sider class="menu-list">
          <a-menu mode="vertical" :default-selected-keys="['1']">
            <a-menu-item key="1" @click="current = 0">
              <a-icon type="desktop" />
              部署任务列表
            </a-menu-item>
            <a-menu-item key="2" @click="current = 1">
              <a-icon type="pie-chart" />
              K8S参数模板
            </a-menu-item>
            <a-menu-item key="3" @click="current = 2">
              <a-icon type="calendar" />
              版本号
            </a-menu-item>
            <a-menu-item
              @click="openUrl(item)"
              v-for="item in urlList"
              :key="1 + item.id"
            >
              <a-icon type="flag" />
              {{ item.name }}
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
                <p>当前任务总数</p>
                <p>
                  {{ dataList.length }}
                </p>
              </li>
              <li>
                <p>技术支持</p>
                <p>交控天枢数据平台组</p>
              </li>
            </ul>
          </div>
          <div class="maintenance-box">
            <div v-show="current === 0">
              <div class="btn-line">
                <a-button type="primary" @click="createRask()">
                  添加任务
                </a-button>
                <a-select
                  v-model="currentVersion"
                  style="width: 120px"
                  @change="handleChange"
                >
                  <a-select-option value="-">
                    全部
                  </a-select-option>
                  <a-select-option
                    v-for="item in versionData"
                    :key="item.id"
                    :value="item.name"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </div>

              <a-table :columns="columns" :data-source="dataList" bordered>
                <template slot="operation" slot-scope="text, record">
                  <a
                    @click="
                      createView(
                        record.params,
                        record.paramType,
                        record.paramMidType
                      )
                    "
                    class="btn-margin-right"
                    >查看参数</a
                  >
                  <a @click="createViewLog(record)" class="btn-margin-right"
                    >查看日志</a
                  >
                  <a
                    :disabled="record.isExecute === 1"
                    @click="editRask(record)"
                    class="btn-margin-right"
                    >修改</a
                  >
                  <a
                    :disabled="record.isExecute === 1"
                    @click="raskRun(record.id)"
                    >执行</a
                  >
                </template>
              </a-table>
            </div>
            <div v-show="current === 1">
              <div class="btn-line">
                <a-button type="primary" @click="createOptions()">
                  创建参数
                </a-button>
                <a-select
                  v-model="currentOptionType"
                  style="width: 120px"
                  @change="paramList"
                >
                  <a-select-option value="-">
                    全部
                  </a-select-option>
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
              </div>
              <a-table
                :columns="paramCloumns"
                :data-source="paramData"
                bordered
              >
              </a-table>
            </div>
            <div v-show="current === 2">
              <div class="btn-line">
                <a-button type="primary" @click="createVersion()">
                  创建版本
                </a-button>
              </div>
              <a-table
                :columns="versionCloumns"
                :data-source="versionData"
                bordered
              >
              </a-table>
            </div>
            <div v-show="current === 3">
              <a-alert
                :message="item"
                type="success"
                v-for="(item, index) in urltoken"
                :key="index"
                style="margin-bottom: 20px;"
              />
              <a-button type="primary" @click="openUrlPage">
                打开链接
              </a-button>
            </div>
          </div>
          <div class="bottom-text">
            copyright © 2020交控科技股份有限公司 & 可视化运维平台
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
    <viewOptions
      :showModal="viewModel"
      :paramType="paramType"
      :paramMidType="paramMidType"
      @closeView="closeView"
      :paramsObj="viewObj"
    ></viewOptions>
    <addList
      :showModal="raskModel"
      :paramData="paramData"
      :raskInfo="raskInfo"
      :versionData="versionData"
      @closeRask="closeRask"
    ></addList>
    <addOptions
      :showModal="optionsModel"
      @closeOptions="closeOptions"
    ></addOptions>
    <addVersion
      :showModal="versionModel"
      @closeVersion="closeVersion"
    ></addVersion>
    <viewLog
      :showModal="viewLog"
      @closeView="closeViewLog"
      :paramsObj="logDate"
    ></viewLog>
  </div>
</template>

<script>
import addList from "../components/addList";
import addOptions from "../components/addOptions";
import addVersion from "../components/addVersion";
import viewOptions from "../components/viewOptions";
import viewLog from "../components/viewLog";

import {
  GET_CONFIG_LIST,
  GET_LINK_URL,
  POST_PARAM_LIST,
  POST_TASK_LIST,
  POST_TASK_RUN,
  POST_VERSIONS_LIST,
} from "../api/url";
export default {
  components: {
    addList,
    addOptions,
    addVersion,
    viewOptions,
    viewLog,
  },
  name: "maintenance-list",
  data() {
    return {
      raskModel: false,
      viewModel: false,
      optionsModel: false,
      versionModel: false,
      viewLog: false,
      current: 0,
      viewObj: [],
      paramMidType: "",
      logDate: "",
      paramType: "",
      paramCloumns: [
        {
          title: "参数Id",
          dataIndex: "id",
        },
        {
          title: "参数名",
          dataIndex: "name",
        },
        {
          title: "参数模板",
          dataIndex: "type",
        },
        {
          title: "类型",
          dataIndex: "midType",
        },
        {
          title: "注释说明",
          dataIndex: "description",
        },
      ],
      versionCloumns: [
        {
          title: "版本号Id",
          dataIndex: "id",
        },
        {
          title: "版本名",
          dataIndex: "name",
        },
      ],
      columns: [
        {
          title: "任务号Id",
          dataIndex: "id",
        },
        {
          title: "版本号",
          dataIndex: "version",
        },
        {
          title: "任务名称",
          dataIndex: "taskName",
        },
        {
          title: "系统名称-组件名",
          dataIndex: "projectName",
        },

        {
          title: "执行进度",
          dataIndex: "result",
          width: 250,
        },
        {
          title: "执行时间",
          dataIndex: "datetime",
        },

        // {
        //     title: '参数',
        //     className: 'column-money',
        //     dataIndex: 'money',
        //     scopedSlots: {customRender: 'options'}
        // },
        {
          title: "操作",
          dataIndex: "address",
          scopedSlots: { customRender: "operation" },
        },
      ],
      dataList: [],
      paramData: [],
      versionData: [],
      currentVersion: "-",
      currentOptionType: "-",
      urlList: [],
      urlDate: {},
      urltoken: [],
      raskInfo: {},
    };
  },
  mounted() {
    this.raskList();
    this.paramList();
    this.versionList();
    this.getUrl();
    this.add();
  },
  methods: {
    add() {
      // 获取参数列表
      this.$axios
        .get(GET_CONFIG_LIST)
        .then((res) => {
          //
          let arr = res.data.data;
          let parmaList = [];
          let typeList = [];
          arr.forEach((item) => {
            if (parmaList.indexOf(item.type) === -1) {
              parmaList.push(item.type);
            }
            if (typeList.indexOf(item.midType) === -1 && item.midType) {
              typeList.push(item.midType);
            }
          });
          this.$store.commit("saveParamList", {
            arr1: parmaList,
            arr2: typeList,
          });
        })
        .catch((result) => {
          console.log(result);
        });
      //
    },
    openUrlPage() {
      window.open(this.urlDate.url);
    },
    getUrl() {
      this.$axios
        .get(GET_LINK_URL)
        .then((res) => {
          this.urlList = res.data.data;
        })
        .catch((result) => {
          console.log(result);
        });
    },
    openUrl(obj) {
      this.current = 3;
      this.urlDate = obj;
      if (obj.token) {
        this.urltoken = obj.token.split(",");
      } else {
        this.urltoken = [];
      }
    },
    handleChange() {
      this.raskList();
    },
    closeView() {
      this.viewModel = false;
    },
    closeViewLog() {
      this.viewLog = false;
    },
    createViewLog(obj) {
      this.viewLog = true;
      this.logDate = obj.log;
    },
    createView(e, type, str) {
      this.viewModel = true;
      this.paramType = type;
      this.paramMidType = str;
      let obj = JSON.parse(e);
      this.viewObj = [];
      let num = 0;
      for (let j in obj) {
        this.viewObj.push({
          index: ++num,
          key: j,
          value: obj[j],
        });
      }
    },
    editRask(obj) {
      let arr1 = [];
      let arr2 = [];
      let arr3 = [];
      let outObj = JSON.parse(obj.params);
      for (let i in outObj) {
        arr1.push(i);
        arr2.push(outObj[i]);
        arr3.push({
          value: "",
          key: "",
        });
      }
      obj.arr1 = arr1;
      obj.arr2 = arr2;
      obj.arr3 = arr3;
      obj.arr4 = [];
      this.raskInfo = obj;
      this.raskModel = true;
    },
    createRask() {
      this.raskInfo = {
        taskName: "",
        id: "",
        projectName: "",
        version: null,
        arr1: [],
        arr2: [],
        arr3: [
          {
            value: "",
            key: "",
          },
        ],
        arr4: [],
      };
      this.raskModel = true;
    },
    closeRask() {
      this.raskList();
      this.raskModel = false;
    },
    createOptions() {
      // 创建参数
      this.optionsModel = true;
    },
    closeOptions() {
      // 关闭参数
      this.paramList();

      this.optionsModel = false;
    },
    createVersion() {
      this.versionModel = true;
    },
    closeVersion() {
      this.versionList();
      this.versionModel = false;
    },
    raskRun(raskId) {
      let _this = this;
      this.$confirm({
        title: "确认运行?",
        content: "是否确认运行",
        okText: "Yes",
        cancelText: "No",
        onOk() {
          _this.$axios
            .get(POST_TASK_RUN, {
              params: {
                id: raskId,
              },
            })
            .then((res) => {
              console.log(res);
              _this.raskList();
            })
            .catch((result) => {
              console.log(result);
            });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    versionList() {
      this.$axios
        .get(POST_VERSIONS_LIST)
        .then((res) => {
          console.log(res);
          this.versionData = res.data.data;
        })
        .catch((result) => {
          console.log(result);
        });
    },
    paramList() {
      this.$axios
        .get(
          POST_PARAM_LIST,
          this.currentOptionType !== "-"
            ? {
                params: {
                  type: this.currentOptionType,
                },
              }
            : ""
        )
        .then((res) => {
          this.paramData = res.data.data;
          console.log("数据结构", this.paramData);
        })
        .catch((result) => {
          console.log(result);
        });
    },
    raskList() {
      this.$axios
        .get(
          POST_TASK_LIST,
          this.currentVersion !== "-"
            ? {
                params: {
                  version: this.currentVersion,
                },
              }
            : ""
        )
        .then((res) => {
          console.log(res);
          this.dataList = res.data.data;
        })
        .catch((result) => {
          console.log(result);
        });
    },
  },
};
</script>

<style scoped>
.maintenance-header {
  height: 50px;
  line-height: 50px;
  text-align: left;
  color: #ffffff;
}
.menu-list {
  background: #ffffff;
  text-align: left;
  padding: 20px 0 0 14px;
}
.maintenance-footer {
  line-height: 40px;
  box-sizing: border-box;
}
.maintenance-container {
  height: calc(100vh - 50px);
}
.maintenance-container .maintenance-box {
  margin: 20px;
  background: #fff;
  text-align: left;
  box-sizing: border-box;
  padding: 20px;
}
.btn-line {
  padding-bottom: 20px;
}
.btn-line button {
  margin-right: 10px;
}
.project-info {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}
.project-info p {
  margin-bottom: 8px;
}
.project-info li {
  padding-top: 12px;
  flex: 1;
  text-align: center;
}
.project-info li p:last-child {
  font-size: 18px;
}
.btn-margin-right {
  margin-right: 20px;
}
.bottom-text {
  position: fixed;
  bottom: 0;
  line-height: 40px;
  width: calc(100% - 200px);
  text-align: center;
}
</style>

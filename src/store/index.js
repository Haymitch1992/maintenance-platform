import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 存放的键值对就是索要管理的状态
    paramlist:[], // 参数类型列表
    typeList:[], // 类型列表
  },
  mutations: {
    saveParamList(state,obj){
      state.paramlist = obj.arr1
      state.typeList = obj.arr2
    }
  },
  actions: {
  },
  modules: {
  }
})

import Vue from 'vue'
import Vuex from 'vuex'
import { Message } from 'element-ui';
import axios from 'axios'
import { auth } from '../assets/js/mock'


Vue.use(Vuex)

// 审核状态信息
const auditStatusInfo = [
    {
        label: '一审待审核',
        value: '101'
    },
    {
        label: '一审审核中',
        value: '102'
    },
    {
        label: '一审不通过',
        value: '103'
    },
    {
        label: '一审通过',
        value: '104'
    },
    {
        label: '一审拒绝',
        value: '105'
    },
    {
        label: '二审待审核',
        value: '201'
    },
    {
        label: '二审审核中',
        value: '202'
    },
    {
        label: '二审不通过',
        value: '203'
    },
    {
        label: '二审通过',
        value: '204'
    },
    {
        label: '二审拒绝',
        value: '205'
    },
    {
        label: '三审待审核',
        value: '301'
    },
    {
        label: '三审审核中',
        value: '302'
    },
    {
        label: '三审不通过',
        value: '303'
    },
    {
        label: '三审通过',
        value: '304'
    },
    {
        label: '三审拒绝',
        value: '305'
    }
]

// 审核类型
const auditType = [
    {
        label: 'B端一审',
        value: 1
    },
    {
        label: 'B端二审',
        value: 2
    },
    {
        label: 'B端三审',
        value: 4
    },
    {
        label: 'C端一审',
        value: 16
    },
    {
        label: 'C端二审',
        value: 32
    }
]

// 计算属性
const getters = {

}

const state = {
    // 改变过的字段名称
    changedfiledName:{},
    // 审核用的标签
    examineTags: [],
    // 审核状态信息
    auditStatusInfo: auditStatusInfo,
    // 用户权限
    userJurisdiction:{},
    // 用户权限是否加载完毕
    isGetUserJurisdiction: false,
    // 当前激活的菜单
    activeIndex:'',
    // 审核类型
    auditType:auditType,
    // 所有审核人的信息
    usersInfo:[],
    // 所有中介公司
    agencyList:[]
}

// 同步操作
const mutations = {
    setChangedfiledName(s, payload){
        s.changedfiledName = {};
        Object.assign(s.changedfiledName, payload);
    },
    setExamineTags(s, payload){
        Object.assign(s.examineTags, payload);
    },
    setJurisdiction(s, payload){
        Object.assign(s.userJurisdiction,payload);
        setTimeout(function () {
            s.isGetUserJurisdiction = true;
        },100);
    },
    setActiveIndex(s, payload){
        s.activeIndex = payload;
    },
    setUsersInfo(s, payload){
        s.usersInfo = payload;
    },
    setAgencyList(s, payload){
        s.agencyList = payload;
    }
}

// 异步操作
const actions = {
    // 获取全局数据
    getGlobalData({commit}){
        // 如果usersInfo不存在，则去调用接口
        if(!state.usersInfo.length){
            axios.all([
                // 所有审核人的信息
                axios.get(`/api/auth/user/get/?page_no=1&page_limit=0`),
                // 中介公司列表
                axios.get(`/v2/api/agencys?limit=0`)
            ]).then( axios.spread( (res1, res2) => {
                commit('setUsersInfo',res1.data.result.users);
                res2.data.isOk = true;
                commit('setAgencyList',res2.data);
            }))
        }
    },
    // 获取用户权限
    getJurisdiction({ commit }){
        axios.get('/api/auth/user/perm/')
            .then((res) => {
                if(res.data.status.code != 0){
                    Message.error(res.data.status.description);
                    setTimeout(function () {
                        window.location.href = "/html/login.html";
                    },1000);
                }else {
                    let obj = {};
                    let userJurisdictionArr = res.data.result.perms;
                    if(Array.isArray(userJurisdictionArr)){
                        userJurisdictionArr.forEach( item => {
                            obj[item.codename] = true;
                        });
                        commit('setJurisdiction',obj);
                    }else {
                        throw TypeError('参数类型错误');
                    }
                }
            })
            .catch( res => {
                window.location.href = "/html/login.html";
            })
    }
}



export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})

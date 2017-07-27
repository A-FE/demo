// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueCookie from 'vue-cookie'
import ElementUI from 'element-ui'
import utils from './assets/js/utils'
import valid from './assets/js/valid'
import store from './vuex/store'
import {Message} from 'element-ui';

//TODO 根据文件夹名，自动注册全局组件
// 引入组件
import checkHistory from 'components/checkHistory'
import riskManageStrategy from 'components/riskManageStrategy'
import renterPaper from 'components/renterPaper'
import agentContract from 'components/agentContract'
import rentContract from 'components/rentContract'
import HFQContract from 'components/HFQContract'
import phoneCheckInfo from 'components/phoneCheckInfo'
import checkSubmit from 'components/checkSubmit'
import checkbox from 'components/checkbox'
import dialogCarousel from 'components/dialogCarousel'
import dialogRefundInfo from 'components/dialogRefundInfo'
import dialogTable from 'components/dialogTable'
import dialogTabsTable from 'components/dialogTabsTable'
import userInfo from 'components/userInfo'
import contractRemark from 'components/contractRemark'
import orderInfo from 'components/orderInfo'
import bankcardInfo from 'components/bankcardInfo'
import paySchedule from 'components/paySchedule'
import repaySchedule from 'components/repaySchedule'
import contractJournal from 'components/contractJournal'
import repayHandle from 'components/repayHandle'
import record from 'components/record'
import qualityControl from 'components/qualityControl'
import searchAgency from 'components/searchAgency'


// 注册为全局组件
Vue.component('hfq-check-history', checkHistory);
Vue.component('hfq-risk-manage-strategy', riskManageStrategy);
Vue.component('hfq-renter-paper', renterPaper);
Vue.component('hfq-agent-contract', agentContract);
Vue.component('hfq-rent-contract', rentContract);
Vue.component('hfq-hfq-contract', HFQContract);
Vue.component('hfq-phone-check-info', phoneCheckInfo);
Vue.component('hfq-check-submit', checkSubmit);
Vue.component('hfq-checkbox', checkbox);
Vue.component('hfq-dialog-carousel', dialogCarousel);
Vue.component('hfq-dialog-refund-info', dialogRefundInfo);
Vue.component('hfq-dialog-table', dialogTable);
Vue.component('hfq-dialog-tabs-table', dialogTabsTable);
Vue.component('hfq-user-info', userInfo);
Vue.component('hfq-contract-remark', contractRemark);
Vue.component('hfq-order-info', orderInfo);
Vue.component('hfq-bankcard-info', bankcardInfo);
Vue.component('hfq-pay-schedule', paySchedule);
Vue.component('hfq-repay-schedule', repaySchedule);
Vue.component('hfq-contract-journal', contractJournal);
Vue.component('hfq-repay-handle', repayHandle);
Vue.component('hfq-record', record);
Vue.component('hfq-quality-control', qualityControl);
Vue.component('hfq-search-agency', searchAgency);

Vue.use(ElementUI)
Vue.use(VueCookie)

// 请求超时配置
axios.defaults.timeout = 20000;
// 状态码配置
axios.defaults.validateStatus = function (status) {
    return status >= 200 && status < 600
};

// 缓存文件失效时间设置
axios.defaults.headers = {
    'Cache-Control': 'max-age=120',
    "Content-Type": "application/json"
}

//添加响应拦截器
axios.interceptors.response.use(res => {
    //对响应数据做些事
    if (res.status >= 400 && res.status < 600) {
        Message({
            showClose: false,
            message: res.data.message || '请求出错',
            type: 'error',
            duration:5000
        });
        return Promise.reject(res)
    }else {
        return res;
    }
}, error => {
    //请求错误时做些事
    Message.error('未知错误')
    return Promise.reject(error);
})

Vue.prototype.utils = utils;
Vue.prototype.valid = valid;
Vue.prototype.$axios = axios;

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App}
})

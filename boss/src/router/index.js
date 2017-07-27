import Vue from 'vue'
import Router from 'vue-router'

/****************************** 风控--审核列表 *******************************/
// 风控入口页
import riskManage from 'pages/riskManage/index'
// 审核列表
import auditList from 'pages/riskManage/auditList/auditList'
// 审核详情
import auditDetail from 'pages/riskManage/auditList/auditDetail'
// B端电核(二审)详情
import phoneCheckDetail from 'pages/riskManage/auditList/phoneCheckDetail'

/****************************** 风控--质检 *******************************/
// 质检详情
import qualityControlDetail from 'pages/riskManage/qualityControl/qualityControlDetail'

/****************************** 风控--派单 *******************************/
// 派单列表
import auditAllotList from 'pages/riskManage/auditAllot/auditAllotList'
// 派单详情
import auditAllotDetail from 'pages/riskManage/auditAllot/auditAllotDetail'
// 派单总览详情
import auditAll from 'pages/riskManage/auditAllot/auditAll'

/****************************** 风控--审核数据分配 *******************************/
// 数据分配列表
import auditDataAllotList from 'pages/riskManage/auditData/auditDataAllotList'

/****************************** 风控--审核人员管理 *******************************/
// 审核人员列表
import auditPersonList from 'pages/riskManage/auditPerson/auditPersonList'
// 中介公司分配
import agencyAllot from 'pages/riskManage/auditPerson/agencyAllot'

/********************  风控--小区别名管理 ****************************/
import areaOtherName from 'pages/riskManage/areaOtherName/areaOtherName'

// 业务运营管理入口页
import operationManagement from 'pages/operationManagement/index'

// 业务运营管理 - 客服管理 - 客服管理详情
import kefuManageDetail from 'pages/operationManagement/kefuManageDetail'

// 合同管理-合同管理入口页
import contractManage from 'pages/contractManage/index'

// 合同管理-会分期合同管理-会分期合同管理详情
import contractManageList from 'pages/contractManage/contractManageList'

// 合同管理-会分期合同管理-会分期合同管理详情
import contractManageDetail from 'pages/contractManage/contractManageDetail'

//中介公司暂停审核
import agencyAuditStop from 'pages/riskManage/agencyAuditIsStop/agencyAuditIsStop'




/****************************** 实用工具 *******************************/
import tools from 'pages/tools/index'
//工行合同标记
import icbcToolsTag from 'pages/tools/icbcTag/icbcTagList'
//短信传
import sms from 'pages/tools/sms/sms'
//违约代扣查询
import withhodldearch from 'pages/tools/withholdSearch/withhodld_search'



Vue.use(Router)

export default new Router({
    routes: [
        {path: '', component: auditList},
        {
            path: '/riskManage', component: riskManage,
            children: [
                {path: '', component: auditList},
                {path: 'auditList', component: auditList},
                {path: 'auditDetail', component: auditDetail},
                {path: 'phoneCheckDetail', component: phoneCheckDetail},
                {path: 'qualityControlDetail', component: qualityControlDetail},
                {path: 'auditAllotList', component: auditAllotList},
                {path: 'auditAllotDetail', component: auditAllotDetail},
                {path: 'auditAll', component: auditAll},
                {path: 'auditDataAllotList', component: auditDataAllotList},
                {path: 'auditPersonList', component: auditPersonList},
                {path: 'agencyAllot', component: agencyAllot},
                {path: 'areaOtherName', component: areaOtherName},
                {path: 'agencyAuditStop', component: agencyAuditStop}
            ]
        },
        {
            path: '/operationManagement', component: operationManagement,
            children: [
                {path: '', component: kefuManageDetail},
                {path: 'kefuManageDetail', component: kefuManageDetail},
            ]
        },
        {
            path: '/contractManage', component: contractManage,
            children: [
                {path: '', component: contractManageList},
                {path: 'contractManageDetail', component: contractManageDetail},
                {path: 'contractManageList', component: contractManageList}
            ]
        },
        {
            path: '/tools', component: tools,
            children: [
                {path: '', component: icbcToolsTag},
                {path: 'icbcToolsTag', component: icbcToolsTag},
                {path: 'sms', component: sms},
                {path: 'withhodldearch', component: withhodldearch},
            ]
        }
    ]
})

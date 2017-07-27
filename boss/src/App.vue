<!-- 所有页面的入口文件 -->
<template>
    <div id="app">
        <!-- 头部导航 -->
        <header class="global-header">
            <div class="global-header-hd" @click="goHome">
                <img src="./assets/img/logo.png" width="63" height="36">
            </div>
            <div class="global-header-bd" v-if="isShowHeader">
                <el-menu theme="dark" :default-active="activeIndex" mode="horizontal" ref="el-menu">
                    <el-submenu v-if="userJurisdiction['contract_snapshot.read'] || userJurisdiction['installment_contract.read'] || userJurisdiction['cs_deleted.read']" index="1">
                        <template slot="title">合同管理</template>
                        <el-menu-item v-if="userJurisdiction['contract_snapshot.read']" index="1-1"
                                      @click="openOld('/html/govern.html?a=1')">
                            会分期合同管理
                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['installment_contract.read']" index="1-2"
                                      @click="openOld('/html/search.html')">
                            审核合同管理
                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['cs_deleted.read']" index="1-3"
                                      @click="openOld('/html/contract_del_list.html?a=1')">
                            取消合同管理
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu v-if="userJurisdiction['ic_rc_first.read'] || userJurisdiction['ic_rc_first_allotted.read'] || userJurisdiction['audit_user.read'] || userJurisdiction['ic_rc_allotted.read'] || userJurisdiction['address_alias.read'] || userJurisdiction['cs_qc.read'] || userJurisdiction['contract_agency.read'] || userJurisdiction['ic_sf_first.read'] || userJurisdiction['ic_sf_second.read']" index="2">
                        <template slot="title">风险控制</template>
                        <el-menu-item v-if="userJurisdiction['ic_rc_first.read']" index="2-2"
                                      @click="openNew('/riskManage/auditList')">
                            审核列表

                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['ic_rc_first_allotted.read']"
                                      id="ic_rc_first_allotted.read" class="" index="2-3"
                                      @click="openNew('/riskManage/auditAllotList')">
                            审核派单
                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['audit_user.read']"  index="2-6"
                                      @click="openNew('/riskManage/auditPersonList')">
                            <router-link to="">审核人员管理</router-link>
                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['ic_rc_allotted.read']" index="2-7"
                                      @click="openNew('/riskManage/auditDataAllotList')">
                            <router-link to="">审核数据分配</router-link>
                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['agency_suspend_audit.read']" index="2-11" @click="openNew('/riskManage/agencyAuditStop')">
                            <router-link to="">中介审核暂停</router-link>
                        </el-menu-item>
                         <el-menu-item v-if="userJurisdiction['address_alias.read']" index="2-8"
                                      @click="openNew('/riskManage/areaOtherName')">
                            地址别名管理
                        </el-menu-item>
                    <!--    <el-menu-item v-if="userJurisdiction['address_alias.read']" index="2-8"
                                      @click="openOld('/html/xiaoqubiemingguanli.html')">
                            小区别名管理
                        </el-menu-item> -->
                        <el-menu-item v-if="userJurisdiction['cs_qc.read']" index="2-9"
                                      @click="openOld('/html/zhijian.html?a=1')">
                            质检
                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['contract_agency.read']" index="2-10"
                                      @click="openOld('/html/dailihetong.html')">
                            代理合同审核

                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['ic_sf_first.read']" index="2-4"
                                      @click="openOld('/html/risk_sf.html?a=1')">
                            收房一审

                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['ic_sf_second.read']" index="2-5"
                                      @click="openOld('/html/risk_sf.html?a=2')">
                            收房二审

                        </el-menu-item>
                    </el-submenu>
                    <el-submenu v-if="userJurisdiction['subrent_cashing.read'] || userJurisdiction['subpay_receipt.read'] || userJurisdiction['subpay_receipt.read'] || userJurisdiction['contract_breaked.read'] || userJurisdiction['bankroll.read'] || userJurisdiction['subrent_borrow.read'] || userJurisdiction['subrent_calculate.read'] || userJurisdiction['refund.read']" index="3">
                        <template slot="title">财务管理</template>
                        <el-menu-item v-if="userJurisdiction['subrent_cashing.read']" index="3-1"
                                      @click="openOld('/html/cashier.html')">
                            款项出纳

                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['subpay_receipt.read']" index="3-2"
                                      @click="openOld('/html/returned.html')">
                            回款款项

                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['subpay_receipt.read']" index="3-3"
                                      @click="openOld('/html/confirmRepayment.html')">
                            确认租客还款

                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['contract_breaked.read']" index="3-4"
                                      @click="openOld('/html/find.html')">
                            违约退款

                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['bankroll.read']" index="3-5"
                                      @click="openOld('/html/export.html')">
                            查询银行流水

                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['subrent_borrow.read']" index="3-6"
                                      @click="openOld('/html/sources_capital.html')">
                            资金请款

                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['subrent_calculate.read']" index="3-7"
                                      @click="openOld('/html/calculate_capital.html')">
                            预测资金

                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['refund.read']" index="3-8"
                                      @click="openOld('/html/tuikuanliebiao.html')">
                            退款列表

                        </el-menu-item>
                    </el-submenu>
                    <el-submenu v-if="userJurisdiction['capital_loan.read'] || userJurisdiction['capital_refund.read'] || userJurisdiction['capital_baidu_repayment.read'] || userJurisdiction['capital_bohai_repayment.read'] || userJurisdiction['capital_yunxin_repayment.read'] || userJurisdiction['subrent_prepay.read'] || userJurisdiction['subrent_prepay_audit.read']" index="4">
                        <template slot="title">资金管理</template>
                        <el-menu-item v-if="userJurisdiction['capital_loan.read']" index="4-1"
                                      @click="openOld('/html/capital_loan.html')">
                            请款列表

                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['capital_refund.read']" index="4-2"
                                      @click="openOld('/html/capital_refund.html')">
                            退租列表

                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['capital_baidu_repayment.read']" index="4-3"
                                      @click="openOld('/html/capital_baidu_repay.html')">
                            百度回款列表

                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['capital_bohai_repayment.read']" index="4-4"
                                      @click="openOld('/html/capital_bohai_repay.html')">
                            渤海回款列表

                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['capital_yunxin_repayment.read']" index="4-5"
                                      @click="openOld('/html/capital_yunxin_repay.html')">
                            云信回款列表

                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['subrent_prepay.read']" index="4-6"
                                      @click="openOld('/html/jd_shenqing.html')">
                            代付申请

                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['subrent_prepay_audit.read']" index="4-7"
                                      @click="openOld('/html/jd_shenhe.html')">
                            审批并代付

                        </el-menu-item>
                    </el-submenu>
                    <el-submenu v-if="userJurisdiction['subpay_collection.read'] || userJurisdiction['subpay_followup.read'] || userJurisdiction['refund_opt.create'] || userJurisdiction['subpay_collection_allotted.read'] || userJurisdiction['subpay_custservice.read'] || userJurisdiction['agency_suspend_cashing.read'] || userJurisdiction['refund_opt.read'] || userJurisdiction['contract_breaked_opt.read']" index="5">
                        <template slot="title">业务运营管理</template>
                        <el-menu-item v-if="userJurisdiction['subpay_collection.read']" index="5-1"
                                      @click="openOld('/html/urge.html')">
                            催收管理

                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['subpay_followup.read']" index="5-2"
                                      @click="openOld('/html/follow.html')">
                            问题跟进

                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['refund_opt.create']" index="5-3"
                                      @click="openOld('/html/tuikuanshenqing.html')">
                            退款申请

                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['subpay_collection_allotted.read']" index="5-4"
                                      @click="openOld('/html/allot.html')">
                            数据分配

                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['subpay_custservice.read']" index="5-5"
                                      @click="openOld('/html/service.html')">
                            客服管理

                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['agency_suspend_cashing.read']" index="5-6"
                                      @click="openOld('/html/zanhuanchunazhongjie.html')">
                            暂缓出纳中介列表

                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['refund_opt.read']" index="5-7"
                                      @click="openOld('/html/tuikuanliebiao.html')">
                            退款列表

                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['contract_breaked_opt.read']" index="5-8"
                                      @click="openOld('/html/new_get_default.html')">
                            违约退款

                        </el-menu-item>
                    </el-submenu>
                    <el-submenu v-if="userJurisdiction['contract_breaked_terms.read'] || userJurisdiction['contract_withhold.read'] || userJurisdiction['user_bank_card.read'] || userJurisdiction['user_phone.read'] || userJurisdiction['user_verification_code.read']" index="6">
                        <template slot="title">实用工具</template>
                        <el-menu-item v-if="userJurisdiction['contract_breaked_terms.read']" index="6-1"
                                      @click="openOld('/html/default.html')">
                            会分期违约单
                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['contract_withhold.read']" index="6-2"
                                      @click="openOld('/html/payment.html')">
                            代扣服务查询
                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['user_bank_card.read']" index="6-3"
                                      @click="openOld('/html/payment_bank.html')">
                            用户银行卡查询
                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['user_phone.read']" index="6-4"
                                      @click="openOld('/html/search_mobile.html')">
                            用户手机号查询
                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['sms.read']" index="6-5"
                                      @click="openNew('/tools/sms')">
                            短信查询
                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['withholdrecord.read']" index="6-7"
                                      @click="openNew('/tools/withhodldearch')">
                            违约代扣查询
                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['contract_extend_source_capital.read']" index="6-6" @click="openNew('/tools/icbcToolsTag')">
                            工行合同标记
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu v-if="userJurisdiction['agency.read'] || userJurisdiction['super_admin.read']" index="7">
                        <template slot="title">基础信息</template>
                        <el-menu-item v-if="userJurisdiction['agency.read']" index="7-1"
                                      @click="openOld('/html/agency.html')">
                            中介公司列表
                        </el-menu-item>
                        <el-menu-item v-if="userJurisdiction['super_admin.read']" index="7-2"
                                      @click="openOld('/html/jurisdiction.html')">
                            编辑权限
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
                <!-- 问好 -->
            </div>
            <div class="global-header-ft">
                {{time}}好,{{userName}}
                <el-button type="text" @click="loginOut">退出</el-button>
            </div>
        </header>
        <router-view></router-view>
    </div>
</template>

<script>
    import 'normalize.css'
    import 'animate.css'
    import 'iview/dist/styles/iview.css'
    import 'element-ui/lib/theme-default/index.css'
    import vueMethods from 'src/assets/js/vueMethods'

    import sha256_digest from 'src/assets/js/sha256'

    export default {
        name: 'app',
        mixins: [vueMethods],
        data(){
            return {
                // 当前用户
                userName: '',
                time: '上午',
                isShowHeader: false,
                // 审核权限
                userJurisdiction:{}
            }
        },
        computed: {
            activeIndex(){
                return this.$store.state.activeIndex
            },
            // 审核权限是否请求完毕
            isGetUserJurisdiction(){
                return this.$store.state.isGetUserJurisdiction
            }
        },
        watch: {
            isGetUserJurisdiction(){
                this.isShowHeader = true;
                Object.assign(this.userJurisdiction,this.$store.state.userJurisdiction);
            }
        },
        methods: {
            // 判断登录状态
            isLogin(){
                let bossId = this.$cookie.get('boss_id');
                let boss_skey = this.$cookie.get('boss_skey');
                if (bossId && boss_skey) { //登录
                    this.userName = this.$cookie.get('boss_name');
                } else { //未登录
                    this.$message('请重新登录');
                    setTimeout(function () {
                        window.location.href = "/html/login.html";
                    }, 2000);
                }
            },
            // 获取用户权限
            getJurisdiction(){
                this.$axios.get('/api/auth/user/perm/')
                    .then((res) => {
                        if (res.data.status.code != 0) {
                            this.$message.error(res.data.status.description);
                            window.location.href = "/html/login.html";
                        } else {
                            this.$store.commit('setJurisdiction', res.data.result.perms);
                            this.userJurisdiction = res.data.result.perms;
                        }
                    })
            },
            // 获取当期的时间
            getTime(){
                let date = new Date();
                let HH = date.getHours();
                if (HH < 12) {
                    this.time = '上午';
                } else if (HH >= 12 && HH < 19) {
                    this.time = '下午';
                } else if (HH >= 19) {
                    this.time = '晚上';
                }
            },
            // 退出登录
            loginOut(){
                this.$axios.get(`/api/auth/logout/`)
                    .then(res => {
                        if (res.data.status.code != 0) {
                            this.$message.error('退出失败');
                        } else {
                            window.location.href = "/html/login.html";
                        }
                    })
            },
            // 返回主页
            goHome(){
                window.location.href = '/html/index1.html';
            },
            // 跳转到新项目
            openOld(url){
                window.location.href = url;
            },
            // 跳转到新项目
            openNew(url){
                this.$router.push(url);
            },
            // 当菜单的子元素为空时,隐藏当期菜单
            hideSubmenu(){
                let $submenus = this.$el.querySelectorAll('.el-submenu');
                for (let i = 0; i < $submenus.length; i++) {
                    let $menuItems = $submenus[i].querySelectorAll('.el-menu-item');
                    $menuItems.len = 0;
                    for (let j = 0; j < $menuItems.length; j++) {
                        if ($menuItems[j].getAttribute('data-show')) {
                            $menuItems.len++
                        }
                    }
                    if ($menuItems.len === 0) {
                        $submenus[i].style.display = 'none';
                    }
                }
            }
        },
        created(){
            this.$store.dispatch('getGlobalData');
            this.$store.dispatch('getJurisdiction');
            this.getTime();
        },
        mounted(){
            // 判断是否为生产环境,如果是，则需要判断登录状态
            if (this.utils.isProduction()) {
                //判断是否登录
                this.isLogin();
            } else {
                this.$cookie.set('webcall', '"8013@hzfkf"');
                this.$cookie.set('web_key', 'WUrh7653');
                this.$cookie.set('boss_id', '"zhouli@huizhaofang.com"');
                this.$cookie.set('boss_name', '陈大牛');
                this.$cookie.set('boss_skey', '3a1dfa99b231416095bf027321cf42f0');
                this.$cookie.set('sessionid', 'hjafpuoo98q3sw6aqgpi4qju7dyhwwhc');
                this.userName = this.$cookie.get('boss_name');
            }
        }
    }
</script>

<style lang="less">
    /* 引入全局样式 */
    @import './assets/css/main.less';

    /* 全局头部 */
    .global-header {
        position: fixed;
        min-width: 1150px;
        z-index: 10;
        top: 0;
        left: 0;
        right: 0;
        background-color: #324057;
        height: 60px;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
    }

    .global-header-hd {
        width: 100px;
        height: 36px;
    }

    .global-header-bd {
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        flex: 1;
        text-align: center;
        height: 60px;
    }

    .global-header-ft {
        width: 200px;
        font-size: 12px;
        color: #E0E6ED;
        letter-spacing: 0;
    }

    .global-header-hd img {
        margin-left: 20px;
    }

    .global-header-bd .el-menu {
        display: inline-block;
    }

    .global-header-ft {
        margin-left: 20px;
    }

    .global-header .el-button.el-button--text {
        margin-left: 18px;
        font-size: 12px;
        line-height: 1;
    }

</style>

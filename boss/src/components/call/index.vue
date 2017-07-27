<!-- 外呼模块 -->
<template>
    <div class="hfq-call waihu">
        <div class="hfq-cell">
            <div class="hfq-cell-hd">
                拨打电话 
                <img v-if="gonghang" style="width:14px;margin:2px 0 0 0px;vertical-align:top;" src="../../assets/img/bank_icon.png" alt="">
            </div>
            <div class="hfq-cell-bd">
                <el-button id="softphoneBarPick" type="text">登录外呼</el-button>
                <el-button id="softphoneBarKick" type="text" style="margin-left: 0;display: none;">退出外呼</el-button>
            </div>
        </div>


        <div id="softphone-bar" class="phone_bar_style">

            <div class="m-input-group" style="width: 150px;">

                <el-select v-model="selectVal" placeholder="请选择" class="m-select" >
                    <el-option label="租客手机号" value="user_mobile"></el-option>
                    <el-option label="紧急联系人" value="user_linkman_mobile"></el-option>
                    <el-option label="预留电话" value="user_card_mobile"></el-option>
                    <el-option label="其他" value="other"></el-option>
                </el-select>

                <div class="hfq-cell">
                    <el-input v-model="callPhone" class="m-display-input" :disabled="selectVal !== 'other'"></el-input>
                </div>

            </div>

            <div id="phone_bar" class="hfq-cell">

                <div class="input-append">
                    <el-button id="DialEnable" type="primary" style="display:none;" @click="softphonebar_dialout">呼叫</el-button>
                    <el-button id="HoldEnable" type="primary"  style="display:none;" @click="phone_hold"> 保持 </el-button>
                    <el-button id="HoldGetEnable" type="primary"  @click="phone_unhold" style="display:none;"> 恢复 </el-button>
                    <el-button id="TransferEnable" type="primary"  style="display:none" @click="phone_openTransferOrConsult"> 转接 </el-button>
                    <el-button id="ConsultTransferEnable" type="primary"  style="display:none" @click="phone_transfer"> 转接 </el-button>
                    <el-button id="ConsultEnable" type="primary"  style="display:none" @click="phone_openTransferOrConsult"> 咨询 </el-button>
                    <!--<el-button id="InvestigateEnable" type="primary"  style="display:none" @click="phone_investigate"> 转调查 </el-button>-->
                    <el-button id="ConsultThreeWayCallEnable" type="primary"  style="display: none" @click="phone_threewaycall"> 三方 </el-button>
                    <el-button id="StopConsultEnable" type="danger"  style="display:none" @click="phone_stopConsult"> 结束咨询 </el-button>
                    <el-button id="HangupEnable" type="danger"  @click="softphonebar_hangup" style="display:none;"> 挂机 </el-button>
                </div>
                <div class="state_group" style="margin-left: 20px;">
                    <div id="softphone_timer" class="fr state_time">00:00:00</div>
                    <div id="softphone_dropdown" class="fr state_dropdown"><b id="softphone_dropdown_caret" class="caret"></b></div>
                    <div id="softphone_phonestate" class="fr state">失效
                    </div>
                </div>

                <div style="clear:both"></div>

            </div>

            <div style="clear: both;"></div>
            <div class="red" style="margin-top: 10px;">
                <span class="errorMsg"></span>
            </div>

            <div id="softphone_otherstate" class="customer_db" style="display: none;"></div>
            <div id="softphone_consult" class="softphone-transfer-div"></div>
            <div id="softphone_transfer" class="softphone-transfer-div"></div>
            <div id="icc_event"></div>
        </div>
        <div style="visibility: hidden"><span class='f_card_user_mobile'></span></div>
        <div style="visibility: hidden"><span class='f_card_user_mobile'></span></div>
        <div style="visibility: hidden"><span class='f_card_user_mobile'></span></div>
    </div>
</template>

<script>
    import holly from './js/app'
    export default{
        name: 'hfq-call',
        props:{
            data:{
                type: Object,
                default(){
                    return {
                        // 用户手机号
                        user_mobile: '',
                        // 紧急联系人手机号
                        user_linkman_mobile:'',
                        // 预留银行卡手机号
                        user_card_mobile:'',
                    }
                }
            }
        },
        data(){
            return {
                selectVal: 'user_mobile',
                callPhone:'',
                gonghang: false
            }
        },
        watch:{
            selectVal(){
                this.getCallPhone();
            },
            data(){
                this.getCallPhone();
            }
        },
        methods: {
            getCallPhone(){
                switch (this.selectVal){
                    case 'user_mobile':
                        this.callPhone = this.data.user_mobile;
                        break
                    case 'user_linkman_mobile':
                        this.callPhone = this.data.user_linkman_mobile;
                        break
                    case 'user_card_mobile':
                        this.callPhone = this.data.user_card_mobile;
                        break
                    case 'other':
                        this.callPhone = '';
                        break
                }
            },
            // 初始化外呼
            initCall(){
                var web_call = this.$cookie.get("web_call")? this.$cookie.get("web_call").replace(/"/g,"") : '';
                var web_key = this.$cookie.get("web_key");
                if (this.isLogin()) {
                    holly.app._initSoftbarPhone(web_call, web_key);
                } else {
                    // 请重新登录
                    this.$message.error('请登录外呼');
                }
            },
            // 呼叫
            softphonebar_dialout(){
                if(!this.isLogin()){
                    this.$message.error('请先登录');
                }else if(!this.callPhone){
                    this.$message.error('手机号不能为空');
                }else {
                    holly.softphonebar.softphonebar_dialout(this.callPhone);
                }
            },
            // 保持
            phone_hold(){
                holly.phone.phone_hold();
            },
            // 恢复
            phone_unhold(){
                holly.phone.phone_unhold();
            },
            // 转接
            phone_transfer(){
                holly.phone.phone_transfer('9123456', 'number');
            },
            // 转接
            phone_openTransferOrConsult(){
                holly.phone.phone_openTransferOrConsult('softphone_transfer');
            },
            // 咨询
            phone_openTransferOrConsult(){
                holly.phone.phone_openTransferOrConsult('softphone_consult');
            },
            // 转调查
            phone_investigate(){
                holly.phone.phone_investigate();
            },
            // 三方
            phone_threewaycall(){
                holly.phone.phone_threewaycall('9123456');
            },
            // 结束咨询
            phone_stopConsult(){
                holly.phone.phone_stopConsult();
            },
            // 挂机
            softphonebar_hangup(){
                holly.softphonebar.softphonebar_hangup();
            },
            isLogin(){
                var web_call = this.$cookie.get("web_call")? this.$cookie.get("web_call").replace(/"/g,"") : '';
                var web_key = this.$cookie.get("web_key");
                return web_call && web_key
            },
            // 判断是否工行
            isICBC(){
                let $axios = this.$axios;
                    $axios.all([
                    $axios.get(`/v2/api/contracts/installments/${this.utils.getUrlParam('contractNo')}`)
                ])
                .then($axios.spread((perms1) => {
                    if(perms1.data.f_first_sources_capital === 'h002'){
                        this.gonghang = true;
                    }
                }))
            }
        },
        mounted(){
            this.initCall();
            this.isICBC();
        }
    }
</script>

<style lang="less">
    .hfq-call {
        .input-append {
            .el-button {
                margin-right: 10px;
            }
        }
        .el-button + .el-button {
            margin-left: 0;
        }
    }

</style>

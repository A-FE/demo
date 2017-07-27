<!-- 3-电核信息 -->
<template>
    <div class="hfq-phone-check-info hfq-component" v-if="isShowPage">

        <!-- 电核信息B端 -->
        <template v-if="contractType === 'B' && rcStatus === '2' ">
            <div class="hfq-component-title">电核信息</div>
            <div class="hfq-component-content">
                <el-row type="flex">
                    <template v-if="rcStatus == '2' ">
                        <!-- 租客信息 -->
                        <el-col  class="renter-info" style="width: 400px;">
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('contract_no')">合同号</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.contract_no}}</div>
                            <el-badge is-dot :hidden="isFiledNameChange('collection_manager')">
                                （跟进人：{{formatterAuditOper(renterData.collection_manager)}}）
                            </el-badge>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('user_name')">租客姓名</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.user_name}}</div>&nbsp;
                            <div class="hfq-cell-bd">{{Number(renterData.user_id_no.slice(-2,-1)%2) ? '先生' : '女士'}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('name')">中介公司</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.name}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('user_id_no')">身份证号</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.user_id_no.slice(0,-4)}}</div>
                            <div class="hfq-cell-bd" style="color:red;">{{renterData.user_id_no.slice(-4)}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('address')">房源地址</el-badge>
                            </div>
                            <div class="hfq-cell-bd address hfq-cell-primary">{{renterData.address}}
                                <el-tooltip class="item" placement="top" v-if="otherName">
                                    <div slot="content" v-html="otherName">
                                    </div>
                                    <el-button type="text" style="width:14px;height:14px;background:#20A0FF;border-radius:7px;color:#fff;font-size: 12px;margin:0 4px;">
                                        别
                                    </el-button>
                                </el-tooltip>
                            </div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('f_address')">代理房源地址</el-badge>
                            </div>
                            <div class="hfq-cell-bd hfq-cell-primary" style="color: #FF4949">{{renterData.f_address}}</div>
                        </div>
                        <div class="hfq-cell">

                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('f_revised_address')">代理修订地址</el-badge>
                            </div>
                            <div class="hfq-cell-bd" style="color: #FF4949">{{renterData.f_revised_address}}</div>
                        </div>

                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot
                                          :hidden="isFiledNameChange('lease_begin') || isFiledNameChange('lease_end')">
                                    租期时间段
                                </el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.lease_begin}} &#160;至&#160; {{renterData.lease_end}}
                            &#160;
                            共&#160;{{renterData.total_months}}&#160;月&#160;{{renterData.total_days}}&#160;天
                            </div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('monthly_amount')">月租金</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.monthly_amount}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('service_fee')">月服务费</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.service_fee}}</div>
                            <div class="hfq-cell-hd" style="color:#1F2D3D">
                                <el-badge is-dot :hidden="isFiledNameChange('real_service_rate')">（服务费率：{{renterData.real_service_rate}}%）</el-badge>
                            </div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('f_prepay_days')">提前还款天数</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.f_prepay_days}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('f_service_fee_payer')">服务费承担方</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData. f_service_fee_payer_value}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('f_down_payment_way')">租客首付方式</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.f_down_payment_way_value}}</div>
                        </div>
                    </el-col>
                        <!-- 还款信息 -->
                        <el-col style="border-right:1px #ccc dashed;margin-left: 70px;" :span="7" class="pay-total">
                            <div class="hfq-cell">
                                <div class="hfq-cell-hd">
                                    <el-badge is-dot :hidden="isFiledNameChange('countPrice')">租客还款总额</el-badge>
                                </div>
                                <div class="hfq-cell-bd">{{Number(renterData.countPrice).toFixed(2)}}</div>
                            </div>

                            <div class="m-table">
                                <!-- 表头 -->
                                <div class="m-table-thead">
                                    <div class="m-table-tr">
                                        <div class="m-table-th column_1">期次</div>
                                        <div class="m-table-th column_2">还款日期</div>
                                        <div class="m-table-th column_3">还款金额</div>
                                    </div>
                                </div>

                                <!-- 表正文 -->
                                <div class="m-table-tbody" v-if="renterData.total">
                                    <!-- 第一期 -->
                                    <div class="m-table-tr">
                                        <div class="m-table-td  column_1" v-text="renterData.f_subpay_list[0].index"></div>
                                        <div class="m-table-td  column_2" v-text="renterData.f_subpay_list[0].pay_date.slice(6,7)+'月'+renterData.f_subpay_list[0].pay_date.slice(8,10)+'日'"></div>
                                        <div class="m-table-td  column_3" v-text="renterData.f_subpay_list[0].price"></div>
                                    </div>

                                    <!-- 中间期次-期次大于2 -->
                                    <div class="m-table-tr" v-if="renterData.total > 2">
                                        <div class="m-table-td  column_1" v-if="renterData.total === 3">2</div>
                                        <div class="m-table-td  column_1" v-if="renterData.total > 3">2-{{renterData.total - 1}}</div>
                                        <div class="m-table-td  column_2">{{renterData.f_subpay_list[1].pay_date.slice(-2)}}日</div>
                                        <div class="m-table-td  column_3" v-text="renterData.f_subpay_list[1].price"></div>
                                    </div>

                                    <!-- 最后一期 -->
                                    <div class="m-table-tr" v-if="renterData.total > 1">
                                        <div class="m-table-td  column_1" v-text="renterData.f_subpay_list[renterData.total -1].index"></div>
                                        <div class="m-table-td  column_2">{{renterData.f_subpay_list[renterData.total -1].pay_date.slice(-2)}}日</div>
                                        <div class="m-table-td  column_3" v-text="renterData.f_subpay_list[renterData.total -1].price"></div>
                                    </div>
                                </div>

                            </div>
                        </el-col>
                        <!-- 拨打电话 -->
                        <el-col  :span="6" :offset="1" class="call-somebody">
                        <!-- 拨打电话模块 -->
                        <hfq-call :data="renterData"></hfq-call>
                        <div class="hfq-tags">
                            <template v-for="item in tags">
                                <hfq-checkbox v-model="model" :label="item.value">{{item.label}}</hfq-checkbox>
                            </template>
                        </div>

                    </el-col>
                    </template>
                </el-row>
            </div>
        </template>

        <!-- 电核信息C端 -->
        <template v-else-if="contractType === 'C'">
            <div class="hfq-component-title">电核信息</div>
            <div class="hfq-component-content">
                <!-- 房东信息 -->
                <el-row type="flex">
                    <!-- 联系人关系 -->
                    <el-col>
                        <!-- 联系人一 -->
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('user_linkman_name')">租客紧急联系人</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.user_linkman_name}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('user_linkman_relation')">紧急联系人关系</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.user_linkman_relation_value}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('user_linkman_mobile')">紧急联系人手机</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.user_linkman_mobile}}</div>
                        </div>
                    </el-col>
                    <!-- 单位信息 -->
                    <el-col>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('user_company_name')">租客单位名称</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.user_company_name}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('user_company_address')">租客单位地址</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.user_company_address}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('user_company_mail')">租客公司邮箱</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.user_company_mail}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('user_job')">租客职务</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.user_job}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('user_income')">租客月收入</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.user_income_value}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('user_card_no')">租客银行账号</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.user_card_no}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('user_qq')">租客QQ</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.user_qq}}</div>
                        </div>
                    </el-col>
                    <!-- 房东信息个人信息 -->
                    <el-col>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('owner_name')">房东姓名</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.owner_name}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('owner_bank_account')">房东开户姓名</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.owner_bank_account}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('owner_bank')">房东开户行</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.owner_bank}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('owner_card_no')">房东银行卡号</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.owner_card_no}}</div>
                        </div>

                    </el-col>
                </el-row>
                <div class="hfq-line"></div>
                <!-- 租客全部信息 -->
                <el-row type="flex">
                    <!-- 租客姓名、手机号、公司 -->
                    <el-col :span="7">
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('contract_no')">合同号</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.contract_no}}</div>
                            <el-badge is-dot :hidden="isFiledNameChange('collection_manager')">
                                （跟进人：{{formatterAuditOper(renterData.collection_manager)}}）
                            </el-badge>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('user_name')">租客姓名</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.user_name}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('user_id_no')">身份证号</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.user_id_no}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('name')">中介公司</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.name}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('address')">房源地址</el-badge>
                            </div>
                            <div class="hfq-cell-bd address hfq-cell-primary">{{renterData.address}}
                                <el-tooltip class="item" placement="top" v-if="otherName">
                                    <div slot="content" v-html="otherName">
                                    </div>
                                    <el-button type="text" style="width:14px;height:14px;background:#20A0FF;border-radius:7px;color:#fff;font-size: 12px;margin:0 4px;line-height: 14px;">
                                        别
                                    </el-button>
                                </el-tooltip>
                            </div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot
                                          :hidden="isFiledNameChange('lease_begin') || isFiledNameChange('lease_end')">
                                    租期时间段
                                </el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.lease_begin}} &#160;至&#160; {{renterData.lease_end}}
                                </br>
                               ({{renterData.total_months}}月{{renterData.total_days}}天)
                            </div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('monthly_amount')">月租金</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.monthly_amount}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('service_fee')">月服务费</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.service_fee}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('f_prepay_days')">提前还款天数</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.f_prepay_days}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('hzf_pay_type')">会找房付款方式</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.hzf_pay_type_value}}</div>
                        </div>
                    </el-col>

                    <el-col :span="7" style="border-right: 1px #ccc dashed;margin:0 40px 0 47px">
                        <!-- 还款总金额 -->
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('countPrice')">租客还款总金额</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{ Number(renterData.countPrice).toFixed(2)}}</div>
                        </div>
                        <!-- 租客还款其次 -->
                        <div class="m-table">
                            <!-- 表头 -->
                            <div class="m-table-thead">
                                <div class="m-table-tr">
                                    <div class="m-table-th column_1">期次</div>
                                    <div class="m-table-th column_2">还款日期</div>
                                    <div class="m-table-th column_3">还款金额</div>
                                </div>
                            </div>
                            <!-- 表正文 -->
                            <div class="m-table-tbody" v-if="renterData.total">
                                <!-- 第一期 -->
                                <div class="m-table-tr">
                                    <div class="m-table-td  column_1" v-text="renterData.f_subpay_list[0].index"></div>
                                    <div class="m-table-td  column_2" v-text="renterData.f_subpay_list[0].pay_date.slice(6,7)+'月'+renterData.f_subpay_list[0].pay_date.slice(8,10)+'日'"></div>
                                    <div class="m-table-td  column_3" v-text="renterData.f_subpay_list[0].price"></div>
                                </div>

                                <!-- 中间期次-期次等于3 -->
                                <div class="m-table-tr" v-if="renterData.total > 2">
                                    <div class="m-table-td  column_1" v-if="renterData.total === 3">2</div>
                                    <div class="m-table-td  column_1" v-if="renterData.total > 3">2-{{renterData.total - 1}}</div>
                                    <div class="m-table-td  column_2">{{renterData.f_subpay_list[1].pay_date.slice(-2)}}日</div>
                                    <div class="m-table-td  column_3" v-text="renterData.f_subpay_list[1].price"></div>
                                </div>

                                <!-- 最后一期 -->
                                <div class="m-table-tr" v-if="renterData.total > 1">
                                    <div class="m-table-td  column_1" v-text="renterData.f_subpay_list[renterData.total -1].index"></div>
                                    <div class="m-table-td  column_2">{{renterData.f_subpay_list[renterData.total -1].pay_date.slice(-2)}}日</div>
                                    <div class="m-table-td  column_3" v-text="renterData.f_subpay_list[renterData.total -1].price"></div>
                                </div>
                            </div>
                        </div>
                        <!--会分期付款总额-->
                        <!-- 打款期次和金额 -->
                        <el-row type="flex">
                            <el-col>
                                <el-popover
                                        ref="popover1"
                                        placement="right"
                                        trigger="hover">
                                    <el-table :data="renterData.f_subrent_list">
                                        <el-table-column width="100" property="index" label="期次"></el-table-column>
                                        <el-table-column width="100" property="price" label="金额"></el-table-column>
                                    </el-table>
                                </el-popover>
                            </el-col>
                        </el-row>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('countPrice')">会分期付款总额</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{Number(renterData.countPrice).toFixed(2)}}</div>
                            <el-button type="text" v-popover:popover1>
                                <img  style="width:14px;cursor: pointer; margin-left:5px;" src="../../assets/img/icon_question.png">
                            </el-button>
                        </div>
                    </el-col>
                    <el-col :span="6" class="call-somebody">
                        <!-- 电核信息标签 -->
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('countPrice')">电核标签</el-badge>
                            </div>
                        </div>
                        <div class="hfq-tags" style="margin:0;">
                            <template v-for="item in tags">
                                <hfq-checkbox v-model="model" :label="item.value">{{item.label}}</hfq-checkbox>
                            </template>
                        </div>

                    </el-col>

                </el-row>
            </div>
        </template>

        <!-- 质检电核信息 -->
        <template v-else>
            <div class="hfq-component-title">电核信息</div>
            <div class="hfq-component-content">
                <el-row type="flex">
                    <el-col>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('renterName')">房东姓名</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.renterName}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('renterName')">开户姓名</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.renterName}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('renterName')">开户行</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.renterName}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('renterName')">用户银行卡号</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.renterName}}</div>
                        </div>
                    </el-col>
                    <!-- 单位信息 -->
                    <el-col>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('renterName')">单位名称</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.renterName}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('renterName')">单位地址</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.renterName}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('renterName')">公司邮箱</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.renterName}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('renterName')">职务</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.renterName}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('renterName')">月收入</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.renterName}}</div>
                        </div>
                    </el-col>
                    <!-- 联系人关系 -->
                    <el-col>
                        <!-- 联系人一 -->
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('renterName')">用户银行卡号</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.renterName}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('renterName')">QQ</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.renterName}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('renterName')">联系人关系</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.renterName}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('renterName')">紧急联系人</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.renterName}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('renterName')">联系人手机</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.renterName}}</div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </template>

    </div>
</template>

<script>

    import call from 'src/components/call/index'
    import vueMethods from 'components/vueMethods'
    export default{
        name: 'hfq-phone-check-info',
        mixins: [vueMethods],
        components:{
            'hfq-call':call
        },
        props: {
            value: {
                type: Array
            }
        },
        data(){
            return {
                contractNo: '',
                //用于判断是那个端
                contractType: '',
                // 判断现在是几审
                rcStatus:0,
                /* 租客信息 */
                renterData: {},
                // 所有员工的信息
                usersInfo: [],
                tags: [],
                // 小区别名
                otherName: '',
                // 外呼数据
                callData:{
                    // 登录状态
                    isLogin: false,
                    // 呼叫状态
                    isCalling: false
                },
                isShowPage:false
            }
        },
        computed: {
            model: {
                get() {
                    return this.value !== undefined
                        ? this.value : [];
                },
                set(val) {
                    this.$emit('input', val);
                }
            }
        },
        methods: {
            // 格式化审核人
            formatterAuditOper(email){
                return this.getUserNameFromEmail(email, this.usersInfo);
            },
            //初始化组件
            initComponent(){
                let contractNo = this.contractNo;
                let agencyId = this.utils.getUrlParam('agencyId');
                this.$set(this.renterData, 'contract_no', contractNo);
                let $axios = this.$axios;

                $axios.all([
                    $axios.get(`/v2/api/contracts/signusers/${contractNo}`),
                    $axios.get(`/v2/api/contracts/installments/${contractNo}`),
                    $axios.get(`/v2/api/contracts/${contractNo}`),
                    $axios.get(`/v2/api/contracts/pays/${contractNo}`),
                    $axios.get(`/v2/api/contracts/agencies/${contractNo}`),
                    $axios.get(`/v2/api/agencys/${agencyId}`),
                    $axios.get(`/v2/api/users/${contractNo}`),
                    $axios.get(`/v2/api/contracts/owners/${contractNo}`),
                    $axios.get(`/api/auth/user/get/?page_no=1&page_limit=0`),
                    $axios.get(`/v2/api/audit/aliases/?f_state=1`)
                ])
                    .then($axios.spread((perms1, perms2, perms3, perms4, perms5, perms6, perms7, perms8, perms9, perms10) => {
                        //当这两个请求都完成的时候会触发这个函数，两个参数分别代表返回的结果
                        let count = 0;
                        this.$set(this.renterData, 'countPrice', 0);
                        this.renterData = Object.assign({}, perms1.data, perms2.data, perms3.data, perms4.data, perms5.data, perms6.data, perms7.data, perms8.data);
                        this.renterData.f_subpay_list.map((val) => {
                            count += val.price;
                        })
                        this.isShowPage = true;
                        this.$set(this.renterData, 'countPrice', count);
                        this.$set(this.renterData, 'total', this.renterData.f_subpay_list.length);
                        this.usersInfo = perms9.data.result.users;
                        this.otherName = this.utils.getOtherName(this.renterData.address,perms10.data.results);

                    }))
            },
            initComponentTags(){
                this.tags = [];
                let examineTags = this.$store.state.examineTags;
                this.getExamineTagsFromAreaId(18, examineTags).forEach( tag =>{
                    this.tags.push({
                        label: tag.f_name,
                        value: tag.f_id
                    })
                });
            },
            globalAjaxSuccess(){
                this.contractNo = this.utils.getUrlParam('contractNo');
                //判断是那个端
                this.contractType = this.utils.getLeaseType();
                console.log( this.contractType)
                this.initComponent();
                this.initComponentTags();
            }
        },
        mounted(){
            this.rcStatus = this.utils.getUrlParam('rcStatus');
        }
    }
</script>

<style lang="less">
    .hfq-phone-check-info{
        .hfq-cell {
            padding-left: 0;
            -webkit-box-align: start;
            align-items: flex-start;
        }
        .hfq-cell-hd {
            white-space: nowrap;
        }
        .el-button--text {
            padding: 0;
        }

        /* 自定义表格 */
        .m-table {
            font-size: 0;
        }

        .m-table-tr {
            line-height: 30px;
        }

        .m-table-th {
            margin-top: 5px;

            display: inline-block;
            font-size: 14px;
            color: #5E6D82;
            line-height: 14px;
        }

        .m-table-td {
            display: inline-block;
            font-size: 14px;
            color: #1F2D3D;
            line-height: 14px;
        }

        .column_1 {
            width: 58px;
        }

        .column_2 {
            width: 110px;
        }

        .column_3 {
            width: 84px;
        }

        /* 租客信息 */
        .renter-info .hfq-cell {
            -webkit-box-align: start;
            align-items: flex-start;
        }

        .renter-info .hfq-cell-bd {
        }


        .hfq-cell-bd.address .el-button--text {
            position: absolute;
            right: -20px;
            top: 0;
            line-height: 18px;
        }

        .hfq-tags {
            margin-top: 15px;
            font-size: 0;
        }
        .hfq-line {
            margin: 12px 0;
        }

        .hfq-cell-hd {
            font-size: 14px;
            color: #5E6D82;
            line-height: 18px;
            margin-right: 5px;
            min-width: 85px;
        }

        .hfq-cell-bd p {
            font-size: 12px;
            color: #5E6D82;
        }
        .hfq-cell-bd.address .el-button--text{
            position:inherit;
        }
        .column_1 {
            width: 35px;
        }

        .column_2 {
            width: 100px;
            text-align: right;
        }

        .m-table-tbody .column_2{
            width: 100px;
            text-align: right;
        }

        .column_3 {
            width: 80px;
            margin-left: 50px;

        }
        .m-table-thead  .column_3{
            width: 80px;
            margin-left: 50px;
        }
        .hfq-component-content{
            margin-top: 10px;
        }
    }
</style>

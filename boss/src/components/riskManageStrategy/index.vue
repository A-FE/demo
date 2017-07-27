<!-- 15-风控策略 -->
<template>
    <div class="hfq-riskManage-strategy hfq-component">
        <div class="hfq-component-title">人工干预</div>

        <div class="hfq-component-content">
            <!-- 组件头部 -->
            <div class="hfq-ul">
                <div class="hfq-li" style="min-width: 500px;margin-right: 30px;">
                    <span class="gray">
                            <el-badge is-dot :hidden="isFiledNameChange('user_mobile')">租客手机号码</el-badge>
                    </span>
                    {{riskTenantMsg.user_mobile}}
                    <el-button type="text" @click="query(riskTenantMsg.user_mobile)">查询</el-button>
                    <span>
                        <el-tooltip class="item" effect="dark" content="与经纪人手机号一致！" placement="top">
                            <img v-show="user_mobile_is_broker" class="icon" src="../../assets/img/icon.png" alt="">
                        </el-tooltip>
                    </span>
                    <span
                        v-if="user_mobile_contracts.contract_phone_contracts.count || user_mobile_contracts.bank_phone_contracts.count || user_mobile_contracts.linkman_phone_contracts.count"
                        class="red"
                        @click="showHistoryContracts('user_mobile_contracts')">匹配合同数:({{user_mobile_contracts.contract_phone_contracts.count}},{{user_mobile_contracts.bank_phone_contracts.count}},{{user_mobile_contracts.linkman_phone_contracts.count}})
                    </span>
                    <span v-else class="disabled">
                        匹配合同数:({{user_mobile_contracts.contract_phone_contracts.count}},{{user_mobile_contracts.bank_phone_contracts.count}},{{user_mobile_contracts.linkman_phone_contracts.count}})
                    </span>

                </div>
                <div class="hfq-li">
                    <span>
                        <span class="gray">
                            <el-badge is-dot :hidden="isFiledNameChange('user_card_mobile')">银行预留手机</el-badge>
                        </span>
                        {{riskTenantMsg.user_card_mobile}}
                        <span>
                            <el-tooltip class="item" effect="dark" content="与经纪人手机号一致！" placement="top">
                                <img v-show="user_card_mobile_is_broker" class="icon" src="../../assets/img/icon.png"
                                     alt="">
                            </el-tooltip>
                        </span>

                    </span>
                    <span
                        v-if="user_card_mobile_contracts.contract_phone_contracts.count || user_card_mobile_contracts.bank_phone_contracts.count || user_card_mobile_contracts.linkman_phone_contracts.count"
                        class="red" @click="showHistoryContracts('user_card_mobile_contracts')">
                            匹配合同数:({{user_card_mobile_contracts.contract_phone_contracts.count}},{{user_card_mobile_contracts.bank_phone_contracts.count}},{{user_card_mobile_contracts.linkman_phone_contracts.count}})
                    </span>
                    <span v-else class="disabled">
                            匹配合同数:({{user_card_mobile_contracts.contract_phone_contracts.count}},{{user_card_mobile_contracts.bank_phone_contracts.count}},{{user_card_mobile_contracts.linkman_phone_contracts.count}})
                    </span>
                </div>
                <br/>
                <br/>
                <div class="hfq-li" style="margin-right: 30px;min-width: 500px;">
                    <span><span class="gray"><el-badge is-dot :hidden="isFiledNameChange('user_linkman_mobile')">紧急联系人手机</el-badge></span>{{riskTenantMsg.user_linkman_mobile}}</span>
                    <span>
                        <el-tooltip class="item" effect="dark" content="与经纪人手机号一致！" placement="top">
                            <img v-show="user_linkman_mobile_is_broker" class="icon" src="../../assets/img/icon.png"
                                 alt="">
                        </el-tooltip>
                    </span>
                    <span
                        v-if="user_linkman_mobile_contracts.contract_phone_contracts.count || user_linkman_mobile_contracts.bank_phone_contracts.count || user_linkman_mobile_contracts.linkman_phone_contracts.count"
                        class="red"
                        @click="showHistoryContracts('user_linkman_mobile_contracts')">匹配合同数:({{user_linkman_mobile_contracts.contract_phone_contracts.count}},{{user_linkman_mobile_contracts.bank_phone_contracts.count}},{{user_linkman_mobile_contracts.linkman_phone_contracts.count}})
                    </span>
                    <span v-else class="disabled"
                    >匹配合同数:({{user_linkman_mobile_contracts.contract_phone_contracts.count}},{{user_linkman_mobile_contracts.bank_phone_contracts.count}},{{user_linkman_mobile_contracts.linkman_phone_contracts.count}})
                    </span>
                </div>

                <div v-if="inProgressContracts" class="hfq-li red hfq-cursor" @click="showInprocessTable = true">
                    <span>身份证匹配的合同数</span>{{inProgressContracts}}
                </div>
                <div v-else class="hfq-li disabled">
                    <span>身份证匹配的合同数</span>{{inProgressContracts}}
                </div>

            </div>

            <div class="hfq-title gray"> 租客信用评分 <span style="font-size:12px;">（来源于同盾信息）</span> </div>
            <div class="hfq-table">
                <el-table :data="tongdunData" :row-class-name="tableRowClassName">
                    <el-table-column prop="seq_id" label="同盾编号" :resizable="false"></el-table-column>
                    <el-table-column prop="final_score" label="信用分" width="120" :resizable="false"></el-table-column>
                    <el-table-column prop="final_decision_value" label="评估结果/调用详情" min-width="120"
                                     :resizable="false"></el-table-column>
                    <el-table-column prop="how_do" label="处理方法" width="120"></el-table-column>
                    <el-table-column label="操作" min-width="120">
                        <template scope="scope">
                            <hfq-checkbox v-model="model" v-for="tag in tongdunTags" :label="tag.value"
                                          :key="tag">
                                {{tag.label}}
                            </hfq-checkbox>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div class="hfq-title gray">租客黑名单记录</div>
            <div class="hfq-table">
                <el-table :data="blacklistData" :row-class-name="tableRowClassName">
                    <el-table-column class="red" prop="applied_at" label="申请时间" width="116" :resizable="false"></el-table-column>
                    <el-table-column class="red" prop="loan_type" label="贷款类型" width="120" :resizable="false"></el-table-column>
                    <el-table-column class="red" prop="confirmed_at" label="不良记录确认时间" width="144"
                                     :resizable="false"></el-table-column>
                    <el-table-column class="red" prop="confirm_type_value" label="记录类型" width="120"></el-table-column>
                    <el-table-column class="red" prop="reason_code" label="细节"></el-table-column>
                    <el-table-column class="red" prop="how_do" label="处理方法" width="120"></el-table-column>
                    <el-table-column label="操作" min-width="120">
                        <template scope="scope">
                            <hfq-checkbox v-model="model" v-for="tag in blacklistTags" :label="tag.value"
                                          :key="tag">
                                {{tag.label}}


                            </hfq-checkbox>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div class="hfq-title gray"> 信息留存 <span style="font-size:12px;">（因为信用评分拒绝租客时，请将查询的同盾信息截图，上传到此处）</span></div>
            <div class="hfq-upload">
                <el-upload
                    :action="imgAction"
                    list-type="picture-card"
                    :file-list="rcImgList"
                    :before-upload="beforeUpload"
                    :on-success="upImgSuccess"
                    :on-error="upImgError"
                    :on-preview="handlePreview"
                    accept="image/gif,image/jpg,image/jpeg,image/bmp,image/png"
                    :data="uploadReqBody"
                    name="img"
                >
                    <i class="el-icon-plus"></i>
                </el-upload>
            </div>
        </div>

        <!-- 风控图片弹框 -->
        <hfq-dialog-carousel tags-position-type="display" v-model="dialogCarouselForm"
                             :data="dialogCarouselData"></hfq-dialog-carousel>

        <!-- 合同历史弹框 -->
        <hfq-dialog-tabs-table title="历史合同" v-model="tabsTableForm" :data="tabsTableData"
                               :page-size="4"></hfq-dialog-tabs-table>

        <!-- 租客合同数弹框 -->
        <hfq-dialog-table v-model="showInprocessTable" title="身份证匹配的合同数" :data="inProcessData" :page-size="5">
            <template slot="description">
                <div class="hfq-cell">
                    <div class="hfq-cell-hd">总计</div>
                    <div class="hfq-cell-bd">{{inProgressContracts}}</div>
                </div>
            </template>
            <template slot="table-item">
                <el-table-column prop="contract_no" label="合同编号" width="130"></el-table-column>
                <el-table-column prop="contract_status_value" label="合同状态" width="90"></el-table-column>
                <el-table-column prop="rc_status_value" label="审核状态" width="90"></el-table-column>
                <el-table-column prop="user_name" label="租客姓名" width="90"></el-table-column>
                <el-table-column prop="user_id_no" label="身份证号" width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="address" label="房源地址" width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="sign_time" label="签约日期" width="110"></el-table-column>
                <el-table-column prop="monthly_amount" label="租金" width="90"></el-table-column>
                <el-table-column prop="lease_begin" label="开始时间" width="110"></el-table-column>
                <el-table-column prop="lease_end" label="结束时间" width="110"></el-table-column>
                <el-table-column label="操作" width="90">
                    <template scope="scope">
                        <a :href="handleAudit(scope.row)" target="_blank">
                            <el-button type="text">查看</el-button>
                        </a>
                    </template>
                </el-table-column>

            </template>
        </hfq-dialog-table>
    </div>
</template>

<script>

    import vueMethods from 'components/vueMethods'
    export default{
        name: 'hfq-riskManage-strategy',
        mixins: [vueMethods],
        props: {
            value: {
                type: Array,
                default(){
                    return []
                }
            }
        },
        data() {
            return {
                // 用户账户手机号匹配合同数
                user_mobile_contracts: {
                    bank_phone_contracts: {
                        count: 0,
                        list: []
                    },
                    contract_phone_contracts: {
                        count: 0,
                        list: []
                    },
                    linkman_phone_contracts: {
                        count: 0,
                        list: []
                    }
                },
                rcStatus:'',
                // 用户银行预留手机号匹配合同数
                user_card_mobile_contracts: {
                    bank_phone_contracts: {
                        count: 0,
                        list: []
                    },
                    contract_phone_contracts: {
                        count: 0,
                        list: []
                    },
                    linkman_phone_contracts: {
                        count: 0,
                        list: []
                    }
                },
                // 用户紧急联系人手机号匹配合同数
                user_linkman_mobile_contracts: {
                    bank_phone_contracts: {
                        count: 0,
                        list: []
                    },
                    contract_phone_contracts: {
                        count: 0,
                        list: []
                    },
                    linkman_phone_contracts: {
                        count: 0,
                        list: []
                    }
                },
                // 同盾信息
                tongdunData: [],
                tongdunTags: [],
                // 黑名单
                blacklistData: [],
                blacklistTags: [],
                // 图片上传的服务器地址
                imgAction: 'http://www.huizhaofang.com/file/api/uploadImageEx/',
                // 文件上传的参数
                uploadReqBody: {},
                showDialog: false,
                activeName: 'user',
                // 已经点击过的合同
                visitedContracts: [],
                tabsTableData: [
                    // 租客手机号匹配
                    {
                        title: '',
                        tableData: []
                    },
                    // 银行预留手机号匹配
                    {
                        title: '',
                        tableData: [],
                    },
                    // 紧急联系人手机号匹配
                    {
                        title: '',
                        tableData: []
                    }
                ],
                tabsTableForm: {
                    showDialog: false,
                    activeIndex: 0
                },
                //风控策略下面的租客信息
                riskTenantMsg: {},
                // 风控图片URL
                upRcImgUrl: '',
                // 风控图片列表
                rcImgList: [],
                // 图片查看弹框的数据
                dialogCarouselData: {
                    imgUrls: [],
                    tags: []
                },
                // 图片查看弹框的表单
                dialogCarouselForm: {
                    initialIndex: 0,
                    showDialog: false,
                    tags: []
                },
                user_card_mobile_is_broker:false,
                user_mobile_is_broker:false,
                user_linkman_mobile_is_broker:false,
                // 租客的合同数
                inProgressContracts : 0,
                // 租客合同数数据
                inProcessData: [],
                showInprocessTable: false
            }
        },
        watch: {},
        computed: {
            model: {
                get(){
                    return this.value
                },
                set(val){
                    this.$emit('input', val);
                }
            }
        },
        methods: {
            //图片上传成功方法
            upImgSuccess(response, file, flieList) {
                this.upRcImgUrl = response.result.path;
                let contractNo = this.utils.getUrlParam('contractNo');
                let $axios = this.$axios;
                $axios.post(`/v2/api/audit/rc/image`, {
                    contract_no: contractNo,
                    file_path: this.upRcImgUrl
                }).then((result) => {
                    this.rcImgList.push({
                        url: file.response.result.source_path
                    });
                })
            },
            beforeUpload(file){
                Object.assign(this.uploadReqBody, {
                    types: 4,
                    img: file.name
                })
            },
            upImgError(){
                this.$message.error('图片上传失败');
            },
            // 预览图片
            handlePreview(file){
                let initialIndex = 0;
                this.dialogCarouselData.imgUrls = [];
                this.rcImgList.forEach((item, index) => {
                    if (item.url === file.url) {
                        initialIndex = index;
                    }
                    this.dialogCarouselData.imgUrls.push(item.url);
                });
                Object.assign(this.dialogCarouselForm, {
                    initialIndex: initialIndex,
                    showDialog: true,
                    isFirst: true
                });
            },
            // 查询手机号
            query(phone) {
                if (!phone) {
                    return this.$message.info('手机号为空');
                }
                window.open('https://www.so.com/s?q=' + phone);
            },
            // 显示弹框
            showHistoryContracts(name) {
                this.tabsTableForm = {
                    showDialog: true,
                    activeIndex: String(0)
                };
                //租客手机号匹配合同数
                this.tabsTableData[0].title = '用户手机号匹配合同数(' + this[name].contract_phone_contracts.count + ')';
                this.tabsTableData[0].tableData = this[name].contract_phone_contracts.list;
                // 银行预留手机号匹配合同数
                this.tabsTableData[1].title = '银行预留手机号匹配(' + this[name].bank_phone_contracts.count + ')';
                this.tabsTableData[1].tableData = this[name].bank_phone_contracts.list;
                //紧急联系人匹配合同数
                this.tabsTableData[2].title = '紧急联系人手机号匹配(' + this[name].linkman_phone_contracts.count + ')';
                this.tabsTableData[2].tableData = this[name].linkman_phone_contracts.list;
            },
            initComponentTags(){
                let examineTags = this.$store.state.examineTags;
                // 同盾信息
                this.getExamineTagsFromAreaId(17, examineTags).forEach(tag => {
                    this.tongdunTags.push({
                        label: tag.f_name,
                        value: tag.f_id,
                        group: 0
                    })
                })
                // 黑名单
                this.getExamineTagsFromAreaId(16, examineTags).forEach(tag => {
                    this.blacklistTags.push({
                        label: tag.f_name,
                        value: tag.f_id,
                        group: 0
                    })
                })
            },
            globalAjaxSuccess() {
                //初始化组件
                this.initComponentTags();
                let contractNo = this.utils.getUrlParam('contractNo');
                let $axios = this.$axios;
                let $this = this;
                $axios.all([
                    $axios.get(`/v2/api/contracts/signusers/${contractNo}`),
                    $axios.get(`/v2/api/users/${contractNo}`),
                    $axios.get(`/v2/api/audit/rc/blacklist/${contractNo}`),
                    $axios.get(`/v2/api/audit/rc/tongdun/${contractNo}`),
                    $axios.get(`/v2/api/audit/rc/repeated/${contractNo}`),
                    $axios.get(`/v2/api/audit/rc/image?contract_no=${contractNo}`),
                    // 获取履行中的合同数
                    $axios.get(`/v2/api/audit/rc/repeated/${contractNo}`)
                ])
                    .then($axios.spread((perms1, perms2, perms3, perms4, perms5, perms6, perms7) => {
                        //当这两个请求都完成的时候会触发这个函数，两个参数分别代表返回的结果
                        this.riskTenantMsg = Object.assign({}, perms1.data, perms2.data);
                        this.blacklistData = perms3.data.results;
                        this.tongdunData.push(perms4.data.results);

                        // 根据手机号匹配合同号
                        this.user_mobile_contracts = perms5.data.user_mobile_contracts;
                        this.user_card_mobile_contracts = perms5.data.user_card_mobile_contracts;
                        this.user_linkman_mobile_contracts = perms5.data.user_linkman_mobile_contracts;
                        // 与经纪人手机号一致！
                        perms5.data.user_card_mobile_is_broker ? this.user_card_mobile_is_broker = true : this.user_card_mobile_is_broker = false;
                        perms5.data.user_mobile_is_broker ? this.user_mobile_is_broker = true : this.user_mobile_is_broker = false;
                        perms5.data.user_linkman_mobile_is_broker ? this.user_linkman_mobile_is_broker = true : this.user_linkman_mobile_is_broker = false;
                        // 渲染风控图片
                        $this.rcImgList = perms6.data.results;
                        $this.rcImgList.map(function (item, i) {
                            $this.rcImgList[i].url = item.file_path;
                        })

                        // 履行中的合同数
                        this.inProcessData = perms7.data.user_id_no_contracts.id_card_contracts.list;
                        this.inProgressContracts = perms7.data.user_id_no_contracts.id_card_contracts.count;
                    }))
            },
            tableRowClassName(row, index) {
                if(this.rcStatus !== '2' && row.how_do === '审核拒绝'){
                    return 'info-row';
                }
                return '';
            },
            // 查看合同
            handleAudit(row){
                let lease_type = this.utils.getLeaseType(row.lease_type);
                let rc_status = Math.floor(Number(row.rc_status)/100);
                // url中的参数
                let params = {
                    contractNo: row.contract_no,
                    leaseType: row.lease_type,
                    rcStatus: rc_status,
                    agencyId: row.agency_id
                }
                let isProduction = process.env.NODE_ENV === 'production';
                let dist = isProduction ? 'dist/' : '';
                if(lease_type === 'B' && rc_status === 2){
                    // 如果为B端二审状态，则进入二审页面
                    return `/${dist}${this.utils.urlEncode(params)}#/riskManage/phoneCheckDetail`;
                }else{
                    return `/${dist}${this.utils.urlEncode(params)}#/riskManage/auditDetail`;
                }
            }
        },
        created(){
            this.rcStatus = this.utils.getUrlParam('rcStatus').slice(0,1);
        }
    }
</script>

<style lang="less">
    @import '../theme.less';

    .hfq-riskManage-strategy {

        .hfq-li {
            display: inline-block;
            height: 14px;
        }

        .hfq-li .gray {
            margin-right: 8px;
            color:#999;
        }

        .hfq-ul span.red {
            cursor: pointer;
        }

        .el-button {
            margin-right: 4px;
            padding: 0;
        }

        .hfq-li > span {
            margin-right: 1px;
        }

        .hfq-title {
            margin: 20px 0 8px;
        }

        .el-upload-list--picture-card .el-upload-list__item-actions .el-upload-list__item-delete {
            display: none;
        }
        .el-table .info-row .cell {
            color: red;
        }
        .differenceMobile{
            position: relative;
        }
        .icon{
            width: 14px;
            vertical-align: top;
            margin-right: 2px;
            cursor: pointer;
        }

        /*自定义样式*/
        .el-upload--picture-card {
            width: 100px;
            height: 100px;
            line-height: 107px;
            margin: 0 8px 0px 0
        }
        .el-upload-list--picture-card .el-upload-list__item {
            width: 100px;
            height: 100px;
            border: none;
        }
        .disabled{
            color: #C0CCDA;
        }
    }
</style>

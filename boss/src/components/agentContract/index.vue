<!-- 5-代理合同 -->
<template>
    <div class="hfq-agent-contract hfq-component">
        <!-- examine类型 -->
        <template v-if="type === 'examine'">
            <!-- B端合同 -->
            <template v-if="contractType === 'B'">
                <!-- 免代理合同 -->
                <template v-if="!isNeedContract">
                    <div class="hfq-component-title">代理合同 <span class="tip"><img class="is_free" src="../../assets/img/label_green.png" alt=""></span></div>
                </template>

                <!-- 不免代理合同 -->
                <template v-if="isNeedContract">

                    <!-- 调用 -->
                    <template v-if="isCallContract">
                        <div class="hfq-component-title">代理合同 <span class="tip"><img class="is_free" src="../../assets/img/label_red.png" alt=""></span>
                            <el-button style="float:right;padding:0" class="m-btn" v-show="showContent" type="text" @click="showContent = false">收起
                            </el-button>
                            <el-button style="float:right;padding:0"   class="m-btn" v-show="!showContent" type="text" @click="showContent = true">展开
                            </el-button>
                            <div class="hfq-cell">
                                <div class="hfq-cell-hd">
                                    租期时间段
                                    <span style="color: #1F2D3D;">
                                        {{contractDetail.lease_begin}} 至 {{contractDetail.lease_end}}</span>
                                    <span style="color: #ff4949;vertical-align: top;margin-left: 5px;" v-if="contractDetail.isOver">
                                        <el-tooltip class="item" effect="dark" content="租期时间范围超出代理时间范围" placement="top">
                                                <img class="icon" src="../../assets/img/icon.png" alt="">
                                        </el-tooltip>
                                    </span>
                                    <span style="margin-left: 20px;"></span>
                                    代理时间段
                                    <span style="color: #1F2D3D;">
                                         {{contractDetail.f_lease_begin_date}} 至 {{contractDetail.f_lease_end_date}}
                                    </span>
                                    <a style="margin:0 10px;" :href="`/html/dailihetong-datail.html?contract_no=${contractDetail.f_ac_no}&contractStatus1=view`" target="_blank">
                                        <el-button type="text">查看代理合同</el-button>
                                    </a>
                                    <div class="hfq-tags" style="display: inline-block;width:auto;">
                                        <hfq-checkbox v-model="titleForm" v-for="tag in titleTags"
                                                      :label="tag.value"
                                                      :key="tag">{{tag.label}}
                                        </hfq-checkbox>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div class="hfq-component-content examine animated hfq-slideInUp" v-show="showContent">
                            <!-- 业主身份证 -->
                            <div class="photo-content">
                                <keep-alive>
                                    <hfq-dialog-carousel v-model="idcardForm" tags-position-type="display"
                                                         :data="idcardData"></hfq-dialog-carousel>
                                </keep-alive>
                                <div class="photo-type">
                        <span class="gray">
                            <el-badge is-dot :hidden="isFiledNameChange('f_owner_poc')">业主身份证</el-badge>
                        </span>
                                    <el-radio-group v-model="model.idcardType">
                                        <el-radio :label="1" disabled>有</el-radio>
                                        <el-radio :label="2" disabled>无(非本人)</el-radio>
                                    </el-radio-group>
                                </div>
                                <div class="photo-img-group">
                                    <img v-for="(url,index) in idcardData.imgUrls"
                                         @click="setActiveItem(index,idcardData,idcardForm)"
                                         :src="url" class="img-item">
                                </div>
                            </div>

                            <!-- 房产证 -->
                            <div class="photo-content">
                                <keep-alive>
                                    <hfq-dialog-carousel v-model="houseForm" tags-position-type="display"
                                                         :data="houseData"></hfq-dialog-carousel>
                                </keep-alive>
                                <div class="photo-type">
                        <span class="gray">
                            <el-badge is-dot :hidden="isFiledNameChange('f_owner_contract')">房产证</el-badge>
                        </span>
                                    <el-radio-group v-model="model.housePaperType">
                                        <el-radio :label="1" disabled>有</el-radio>
                                        <el-radio :label="2" disabled>保证函</el-radio>
                                        <el-radio :label="3" disabled>无</el-radio>
                                    </el-radio-group>
                                </div>
                                <div class="photo-img-group">
                                    <img v-for="(url,index) in houseData.imgUrls"
                                         @click="setActiveItem(index,houseData,houseForm)"
                                         :src="url"
                                         class="img-item">
                                </div>
                            </div>

                            <!-- 代理合同 -->
                            <div class="photo-content">
                                <keep-alive>
                                    <hfq-dialog-carousel v-model="agentContractForm" tags-position-type="display"
                                                         :data="agentContractData"></hfq-dialog-carousel>
                                </keep-alive>
                                <div class="photo-type">
                        <span class="gray">
                            <el-badge is-dot :hidden="isFiledNameChange('f_agency_contract')">代理合同</el-badge>
                        </span>
                                    <el-radio-group v-model="model.agentContractType">
                                        <el-radio :label="1" disabled>明押</el-radio>
                                        <el-radio :label="2" disabled>暗押</el-radio>
                                        <el-radio :label="3" disabled>无</el-radio>
                                    </el-radio-group>
                                </div>
                                <div class="photo-img-group">
                                    <img v-for="(url,index) in agentContractData.imgUrls"
                                         @click="setActiveItem(index,agentContractData,agentContractForm)" :src="url"
                                         class="img-item">
                                </div>
                            </div>
                        </div>

                    </template>

                    <!-- 非调用 -->
                    <template v-if="!isCallContract">
                        <div class="hfq-component-title">代理合同
                            <span class="tip"><img class="is_free" src="../../assets/img/label_red.png" alt=""></span>
                        </div>
                        <template v-if="type === 'examine' && showContent">

                            <div class="hfq-component-content examine animated hfq-slideInUp" v-show="showContent">

                                <!-- 业主身份证 -->
                                <div class="photo-content">
                                    <keep-alive>
                                        <hfq-dialog-carousel v-model="idcardForm" tags-position-type="mix"
                                                             :data="idcardData"></hfq-dialog-carousel>
                                    </keep-alive>
                                    <div class="photo-type">
                        <span class="gray">
                            <el-badge is-dot :hidden="isFiledNameChange('f_owner_poc')">业主身份证</el-badge>
                        </span>
                                        <el-radio-group v-model="model.idcardType">
                                            <el-radio :label="1">有</el-radio>
                                            <el-radio :label="2">无(非本人)</el-radio>
                                        </el-radio-group>
                                    </div>
                                    <div class="photo-img-group">
                                        <img v-for="(url,index) in idcardData.imgUrls"
                                             @click="setActiveItem(index,idcardData,idcardForm)"
                                             :src="url" class="img-item">
                                    </div>
                                    <div class="hfq-tags">
                                        <hfq-checkbox v-model="idcardForm.tags" v-for="tag in idcardData.tags"
                                                      :label="tag.value"
                                                      :key="tag">
                                            {{tag.label}}



                                        </hfq-checkbox>
                                    </div>
                                </div>

                                <!-- 房产证 -->
                                <div class="photo-content">
                                    <keep-alive>
                                        <hfq-dialog-carousel v-model="houseForm" tags-position-type="mix"
                                                             :data="houseData"></hfq-dialog-carousel>
                                    </keep-alive>
                                    <div class="photo-type">
                        <span class="gray">
                            <el-badge is-dot :hidden="isFiledNameChange('f_owner_contract')">房产证</el-badge>
                        </span>
                                        <el-radio-group v-model="model.housePaperType">
                                            <el-radio :label="1">有</el-radio>
                                            <el-radio :label="2">保证函</el-radio>
                                            <el-radio :label="3">无</el-radio>
                                        </el-radio-group>
                                    </div>
                                    <div class="photo-img-group">
                                        <img v-for="(url,index) in houseData.imgUrls"
                                             @click="setActiveItem(index,houseData,houseForm)"
                                             :src="url"
                                             class="img-item">
                                    </div>
                                    <div class="hfq-tags">
                                        <hfq-checkbox v-model="houseForm.tags" v-for="tag in houseData.tags"
                                                      :label="tag.value"
                                                      :key="tag">
                                            {{tag.label}}



                                        </hfq-checkbox>
                                    </div>
                                </div>

                                <!-- 代理合同 -->
                                <div class="photo-content">
                                    <keep-alive>
                                        <hfq-dialog-carousel v-model="agentContractForm" tags-position-type="mix"
                                                             :data="agentContractData"></hfq-dialog-carousel>
                                    </keep-alive>
                                    <div class="photo-type">
                        <span class="gray">
                            <el-badge is-dot :hidden="isFiledNameChange('f_agency_contract')">代理合同</el-badge>
                        </span>
                                        <el-radio-group v-model="model.agentContractType">
                                            <el-radio :label="1">明押</el-radio>
                                            <el-radio :label="2">暗押</el-radio>
                                            <el-radio :label="3">无</el-radio>
                                        </el-radio-group>
                                    </div>
                                    <div class="photo-img-group">
                                        <img v-for="(url,index) in agentContractData.imgUrls"
                                             @click="setActiveItem(index,agentContractData,agentContractForm)"
                                             :src="url"
                                             class="img-item">
                                    </div>
                                    <div class="hfq-tags">
                                        <hfq-checkbox v-model="agentContractForm.tags"
                                                      v-for="tag in agentContractData.tags"
                                                      :label="tag.value"
                                                      :key="tag">{{tag.label}}


                                        </hfq-checkbox>
                                    </div>
                                </div>

                            </div>

                        </template>
                    </template>
                </template>

            </template>

            <!-- C端合同 -->
            <template v-if="contractType === 'C'">
                <div class="hfq-component-title">代理合同</div>
                <template v-if="type === 'examine' && showContent">
                    <el-row type="flex" align="top" justify="start">
                        <el-col :span="14">
                            <el-row type="flex" align="top" justify="start" >
                                <el-col>
                                    <div class="hfq-component-content examine animated hfq-slideInUp">
                                        <!-- 工作证明/在校资质证明 -->
                                        <div class="photo-content">
                                            <keep-alive>
                                                <hfq-dialog-carousel v-model="jobCardForm" tags-position-type="mix"
                                                                     :data="jobCardData"></hfq-dialog-carousel>
                                            </keep-alive>
                                            <span class="gray hfq-cell">
                                                <el-badge is-dot :hidden="isFiledNameChange('f_agency_contract')">工作证明/在校资质证明</el-badge>
                                            </span>
                                            <div class="photo-img-group">
                                                <img v-for="(url,index) in jobCardData.imgUrls" :src="url" class="img-item"
                                                     @click="setActiveItem(index,jobCardData,jobCardForm)">
                                            </div>
                                            <div class="hfq-tags">
                                                <hfq-checkbox v-model="jobCardForm.tags" v-for="tag in jobCardData.tags"
                                                              :label="tag.value"
                                                              :key="tag">
                                                    {{tag.label}}

                                                </hfq-checkbox>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="8">
                            <div class="hfq-cell" style="margin-top:15px;">
                                <div><b class="hfq-cell-hd">核对信息</b></div>
                            </div>
                            <div class="hfq-cell">
                                <div class="hfq-cell-hd">
                                    <el-badge is-dot :hidden="isFiledNameChange('user_company_name')">租客单位名称</el-badge>
                                </div>
                                <div class="hfq-cell-bd">{{usersInfo.user_company_name}}</div>
                            </div>
                            <div class="hfq-cell">
                                <div class="hfq-cell-hd">
                                    <el-badge is-dot :hidden="isFiledNameChange('user_company_address')">租客单位地址</el-badge>
                                </div>
                                <div class="hfq-cell-bd">{{usersInfo.user_company_address}}</div>
                            </div>
                            <div class="hfq-cell">
                                <div class="hfq-cell-hd">
                                    <el-badge is-dot :hidden="isFiledNameChange('user_company_mail')">租客公司邮箱</el-badge>
                                </div>
                                <div class="hfq-cell-bd">{{usersInfo.user_company_mail}}</div>
                            </div>
                            <div class="hfq-cell">
                                <div class="hfq-cell-hd">
                                    <el-badge is-dot :hidden="isFiledNameChange('user_job')">租客职务</el-badge>
                                </div>
                                <div class="hfq-cell-bd">{{usersInfo.user_job}}</div>
                            </div>
                        </el-col>


                    </el-row>


                </template>

            </template>
        </template>

        <!-- display类型 -->
        <template v-if="type === 'display'">

        </template>
        <!-- upload类型 -->
        <template v-if="type === 'upload'">

        </template>
    </div>
</template>

<script>
    import vueMethods from 'components/vueMethods'
    export default{
        name: 'hfq-agent-contract',
        mixins: [vueMethods],
        props: {
            /* 三种类型，display: 查看模式；upload:上传模式；examine:审核模式*/
            type: {
                type: String,
                default: 'display'
            },
            value: {
                type: Object,
                default: function () {
                    return {
                        // 身份证类型
                        idcardType: '',
                        // 房产证类型
                        housePaperType: '',
                        // 代理合同的类型
                        agentContractType: '',
                        tags: [],
                        // 是否需要校验单选框
                        isNeed: false
                    }
                }
            }
        },
        data(){
            return {
                // 房源/标题标签
                titleTags: [],
                titleForm: [],
                // 业主身份证照片信息
                idcardData: {
                    imgUrls: [],
                    tags: []
                },
                // 身份证照片表单
                idcardForm: {
                    initialIndex: 0,
                    showDialog: false,
                    tags: []
                },
                // 房产证信息
                houseData: {
                    imgUrls: [],
                    tags: []
                },
                // 房产证信息表单
                houseForm: {
                    initialIndex: 0,
                    showDialog: false,
                    tags: []
                },
                // 代理合同信息
                agentContractData: {
                    imgUrls: [],
                    tags: []
                },
                // 代理合同表单
                agentContractForm: {
                    initialIndex: 0,
                    showDialog: false,
                    tags: []
                },
                // 工作证明信息
                jobCardData: {
                    imgUrls: [],
                    tags: []
                },
                // 工作证明表单
                jobCardForm: {
                    initialIndex: 0,
                    showDialog: false,
                    tags: []
                },
                contractNo: '',
                // 合同类型
                contractType: '',
                // 是否免代理合同
                isNeedContract: false,
                // 是否调用代理合同
                isCallContract: false,
                contractDetail:{
                    f_ac_no:'',
                    // 起租日
                    lease_begin:'',
                    lease_end:'',
                    // 代理合同时间
                    f_lease_begin_date:'',
                    f_lease_end_date:'',
                    // 是否超期
                    isOver: false
                },
                // 是否显示内容区
                showContent: true,
                isAgencyTime : {},
                usersInfo : {}
            }
        },
        computed: {
            model: {
                get(){
                    return this.value !== undefined ? this.value : {}
                },
                set(val){
                    this.$emit('input', val);
                }
            },
        },
        watch: {
            idcardForm: {
                handler(){
                    this.setModelTags();
                },
                deep: true
            },
            houseForm: {
                handler(){
                    this.setModelTags();
                },
                deep: true
            },
            agentContractForm: {
                handler(){
                    this.setModelTags();
                },
                deep: true
            },
            jobCardForm: {
                handler(){
                    this.setModelTags();
                },
                deep: true
            },
            titleForm(){
                this.setModelTags();
            },
        },
        methods: {
            // 显示轮播图,设置轮播图的第一页
            setActiveItem(index, data, form){
                form.initialIndex = index;
                form.showDialog = true;
            },
            // 初始化图片数据
            initComponentImg(){
                let contractNo = this.contractNo;
                this.$axios.all([
                    this.$axios.get(`/v2/api/contracts/images/${contractNo}`),
                ]).then(this.$axios.spread((res1, res2) => {
                    this.idcardData.imgUrls = res1.data.f_owner_poc;
                    this.houseData.imgUrls = res1.data.f_owner_contract;
                    this.agentContractData.imgUrls = res1.data.f_agency_contract;
                    this.jobCardData.imgUrls = res1.data.f_agency_contract;
                }))
            },
            // 初始化数据
            initComponentData(){
                let contractNo = this.contractNo;
                this.$axios.all([
                    this.$axios.get(`/v2/api/contracts/agencies/${contractNo}`),
                    this.$axios.get(`/v2/api/contracts/${contractNo}`),
                    this.$axios.get(`/v2/api/users/${contractNo}`)
                ]).then(this.$axios.spread((res1,res2,res3) => {
                    this.usersInfo = res3.data;
                    this.isCallContract = res1.data.f_ac_no !== '';
                    this.isNeedContract = !res1.data.f_exempt_agent;
                    this.model.idcardType = res1.data.f_owner_id_flag;
                    this.model.housePaperType = res1.data.f_owner_cert_flag;
                    this.model.agentContractType = res1.data.f_lease_type;
                    this.contractDetail = {
                        f_ac_no:res1.data.f_ac_no,
                        lease_begin:res2.data.lease_begin,
                        lease_end:res2.data.lease_end,
                        f_lease_begin_date:res1.data.f_lease_begin_date,
                        f_lease_end_date:res1.data.f_lease_end_date,
                        isOver: this.isOverTime(res2.data.lease_begin,res2.data.lease_end,res1.data.f_lease_begin_date,res1.data.f_lease_end_date)
                    };
                    this.showContent = !(this.contractType === 'B' && this.isNeedContract && this.isCallContract);
                    this.model.isNeed = this.contractType === 'B' && this.isNeedContract && !this.isCallContract;
                }))
            },
            // 初始化标签
            initComponentTags(){
                let examineTags = this.$store.state.examineTags;

                // 房源标签
                this.titleTags = [];
                this.getExamineTagsFromAreaId(12, examineTags).forEach(tag => {
                    this.titleTags.push({
                        label: tag.f_name,
                        value: tag.f_id
                    })
                });

                // 业主身份证
                this.idcardData.tags = [];
                this.getExamineTagsFromAreaId(10, examineTags).forEach(tag => {
                    this.idcardData.tags.push({
                        label: tag.f_name,
                        value: tag.f_id
                    })
                });

                // 业主房产证
                this.houseData.tags = [];
                this.getExamineTagsFromAreaId(9, examineTags).forEach(tag => {
                    this.houseData.tags.push({
                        label: tag.f_name,
                        value: tag.f_id
                    })
                });

                // 业主代理合同,工作证明/实习证明
                this.agentContractData.tags = [];
                this.jobCardData.tags = [];
                this.getExamineTagsFromAreaId(11, examineTags).forEach(tag => {
                    this.agentContractData.tags.push({
                        label: tag.f_name,
                        value: tag.f_id
                    });
                    this.jobCardData.tags.push({
                        label: tag.f_name,
                        value: tag.f_id
                    })
                });
            },
            // 全局请求
            globalAjaxSuccess(){
                // 初始化数据
                this.contractNo = this.utils.getUrlParam('contractNo');
                this.contractType = this.utils.getLeaseType();
                this.initComponentData();
                this.initComponentImg();
                this.initComponentTags();
            },
            setModelTags(){
                this.model.tags = [...this.idcardForm.tags, ...this.houseForm.tags, ...this.agentContractForm.tags,...this.jobCardForm.tags,...this.titleForm];
            },
            // 组件表单验证
            validComponent(){
                // 是否需要验证代理合同的单选框
                if(this.model.isNeed) {
                    if (!this.model.idcardType) {
                        this.$message.error('请选择业主身份证类型');
                        return false
                    } else if (!this.model.housePaperType) {
                        this.$message.error('请选择房产证类型');
                        return false
                    } else if (!this.model.agentContractType) {
                        this.$message.error('请选择代理合同类型');
                        return false
                    }
                }
                return true
            },
            /* 时间段是否超期的判断,
            * @param time1 <String> 租期开始时间，格式'2017-04-12'
            * @param time2 <String> 租期结束时间，格式'2017-04-12'
            * @param time3 <String> 代理合同开始时间，格式'2017-04-12'
            * @param time4 <String> 代理合同结束时间，格式'2017-04-12'
            * @return <Boolen> true 没有超期；false 超期
            * */
            isOverTime(time1,time2,time3,time4){
                if(time1 && time2 && time3 && time4){
                    return !(this.utils.compareTime(time1, time3) && this.utils.compareTime(time4, time2))
                }else {
                    return false
                }
            }
        }
    }

</script>

<style lang="less">
    @import '../theme.less';

    .hfq-agent-contract {
        .hfq-component-title .m-btn {
            margin: 0 18px;
        }
        /* 图片区域容器 */
        .photo-content + .photo-content {
            margin-top: 39px;
        }
        /* 单选框 */
        .photo-type {
            margin-bottom: 8px;
        }
        .photo-type > span {
            margin-right: 18px;
        }
        /* 照片区 */
        .photo-img-group {
            font-size: 0;
        }
        .photo-img-group .img-item {
            width: 100px;
            height: 100px;
            border-radius: 4px;
            margin-right: 12px;
        }
        .hfq-component-title .tip {
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #FF4949;
            line-height: 16px;
            font-weight: bold;
            margin-left: 5px;
            vertical-align: baseline;
        }
        .hfq-component-content{
            width: 790px;
        }
        .hfq-tags{
            width: 600px;
        }
        .is_free{
            width: 37px;
            vertical-align:bottom;
        }
        .icon{
            width: 14px;
            vertical-align: middle;
            margin-right: 2px;
            cursor: pointer;
            margin-top: -3px;
        }
    }

</style>

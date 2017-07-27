<!-- 风控审核-审核详情-->
<template>
    <div class="page-examine-detail">
        <!-- 面包屑 -->
        <div class="hfq-breadcrumb-wrap">
            <el-row type="flex" align="middle" class="hfq-breadcrumb-content">
                <el-col>
                    <el-breadcrumb>
                        <el-breadcrumb-item v-if="rcStatus == 1">一审详情</el-breadcrumb-item>
                        <el-breadcrumb-item v-if="rcStatus == 2">二审详情</el-breadcrumb-item>
                        <el-breadcrumb-item v-if="rcStatus == 3">三审详情</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
                <!-- 按钮 -->
                <el-col class="hfq-align-right" v-if="isGetUserJurisdiction">
                    <el-button v-if="userJurisdiction['ic_rc_first.reaudit']" type="primary" @click="open2"
                               class="userJurisdiction">重审
                    </el-button>
                </el-col>
            </el-row>
        </div>

        <!-- 审核历史 -->
        <hfq-check-history></hfq-check-history>
        <!-- 风控策略 -->
        <hfq-risk-manage-strategy v-model="tags.riskManageStrategy"></hfq-risk-manage-strategy>
        <!-- 租客证件 -->
        <hfq-renter-paper v-model="tags.renterPaper" type="examine"></hfq-renter-paper>
        <!-- 代理合同 -->
        <hfq-agent-contract v-model="agentContractResult" type="examine" ref="agentContract"></hfq-agent-contract>
        <!-- 租赁合同 -->
        <hfq-rent-contract v-model="tags.rentContract" type="examine"></hfq-rent-contract>
        <!-- C端二审信息 -->
        <hfq-phone-check-info v-if="leaseType === 'C'" v-model="tags.phoneCheck"></hfq-phone-check-info>
        <!-- 审核提交 -->
        <hfq-check-submit v-model="submitResult" @submit="handlerSubmit" @tags-change="tagsChange"></hfq-check-submit>
    </div>
</template>

<script>
    import vueMethods from 'src/assets/js/vueMethods'
    import store from 'src/vuex/store'

    export default{
        name: 'page-examine-detail',
        mixins: [vueMethods],
        data(){
            return {
                // 租客证件审核结果
                agentContractResult: {
                    // 身份证类型、房产证类型、agentContractType单选框是否必传
                    isNeed: false,
                    // 身份证类型
                    idcardType: '',
                    // 房产证类型
                    housePaperType: '',
                    // 代理合同的类型
                    agentContractType: '',
                    // 标签
                    tags: []
                },
                contractNo: '',
                // 合同类型
                leaseType: '',
                // 合同审核进度
                rcStatus: '',
                // 审核提交表单
                submitResult: {
                    // 审核备注
                    remark: '',
                    tags: []
                },
                // 所有标签的tags
                tags: {
                    // 租客证件
                    renterPaper: [],
                    // 租赁合同
                    rentContract: [],
                    // 会分期合同
                    hfqContract: [],
                    // 代理合同
                    agentContract: [],
                    // 审核提交
                    submitForm: [],
                    // 风控策略
                    riskManageStrategy: [],
                    // 二审信息
                    phoneCheck: []
                },
                // 将要被提交的表单
                submitForm: {
                    // 代理合同类型
                    f_lease_type: '',
                    // 业主身份证标识
                    f_owner_id_flag: '',
                    // 产权证标识
                    f_owner_cert_flag: ''
                },
                // 将要被提交的表单元素tag_ids
                tag_ids: '',
                // 审核权限
                userJurisdiction: {}
            }
        },
        computed: {
            // 审核权限是否请求完毕
            isGetUserJurisdiction(){
                return this.$store.state.isGetUserJurisdiction
            }
        },
        watch: {
            agentContractResult: {
                handler(obj){
                    this.tags.agentContract = obj.tags;
                    this.submitForm.f_lease_type = obj.agentContractType;
                    this.submitForm.f_owner_id_flag = obj.idcardType;
                    this.submitForm.f_owner_cert_flag = obj.housePaperType;
                },
                deep: true
            },
            tags: {
                handler(obj){
                    let tags = [];
                    Object.values(obj).forEach(arr => {
                        tags = [...tags, ...arr]
                    });
                    this.tag_ids = tags;
                },
                deep: true
            },
            tag_ids(val, oldVal){
                if (!Array.isArray(oldVal)) {
                    this.submitResult.remark = this.getTagsFromTagsId(val);
                    return
                }

                if (val.length > oldVal.length) {
                    // 增加
                    let addVal = this.getDiff(val, oldVal);
                    let addStr = this.getTagsFromTagsId(addVal);
                    this.submitResult.remark += addStr;
                } else if (val.length < oldVal.length) {
                    // 减少
                    let cutVal = this.getDiff(val, oldVal);
                    let cutStr = this.getTagsFromTagsId(cutVal).replace(/;/, '');
                    let resultStr = this.submitResult.remark.split(';').filter(item => {
                        return item.indexOf(cutStr) === -1
                    })
                    this.submitResult.remark = resultStr.join(';');
                } else {
                    // 不变
                    this.submitResult.remark = this.getTagsFromTagsId(val);
                }
            },
            isGetUserJurisdiction(){
                Object.assign(this.userJurisdiction, this.$store.state.userJurisdiction);
            }
        },
        methods: {
            handlerSubmit(){
                if (this.tag_ids.length == 0) {
                    this.$message.error('至少选择一个标签');
                    return false
                } else if (!this.$refs['agentContract'].validComponent()) {
                    // 验证代理合同
                    return false
                }

                let param = {
                    tag_ids: this.tag_ids,
                    audit_desc: this.submitResult.remark
                }
                this.$axios.all([
                    this.$axios.patch(`/v2/api/audit/contracts/${this.contractNo}/tags/`, param),
                    this.$axios.patch(`/v2/api/contracts/agencies/${this.contractNo}`, this.submitForm)
                ]).then(this.$axios.spread((res1, res2) => {
                    this.$message.info('提交成功');
                    setTimeout(function () {
                        window.close();
                    }, 2000)
                }))
            },
            tagsChange(arr){
                this.tags.submitForm = arr;
            },
            // 重审
            resetAudit(){
                this.$axios.all([
                    this.$axios.patch(`/v2/api/audit/contracts/${this.contractNo}/reset/`),
                ]).then(this.$axios.spread((res1) => {
                    this.$message.info('重审成功');
                    setTimeout(function () {
                        location.reload();
                    }, 2000)
                }))
            },
            open2() {
                this.$confirm('是否确认重审？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.resetAudit();
                }).catch(() => {});
            },
            // 找出两个数组中不同的值，并返回不同的值
            getDiff(arr1, arr2){
                if (Array.isArray(arr1) && Array.isArray(arr2)) {
                    let diff1 = arr1.filter(item => arr2.findIndex(item2 => item2 === item) === -1);
                    let diff2 = arr2.filter(item => arr1.findIndex(item1 => item1 === item) === -1);
                    return [...diff1, ...diff2]
                } else {
                    console.log("getDiff的参数(arr1,arr2)必须为数组");
                    return []
                }
            }
        },
        created(){
            this.contractNo = this.utils.getUrlParam('contractNo');
            this.leaseType = this.utils.getLeaseType(this.utils.getUrlParam('leaseType'));
            this.rcStatus = this.utils.getUrlParam('rcStatus').slice(0, 1);

            // 设置当前激活菜单
            this.$store.commit('setActiveIndex', '2-2');
        },
        mounted(){
            Object.assign(this.userJurisdiction, this.$store.state.userJurisdiction);
        }
    }
</script>

<style scoped>
    /* 按钮组 */
    .button-group {
        width: 1120px;
        margin: 16px auto;
        font-size: 0;
    }

    .button-group button + button {
        margin-left: 20px;
    }
</style>

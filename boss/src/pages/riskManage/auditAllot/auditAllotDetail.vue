<!-- 审核派单详情 -->
<template>
    <div class="page-audit-allot-detail hfq-list-page">
        <!-- 面包屑 -->
        <div class="hfq-breadcrumb-wrap">
            <el-row type="flex" align="middle" class="hfq-breadcrumb-content">
                <el-col>
                    <el-breadcrumb>
                        <el-breadcrumb-item to="/riskManage/auditAllotList"><i class="el-icon-arrow-left"></i>审核派单</el-breadcrumb-item>
                        <el-breadcrumb-item>审核详情</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
        </div>

        <!-- 内容区 -->
        <main class="hfq-list-page-content">

            <!-- 今日审核数据统计表 -->
            <div style="margin-top: 30px;">
                <div class="hfq-cell-hd hfq-cell-left">
                    今日审核数据统计表
                </div>
            </div>
            <div class="hfq-table-wrap">
                <el-table :data="auditDataList" border>
                    <el-table-column label="一审">
                        <el-table-column prop="101" label="待审核"></el-table-column>
                        <el-table-column prop="102" label="审核中"></el-table-column>
                        <el-table-column prop="104" label="通过"></el-table-column>
                        <el-table-column prop="103" label="不通过"></el-table-column>
                        <el-table-column prop="105" label="拒绝"></el-table-column>
                    </el-table-column>
                    <el-table-column label="二审">
                        <el-table-column prop="201" label="待审核"></el-table-column>
                        <el-table-column prop="202" label="审核中"></el-table-column>
                        <el-table-column prop="204" label="通过"></el-table-column>
                        <el-table-column prop="203" label="不通过"></el-table-column>
                        <el-table-column prop="205" label="拒绝"></el-table-column>
                    </el-table-column>
                    <el-table-column label="三审">
                        <el-table-column prop="301" label="待审核"></el-table-column>
                        <el-table-column prop="302" label="审核中"></el-table-column>
                        <el-table-column prop="304" label="通过"></el-table-column>
                        <el-table-column prop="303" label="不通过"></el-table-column>
                        <el-table-column prop="305" label="拒绝"></el-table-column>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 今日审核合同状态 -->
            <div class="hfq-audit-status">
                <div class="hfq-cell-hd hfq-cell-left">
                    今日审核合同状态
                </div>
            </div>
            <div class="hfq-table-wrap">
                <el-table :data="auditContractStatusList">
                    <el-table-column prop="contract_no" label="合同号" width="120"></el-table-column>
                    <el-table-column prop="user_name" label="租客姓名" width="90"></el-table-column>
                    <el-table-column prop="agency_name" label="中介公司" width="300" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="monthly_amount" label="月租金" width="80"></el-table-column>
                    <el-table-column prop="enter_time" label="进件时间" width="100"></el-table-column>
                    <el-table-column prop="audit_time" label="审核时间" width="100"></el-table-column>
                    <el-table-column prop="comment" label="中介备注" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="rc_status_value" label="预审状态" :formatter="formatterAuditStatus" width="90"></el-table-column>
                   <el-table-column label="操作" width="70">
                        <template scope="scope">
                            <a :href="handleAudit(scope.row)" target="_blank">
                                <el-button type="text">查看</el-button>
                            </a>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <div class="hfq-pagination-wrap" v-if="pagination.total > pagination.pageSize">
                    <el-pagination
                        layout="prev, pager, next"
                        :page-size="pagination.pageSize"
                        :current-page="pagination.currentPage"
                        :total="pagination.total"
                        @current-change="currentChange"
                        >
                    </el-pagination>
                </div>
            </div>



        </main>
    </div>
</template>

<script>
    import vueMethods from 'src/assets/js/vueMethods'
    export default{
        name: 'page-audit-allot-detail',
        mixins: [vueMethods],
        data(){
            return {
                // 列表总共多少条
                pagination:{
                    total:0,
                    pageSize:4,
                    currentPage: 1
                },
                // 今日审核数据统计表
                auditDataList: [],
                //今日审核合同状态列表
                auditContractStatusList:[],
                bossId: ''
            }
        },
        methods: {
            // 数据表统计
            dataTableList(){
                this.$axios.all([
                    this.$axios.get(`/v2/api/audit/statistic/${this.bossId}`)
                ])
                .then(this.$axios.spread((res1) => {
                   this.auditDataList.push(res1.data);
                }))
            },
            //合同状态列表
            getTableData(){
                this.$axios.all([
                    this.$axios.get(`/v2/api/audit/statistic/${this.bossId}/contracts/`)
                ])
                .then(this.$axios.spread((res1) => {
                    this.auditContractStatusList = res1.data.result
                }))
            },
            currentChange(currentPage){
                this.currentPage = currentPage;
                this.searchForm.offset = (currentPage - 1) * this.pageSize;
                this.getTableData();
            },
            // 点击查看时
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
            },
            // 格式化审核状态
            formatterAuditStatus(row){
                let auditStatusInfo = this.$store.state.auditStatusInfo;
                for(var i in auditStatusInfo){
                    if(auditStatusInfo[i].value == row.rc_status){
                        return auditStatusInfo[i].label
                    }
                }
            }
        },
        //初始化列表
        created(){
            this.bossId = this.$cookie.get('boss_id') ? this.$cookie.get('boss_id').replace(/"/g,'') : '';
            if(!this.bossId){
                return this.$message.error('请先登录')
            }
            this.getTableData();
            this.dataTableList();
        }

    }
</script>

<style lang="less">
    .page-audit-allot-detail {
        /* 表格区 */
        .el-table {
            font-size: 12px;
        }
        /* 分页 */
        .hfq-pagination-wrap {
            text-align: center;
            margin-top: 10px;
        }
        /* 其他样式 */
        .hfq-breadcrumb-wrap {
            margin-bottom: 6px;
        }
        .hfq-audit-view {
            margin-left: 15px;
        }
        .hfq-cell-right {
            float: right;
        }
        .hfq-cell-left {
            float: left;
            margin-top: 8px;
            margin-bottom: 10px;
            color: #1F2D3D;
        }
        .hfq-audit-status {
            margin-top: 10px;
        }
        .el-breadcrumb__item .el-icon-arrow-left {
            font-size: 14px;
        }
        .el-table th,.el-table td{
            text-align: center;
        }
        .el-table .cell{
            padding:5px;
        }
    }

</style>

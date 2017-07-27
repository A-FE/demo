<!-- 审核派单列表 -->
<template>
    <div class="page-audit-allot-list hfq-list-page">
        <!-- 面包屑 -->
        <div class="hfq-breadcrumb-wrap">
            <el-row type="flex" align="middle" class="hfq-breadcrumb-content">
                <el-col>
                    <el-breadcrumb>
                        <el-breadcrumb-item to="/riskManage/auditAllotList">审核派单</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
        </div>

        <!-- 内容区 -->
        <main class="hfq-list-page-content">

                   <div class="hfq-search-wrap">
                <!-- 第一行 -->
                <div class="hfq-cell row-1">
                    <div class="hfq-cell-hd hfq-cell hfq-search-item">
                        <div class="hfq-cell-hd ">合同号</div>
                        <div class="hfq-cell-bd">
                            <el-input v-model="searchForm.contract_no" class="m-search-input"></el-input>
                        </div>
                    </div>
                    <div class="hfq-cell-hd hfq-cell hfq-search-item">
                        <div class="hfq-cell-hd">租客姓名</div>
                        <div class="hfq-cell-bd">
                            <el-input v-model="searchForm.user_name" class="m-search-input"></el-input>
                        </div>
                    </div>
                    <div class="hfq-cell-hd hfq-cell hfq-search-item">
                        <div class="hfq-cell-hd">中介公司</div>
                        <div class="hfq-cell-bd">
                            <hfq-search-agency v-model="searchForm.agency_id"></hfq-search-agency>
                        </div>
                    </div>
                    <div class="hfq-cell-hd hfq-cell hfq-search-item">
                        <div class="hfq-cell-hd">预审状态</div>
                        <div class="hfq-cell-bd">
                            <el-select v-model="searchForm.rc_status" class="m-search-select" placeholder="请选择">
                                <el-option label="不限" value=""></el-option>
                                <template v-for="key in auditStatusInfo">
                                    <el-option :label="key.label" :key="key.value" :value="key.value"></el-option>
                                </template>
                            </el-select>
                        </div>
                    </div>

                    <div class="hfq-cell-ft hfq-cell-primary hfq-search-item m-button-group">
                        <el-button type="primary" @click="handleClickSearch">搜索</el-button>
                        <el-button @click="Object.assign(searchForm,resetForm);">重置</el-button>
                    </div>

                </div>


            </div>

            <!-- 表格 -->
            <div>
                <div class="hfq-cell-hd hfq-cell-left">
                    合计 {{pagination.total}}条
                </div>
                <div class="hfq-cell-ft" v-if="isGetUserJurisdiction">
                    <span>今日已审核 {{auditCount}} 条</span>
                    <router-link to="/riskManage/auditAllotDetail" v-if="userJurisdiction['ic_rc_stat_ personal.read']">
                        <el-button class="hfq-audit-view" type='text'>审核详情</el-button>
                    </router-link>
                    <router-link to="/riskManage/auditAll" v-if="userJurisdiction['ic_rc_stat.read']">
                        <el-button class="hfq-audit-view"
                                   type='text'>审核总览</el-button>
                    </router-link>
                </div>
            </div>
            <div class="hfq-table-wrap">
                <el-table :data="tableData" @sort-change="sortChange">
                    <el-table-column prop="contract_no" label="合同号" width="125"></el-table-column>
                    <el-table-column prop="user_name" label="租客姓名" width="90"></el-table-column>
                    <el-table-column prop="agency_name" label="中介公司" min-width="120" :show-overflow-tooltip="false"></el-table-column>
                    <el-table-column label="月租金" width="100">
                        <template scope="scope">
                            <span v-if="scope.row.monthly_amount >= 4000" class="monthly_amount">{{scope.row.monthly_amount}}</span>
                            <span v-else="scope.row.monthly_amount < 4000">{{scope.row.monthly_amount}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="进件时间" width="110" sortable>
                        <template scope="scope">
                            {{scope.row.enter_time && scope.row.enter_time.slice(0,10)}}<br/>
                            {{scope.row.enter_time && scope.row.enter_time.slice(11)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="审核时间" width="110" sortable>
                        <template scope="scope">
                            {{scope.row.audit_time && scope.row.audit_time.slice(0,10)}}<br/>
                            {{scope.row.audit_time && scope.row.audit_time.slice(11)}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="comment" label="中介备注" min-width="120" :show-overflow-tooltip="false"></el-table-column>
                    <el-table-column prop="rc_status_value" label="预审状态" width="100"></el-table-column>
                   <el-table-column label="操作" width="100">
                        <template scope="scope">
                            <a :href="handleAudit(scope.row)" target="_blank" class="text">
                                审核
                            </a>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <div class="hfq-pagination-wrap">
                    <el-pagination
                        v-if="pagination.total > pagination.pageSize"
                        :current-page="pagination.currentPage"
                        layout="prev, pager, next"
                        :page-size="pagination.pageSize"
                        :total="pagination.total"
                        @current-change="currentChange">
                    </el-pagination>
                </div>

            </div>

        </main>
    </div>
</template>

<script>
    import vueMethods from 'src/assets/js/vueMethods'
    export default{
        name: 'page-audit-allot-list',
        mixins: [vueMethods],
        data(){
            return {
                // 搜索表单
                searchForm: {
                    contract_no: '',
                    user_name: '',
                    agency_id: '',
                    rc_status: '',
                    // 排序字段
                    sort_field: 'enter_time',
                    // 排序方式DESC、ASC
                    sort_type: 'ASC',
                    // 偏移量=(页码-1)*每页页数
                    offset: 0,
                    limit: 20
                },
                // 搜索表单初始值
                resetForm: {
                    contract_no: '',
                    user_name: '',
                    user_mobile: '',
                    agency_id: '',
                    rc_status: '',
                    // 排序字段
                    sort_field: 'enter_time',
                    // 排序方式DESC、ASC
                    sort_type: 'ASC'
                },
                // 分页
                pagination:{
                    total: 0,
                    currentPage:1,
                    pageSize: 20,
                },
                // 列表数据
                tableData:[],
                // 中介公司数据
                companyData: [],
                auditCount: 0,
                // 审核权限
                userJurisdiction:{}
            }
        },
        computed:{
            // 审核权限是否请求完毕
            isGetUserJurisdiction(){
                return this.$store.state.isGetUserJurisdiction
            },
            auditStatusInfo(){
                return [
                            {
                                label: '一审待审核',
                                value: '101'
                            },
                            {
                                label: '一审审核中',
                                value: '102'
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
                                label: '三审待审核',
                                value: '301'
                            },
                            {
                                label: '三审审核中',
                                value: '302'
                            }
                       ]
            }
        },
        watch:{
            isGetUserJurisdiction(){
                Object.assign(this.userJurisdiction,this.$store.state.userJurisdiction);
            }
        },
        methods: {
            // 搜索
            handleClickSearch(){
                this.pagination.currentPage = 1;
                this.getTableData();
            },
            // 数据表统计
            dataTableList(){
                this.bossId = this.$cookie.get('boss_id') ? this.$cookie.get('boss_id').replace(/"/g,'') : '';
                this.$axios.all([
                    this.$axios.get(`/v2/api/audit/statistic/${this.bossId}`)
                ])
                .then(this.$axios.spread((res1) => {
                    this.auditCount = res1.data.audited;
                }))
            },
            // 获取中介公司列表
            getCompanyData(){
                this.$axios.get(`/v2/api/agencys?limit=0`)
                    .then(res => {
                        this.companyData = res.data;
                    })
            },
            // 获取table列表
            getTableData(){
                let params = Object.assign({},{
                    is_alloted: 1,
                    audit_oper:this.$cookie.get('boss_id') ? this.$cookie.get('boss_id').replace(/\"/g,'') : ''
                },this.searchForm);
                this.$axios.get(`/v2/api/audit/contracts${this.utils.urlEncode(params)}`)
                .then(result=>{
                    this.pagination.total = result.data.count;
                    this.tableData = result.data.results;
                })
            },
            // 页码改变时
            currentChange(currentPage){
                 this.pagination.currentPage = currentPage;
                // 偏移量=(页码-1) * 每页页数
                 this.searchForm.offset = (currentPage - 1) * this.pagination.pageSize;
                 this.getTableData();
            },
            // 排序改变时
            sortChange(column){
                this.pagination.currentPage = 1;
                this.searchForm.sort_field = column.prop;
                this.searchForm.sort_type = column.order === 'ascending' ? 'ASC' : 'DESC';
                this.getTableData();
            },
            // 点击审核时
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
        },
        //初始化列表
        created(){
           this.getTableData();
           this.dataTableList();
           this.getCompanyData();
        },
        mounted(){
            Object.assign(this.userJurisdiction,this.$store.state.userJurisdiction);
        }
    }
</script>

<style lang="less">
    .page-audit-allot-list {
        /* 表格区 */
        .el-table {
            font-size: 14px;
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
        }
        .el-table .cell .monthly_amount{
            border-radius: 4px;background:#ff5b5b;padding:6px 8px;
            color:#fff;
        }
    }

</style>

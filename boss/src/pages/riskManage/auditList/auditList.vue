<!-- 审核列表 -->
<template>
    <div class="page-audit-list hfq-list-page" >
        <!-- 面包屑 -->
        <div class="hfq-breadcrumb-wrap">
            <el-row type="flex" align="middle" class="hfq-breadcrumb-content">
                <el-col>
                    <el-breadcrumb>
                        <el-breadcrumb-item>审核列表</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
        </div>

        <!-- 内容区 -->
        <main class="hfq-list-page-content">
            <!-- 搜索框 -->
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
                        <div class="hfq-cell-hd">租客手机</div>
                        <div class="hfq-cell-bd">
                            <el-input v-model="searchForm.user_mobile" class="m-search-input"></el-input>
                        </div>
                    </div>
                    <div class="hfq-cell-hd hfq-cell hfq-search-item">
                        <div class="hfq-cell-hd">中介公司</div>
                        <div class="hfq-cell-bd" style="width: 120px;">
                            <hfq-search-agency v-model="searchForm.agency_id"></hfq-search-agency>
                        </div>
                    </div>
                    <div class="hfq-cell-hd hfq-cell hfq-search-item">
                        <div class="hfq-cell-hd">起租日</div>
                        <div class="hfq-cell-bd">
                            <el-date-picker
                                v-model="dataPickerForm.lease_begin_begin"
                                type="date"
                                format="yyyy-MM-dd"
                                @change=" (val)=>{searchForm.lease_begin_begin = val}"
                                placeholder="选择日期">
                            </el-date-picker>
                            <el-date-picker
                                v-model="dataPickerForm.lease_begin_end"
                                type="date"
                                format="yyyy-MM-dd"
                                @change=" (val)=>{searchForm.lease_begin_end = val}"
                                placeholder="选择日期">
                            </el-date-picker>
                        </div>
                    </div>
                </div>
                <!-- 第二行 -->
                <div class="hfq-cell row-2">
                    <div class="hfq-cell-hd hfq-cell hfq-search-item">
                        <div class="hfq-cell-hd">付款方式</div>
                        <div class="hfq-cell-bd">
                            <el-select v-model="searchForm.hzf_pay_type" class="m-search-select" placeholder="请选择">
                                <el-option label="不限" value=""></el-option>
                                <el-option label="季付" :value="1"></el-option>
                                <el-option label="半年付" :value="2"></el-option>
                                <el-option label="年付" :value="3"></el-option>
                                <el-option label="一年半付" :value="4"></el-option>
                                <el-option label="两年付" :value="5"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="hfq-cell-hd hfq-cell hfq-search-item">
                        <div class="hfq-cell-hd">合同类型</div>
                        <div class="hfq-cell-bd">
                            <el-select v-model="searchForm.lease_type" class="m-search-select" placeholder="请选择">
                                <el-option label="不限" value=""></el-option>
                                <el-option label="代理" :value="2"></el-option>
                                <el-option label="房东" :value="1"></el-option>
                                <el-option label="C端" :value="3"></el-option>
                                <el-option label="公寓" :value="4"></el-option>
                            </el-select>
                        </div>
                    </div>

                    <div class="hfq-cell-hd hfq-cell hfq-search-item">
                        <div class="hfq-cell-hd">暂停审核</div>
                        <div class="hfq-cell-bd">
                            <el-select v-model="searchForm.is_audit" class="m-search-select" placeholder="请选择">
                                <el-option label="是" :value="0"></el-option>
                                <el-option label="否" :value="1"></el-option>
                            </el-select>
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
                    <div class="hfq-cell-hd hfq-cell hfq-search-item">
                        <div class="hfq-cell-hd">申请时间</div>
                        <div class="hfq-cell-bd">
                            <el-date-picker
                                v-model="dataPickerForm.create_time_begin"
                                type="datetime"
                                format="yyyy-MM-dd HH:mm:ss"
                                @change=" (val)=>{searchForm.create_time_begin = val}"
                                placeholder="选择时间">
                            </el-date-picker>
                            <el-date-picker
                                v-model="dataPickerForm.create_time_end"
                                type="datetime"
                                format="yyyy-MM-dd HH:mm:ss"
                                @change=" (val)=>{searchForm.create_time_end = val}"
                                placeholder="选择时间">
                            </el-date-picker>
                        </div>
                    </div>
                </div>
                <!-- 第三行 -->
                <div class="hfq-cell row-3">
                    <div class="hfq-cell-hd hfq-cell hfq-search-item">
                        <div class="hfq-cell-hd">审核时间</div>
                        <div class="hfq-cell-bd">
                            <el-date-picker
                                v-model="dataPickerForm.audit_time_begin"
                                type="datetime"
                                format="yyyy-MM-dd HH:mm:ss"
                                @change=" (val)=>{searchForm.audit_time_begin = val}"
                                placeholder="选择时间">
                            </el-date-picker>
                            <el-date-picker
                                v-model="dataPickerForm.audit_time_end"
                                type="datetime"
                                format="yyyy-MM-dd HH:mm:ss"
                                @change=" (val)=>{searchForm.audit_time_end = val}"
                                placeholder="选择时间">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="hfq-cell-hd hfq-cell hfq-search-item">
                        <div class="hfq-cell-hd">进件时间</div>
                        <div class="hfq-cell-bd">
                            <el-date-picker
                                v-model="dataPickerForm.enter_time_begin"
                                type="datetime"
                                format="yyyy-MM-dd HH:mm:ss"
                                @change=" (val)=>{searchForm.enter_time_begin = val}"
                                placeholder="选择时间">
                            </el-date-picker>
                            <el-date-picker
                                v-model="dataPickerForm.enter_time_end"
                                type="datetime"
                                format="yyyy-MM-dd HH:mm:ss"
                                @change=" (val)=>{searchForm.enter_time_end = val}"
                                placeholder="选择时间">
                            </el-date-picker>
                        </div>
                    </div>

                    <div class="hfq-cell-ft hfq-cell-primary hfq-search-item m-button-group">
                        <el-button type="primary" @click="handleClickSearch">搜索</el-button>
                        <el-button @click="Object.assign(searchForm,resetForm);Object.assign(dataPickerForm,resetForm);">重置</el-button>
                    </div>
                </div>
            </div>

            <!-- 表格 -->
            <div class="hfq-table-wrap">
                <el-table :data="tableData" @sort-change="sortChange">
                    <el-table-column prop="contract_no" label="合同号" width="112"></el-table-column>
                    <el-table-column prop="user_name" label="租客姓名" width="85"></el-table-column>
                    <el-table-column prop="lease_type_value" label="合同类型" width="85"></el-table-column>
                    <el-table-column prop="monthly_amount" label="月租金" width="75"></el-table-column>
                    <el-table-column prop="hzf_pay_type_value" label="垫付方式" width="90"></el-table-column>
                    <el-table-column prop="lease_begin" label="起租日" width="100"></el-table-column>
                    <el-table-column prop="agency_name" label="中介公司" min-width="128"></el-table-column>
                    <el-table-column  label="申请时间" width="110" sortable>
                        <template scope="scope">
                            {{scope.row.create_time && scope.row.create_time.slice(0,10)}}<br/>
                            {{scope.row.create_time && scope.row.create_time.slice(11)}}
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
                    <el-table-column prop="audit_oper" label="审核人" width="70" :formatter="formatterAuditOper"></el-table-column>
                    <el-table-column prop="rc_status_value" label="预审状态" width="90"></el-table-column>
                    <el-table-column label="操作" width="70">
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
                        :current-page="currentPage"
                        layout="prev, pager, next"
                        :page-size="pageSize"
                        :total="total"
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
        name: 'page-audit-list',
        mixins: [vueMethods],
        data(){
            return {
                // 辅助显示的表单
                dataPickerForm:{
                    lease_begin_begin: '',
                    lease_begin_end: '',
                    create_time_begin: '',
                    create_time_end: '',
                    audit_time_begin: '',
                    audit_time_end: '',
                    enter_time_begin: '',
                    enter_time_end: '',
                },
                // 搜索表单
                searchForm: {
                    contract_no: '',
                    user_name: '',
                    user_mobile: '',
                    agency_id: '',
                    lease_begin_begin: '',
                    lease_begin_end: '',
                    hzf_pay_type: '',
                    lease_type: '',
                    is_audit: 1,
                    rc_status: '101',
                    create_time_begin: '',
                    create_time_end: '',
                    audit_time_begin: '',
                    audit_time_end: '',
                    enter_time_begin: '',
                    enter_time_end: '',
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
                    lease_begin_begin: '',
                    lease_begin_end: '',
                    hzf_pay_type: '',
                    lease_type: '',
                    is_audit: 1,
                    rc_status: '101',
                    create_time_begin: '',
                    create_time_end: '',
                    audit_time_begin: '',
                    audit_time_end: '',
                    enter_time_begin: '',
                    enter_time_end: '',
                    // 排序字段
                    sort_field: 'enter_time',
                    // 排序方式DESC、ASC
                    sort_type: 'ASC'
                },
                // 列表数据
                tableData: [],
                // 分页数据
                total: 0,
                currentPage: 1,
                pageSize: 20,
                // 中介公司数据
                companyData: [],
            }
        },
        computed: {
            auditStatusInfo(){
                return this.$store.state.auditStatusInfo
            },
            // 所有员工的信息
            usersInfo(){
                return this.$store.state.usersInfo
            }
        },
        watch:{
            searchForm:{
                handler(searchForm){
                    console.log(searchForm);
                },
                deep: true
            },
            usersInfo(){
                // 执行默认搜索
                this.getTableData();
            }
        },
        methods: {
            handleClickSearch(){
                this.currentPage = 1;
                this.getTableData();
            },
            //获取表格数据
            getTableData(){
                let url = '/v2/api/audit/contracts' + this.utils.urlEncode(this.searchForm);
                this.$axios.all([
                    this.$axios.get(url)
                ]).then(this.$axios.spread((res1) => {
                    this.tableData = res1.data.results;
                    this.total = res1.data.count;
                }))
            },
            // 页码改变时
            currentChange(currentPage){
                this.currentPage = currentPage;
                this.searchForm.offset = (currentPage - 1) * this.pageSize;
                this.getTableData();
            },
            // 获取中介公司列表
            getCompanyData(){
                this.$axios.get(`/v2/api/agencys?limit=0`)
                    .then(res => {
                        this.companyData = res.data;
                    })
            },
            // 排序值发生变化时
            sortChange(column){
                this.currentPage = 1;
                this.searchForm.sort_field = column.prop;
                this.searchForm.sort_type = column.order === 'ascending' ? 'ASC' : 'DESC';
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
            // 格式化合同类型
            formatterLeaseType(row){
                let leasetype = '';
                switch (row.lease_type) {
                    case 1:
                        leasetype = '房东';
                        break
                    case 2:
                        leasetype = '代理';
                        break
                    case 3:
                        leasetype = 'C端';
                        break
                    case 4:
                        leasetype = '公寓';
                        break
                }
                return leasetype
            },
            // 格式化审核人
            formatterAuditOper(row, column){
                if(row.audit_oper === 'pool'){
                    return '未分配'
                }else{
                    return this.getUserNameFromEmail(row.audit_oper, this.usersInfo);
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
            },
        },
        created(){
            this.getTableData();
            this.getCompanyData();
            // 设置当前激活菜单
            this.$store.commit('setActiveIndex','2-2');
        }
    }
</script>

<style lang="less">
    .page-audit-list {
        /* 搜索框样式 */
        .hfq-search-wrap .hfq-cell {
            margin: 0;
            padding: 0;
        }

        .hfq-search-wrap .hfq-cell-hd {
            margin-right: 8px;
        }

        .hfq-search-wrap .m-search-input {
            width: 120px;
        }

        .hfq-search-wrap .m-search-select {
            width: 120px;
        }

        .hfq-search-wrap .hfq-search-item {
            margin-right: 12px;
        }

        .hfq-search-wrap .hfq-search-item .hfq-cell-hd {
            width: 60px;
            text-align: right;
        }

        .hfq-search-wrap .el-date-editor.el-input {
            width: 158px;
        }

        .hfq-search-wrap .hfq-cell-ft.m-button-group {
            padding-right: 10px;
        }

        .hfq-search-wrap .hfq-search-item:last-of-type {
            margin-right: 0;
        }

        .hfq-search-wrap .el-input__inner {
            height: 32px;
        }

        .hfq-search-wrap .row-1, .hfq-search-wrap .row-2 {
            margin-bottom: 8px;
        }

        /* 表格区 */
        .el-table {
            font-size: 12px;
        }

        .hfq-table-wrap {
            margin-top: 20px;
        }

        /* 分页 */
        .hfq-pagination-wrap {
            text-align: center;
            margin-top: 20px;
        }
    }

</style>

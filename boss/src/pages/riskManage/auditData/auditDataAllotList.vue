<!-- 审核数据分配列表 -->
<template>
    <div class="page-audit-data-allot-list hfq-list-page">
        <!-- 面包屑 -->
        <div class="hfq-breadcrumb-wrap">
            <el-row type="flex" align="middle" class="hfq-breadcrumb-content">
                <el-col>
                    <el-breadcrumb>
                        <el-breadcrumb-item>审核数据分配</el-breadcrumb-item>
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
                        <div class="hfq-cell-hd">中介公司</div>
                        <div class="hfq-cell-bd" style="width: 120px;">
                            <hfq-search-agency v-model="searchForm.agency_id"></hfq-search-agency>
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
                        <div class="hfq-cell-hd">审核人</div>
                        <div class="hfq-cell-bd">
                            <el-select v-model="searchForm.audit_oper" class="m-search-select" placeholder="请选择">
                                <el-option label="未分配" value="pool"></el-option>
                                <template v-for="key in auditOperList">
                                    <el-option :label="key.f_oper_name" :key="key.valf_oper_nameue" :value="key.f_oper_id"></el-option>
                                </template>
                            </el-select>
                        </div>
                    </div>
                    <div class="hfq-cell-hd hfq-cell hfq-search-item">
                        <div class="hfq-cell-hd">预审状态</div>
                        <div class="hfq-cell-bd">
                            <el-select v-model="searchForm.rc_status" class="m-search-select" placeholder="请选择">
                                <el-option label="请选择" value=""></el-option>
                                <template v-for="key in auditStatusInfo">
                                    <el-option :label="key.label" :key="key.value" :value="key.value"></el-option>
                                </template>
                            </el-select>
                        </div>
                    </div>
                    <div class="hfq-cell-ft hfq-cell-primary hfq-search-item m-button-group">
                        <el-button type="primary" @click="handleClickSearch">搜索</el-button>
                        <el-button @click="Object.assign(searchForm,resetForm)">重置</el-button>
                    </div>

                </div>
            </div>

            <!-- 表格 -->
            <div class="hfq-table-wrap">
                <div class="hfq-cell">
                    <template v-if="isGetUserJurisdiction">
                        <el-button v-if="userJurisdiction['ic_rc_allotted.assign']" type="primary" @click="apply(3)">数据分配</el-button>
                    </template>
                    <el-button type="primary" @click="apply(1)">申请</el-button>
                    <el-button type="primary" @click="apply(2)">放弃</el-button>
                    <span style="margin-left: 20px;">合计 {{total}}条</span>
                </div>
                <el-table :data="tableData" @sort-change="sortChange" ref="multipleTable"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="contract_no" label="合同号" width="112"></el-table-column>
                    <el-table-column prop="user_name" label="租客姓名" width="85"></el-table-column>
                    <el-table-column prop="agency_name" label="中介公司" min-width="200"></el-table-column>
                    <el-table-column prop="lease_type_value" label="合同类型" min-width="90"></el-table-column>
                    <el-table-column prop="monthly_amount" label="月租金" width="75"></el-table-column>
                    <el-table-column prop="lease_begin" label="起租日" width="100"></el-table-column>
                    <el-table-column prop="enter_time" label="进件时间" width="110" sortable></el-table-column>
                    <el-table-column prop="audit_time" label="审核时间" width="110" sortable></el-table-column>
                    <el-table-column prop="audit_oper" label="审核人" width="70"
                                     :formatter="formatterAuditOper"></el-table-column>
                    <el-table-column prop="rc_status" label="预审状态" width="90"
                                     :formatter="formatterAuditStatus"></el-table-column>
                </el-table>
                <!-- 分页 -->
                <div class="hfq-pagination-wrap">
                    <el-pagination
                        v-if="total > pageSize"
                        :current-page="currentPage"
                        layout="prev, pager, next"
                        :page-size="pageSize"
                        :total="total"
                        @current-change="currentChange">
                    </el-pagination>
                </div>
            </div>

        </main>
        <!-- 数据分配人弹框 -->
        <el-dialog title="选择分配人" v-model="dataAllocationPerson" >
            <template>
                <div v-for="item in auditOperList" class="hfq-cell" style="width:400px;">
                    <el-radio v-model="radio" :value="item.f_allot_oper_id" :label="item.f_oper_id">{{item.f_oper_name}}</el-radio>
                </div>
            </template>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dataAllocationPerson = false">取 消</el-button>
                <el-button type="primary" @click="submitAudit(3)">提 交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import vueMethods from 'src/assets/js/vueMethods'

    export default{
        name: 'page-audit-data-allot-list',
        mixins: [vueMethods],
        data(){
            return {
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
                    is_alloted:1,
                    rc_status: '',
                    audit_oper:'pool',
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
                    rc_status: '',
                    audit_oper:'pool',
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
                // 数据分配弹框
                dataAllocationPerson:false,
                // 审核人
                auditOperList:[],
                // 列表数据
                tableData: [],
                // 分页数据
                total: 0,
                currentPage: 1,
                pageSize: 20,
                // 中介公司数据
                companyData: [],
                // 所有员工的信息
                usersInfo: [],
                // 申请
                applyForm:{
                    oper_id:'',
                    contract_nos:[],
                    flag:1,
                },
                flag:1,
                //选中的审核人邮箱
                checkOperIdLista:[],
                radio: '',
                // 审核权限
                userJurisdiction:{}
            }
        },
        computed: {
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
            },
            // 审核权限是否请求完毕
            isGetUserJurisdiction(){
                return this.$store.state.isGetUserJurisdiction
            }
        },
        watch:{
            searchForm:{
                handler(searchForm){
//                    console.log(searchForm);
                },
                deep: true
            },
            isGetUserJurisdiction(){
                Object.assign(this.userJurisdiction,this.$store.state.userJurisdiction);
            }
        },
        methods: {
            // 提交审核人
            submitAudit(flag){
                if(this.radio === ''){
                    return this.$message('请选择审核人');
                }
                this.applyForm.oper_id = this.radio;
                this.applyForm.flag = flag;
                this.applyForm.contract_nos = this.applyForm.contract_nos
                this.$axios({
                    method:"patch",
                    url:'/v2/api/audit/contracts/allot/',
                    data:this.applyForm
                })
                .then((res1) => {
                    switch (flag){
                        case 1:
                            this.$message('申请成功');
                            break
                        case 2:
                            this.$message('放弃成功');
                            break
                        case 3:
                            this.dataAllocationPerson = false;
                            this.$message('数据分配成功');
                    }
                    this.getTableData();
                })
            },
            // 申请/放弃/数据分配
            apply(flag){
                let relinquishedStatus = false;
                if(this.applyForm.contract_nos.length == 0){
                    return this.$message('请选择数据');
                }
                if(flag == 2){
                    this.checkOperIdLista.forEach(item => {
                        if(this.$cookie.get('boss_id').replace(/"/g,'') !== item.audit_oper){
                            this.$message('只能放弃自己的合同');
                        }else{
                            relinquishedStatus = true;
                        }
                    })
                   if(relinquishedStatus != true){
                        return false;
                   }
                }else if(flag == 1){
                    this.checkOperIdLista.forEach(item => {
                        if( item.audit_oper !== 'pool'){
                           this.$message('合同已分配，不能重复申请');
                        }else{
                            relinquishedStatus = true;
                        }
                    })
                   if(relinquishedStatus != true){
                        return false;
                   }
                }else if(flag == 3){
                    this.dataAllocationPerson = true;
                    return false;
                }

                this.applyForm.oper_id = this.$cookie.get('boss_id').replace(/"/g,'');
                this.applyForm.flag = flag;
                this.applyForm.contract_nos = this.applyForm.contract_nos
                this.$axios({
                    method:"patch",
                    url:'/v2/api/audit/contracts/allot/',
                    data:this.applyForm
                })
                .then((res1) => {
                    switch (flag){
                        case 1:
                            this.$message('申请成功');
                            break
                        case 2:
                            this.$message('放弃成功');
                            break
                        case 3:
                            this.$message('数据分配成功');
                    }
                    this.getTableData();
                })
            },
            // 搜索
            handleClickSearch(){
                if(this.searchForm.rc_status === ''){
                    return this.$message('请选择预审状态');
                }
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
            // 获取审核人
            getAuditPorson(){
                this.$axios.all([
                    this.$axios.get(`/v2/api/audit/opers/`)
                ]).then(this.$axios.spread((res1) => {
                    this.auditOperList = res1.data.result;
                }))
            },
            // 获取权限
            getAuditAuth(){
                this.$axios.all([
                    this.$axios.get(`/api/auth/user/get/?page_no=1&page_limit=0`),
                ]).then(this.$axios.spread((res1) => {
                    this.usersInfo = res1.data.result.users;
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
            // 搜索框数据
            querySearch(queryString, cb){
                let companyData = this.companyData;
                let results = queryString ? companyData.filter(item => (item.value.indexOf(queryString.toLowerCase()) === 0)) : companyData;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            // 搜索下拉框选中值时
            handleSelect(item){
                this.searchForm.agency_id = item.agencyid;
            },
            // 排序值发生变化时
            sortChange(column){
                this.currentPage = 1;
                this.searchForm.sort_field = column.prop;
                this.searchForm.sort_type = column.order === 'ascending' ? 'ASC' : 'DESC';
                this.getTableData();
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
            // 格式化垫付方式
            formatterHfqPayType(row){
                let hfqPayType = '';
                switch (row.lease_type) {
                    case 1:
                        hfqPayType = '季付';
                        break
                    case 2:
                        hfqPayType = '半年付';
                        break
                    case 3:
                        hfqPayType = '年付';
                        break
                    case 4:
                        hfqPayType = '一年半付';
                        break
                    case 5:
                        hfqPayType = '两年付';
                        break
                }
                return hfqPayType
            },
            // 格式化审核人
            formatterAuditOper(row){
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
            // 获取全选数据
            handleSelectionChange(val) {
                this.applyForm.contract_nos = [];
                this.checkOperIdLista = val;
                val.forEach(item => {
                    this.applyForm.contract_nos.push(item.contract_no);
                })
            }
        },
        created(){
            Object.assign(this.userJurisdiction,this.$store.state.userJurisdiction);
            this.getCompanyData();
            this.getAuditAuth();
            this.getAuditPorson();
        }
    }
</script>

<style lang="less">
    .page-audit-data-allot-list {
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

        /* 表格区 */
        .el-table {
            font-size: 12px;
        }

        .hfq-table-wrap {
            margin-top: 20px;
            margin-top: 10px;
        }

        /* 分页 */
        .hfq-pagination-wrap {
            text-align: center;
            margin-top: 20px;
        }
        /* 弹框样式 */
        .el-dialog .el-dialog__body {
            overflow-x: hidden;
            overflow-y: auto;
            padding-top: 10px;
        }
    }

</style>

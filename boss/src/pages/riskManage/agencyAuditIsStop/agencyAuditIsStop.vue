<!-- 中介审核暂停 -->
<template>
    <div class="agencyAuditIsStop hfq-list-page">
        <!-- 面包屑 -->
        <div class="hfq-breadcrumb-wrap">
            <el-row type="flex" align="middle" class="hfq-breadcrumb-content">
                <el-col>
                    <el-breadcrumb>
                        <el-breadcrumb-item>中介审核暂停</el-breadcrumb-item>
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
                        <div class="hfq-cell-hd ">中介公司</div>
                        <div class="hfq-cell-bd">
                            <hfq-search-agency v-model="searchForm.agency_id"></hfq-search-agency>
                        </div>
                    </div>
                    <div class="hfq-cell-hd hfq-cell hfq-search-item">
                        <div class="hfq-cell-hd">审核状态</div>
                        <div class="hfq-cell-bd">
                            <el-select v-model="searchForm.is_audit" class="m-search-select" placeholder="请选择">
                                <el-option label="未暂停" :value="1"></el-option>
                                <el-option label="已暂停" :value="0"></el-option>
                            </el-select>
                        </div>
                    </div>

                    <el-button class="searchBtn" type="primary" @click="handleClickSearch">搜索</el-button>
                    <el-button @click="Object.assign(searchForm,resetForm);">重置</el-button>
                </div>
            </div>

            <!-- 表格 -->
            <div class="hfq-table-wrap">
                <el-table :data="defaultShowData" @sort-change="sortChange">
                    <el-table-column prop="name" label="中介公司名称" sortable></el-table-column>
                    <el-table-column prop="is_audit" label="审核状态" :formatter="formatterAuditStatus"></el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button v-if="scope.row.is_audit === 0" type="text"  @click="agencyCancel(scope.row,1,'取消暂停审核')">取消暂停审核</el-button>
                            <el-button v-else-if="scope.row.is_audit === 1" type="text" @click="agencyCancel(scope.row,0,'暂停审核')">暂停审核</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                 <!-- 分页 -->
                <div class="hfq-pagination-wrap" v-if="total > pageSize">
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
        name: 'agencyAuditIsStop',
        mixins: [vueMethods],
        data(){
            return {
                // 搜索表单
                searchForm: {
                    contract_no: '',
                    agency_id:'',
                    is_audit:0,
                    // 排序字段
                    sort_field: 'create_time',
                    // 排序方式DESC、ASC
                    sort_type: 'DESC',
                    // 偏移量=(页码-1)*每页页数
                    offset: 0,
                    limit: 0
                },
                total: 0,
                currentPage:1,
                pageSize: 20,
                //重置表单数据
                resetForm: {
                    contract_no: '',
                    agency_id:'',
                    is_audit:0,
                    // 排序字段
                    sort_field: 'create_time',
                    // 排序方式DESC、ASC
                    sort_type: 'DESC',
                    // 偏移量=(页码-1)*每页页数
                    offset: 0,
                    limit: 0
                },
                // 列表数据
                tableData: [],
                //列表默认展示20条数据
                defaultShowData:[],
                // 中介公司数据
                companyData:[],
                //暂停审核的数组
                agency_ids:[]
            }
        },
        methods: {
            // 中介公司暂缓
            agencyCancel(row,is_audit,text){

                this.$confirm('是否'+text, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {

                    this.agency_ids = [];
                    this.agency_ids.push(row.agency_id)

                    this.$axios.patch('/v2/api/audit/agencies/cancel/',{
                        agency_ids : this.agency_ids,
                        is_audit : is_audit
                    })
                    .then((res) => {
                        this.$message(text+'成功');
                        this.getTableData();
                    })

                }).catch(() => {});

            },
            // 搜索
            handleClickSearch(){
                this.searchForm.offset = 0;
                this.currentPage = 1;
                this.getTableData();
            },
            //获取表格数据
            getTableData(){
                this.$axios.all([
                    this.$axios.get(`/v2/api/audit/agencies/cancel/?limit=${this.searchForm.limit}&is_audit=${this.searchForm.is_audit}&offset=${this.searchForm.offset}&agency_id=${this.searchForm.agency_id}`),
                ]).then(this.$axios.spread((res1) => {
                    this.tableData = res1.data.result;
                    this.defaultShowData = this.tableData.slice(0, 20);
                    this.total = res1.data.result.length;
                    this.getDisplayTableData();
                }))
            },
            // 获取用来展示的tableData
            getDisplayTableData(){
                this.defaultShowData = this.tableData.slice((this.currentPage-1)*this.pageSize, (this.currentPage) * 20);
            },
            // 格式化审核状态
            formatterAuditStatus(row){
                let is_audit = '';
                switch(row.is_audit){
                    case 0:
                    is_audit = '已暂停';
                    break;
                    case 1:
                    is_audit = '未暂停';
                    break;
                }
                return is_audit;
            },
            // 获取所有中介公司列表
            getAllCompanyData(){
                this.$axios.get(`/v2/api/agencys?limit=0`)
                    .then(res => {
                        this.companyData = res.data;
                    })
            },
            // 页码改变时
            currentChange(currentPage){
                this.currentPage = currentPage;
                this.searchForm.offset = (currentPage - 1) * this.pageSize;
                this.getTableData();
            },
            // 排序改变时
            sortChange(column){
                this.currentPage = 1;
                this.searchForm.sort_field = column.prop;
                this.searchForm.sort_type = column.order === 'ascending' ? 'ASC' : 'DESC';
                this.getTableData();
            },
        },
        created(){
            this.getTableData();
            this.getAllCompanyData();
        }
    }
</script>

<style lang="less">
    .agencyAuditIsStop {
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

        .hfq-search-wrap .row-1 {
            margin-bottom: 8px;
        }

        /* 表格区 */
        .el-table {
            font-size: 12px;
        }

        .hfq-table-wrap {
            margin-top: 20px;
            margin-top: 10px;
        }
        .searchBtn{
            margin-left: 10px;
        }
        .icbcTagList .hfq-search-wrap .hfq-search-item .hfq-cell-hd{
            width: auto;
        }
        .hfq-table-wrap .el-table .cell span{
            float: left;
        }
        .hfq-table-wrap .el-table .cell img{
            width: 14px;
            float: left;
            margin: 2px 0px 0 4px;
        }

        /* 分页 */
        .hfq-pagination-wrap {
            text-align: center;
            margin-top: 20px;
        }

        .hfq-search-wrap .m-search-input,.hfq-search-wrap .m-search-select{
            width: 200px;
        }
        .hfq-table-wrap .el-table .cell span{
            float: none;
        }
        .el-table .cell{
            font-size:14px;
            padding:10px;
        }


    }

</style>

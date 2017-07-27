<!-- 违约代扣查询 -->
<template>
    <div class="withhodldSearch hfq-list-page">
        <!-- 面包屑 -->
        <div class="hfq-breadcrumb-wrap">
            <el-row type="flex" align="middle" class="hfq-breadcrumb-content">
                <el-col>
                    <el-breadcrumb>
                        <el-breadcrumb-item>违约代扣查询</el-breadcrumb-item>
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
                            <el-input v-model="searchForm.f_contract_no"></el-input>
                        </div>
                    </div>
                    <div class="hfq-cell-hd hfq-cell hfq-search-item">
                        <div class="hfq-cell-hd ">交易号</div>
                        <div class="hfq-cell-bd">
                            <el-input v-model="searchForm.f_req_sn"></el-input>
                        </div>
                    </div>
                    <el-button class="searchBtn" type="primary" @click="handleClickSearch">搜索</el-button>
                    <el-button @click="Object.assign(searchForm,resetForm);">重置</el-button>
                </div>
            </div>

            <!-- 表格 -->
            <div class="hfq-table-wrap">
                <el-table :data="tableData">
                    <el-table-column  prop="f_contract_no"  label="合同号" width="130"></el-table-column>
                    <el-table-column  prop="f_req_sn"  label="请求交易号" width="200"></el-table-column>
                    <el-table-column  prop='f_bank_card_no'  label="银行卡号" width="180"></el-table-column>
                    <el-table-column  prop="f_amount"  label="卡内余额" width="100"></el-table-column>
                    <el-table-column  prop="f_agency_name"  label="中介公司名称" width="200"></el-table-column>
                    <el-table-column  prop="f_pay_channel" label="支付渠道" width="90"></el-table-column>
                    <el-table-column  prop="f_withhold_desc"  label="违约原因" width="150"></el-table-column>
                    <el-table-column  prop="f_withhold_call_time"  label="违约回调时间" width="180"></el-table-column>
                    <el-table-column  prop="f_update_time"  label="创建时间" width="180"></el-table-column>
                </el-table>
                <!-- 分页 -->
                <div class="hfq-pagination-wrap" v-if="total > pageSize">
                    <el-pagination
                            :current-page="currentPage"
                            layout="total, prev, pager, next"
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
        name: 'withhodldSearch',
        mixins: [vueMethods],
        data(){
            return {
                // 搜索表单
                searchForm: {
                    f_contract_no: '',
                    f_req_sn: '',
                    offset: 0,
                    limit: 20
                },
                total: 0,
                currentPage:1,
                pageSize: 20,
                //重置表单数据
                resetForm: {
                    f_contract_no: '',
                    f_req_sn: '',
                    offset: 0,
                    limit: 20
                },
                // 列表数据
                tableData: [],
            }
        },
        methods: {
            //搜索
            handleClickSearch(){
                if(this.searchForm.phone === ''){
                    return  this.$message('手机号不能为空');
                }
                this.searchForm.offset = 0;
                this.currentPage = 1;
                this.getTableData();
            },
            //获取表格数据
            getTableData(){
                this.$axios.all([
                    this.$axios.get(`/v2/api/tools/withholdrecord?limit=${this.searchForm.limit}&offset=${this.searchForm.offset}&f_contract_no=${this.searchForm.f_contract_no}&f_req_sn=${this.searchForm.f_req_sn}`),
                ]).then(this.$axios.spread((res1) => {
                    if(res1.data.count === 0){
                        this.$message('暂无数据');
                    }
                    this.tableData = res1.data.results;
                    this.total = res1.data.count;
                }))
            },
            // 页码改变时
            currentChange(currentPage){
                this.currentPage = currentPage;
                this.searchForm.offset = (currentPage - 1) * this.pageSize;
                this.getTableData();
            }
        }
    }
</script>

<style lang="less">
    .withhodldSearch {
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
        }
    }

</style>

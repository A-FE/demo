<!-- 短信查询 -->
<template>
    <div class="sms hfq-list-page">
        <!-- 面包屑 -->
        <div class="hfq-breadcrumb-wrap">
            <el-row type="flex" align="middle" class="hfq-breadcrumb-content">
                <el-col>
                    <el-breadcrumb>
                        <el-breadcrumb-item>短信查询</el-breadcrumb-item>
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
                        <div class="hfq-cell-hd ">手机号</div>
                        <div class="hfq-cell-bd">
                            <el-input v-model="searchForm.phone"></el-input>
                        </div>
                    </div>
                    <el-button class="searchBtn" type="primary" @click="handleClickSearch">搜索</el-button>
                    <el-button @click="Object.assign(searchForm,resetForm);">重置</el-button>
                </div>
            </div>

            <!-- 表格 -->
            <div class="hfq-table-wrap">
                <el-table :data="tableData">
                    <el-table-column  prop="sms_id"  label="短信id" width="80"></el-table-column>
                    <el-table-column  prop="phone"  label="手机号" width="150"></el-table-column>
                    <el-table-column  prop="content"  label="短信内容"></el-table-column>
                    <el-table-column  prop='sms_type'  label="验证码类型" width="110"></el-table-column>
                    <el-table-column  prop="send_state"  label="发送状态" width="150"></el-table-column>
                    <el-table-column  prop="send_callback" label="回调状态" width="150"></el-table-column>
                    <el-table-column  prop="create_time"  label="发送时间" width="180"></el-table-column>
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
        name: 'sms',
        mixins: [vueMethods],
        data(){
            return {
                // 搜索表单
                searchForm: {
                    phone: '',
                    offset: 0,
                    limit: 20
                },
                total: 0,
                currentPage:1,
                pageSize: 20,
                //重置表单数据
                resetForm: {
                    phone: '',
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
                this.searchForm.offset = 0;
                this.currentPage = 1;
                this.getTableData();
            },
            //获取表格数据
            getTableData(){
                this.$axios.all([
                    this.$axios.get(`/v2/api/tools/sms?limit=${this.searchForm.limit}&phone=${this.searchForm.phone}&offset=${this.searchForm.offset}`),
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
    .sms {
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

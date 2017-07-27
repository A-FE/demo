<!-- 工行合同标记 -->
<template>
    <div class="icbcToolsTag hfq-list-page">
        <!-- 面包屑 -->
        <div class="hfq-breadcrumb-wrap">
            <el-row type="flex" align="middle" class="hfq-breadcrumb-content">
                <el-col>
                    <el-breadcrumb>
                        <el-breadcrumb-item>工行合同标记</el-breadcrumb-item>
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
                        <div class="hfq-cell-hd ">合同号/租客姓名/手机号</div>
                        <div class="hfq-cell-bd">
                            <el-input v-model="searchForm.keyword" width="200"></el-input>
                        </div>
                    </div>
                    <el-button class="searchBtn" type="primary" @click="handleClickSearch">搜索</el-button>
                </div>
            </div>

            <!-- 表格 -->
            <div class="hfq-table-wrap">
                <el-table :data="tableData">
                    <el-table-column label="合同号">
                    	<template scope="scope">
                    		<span>{{ scope.row.contract_no }}</span>
					        <img v-if="scope.row.f_first_sources_capital === 'h002'" src="../../../assets/img/bank_icon.png" alt="">
					    </template>
                    </el-table-column>
                    <el-table-column prop="contract_status_name" label="合同状态"></el-table-column>
                    <el-table-column prop="user_name" label="租客姓名"></el-table-column>
                    <el-table-column prop="user_mobile" label="租客手机号"></el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button v-if="userJurisdiction['contract_extend_source_capital.update'] && scope.row.can_update_sources_capital !== 1" :disabled="true" type="text" size="mini">标记为工行合同</el-button>
                            <el-button v-else-if="userJurisdiction['contract_extend_source_capital.update'] && scope.row.can_update_sources_capital === 1" type="text" size="mini" @click="addTag(scope.row)">标记为工行合同</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

        </main>
        
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
                    keyword: '',
                },
                // 列表数据
                tableData: [],
                // 审核权限
                userJurisdiction:{}
            }
        },
        computed: {
            // 审核权限是否请求完毕
            isGetUserJurisdiction(){
                return this.$store.state.isGetUserJurisdiction
            }
        },
        watch: {
            isGetUserJurisdiction(){
                Object.assign(this.userJurisdiction,this.$store.state.userJurisdiction);
            }
        },
        methods: {
            
            // 搜索
            handleClickSearch(){
                this.tableData = [];
                if(this.searchForm.keyword === ''){
                    return this.$message('请输入搜索条件');
                }
                this.getTableData();
            },
            //获取表格数据
            getTableData(){
                this.tableData = [];
                this.$axios.all([
                    this.$axios.get(`/api/contract/search_contract/?keyword=${this.searchForm.keyword}`),
                ]).then(this.$axios.spread((res1) => {
                    this.tableData = res1.data.result.contract_list;
                }))
            },
            // 添加工行标记
            addTag(row){
                this.$confirm('是否标记为工行合同?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.all([
                        this.$axios.post(`/api/contract/modify_sources_capital/?contract_no=${row.contract_no}&sources_capital=h002`),
                    ]).then(this.$axios.spread((res1) => {
                        this.$message({
                            type: 'success',
                            message: '标记成功'
                        });
                        this.getTableData();
                    }))
                }).catch(() => {});
            }
        },
        created(){
            Object.assign(this.userJurisdiction,this.$store.state.userJurisdiction);
        }
    }
</script>

<style lang="less">
    .icbcToolsTag {
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
        .icbcToolsTag .hfq-search-wrap .hfq-search-item .hfq-cell-hd{
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
        .hfq-search-wrap .row-1{
            margin:0;
        }

    }

</style>

<!-- 审核总揽列表 -->
<template>
    <div class="page-view-all-audit hfq-list-page">
        <!-- 面包屑 -->
        <div class="hfq-breadcrumb-wrap">
            <el-row type="flex" align="middle" class="hfq-breadcrumb-content">
                <el-col>
                    <el-breadcrumb>
                        <el-breadcrumb-item to="/riskManage/auditAllotList"><i class="el-icon-arrow-left"></i>审核派单</el-breadcrumb-item>
                        <el-breadcrumb-item>审核总览</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
        </div>

        <!-- 内容区 -->
        <main class="hfq-list-page-content">

            <!-- 今日审核数据统计表 -->
            <div>
                <div class="hfq-cell-hd hfq-cell-left">
                    今日审核数据统计表
                </div>
            </div>
            <div class="hfq-table-wrap">
                <el-table :data="getDetailData" border height="720">
                    <el-table-column prop="oper_id" label="审核人"></el-table-column>
                    <el-table-column prop="audited" label="已审核" width="70"></el-table-column>
                    <el-table-column label="一审">
                        <el-table-column prop="101" label="待审核" class-name="table-check-1" width="70"></el-table-column>
                        <el-table-column prop="102" label="审核中" width="70" class-name="table-check-1"></el-table-column>
                        <el-table-column prop="104" label="通过" width="70" class-name="table-check-1"></el-table-column>
                        <el-table-column prop="103" label="不通过" width="70" class-name="table-check-1"></el-table-column>
                        <el-table-column prop="105" label="拒绝" width="70" class-name="table-check-1"></el-table-column>
                    </el-table-column>
                    <el-table-column label="二审">
                        <el-table-column prop="201" label="待审核" width="70" class-name="table-check-2"></el-table-column>
                        <el-table-column prop="202" label="审核中" width="70" class-name="table-check-2"></el-table-column>
                        <el-table-column prop="204" label="通过" width="70" class-name="table-check-2"></el-table-column>
                        <el-table-column prop="203" label="不通过" width="70" class-name="table-check-2"></el-table-column>
                        <el-table-column prop="205" label="拒绝" width="70" class-name="table-check-2"></el-table-column>
                    </el-table-column>
                    <el-table-column label="三审">
                        <el-table-column prop="301" label="待审核" width="70" class-name="table-check-3"></el-table-column>
                        <el-table-column prop="302" label="审核中" width="70" class-name="table-check-3"></el-table-column>
                        <el-table-column prop="304" label="通过" width="70" class-name="table-check-3"></el-table-column>
                        <el-table-column prop="303" label="不通过" width="70" class-name="table-check-3"></el-table-column>
                        <el-table-column prop="305" label="拒绝" width="70" class-name="table-check-3"></el-table-column>
                    </el-table-column>
                </el-table>
            </div>
        </main>
    </div>
</template>

<script>

    import vueMethods from 'src/assets/js/vueMethods'
    export default{
        name: 'page-view-all-audit',
        mixins: [vueMethods],
        data(){
            return {
                // 列表总共多少条
                total:0,
                // 今日审核数据统计表
                getDetailData : []
            }
        },
        methods: {
            // 获取审核数据统计表
            getData(){
                this.$axios.all([
                    this.$axios.get('/v2/api/audit/statistic/')
                ])
                .then(this.$axios.spread((res1) => {
                    this.getDetailData = res1.data.result;
                }))
            }
        },
        created(){
            //初始化列表
            this.getData();
        }

    }
</script>

<style lang="less">
    .page-view-all-audit{
        /* 表格区 */
        .el-table{font-size: 12px;}
        /* 分页 */
        .hfq-pagination-wrap{text-align: center;margin-top: 10px;}
        /* 其他样式 */
        .hfq-breadcrumb-wrap{margin-bottom: 6px;}
        .hfq-audit-view{
            margin-left: 15px;
        }
        .hfq-cell-right{
            float: right;
        }
        .hfq-cell-left{
            float: left;
            margin-top: 8px;
            margin-bottom: 10px;
            color: #1F2D3D;
        }
        .hfq-audit-status{
            margin-top: 10px;
        }
        .el-breadcrumb__item .el-icon-arrow-left{
            font-size: 14px;
        }

        td.table-check-1{background-color:  rgba(32,160,255,0.04);}
        td.table-check-2{background-color: rgba(32,160,255,0.07);}
        td.table-check-3{background-color: rgba(32,160,255,0.11);}
        .el-table th,.el-table td{
            text-align: center;
        }
        .el-table .cell{
            padding:5px;
        }
    }

</style>

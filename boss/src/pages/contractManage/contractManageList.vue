<!-- 合同管理列表页 -->
<template>
    <div class="page-contract-manage-list hfq-list-page">
        <!-- 面包屑 -->
        <div class="hfq-breadcrumb-wrap">
            <el-row type="flex" align="middle" class="hfq-breadcrumb-content">
                <el-col>
                    <el-breadcrumb>
                        <el-breadcrumb-item>会分期合同管理</el-breadcrumb-item>
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
                            <el-input v-model="searchForm.contractNo" class="m-search-input"></el-input>
                        </div>
                    </div>
                    <div class="hfq-cell-hd hfq-cell hfq-search-item">
                        <div class="hfq-cell-hd">租客姓名</div>
                        <div class="hfq-cell-bd">
                            <el-input v-model="searchForm.renterName" class="m-search-input"></el-input>
                        </div>
                    </div>
                    <div class="hfq-cell-hd hfq-cell hfq-search-item">
                        <div class="hfq-cell-hd">租客手机</div>
                        <div class="hfq-cell-bd">
                            <el-input v-model="searchForm.renterPhone" class="m-search-input"></el-input>
                        </div>
                    </div>
                    <div class="hfq-cell-hd hfq-cell hfq-search-item">
                        <div class="hfq-cell-hd">中介公司</div>
                        <div class="hfq-cell-bd">
                            <el-input v-model="searchForm.agentCompany" class="m-search-input"></el-input>
                        </div>
                    </div>
                    <div class="hfq-cell-hd hfq-cell hfq-search-item">
                        <div class="hfq-cell-hd">提交日期</div>
                        <div class="hfq-cell-bd">
                            <el-date-picker
                                v-model="searchForm.startData"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                            <el-date-picker
                                v-model="searchForm.endData"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                        </div>
                    </div>
                </div>
                <!-- 第二行 -->
                <div class="hfq-cell row-2">
                    <div class="hfq-cell-hd hfq-cell hfq-search-item">
                        <div class="hfq-cell-hd">合同状态</div>
                        <div class="hfq-cell-bd">
                            <el-select v-model="searchForm.contractStatus" class="m-search-select" placeholder="请选择">
                                <el-option label="不限" :value="0"></el-option>
                                <el-option label="正常" :value="1"></el-option>
                                <el-option label="正常结束" :value="2"></el-option>
                                <el-option label="违约" :value="3"></el-option>
                                <el-option label="转租" :value="4"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="hfq-cell-hd hfq-cell hfq-search-item">
                        <div class="hfq-cell-hd">归档状态</div>
                        <div class="hfq-cell-bd">
                            <el-select v-model="searchForm.fileStatus" class="m-search-select" placeholder="请选择">
                                <el-option label="不限" :value="0"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="hfq-cell-hd hfq-cell hfq-search-item">
                        <div class="hfq-cell-hd">合同类型</div>
                        <div class="hfq-cell-bd">
                            <el-select v-model="searchForm.contractType" class="m-search-select" placeholder="请选择">
                                <el-option label="不限" :value="0"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="hfq-cell-hd hfq-cell hfq-search-item">
                        <div class="hfq-cell-hd">归档号</div>
                        <div class="hfq-cell-bd">
                            <el-input v-model="searchForm.fileNo" class="m-search-input"></el-input>
                        </div>
                    </div>
                    <div class="hfq-cell-ft hfq-cell-primary hfq-search-item m-button-group">
                            <el-button type="primary">搜索</el-button>
                            <el-button @click="Object.assign(searchForm,resetForm)">重置</el-button>
                    </div>
                </div>

            </div>

            <!-- 列表 -->
            <div class="hfq-table-wrap">
                <el-table :data="tableData">
                    <el-table-column prop="contractNo" label="合同号" width="128"></el-table-column>
                    <el-table-column prop="contractStatus" label="合同状态" width="100"></el-table-column>
                    <el-table-column prop="renterName" label="租客姓名" width="100"></el-table-column>
                    <el-table-column prop="payType" label="垫付方式" width="100"></el-table-column>
                    <el-table-column prop="agentCompany" label="中介公司" min-width="190"></el-table-column>
                    <el-table-column prop="rentstartData" label="起租日" width="110"></el-table-column>
                    <el-table-column prop="rentEndData" label="月租金" width="110"></el-table-column>
                    <el-table-column prop="monthRent" label="期手续费" width="100"></el-table-column>
                    <el-table-column prop="monthFee" label="月还款额" width="100"></el-table-column>
                    <el-table-column prop="repayData" label="还款日" width="100"></el-table-column>
                    <el-table-column label="操作" width="70">
                        <template scope="scope">
                            <a :href="'/?contractNo='+scope.row.contractNo+'#/contractManage/contractManageDetail'" target="_blank">
                                    <el-button type="text" >查看</el-button>
                            </a>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 分页 -->
            <div class="hfq-pagination-wrap">
                <el-pagination
                    layout="prev, pager, next"
                    :total="1000">
                </el-pagination>
            </div>
        </main>

    </div>
</template>

<script>
    import vueMethods from 'src/assets/js/vueMethods'

    export default{
        name: 'page-contract-manage-list',
        mixins: [vueMethods],
        data(){
            return {
                // 搜索表单
                searchForm:{
                    contractNo:'20170123',
                    renterName:'陈可可',
                    renterPhone:'18825144569',
                    agentCompany:'保护伞公司',
                    startData:'2017-03-12',
                    endData:'2017-05-11',
                    contractStatus:0,
                    fileStatus:0,
                    contractType:0,
                    fileNo:'2015011234'
                },
                resetForm:{
                    contractNo:'',
                    renterName:'',
                    renterPhone:'',
                    agentCompany:'',
                    startData:'',
                    endData:'',
                    contractStatus:'',
                    fileStatus:'',
                    contractType:'',
                    fileNo:''
                },
                // 列表数据
                tableData:[
                    {
                        contractNo:'201705100012',
                        contractStatus:0,
                        renterName:'陈大牛',
                        payType:0,
                        agentCompany:'保护伞',
                        rentstartData:'2017-12-28',
                        rentEndData:'2018-12-27',
                        monthRent:'1000.00',
                        monthFee:'45.00',
                        repayData:'12'
                    },
                    {
                        contractNo:'201600120982',
                        contractStatus:0,
                        renterName:'陈大牛',
                        payType:0,
                        agentCompany:'保护伞',
                        rentstartData:'2017-12-28',
                        rentEndData:'2018-12-27',
                        monthRent:'1000.00',
                        monthFee:'45.00',
                        repayData:'12'
                    },
                    {
                        contractNo:'201600120982',
                        contractStatus:0,
                        renterName:'陈大牛',
                        payType:0,
                        agentCompany:'保护伞',
                        rentstartData:'2017-12-28',
                        rentEndData:'2018-12-27',
                        monthRent:'1000.00',
                        monthFee:'45.00',
                        repayData:'12'
                    },
                    {
                        contractNo:'201600120982',
                        contractStatus:0,
                        renterName:'陈大牛',
                        payType:0,
                        agentCompany:'保护伞',
                        rentstartData:'2017-12-28',
                        rentEndData:'2018-12-27',
                        monthRent:'1000.00',
                        monthFee:'45.00',
                        repayData:'12'
                    },
                    {
                        contractNo:'201600120982',
                        contractStatus:0,
                        renterName:'陈大牛',
                        payType:0,
                        agentCompany:'保护伞',
                        rentstartData:'2017-12-28',
                        rentEndData:'2018-12-27',
                        monthRent:'1000.00',
                        monthFee:'45.00',
                        repayData:'12'
                    },
                    {
                        contractNo:'201600120982',
                        contractStatus:0,
                        renterName:'陈大牛',
                        payType:0,
                        agentCompany:'保护伞',
                        rentstartData:'2017-12-28',
                        rentEndData:'2018-12-27',
                        monthRent:'1000.00',
                        monthFee:'45.00',
                        repayData:'12'
                    },
                    {
                        contractNo:'201600120982',
                        contractStatus:0,
                        renterName:'陈大牛',
                        payType:0,
                        agentCompany:'保护伞',
                        rentstartData:'2017-12-28',
                        rentEndData:'2018-12-27',
                        monthRent:'1000.00',
                        monthFee:'45.00',
                        repayData:'12'
                    },
                    {
                        contractNo:'201600120982',
                        contractStatus:0,
                        renterName:'陈大牛',
                        payType:0,
                        agentCompany:'保护伞',
                        rentstartData:'2017-12-28',
                        rentEndData:'2018-12-27',
                        monthRent:'1000.00',
                        monthFee:'45.00',
                        repayData:'12'
                    },
                    {
                        contractNo:'201600120982',
                        contractStatus:0,
                        renterName:'陈大牛',
                        payType:0,
                        agentCompany:'保护伞',
                        rentstartData:'2017-12-28',
                        rentEndData:'2018-12-27',
                        monthRent:'1000.00',
                        monthFee:'45.00',
                        repayData:'12'
                    },
                    {
                        contractNo:'201600120982',
                        contractStatus:0,
                        renterName:'陈大牛',
                        payType:0,
                        agentCompany:'保护伞',
                        rentstartData:'2017-12-28',
                        rentEndData:'2018-12-27',
                        monthRent:'1000.00',
                        monthFee:'45.00',
                        repayData:'12'
                    },
                    {
                        contractNo:'201600120982',
                        contractStatus:0,
                        renterName:'陈大牛',
                        payType:0,
                        agentCompany:'保护伞',
                        rentstartData:'2017-12-28',
                        rentEndData:'2018-12-27',
                        monthRent:'1000.00',
                        monthFee:'45.00',
                        repayData:'12'
                    },
                    {
                        contractNo:'201600120982',
                        contractStatus:0,
                        renterName:'陈大牛',
                        payType:0,
                        agentCompany:'保护伞',
                        rentstartData:'2017-12-28',
                        rentEndData:'2018-12-27',
                        monthRent:'1000.00',
                        monthFee:'45.00',
                        repayData:'12'
                    }
                ]
            }
        },
        methods: {
        }
    }
</script>

<style scoped>
    /* 搜索框样式 */
    .hfq-search-wrap .hfq-cell{margin:0;padding: 0; }
    .hfq-search-wrap .hfq-cell-hd{margin-right: 8px;}
    .hfq-search-wrap .m-search-input{width: 120px;}
    .hfq-search-wrap .m-search-select{width: 120px;}
    .hfq-search-wrap .hfq-search-item{margin-right: 12px;}
    .hfq-search-wrap .hfq-search-item .hfq-cell-hd{width: 60px;text-align: right;}
    .hfq-search-wrap .el-date-editor.el-input{width: 158px;}
    .hfq-search-wrap .hfq-cell-ft.m-button-group{padding-right: 10px;}
    .hfq-search-wrap .hfq-search-item:last-of-type{margin-right: 0;}
    .hfq-search-wrap .el-input__inner{height: 32px;}
    .hfq-search-wrap .row-1{margin-bottom: 8px;}

    /* 表格区 */
    .el-table{font-size: 12px;}
    .hfq-table-wrap{margin-top: 20px;}
    /* 分页 */
    .hfq-pagination-wrap{text-align: center;margin-top: 20px;}
</style>

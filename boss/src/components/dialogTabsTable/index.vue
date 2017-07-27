<template>
    <div class="hfq-dialog-tabs-table" v-show="model.showDialog">
        <el-dialog title="历史合同" v-model="model.showDialog">
            <el-tabs v-model="model.activeIndex">
                <!-- 租客手机号匹配 -->
                <template v-for="(item, index) in tableDataArr">
                    <el-tab-pane :label="item.title" :key="index">
                        <el-table :data="item.tableDisplayData" :fit="false">
                            <el-table-column prop="contract_no" label="合同编号" width="90" ></el-table-column>
                            <el-table-column prop="contract_status_value" label="合同状态" width="90" ></el-table-column>
                            <el-table-column prop="rc_status_value" label="审核状态" width="90" ></el-table-column>
                            <el-table-column prop="user_name" label="租客姓名" width="90" ></el-table-column>
                            <el-table-column prop="user_id_no" label="身份证号" width="120" ></el-table-column>
                            <el-table-column prop="address" label="房源地址" width="140" ></el-table-column>
                            <el-table-column prop="sign_time" label="签约日期" width="110" ></el-table-column>
                            <el-table-column prop="monthly_amount" label="租金" width="90" ></el-table-column>
                            <el-table-column prop="lease_begin" label="开始时间" width="110" ></el-table-column>
                            <el-table-column prop="lease_end" label="结束时间" width="110" ></el-table-column>
                            <el-table-column label="操作" width="90">
                                <template scope="scope">
                                    <a :href="handleAudit(scope.row)" target="_blank">
                                        <el-button type="text">查看</el-button>
                                    </a>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="m-pagination">
                            <el-pagination
                                    v-if="item.tableData.length > pageSize"
                                    :small="small"
                                    :page-size="pageSize"
                                    :total="item.tableData.length"
                                    :current-page="item.currentPage"
                                    :layout="layout"
                                    :page-sizes="pageSizes"
                                    @current-change="currentChange"
                            >
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                </template>
            </el-tabs>
        </el-dialog>
    </div>
</template>

<script>
    export default{
        name: 'hfq-dialog-tabs-table',
        props:{
            value:{
                type: Object,
                default(){
                    return {
                        showDialog: false,
                        activeIndex:0
                    }
                }
            },
            // 表格数据
            data:{
                type: Array,
                required: true
            },
            // 分页的属性
            small: {
                type: Boolean,
                default: true
            },
            pageSize: {
                type: Number,
                default: 4
            },
            pageCount: {
                type: Number
            },
            layout: {
                type: String,
                default: 'prev, pager, next',
            },
            pageSizes: {
                type: Array,
                defaule: [10, 20, 30, 40, 50, 100]
            }
        },
        computed:{
          model:{
              get(){
                  return this.value
              },
              set(){
                  this.$emit('input',this.model)
              }
          }
        },
        data(){
            return {
                tableDataArr:[]
            }
        },
        watch:{
            data:{
                handler(){
                    this.initTableDataArr();
                },
                deep: true
            },
            tableDataArr(){
                this.$forceUpdate();
            }
        },
        methods: {
            // 切换分页时
            currentChange(currentPage){
                let activeIndex = this.model.activeIndex;
                let item = this.tableDataArr[activeIndex];
                item.tableDisplayData = item.tableData.slice((currentPage - 1 ) * this.pageSize,currentPage * this.pageSize);
                // 数据嵌套太深，强制更新
                this.$forceUpdate();
            },
            // 初始化表格数据
            initTableDataArr(){
                this.tableDataArr = this.data.map((item)=>{
                    item.currentPage = 1;
                    // 是否访问过
                    item.visited = false;
                    // 展示的数据
                    item.tableDisplayData = item.tableData.slice(0,this.pageSize);
                    return item
                })
            },
             // 点击查看时
            handleAudit(row){
                console.log(row);
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
        mounted(){
        }
    }
</script>

<style lang="less">
    .hfq-dialog-tabs-table{
        .el-dialog__body{padding-top: 15px;}
        /* 分页组件 */
        .m-pagination {
            text-align: center;
            margin-top: 16px;
        }
    }
</style>

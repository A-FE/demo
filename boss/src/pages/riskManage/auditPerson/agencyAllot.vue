<template>
    <div class="hfq-list-page page-agency-allot">
        <!-- 面包屑 -->
        <div class="hfq-breadcrumb-wrap">
            <el-row type="flex" align="middle" class="hfq-breadcrumb-content">
                <el-col>
                    <el-breadcrumb>
                        <el-breadcrumb-item to="/riskManage/auditPersonList"><i class="el-icon-arrow-left"></i>审核人员管理</el-breadcrumb-item>
                        <el-breadcrumb-item>中介公司分配</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>

            </el-row>
        </div>

        <!-- 内容区 -->
        <main class="hfq-list-page-content">
            <!-- 搜索框 -->
            <div class="hfq-search-wrap">
                <div class="hfq-cell row-1">
                    <div class="hfq-cell-hd hfq-cell hfq-search-item">
                        <div class="hfq-cell-hd ">中介公司</div>
                        <div class="hfq-cell-bd">
                            <hfq-search-agency v-model="searchForm.agencyid"></hfq-search-agency>
                        </div>
                    </div>
                    <div class="hfq-cell-hd hfq-cell hfq-search-item">
                        <div class="hfq-cell-hd ">审核人</div>
                        <el-select v-model="searchForm.oper_id" filterable class="m-search-input">
                            <el-option label="不限" value=""></el-option>
                            <el-option
                                v-for="item in auditList"
                                :key="item.f_oper_id"
                                :label="item.f_oper_name"
                                :value="item.f_oper_id">
                            </el-option>
                        </el-select>
                    </div>
                     <div class="hfq-cell-bd hfq-cell-primary hfq-search-item m-button-group">
                        <el-button @click="search" type="primary">搜索</el-button>
                        <el-button @click="Object.assign(searchForm,resetForm)">重置</el-button>
                    </div>
                </div>
            </div>
            <!-- 表格 -->
            <div class="hfq-table-wrap">
                <el-button class="search" type="primary" @click="distributionPerson">分配给</el-button>
                <el-button style="float:right" type="primary" @click="isShowAgencyAuditPersonReplace = true">审核轮换</el-button>
                <el-table :data="currentTableData"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="60"></el-table-column>
                    <el-table-column prop="name" label="中介公司"></el-table-column>
                    <el-table-column prop="f_oper_id" :formatter="formatterAuditOper" label="审核人" width="300"></el-table-column>
                    <el-table-column label="操作" width="200">
                        <template scope="scope">
                            <el-button class="delete" :disabled="!scope.row.f_oper_id" type="text" @click="open2(scope.$index,scope.row)">移除审核人</el-button>
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

        <!-- 中介公司分配弹框 -->
        <el-dialog title="选择审核人" v-model="isShowAgencyAllocationPerson" >
            <template>
                <div v-for="item in auditList" class="hfq-cell" style="width:400px;">
                    <el-radio v-model="radio" :value="item.f_allot_oper_id" :label="item.f_oper_id">{{item.f_oper_name}}</el-radio>
                </div>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowAgencyAllocationPerson = false">取 消</el-button>
                <el-button type="primary" @click="submitAudit">提 交</el-button>
            </div>
        </el-dialog>

        <!-- 审核轮换弹框 -->
        <el-dialog title="选择两位审核人轮换" v-model="isShowAgencyAuditPersonReplace" >
            <el-table class="el-table-margin" :data="auditList" ref="multipleTable" height="540"
                border
                tooltip-effect="dark"
                @selection-change="handleSelectionChange1">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="f_oper_name" label="审核人" width="345"></el-table-column>
            </el-table>

            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowAgencyAuditPersonReplace = false">取 消</el-button>
                <el-button type="primary" @click="auditReplace">提 交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import vueMethods from 'src/assets/js/vueMethods'
    export default{
        name: 'page-agency-allot',
        mixins: [vueMethods],
        data(){
            return {
                // 分页数据
                total: 0,
                currentPage: 1,
                pageSize: 20,
                // 审核人员的数据
                auditList:[],
                // 所有数据
                allTableData:[],
                // 当前显示的列表数据
                currentTableData: [],
                // 中介公司数据
                companyData:[],
                // 选中的中介公司
                multipleSelection: [],
                // 选中的中介公司id
                agency_ids: [],
                // 审核轮换人
                auditReplaceList:[],
                auditReplaceForm:{
                    oper_a_id:'',
                    oper_b_id:''
                },
                // 搜索条件查询参数
                searchForm:{
                    name:'',
                    agencyid:'',
                    oper_id:'',
                    oper_id_value:'',
                },
                // 重置的表单
                resetForm:{
                    name:'',
                    oper_id: '',
                    oper_id_value:'',
                },
                // 分配审核弹框控制
                isShowAgencyAllocationPerson: false,
                //审核轮换弹框控制
                isShowAgencyAuditPersonReplace: false,
                radio: '',
            }
        },
        computed:{
            usersInfo(){
                return this.$store.state.usersInfo
            }
        },
        watch:{
            usersInfo(){
                // 执行搜索
                this.getTableData();
            },
            searchForm:{
                handler(val){
//                    console.log(val);
                },
                deep: true
            }
        },
        methods: {
            // 列表多选返回值
            handleSelectionChange(val) {
                this.agency_ids = [];
                this.multipleSelection = val;
                val.map(item => {
                    this.agency_ids.push(item.agencyid);
                })
            },
            //审核轮换多选返回值
            handleSelectionChange1(val) {
                this.auditReplaceList = [];
                this.auditReplaceList = val;
                if(this.auditReplaceList.length === 2){
                    this.auditReplaceForm.oper_a_id = this.auditReplaceList[0].f_oper_id;
                    this.auditReplaceForm.oper_b_id = this.auditReplaceList[1].f_oper_id;
                }
            },
            // 提交审核轮换人
            auditReplace(){
                if(this.auditReplaceList.length !== 2 ){
                    return this.$message('请选择两位审核轮换人');
                }
                this.$axios.patch(`/v2/api/audit/oper/agencies/exchange/`,this.auditReplaceForm)
                .then( res => {
                   this.$message.success('提交成功');

                   this.getAuditList();
                   this.getTableData();
                   this.auditReplaceForm = {
                        oper_a_id:'',
                        oper_b_id:''
                    }
                })
            },
            // 提交审核人
            submitAudit(){
                if(this.radio === ''){
                    return this.$message('请选择审核人');
                }
                this.$axios.post(` /v2/api/audit/oper/${this.radio}/agencies/`,{
                    agency_ids: this.agency_ids
                })
                .then( res => {
                   this.$message.success('提交成功');
                   this.radio = '';
                   this.isShowAgencyAllocationPerson = false;
                   this.getTableData();
                })
            },
            // 页码改变时
            currentChange(currentPage){
                this.currentPage = currentPage;
                this.getDisplayTableData();
            },
            // 获取审核人员数据
            getAuditList(){
                this.$axios.get(`/v2/api/audit/opers/`)
                    .then( res => {
                        this.auditList = res.data.result;
                    })
            },
            //分配给弹框
            distributionPerson(){
                if(this.multipleSelection.length === 0){
                    return this.$message('请选择要分配的中介公司数据');
                }
                for(let i in this.multipleSelection){
                    if(this.multipleSelection[i].f_oper_id !== null){
                        this.$message(this.multipleSelection[i].name+'已分配，请选择其他中介公司');
                        return false;
                    }
                }
                this.isShowAgencyAllocationPerson = true;
            },
            // 获取所有中介公司列表
            getAllCompanyData(){
                this.$axios.get(`/v2/api/agencys?limit=0`)
                    .then(res => {
                        this.companyData = res.data;
                    })
            },
            // 获取表格列表
            getTableData(){
                this.$axios.get(`/v2/api/audit/oper/agencies/?agency_id=${this.searchForm.agencyid}&oper_id=${this.searchForm.oper_id}&limit=0`)
                    .then(res => {
                        this.total = res.data.result.length;
                        this.allTableData = res.data.result;
                        this.getDisplayTableData();
                    });
                    this.currentPage = 1;
            },
            // 获取用来展示的tableData
            getDisplayTableData(){
                this.currentTableData = this.allTableData.slice((this.currentPage-1)*this.pageSize, (this.currentPage) * 20);
            },
            // 搜索
            search(){
                this.getTableData();
            },
            // 移除审核人确认框
            open2(index,row) {
                this.$confirm('是否移除审核人？', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                }).then(() => {
                    this.deleteAudit(index,row);
                }).catch(() => {});
            },
            // 移除审核人接口
            deleteAudit(index,row){
                this.$axios.all([
                    this.$axios.delete(`/v2/api/audit/oper/${row.f_oper_id}/agencies/${row.agencyid}`)
                ])
                .then(this.$axios.spread((res1) => {
                    this.$message.success('移除成功');
                    this.getTableData();
                }))
            },
            // 格式化审核人
            formatterAuditOper(row){
                return this.getUserNameFromEmail(row.f_oper_id, this.usersInfo);
            },
        },
        //初始化列表
        created(){
            // 获取审核人员列表
            this.getAuditList();
            // 获取所有中介公司数据
            this.getAllCompanyData();
            // 获取表格列表
            this.getTableData();
        }
    }
</script>

<style lang="less">
    .page-agency-allot{
        .hfq-table-wrap{
            margin-top: 20px;
        }
        .hfq-search-wrap{
            padding:10px 10px 10px 10px;
        }
        .hfq-table-wrap .search{
            margin-bottom: 10px;
        }
        .hfq-pagination-wrap{
            text-align: center;
            margin-top: 15px;
        }
        .el-dialog__body{
            padding: 10px 20px;
        }
        .el-table-margin{
            margin-top: 10px;
        }
        .el-table .cell{
            padding: 7px 20px
        }
    }

</style>

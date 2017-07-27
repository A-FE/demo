<template>
    <div class="hfq-list-page page-audit-person-list">
        <!-- 面包屑 -->
        <div class="hfq-breadcrumb-wrap">
            <el-row type="flex" align="middle" class="hfq-breadcrumb-content">
                <el-col>
                    <el-breadcrumb>
                        <el-breadcrumb-item>审核人员管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
        </div>

        <!-- 内容区 -->
        <main class="hfq-list-page-content">
            <!-- 表格 -->
            <div style="margin:15px 0 10px 0">
                <div class="hfq-cell" style="float:right">
                    <template v-if="isGetUserJurisdiction">
                        <router-link to="/riskManage/agencyAllot">
                            <el-button v-if="userJurisdiction['audit_user_agency.read']" style="float:right;"  type="primary">中介公司分配</el-button>
                        </router-link>
                    </template>
                    <template v-if="isGetUserJurisdiction">
                        <el-button v-if="userJurisdiction['audit_user.create']" style="margin-left:15px;" @click="addAuditPersonMask = true">新增审核人员</el-button>
                    </template>
                </div>
            </div>
            <div class="hfq-table-wrap" style="margin: 15px auto;">
                <el-table :data="tableData" v-if="isGetUserJurisdiction">
                    <el-table-column prop="f_oper_name" label="审核人员" width="160"></el-table-column>
                    <el-table-column prop="f_oper_id" label="邮箱账号" width="300"></el-table-column>
                    <el-table-column prop="f_allot_type" label="审核类型" width="280" :formatter="formatterAllotType"></el-table-column>
                    <el-table-column prop="f_state" label="状态" width="200" :formatter="formatterState"></el-table-column>
                    <el-table-column label="操作" min-width="120">
                        <template scope="scope">
                            <el-button v-if="userJurisdiction['audit_user.update']" type="text" @click="update(scope.$index,scope.row)">修改</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </main>

        <!-- 新增审核人员弹框 -->
        <el-dialog title="新增审核人员" v-model="addAuditPersonMask" >
            <el-form :model="auditPersonForm" label-width="left">
                <el-form-item label="审核人" label-width="left">
                      <el-select v-model="auditPersonForm.f_oper_id" filterable placeholder="请选择">
                        <el-option
                          v-for="item in auditPersonList"
                          :key="item.oper_id"
                          :label="item.oper_name"
                          :value="item.oper_id">
                            <span style="float: left">{{ item.oper_name }}</span>
                            <span style="float: right;  font-size: 13px">{{ item.oper_id }}</span>
                        </el-option>
                      </el-select>
                </el-form-item>
                <el-form-item label="启用派单">
                    <el-radio-group v-model="auditPersonForm.f_state">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="审核类型">
                    <div class="hfq-cell">
                        <div class="hfq-cell-bd">
                            B端：
                        </div>
                        <div class="hfq-cell-bd">
                            <template>
                                <el-checkbox-group v-model="auditPersonForm.f_allot_type">
                                    <el-checkbox :label="1">一审</el-checkbox>
                                    <el-checkbox :label="2">二审</el-checkbox>
                                    <el-checkbox :label="4">三审</el-checkbox>
                                </el-checkbox-group>
                            </template>
                        </div>
                    </div>
                    <div class="hfq-cell">
                        <div class="hfq-cell-bd">
                            C端：
                        </div>
                        <div class="hfq-cell-bd">
                            <template>
                                <el-checkbox-group v-model="auditPersonForm.f_allot_type">
                                    <el-checkbox :label="16">一审</el-checkbox>
                                    <el-checkbox :label="32">二审</el-checkbox>
                                </el-checkbox-group>
                            </template>
                        </div>
                    </div>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="addAuditPersonMask = false">取 消</el-button>
                <el-button type="primary" @click="addPerson">提 交</el-button>
            </div>
        </el-dialog>

        <!-- 修改审核人员弹框 -->
        <el-dialog title="修改审核人员" v-model="upAuditPersonMask" >
            <el-form :model="upAuditPersonForm" label-width="left">
                <el-form-item label="审核人姓名" label-width="left">
                    {{upAuditPersonForm.f_oper_name}}
                </el-form-item>
                <el-form-item label="审核人邮箱" label-width="left">
                    {{upAuditPersonForm.f_oper_id}}
                </el-form-item>
                <el-form-item label="启用派单">
                    <el-radio-group v-model="upAuditPersonForm.f_state">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="审核类型">
                    <div class="hfq-cell">
                        <div class="hfq-cell-bd">B端： </div>
                        <div class="hfq-cell-bd">
                           <template>
                                <el-checkbox-group v-model="upAuditPersonForm.f_allot_type">
                                    <el-checkbox :label="1">一审</el-checkbox>
                                    <el-checkbox :label="2">二审</el-checkbox>
                                    <el-checkbox :label="4">三审</el-checkbox>
                                </el-checkbox-group>
                            </template>
                        </div>
                    </div>
                    <div class="hfq-cell">
                        <div class="hfq-cell-bd">C端：</div>
                        <div class="hfq-cell-bd">
                            <template>
                                <el-checkbox-group v-model="upAuditPersonForm.f_allot_type">
                                    <el-checkbox :label="16">一审</el-checkbox>
                                    <el-checkbox :label="32">二审</el-checkbox>
                                </el-checkbox-group>
                            </template>
                        </div>
                    </div>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="upAuditPersonMask = false">取 消</el-button>
                <el-button type="primary" @click="subUpDate">提 交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Vue from 'vue'
    import vueMethods from 'src/assets/js/vueMethods'

    Vue.component('m-search-input',{
        functional: true,
        render(h,ctx){
            let item = ctx.props.item;
            return h('li',ctx.data,[
                h('div',{attrs:{class:'name'}},[item.oper_name]),
                h('span',{attrs:{class:'addr'}},[item.oper_id])
            ]);
        },
        props:{
            item: {type:Object,required: true}
        }
    });
    export default{
        name: 'page-audit-person-list',
        mixins: [vueMethods],
        data(){
            return {
                // 列表总共多少条
                total:0,
                // 列表数据
                tableData:[],
                // 审核人列表
                auditPersonList: [],
                // 新增审核人员弹框是否显示
                addAuditPersonMask: false,
                // 修改审核人员是否显示
                upAuditPersonMask: false,
                //新增审核人员参数
                auditPersonForm: {
                  f_oper_id: '',
                  f_state:1,
                  f_allot_type:[1]
                },
                //修改审核人员参数
                upAuditPersonForm: {
                    f_oper_id: "",
                    f_allot_oper_id: 0,
                    f_allot_type:[],
                    f_oper_name: "",
                    f_state: 0
                },
                // 审核权限
                userJurisdiction:{}
            }
        },
        computed:{
            // 审核权限是否请求完毕
            isGetUserJurisdiction(){
                return this.$store.state.isGetUserJurisdiction
            }
        },
        watch:{
            isGetUserJurisdiction(){
                Object.assign(this.userJurisdiction,this.$store.state.userJurisdiction);
            }
        },
        methods: {
            //获取列表
            getPersonData(){
                this.$axios.all([
                    this.$axios.get('/v2/api/audit/opers/')
                ])
                .then(this.$axios.spread((res1) => {
                    this.tableData = res1.data.result;
                }))
            },
            // 获取审核人
            getAuditPerson(){
                this.$axios.all([
                    this.$axios.get('/api/auth/user/get/?page_limit=0')
                ])
                .then(this.$axios.spread((res1) => {
                   this.auditPersonList = res1.data.result.users;
                }))
            },
            // 新增审核人员
            addPerson(){
                if(this.auditPersonForm.f_allot_type.length === 0){
                    return this.$message('请选择审核类型');
                }
                if(this.auditPersonForm.f_oper_id === ''){
                    return this.$message('请选择审核人邮箱');
                }
                if(this.tableData.find((item) => item.f_oper_id === this.auditPersonForm.f_oper_id)){
                    return this.$message('审核人已存在');
                }
                this.$axios.all([
                    this.$axios.post('/v2/api/audit/opers/',this.auditPersonForm)
                ])
                .then(this.$axios.spread((res1) => {
                      this.$message('添加成功');
                      this.addAuditPersonMask = false;
                      this.getPersonData();
                }))
            },
            //修改审核人
            update(index,row){
                this.upAuditPersonMask = true;
                this.upAuditPersonForm.f_allot_type = row.f_allot_type;
                this.upAuditPersonForm.f_oper_id = row.f_oper_id;
                this.upAuditPersonForm.f_allot_name = row.f_allot_name;
                this.upAuditPersonForm.f_allot_oper_id = row.f_allot_oper_id;
                this.upAuditPersonForm.f_state = row.f_state;
                this.upAuditPersonForm.f_oper_name = row.f_oper_name;
            },
            // 提交修改审核人
            subUpDate(){
                if(this.upAuditPersonForm.f_allot_type.length === 0){
                    return this.$message('请选择审核类型');
                }
                this.$axios.all([
                    this.$axios.patch(`/v2/api/audit/opers/${this.upAuditPersonForm.f_allot_oper_id}`,this.upAuditPersonForm)
                ])
                .then(this.$axios.spread((res1) => {
                    this.upAuditPersonMask = false;
                    this.$message('修改成功');
                    this.getPersonData();
                }))
            },
            // 格式化审核类型
            formatterAllotType(row){
                //审核类型的枚举值
                let type = row.f_allot_type;
                // 全局的审核类型的枚举值
                let auditType = this.$store.state.auditType;
                let resultStr = '';
                for(var i = 0; i < type.length; i ++){
                    for(var j = 0; j < auditType.length; j ++){
                        if(type[i] === auditType[j].value){
                             resultStr += auditType[j].label + '、';
                        }
                    }
                }
                return resultStr.slice(0,-1);
            },
            // 格式化状态
            formatterState(row){
                if(row.f_state === 1){
                    return '启用派单'
                }else if(row.f_state === 0){
                    return '暂停派单'
                }
            },
        },
        //初始化列表
        created(){
            // 设置当前激活菜单
            this.$store.commit('setActiveIndex','2-6');
            this.getPersonData();
            this.getAuditPerson();
        },
        mounted(){
            Object.assign(this.userJurisdiction,this.$store.state.userJurisdiction);
        }
    }
</script>

<style lang="less">
    .page-audit-person-list{
        /* 表格区 */
        .el-table{font-size: 14px;}
        .el-table .cell{padding: 10px;}
        /* 分页 */
        .hfq-pagination-wrap{text-align: center;margin-top: 10px;}
        /* 其他样式 */
        .hfq-breadcrumb-wrap{margin-bottom: 6px;}
        .hfq-audit-view{
            margin-left: 15px;
        }
        .hfq-cell-right{
            float: right;
            margin-top: 10px;
        }
        .delete{
            color: #f15555;
        }
        .el-dialog{
            width: 400px;
        }
        .el-dialog .el-form-item__content{
            float: left;
            width: 250px;
        }
        .el-dialog .el-form-item{
            margin-bottom: 10px;
        }
        .el-dialog .el-dialog__body{
            padding: 20px 0 10px 20px;
        }

        .hfq-table-wrap .cell{
            padding: 10px 15px;
        }

        .my-autocomplete {
            li {
                line-height: normal;
                padding: 7px;

                .name {
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
                .addr {
                    font-size: 12px;
                    color: #b4b4b4;
                }

                .highlighted .addr {
                    color: #ddd;
                }
            }
        }
    }
</style>

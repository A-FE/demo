<!-- 地址别名管理 -->
<template>
    <div class="page-area-other-name hfq-list-page">
        <!-- 面包屑 -->
        <div class="hfq-breadcrumb-wrap">
            <el-row type="flex" align="middle" class="hfq-breadcrumb-content">
                <el-col>
                    <el-breadcrumb>
                        <el-breadcrumb-item>地址别名管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
                <el-col class="hfq-align-right">
                    <el-button type="primary" @click="handleOpenDialog">添加地址别名</el-button>
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
                        <div class="hfq-cell-hd ">地址名称</div>
                        <div class="hfq-cell-bd">
                            <el-input v-model="searchForm.f_name" placeholder="请输入" class="m-search-input"></el-input>
                        </div>
                    </div>
                    <div class="hfq-cell-hd hfq-cell hfq-search-item">
                        <div class="hfq-cell-hd">是否有效</div>
                        <div class="hfq-cell-bd">
                            <el-select v-model="searchForm.f_state" filterable class="m-search-input">
                                <el-option label="不限" value=""></el-option>
                                <el-option label="有效" :value="1"></el-option>
                                <el-option label="无效" :value="0"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="hfq-search-item m-button-group">
                        <el-button type="primary" @click="handleClickSearch">搜索</el-button>
                        <el-button @click="Object.assign(searchForm,resetForm)">重置</el-button>
                    </div>
                </div>
            </div>

            <!-- 表格内容区 -->
            <div class="hfq-table-wrap">
                <el-table :data="currentTableData" :row-class-name="tableRowClassName">
                    <el-table-column label="地址名称（常用名+别名）" min-width="400">
                        <template scope="scope">
                             <div v-for="(item, index) in scope.row.f_name" class="table-item-inner-row dots"><i :class="index%3 === 0 ? 'circle-blue': (index%3 === 1 ? 'circle-yellow' : 'circle-red')"></i>{{item}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" min-width="300">
                        <template scope="scope">
                            <div v-for="(item, index) in scope.row.f_remarks" class="table-item-inner-row">{{ item}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="f_state" :formatter="formateIsValid" label="是否有效" width="140"></el-table-column>
                    <el-table-column label="操作" width="200">
                        <template scope="scope">
                            <el-button v-if="scope.row.f_state === 0" :disabled="true" type="text">置为无效</el-button>
                            <el-button v-else-if="scope.row.f_state === 1" type="text" @click="setInvalid(scope.row,0,'置为无效')">置为无效</el-button>
                            <el-button v-if="scope.row.f_state === 0" :disabled="true" type="text">补录</el-button>
                            <el-button v-if="scope.row.f_state === 1" type="text" @click="handleChange(scope.row)">补录</el-button>
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

        <!-- 添加地址别名的弹框 -->
        <el-dialog title="添加地址别名" v-model="dialogFormVisible" class="dialog-wrap-1">
            <template slot="title">
                <div class="dialog-title">添加地址别名</div>
            </template>
            <div>
                <el-row type="flex" align="top" :gutter="10" class="dialog-input-title">
                    <el-col class="column-0"></el-col>
                    <el-col class="column-1 is-required">地址名称
                        <span style="font-size:12px;">（输入省市时，请去掉"省""市"文字）</span>
                        <span style="font-size:12px;">50</span>
                        <span style="font-size:12px;">字</span>
                    </el-col>
                    <el-col class="column-3 is-required">备注
                        <span style="font-size:12px;">30</span>
                        <span style="font-size:12px;">字</span>
                    </el-col>
                    <el-col class="column-4"></el-col>
                </el-row>
                <el-row type="flex" align="top" :gutter="10" v-for="(item,index) in dialogForm" :key="index"
                        class="dialog-input-content">
                    <el-col class="column-0" v-if="index === 0">
                        常用名
                    </el-col>
                    <el-col class="column-0" v-if="index !== 0">
                        别名{{index}}
                    </el-col>
                    <el-col class="column-1">
                        <el-input type="textarea" v-model="item.f_name" placeholder="例：湖南省长沙市 请输入 湖南长沙"
                                  :autosize="{minRows: 2, maxRows: 2}" :maxlength="50" :disabled="item.disabled" @change="item.isValid = true">

                        </el-input>
                        <span v-if="!item.disabled" :class="item.isValid ? 'is-ok' : 'is-error'">该名称已经存在</span>
                    </el-col>
                    <el-col class="column-3">
                        <el-input type="textarea" v-model="item.f_remarks" placeholder="请输入内容"
                                  :autosize="{minRows: 2, maxRows: 2}" :maxlength="30" :disabled="item.disabled"></el-input>
                    </el-col>
                    <el-col class="column-4">
                        <el-button v-if="item.showDelete && !item.disabled" type="danger" icon="delete" @click="handleRemove(index)"></el-button>
                    </el-col>
                </el-row>
            </div>
            <div slot="footer" class="dialog-footer">
               <el-row type="flex">
                   <el-col style="text-align: left;">
                       <el-button @click="handleAdd">新增地址别名</el-button>
                   </el-col>
                   <el-col class="hfq-align-right">
                       <el-button @click="dialogFormVisible = false">取 消</el-button>
                       <el-button type="primary" @click="handleSubmit">提 交</el-button>
                   </el-col>
               </el-row>
            </div>
        </el-dialog>

        <!-- 用来展示信息的弹框 -->
        <el-dialog title="提示" v-model="dialogVisible" class="dialog-wrap-2">
            <div class="dialog-title">您添加的信息为</div>
            <!-- 展示的信息 -->
            <div v-for="(item, index) in dialogForm" style="margin-bottom:15px;" v-if="!item.disabled">
                <div class="hfq-cel-hd hfq-cell" style="margin-right: 20px;">
                    <div class="hfq-cell-hd title" v-if="index === 0">常用名：</div>
                    <div class="hfq-cell-hd title" v-if="index !== 0">别名{{index}}：</div>
                    <div class="hfq-cell-bd hfq-cell-bd-1">{{item.f_name}}</div>
                </div>
                <div class="hfq-cell">
                    <div class="hfq-cell-hd title">备注：</div>
                    <div class="hfq-cell-bd">{{item.f_remarks}}</div>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirm">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default{
        name: 'page-area-other-name',
        data(){
            return {
                // 分页数据
                total: 0,
                currentPage: 1,
                pageSize: 10,
                searchForm: {
                    f_name: '',
                    f_state: ''
                },
                resetForm: {
                    f_name: '',
                    f_state: ''
                },
                tableData: [],
                // 当前显示的列表数据
                currentTableData: [],
                dialogForm: [
                    {
                        f_name: '',
                        f_remarks: '',
                        disabled: false,
                        showDelete: false,
                        isValid:false
                    },
                    {
                        f_name: '',
                        f_remarks: '',
                        disabled: false,
                        showDelete: false,
                        isValid:true
                    }
                ],
                resetDialogForm:[
                    {
                        f_name: '',
                        f_remarks: '',
                        disabled: false,
                        showDelete: false,
                        isValid:true
                    },
                    {
                        f_name: '',
                        f_remarks: '',
                        disabled: false,
                        showDelete: false,
                        isValid:true
                    }
                ],
                dialogFormVisible: false,
                dialogVisible: false,
                f_upstream_id:0,
                // 是否为新增，true/false
                status:1
            }
        },
        methods: {
            // 页码改变时
            currentChange(currentPage){
                this.currentPage = currentPage;
                this.getDisplayTableData();
            },
            // 获取用来展示的tableData
            getDisplayTableData(){
                this.currentTableData = this.tableData.slice((this.currentPage-1)*this.pageSize, (this.currentPage) * this.pageSize);
            },
            //获取地址别名列表
            getVillageName(){
                this.$axios.get(`/v2/api/audit/aliases/?f_state=${this.searchForm.f_state}&f_name=${this.searchForm.f_name}`)
                .then((res) => {
                    this.total = res.data.results.length;
                    this.tableData = res.data.results;
                    this.getDisplayTableData();
                })
                this.currentPage = 1;
            },
            // 搜索
            handleClickSearch(){
                if(this.searchForm.f_name === ''){
                    this.tableData = [];
                    return this.$message('搜索关键字不能为空');
                }
                this.getVillageName();
            },
            // 置为无效
            setInvalid(row,state,text){
                this.$confirm('是否'+text, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.patch(`/v2/api/audit/aliases/${row.f_upstream_id}`,{
                        f_state:state
                    })
                    .then((res) => {
                        this.$message({
                            type: 'success',
                            message: text+'成功'
                        });
                        this.getVillageName();
                    })
                }).catch(() => {});
            },
            // 打开添加地址别名的弹框
            handleOpenDialog(){
                this.dialogFormVisible = true;
                this.dialogForm = [
                    {
                        f_name: '',
                        f_remarks: '',
                        disabled: false,
                        showDelete: false,
                        isValid:true
                    },
                    {
                        f_name: '',
                        f_remarks: '',
                        disabled: false,
                        showDelete: false,
                        isValid:true
                    }
                ]
            },
            // 增加地址别名
            handleAdd(){
                this.dialogForm.push({
                    f_name: '',
                    f_remarks: '',
                    disabled: false,
                    showDelete: true,
                    isValid:true,
                    f_upstream_id:this.f_upstream_id
                })
            },
            // 补录
            handleChange(item){
                this.status = 0;
                if(Array.isArray(item.f_name) && Array.isArray(item.f_remarks)){
                    this.dialogForm = [];
                    item.f_name.forEach( (name,index) => {
                        this.f_upstream_id = item.f_upstream_id;
                            this.dialogForm.push({
                                f_name: name,
                                f_remarks: item.f_remarks[index],
                                f_upstream_id: item.f_upstream_id,
                                disabled: true,
                                showDelete: false,
                                isValid:true
                            })
                    })
                    this.dialogForm.push({
                        f_name: '',
                        f_remarks: '',
                        disabled: false,
                        showDelete: false,
                        isValid:true,
                        f_upstream_id: this.f_upstream_id
                    })
                }
                this.dialogFormVisible = true;
            },
            // 删除地址别名
            handleRemove(index){
                this.dialogForm.splice(index,1);
            },
            // 提交弹框表单
            handleSubmit(){
                let isValid = this.checkDialogForm();
                this.dialogVisible = isValid;
            },
            // 确认
            confirm(){
                    let dialogForm = [];
                    if(this.status === 0){
                        dialogForm = this.dialogForm.filter((item,i) => !item.disabled)
                    }else{
                        dialogForm = this.dialogForm;
                    }
                    // 提交成功之后的回调函数
                    this.$axios.post(`/v2/api/audit/aliases/`,dialogForm)
                    .then((res) => {
                        // this.dialogForm[0].isValid = false;
                            this.$message.success('操作成功');
                            this.dialogFormVisible = false;
                            this.dialogForm = this.resetDialogForm;
                            this.dialogVisible = false;
                    })
                    .catch((res) => {
                        let arr = res.data.exist_names;
                            if(Array.isArray(arr)){
                                arr.map( (item) =>{
                                    this.dialogForm = this.dialogForm.map((val) => {
                                        if(item === val.f_name){
                                            val.isValid = false;
                                        }
                                        return val;
                                    })
                                })
                            }else{
                                throw new TypeError('参数错误')
                            }
                            this.dialogVisible = false;
                    })
            },
            // 验证地址别名是否重复
            checkIsRepeat(array){
                // 判断是否重名,arr里面存着重名的元素
                let arr = array.filter( (item,index) => {
                    let dialogForm = [...array];
                    let a = dialogForm.splice(index,1)[0];
                    return dialogForm.findIndex( n => n.f_name === a.f_name) !== -1 ;
                })
                return arr.length
            },
            // 弹框表单验证
            checkDialogForm(){
                // 校验是否为空
                let isEmpty = this.dialogForm.find( item => {
                    return item.f_name === '' ||  item.f_remarks === ''
                });
                if(isEmpty){
                    // 如果为空
                    this.$message.warning('请完善信息后提交')
                    return false
                }

                // 校验是否有重名的元素
               let isRepeat = this.checkIsRepeat(this.dialogForm);
               if(isRepeat){
                    this.$message.warning('地址名称重复')
                    return false
                }

                return true
            },
            // 格式化是否有效
            formateIsValid(row){
                switch (row.f_state) {
                    case 0:
                        return '否'
                        break
                    case 1:
                        return '是'
                        break
                    default:
                        return ''
                }
            },
            tableRowClassName(row, index) {
                if (index === 1) {
                  return 'info-row';
                } else if (index === 3) {
                  return 'positive-row';
                }
                return '';
            }
        }
    }
</script>

<style lang="less">
    .page-area-other-name {
        /* 搜索框样式 */
        .hfq-search-wrap {
            .hfq-cell {
                margin: 0;
                padding: 0;
            }
            .hfq-cell-hd {
                margin-right: 8px;
            }

            .m-search-input {
                width: 120px;
            }

            .m-search-select {
                width: 120px;
            }

            .hfq-search-item {
                margin-right: 12px;
            }

            .hfq-search-item .hfq-cell-hd {
                width: 60px;
                text-align: right;
            }

            .el-date-editor.el-input {
                width: 158px;
            }

            .hfq-cell-ft.m-button-group {
                padding-right: 10px;
            }

            .hfq-search-item:last-of-type {
                margin-right: 0;
            }
            .el-input__inner {
                height: 32px;
            }
        }

        /* 表格 */
        .hfq-table-wrap{
            margin-top: 20px;
        }
        .el-table{
            font-size: 14px;
        }



        /* table-地址别名 */
        .table-item-inner-row{
            height: 36px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            position: relative;
        }
        .table-item-inner-row.dots{
            padding-left: 10px;
        }
        .table-item-inner-row + .table-item-inner-row{
            margin-top: 10px;
        }
        /* 小圆点 */
        [class^='circle-']{
            content: '';
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            position: absolute;
            left: 0;
            top:6px;
        }
        .circle-red{background: rgba(19,193,102,0.90);  top:10px; }
        .circle-yellow{background: #F7BA2A; top:10px;}
        .circle-blue{background: #FF7D7D; top:10px;}


        /* 弹框一 */
        .dialog-wrap-1 {
            /* 弹框输入框上面的标题 */
            .dialog-input-title {
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #5E6D82;
                letter-spacing: 0;
                line-height: 30px;
            }
            .el-dialog__body {
                padding-top: 22px;
            }
            .column-0{
                width: 55px;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #5E6D82;
                letter-spacing: 0;
                padding-top: 5px;
            }
            .column-1 {
                width: 260px;
            }
            .column-2 {
                width: 160px;
            }
            .column-3 {
                width: 160px;
            }
            .column-4{
                width: 50px;
            }

            .dialog-input-content + .dialog-input-content{
                margin-top: 10px;
            }
            .dialog-title-tip{
                font-family: PingFangSC-Regular;
                font-size: 12px;
                color: #FF4949;
                letter-spacing: 0;
                line-height: 12px;
                margin-left: 8px;
            }
            .dialog-title{
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #1F2D3D;
                letter-spacing: 0;
                line-height: 16px;
                display: inline-block;
            }
        }

        /* 弹框二 */
        .dialog-wrap-2{
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #475669;
            letter-spacing: 0;
            line-height: 14px;
            .dialog-title{margin-bottom: 15px;}
            .el-dialog{min-width: 400px;}
            .hfq-cell-hd.title{width: 60px;}
            .hfq-cell-bd{min-width: 100px;}
            .hfq-cell-bd-1{width: 200px;}
            .hfq-cell .hfq-cell{margin: 0;padding: 0;}
        }
        .table-item-inner-row{
            height: 25px;
            line-height: 25px;
            margin:0;
        }
        .dialog-wrap-1 .dialog-input-content + .dialog-input-content{
            margin-top: 20px;
        }
        .dialog-wrap-1 .column-0{
            margin-top: 13px;
        }
        .el-dialog__body .el-button:not(.el-button--text){
            margin-top: 11px;
        }
        .dialog-wrap-1 .column-1{
            width:350px;
        }
        .el-dialog__body ::-webkit-input-placeholder { /* WebKit browsers */
            font-size:12px;
        }
        .is-error{
            opacity: 1;
            color:red;
            font-size: 12px;
        }
        .is-ok{
            opacity: 0;
        }
        .el-table .info-row {
            background: #eceef0;
        }

        .el-table .positive-row {
            background: #eceef0;
        }
        .hfq-pagination-wrap{
            text-align: center;
            margin-top: 15px;
        }

    }
</style>

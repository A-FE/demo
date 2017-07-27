<!-- 还款计划单处理 -->
<template>
    <div class="hfq-repay-handle hfq-component">
        <div class="hfq-component-title">还款单处理</div>
        <div class="hfq-component-content">
            <div class="hfq-cell" style="margin-bottom: 10px;">
                <div class="hfq-cell-hd">问题类型</div>
                <div class="hfq-cell-bd ">
                    <el-select v-model="form.questionType" class="el-select-180">
                        <el-option label="租客违约不住" value="00001"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="hfq-cell" style="align-items: flex-start;">
                <div class="hfq-cell-hd">备注</div>
                <div class="hfq-cell-bd">
                    <el-input v-model="form.remark" type="textarea" row="4"></el-input>
                </div>
            </div>

            <!-- 按钮组 -->
            <div class="hfq-cell">
                <div class="hfq-cell-hd"></div>
                <div class="hfq-cell-bd btn-group">
                    <el-button type="primary">提交</el-button>
                    <el-button type="primary" @click="showDialog = true">发起平账</el-button>
                </div>
            </div>

        </div>

        <!-- 发起平账的弹框 -->
        <el-dialog v-model="showDialog" tilte="发起平账">
            <!-- 还款信息 -->
            <div class="hfq-cell">
                <div class="hfq-cell-hd hfq-cell">
                    <div class="hfq-cell-hd">月还款额</div>
                    <div class="hfq-cell-bd">1560.00元</div>
                </div>
                <div class="hfq-cell-hd hfq-cell">
                    <div class="hfq-cell-hd">滞纳金</div>
                    <div class="hfq-cell-bd">1560.00元</div>
                </div>
                <div class="hfq-cell-hd hfq-cell">
                    <div class="hfq-cell-hd">本期应还</div>
                    <div class="hfq-cell-bd">1560.00元</div>
                </div>
                <div class="hfq-cell-hd hfq-cell">
                    <div class="hfq-cell-hd">还款日期</div>
                    <div class="hfq-cell-bd">2016-09-30</div>
                </div>
                <div class="hfq-cell-hd hfq-cell">
                    <div class="hfq-cell-hd">租客姓名</div>
                    <div class="hfq-cell-bd">李小宝</div>
                </div>
            </div>

            <!-- 带搜索的表格 -->
            <div class="m-table-wrap">
                 <div class="m-table-title">选择银行流水</div>
                    <div class="m-table-search-wrap">

                    </div>
                    <div class="m-table-content">
                        <!-- 表格 -->

                        <!-- 分页 -->

                    </div>
            </div>

            <!-- 填写备注 -->
            <div class="m-remark-wrap">
                <div class="m-remark-wrap-title">填写发起平账备注</div>
                <div class="m-remark-content">
                    <div class="hfq-cell">
                        <div class="hfq-cell-hd">平账备注</div>
                        <div class="hfq-cell-bd">
                            <el-input type="textarea"></el-input>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 底部按钮 -->
            <div class="m-button-wrap">
                <el-button>取消</el-button>
                <el-button type="primary">发起平账</el-button>
            </div>
  </el-dialog>
    </div>
</template>

<script>
    export default{
        name: 'hfq-repay-handle',

        data(){
            return {
                showDialog: false,
                form: {
                    questionType: '00001',
                    remark: ''
                }
            }
        },
        methods: {},
        created(){

        }
    }
</script>

<style lang="less">
    .hfq-repay-handle {
        .hfq-cell-hd { width: 80px; margin-right: 0; }
        .hfq-cell-bd { width: 360px; }
    }
</style>

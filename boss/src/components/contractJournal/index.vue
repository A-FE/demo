<!-- 合同日志 -->
<template>
    <div class="hfq-contract-journal hfq-component">

        <div class="hfq-component-title">合同日志

            <el-button type="text" @click="isShowAll = true">查看合同日志</el-button>
        </div>
        <div class="hfq-component-content">
            <el-table :data="journalData">
                <el-table-column prop="type" label="日志类型" width="120"></el-table-column>
                <el-table-column prop="time" label="操作时间" width="110"></el-table-column>
                <el-table-column prop="operation" label="操作" width="180"></el-table-column>
                <el-table-column prop="remark" label="备注" min-width="180"></el-table-column>
                <el-table-column prop="planTime" label="应还款日期" width="120"></el-table-column>
                <el-table-column prop="operator" label="操作人" width="120"></el-table-column>
                <el-table-column prop="origin" label="日志来源" width="120">
                    <template scope="scope">
                        <el-tag :type="scope.row.origin === '系统' ? 'primary' : 'success'" close-transition>
                            {{scope.row.origin}}
                        </el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 嵌套表格的dialog -->
        <hfq-dialog-table v-model="isShowAll" title="全部日志" :data="journalDataAll" :page-size="10">
            <template slot="table-item">
                <el-table-column prop="type" label="日志类型" width="120"></el-table-column>
                <el-table-column prop="time" label="操作时间" width="110"></el-table-column>
                <el-table-column prop="operation" label="操作" width="180"></el-table-column>
                <el-table-column prop="remark" label="备注" min-width="180"></el-table-column>
                <el-table-column prop="planTime" label="应还款日期" width="120"></el-table-column>
                <el-table-column prop="operator" label="操作人" width="120"></el-table-column>
                <el-table-column prop="origin" label="日志来源" width="120" :filters="filters"
                                 column-key="origin">
                    <template scope="scope">
                        <el-tag :type="scope.row.origin === '系统' ? 'primary' : 'success'" close-transition>
                            {{scope.row.origin}}
                        </el-tag>
                    </template>
                </el-table-column>
            </template>
        </hfq-dialog-table>


    </div>
</template>

<script>
    export default{
        name: 'hfq-contract-journal',
        props: {
            /* showAll:可以查看全部;showItem: 只查看当期 ,默认showItem*/
            type: {
                type: String,
                default: 'showItem'
            }
        },
        data(){
            return {
                isShowAll: false,
                journalData: [
                    {
                        type: '风控审核',
                        time: '2017-04-15 12:32:24',
                        operation: '发起违约',
                        remark: '测试测试测试',
                        planTime: '2017-04-15',
                        operator: '陈大牛1',
                        origin: '人工'
                    },
                    {
                        type: '风控审核',
                        time: '2017-04-15 12:32:24',
                        operation: '发起违约',
                        remark: '测试测试测试',
                        planTime: '2017-04-15',
                        operator: '陈大牛2',
                        origin: '系统'
                    }
                ],
                journalDataAll: [
                    {
                        type: '风控审核',
                        time: '2017-04-15 12:32:24',
                        operation: '发起违约',
                        remark: '测试测试测试',
                        planTime: '2017-04-15',
                        operator: '陈大牛1',
                        origin: '人工'
                    },
                    {
                        type: '风控审核',
                        time: '2017-04-15 12:32:24',
                        operation: '发起违约',
                        remark: '测试测试测试',
                        planTime: '2017-04-15',
                        operator: '陈大牛2',
                        origin: '系统'
                    },
                    {
                        type: '风控审核',
                        time: '2017-04-15 12:32:24',
                        operation: '发起违约',
                        remark: '测试测试测试',
                        planTime: '2017-04-15',
                        operator: '陈大牛3',
                        origin: '人工'
                    },
                    {
                        type: '风控审核',
                        time: '2017-04-15 12:32:24',
                        operation: '发起违约',
                        remark: '测试测试测试',
                        planTime: '2017-04-15',
                        operator: '陈大牛4',
                        origin: '系统'
                    },
                    {
                        type: '风控审核',
                        time: '2017-04-15 12:32:24',
                        operation: '发起违约',
                        remark: '测试测试测试',
                        planTime: '2017-04-15',
                        operator: '陈大牛5',
                        origin: '人工'
                    },
                    {
                        type: '风控审核',
                        time: '2017-04-15 12:32:24',
                        operation: '发起违约',
                        remark: '测试测试测试',
                        planTime: '2017-04-15',
                        operator: '陈大牛2',
                        origin: '系统'
                    },
                    {
                        type: '风控审核',
                        time: '2017-04-15 12:32:24',
                        operation: '发起违约',
                        remark: '测试测试测试',
                        planTime: '2017-04-15',
                        operator: '陈大牛3',
                        origin: '人工'
                    },
                    {
                        type: '风控审核',
                        time: '2017-04-15 12:32:24',
                        operation: '发起违约',
                        remark: '测试测试测试',
                        planTime: '2017-04-15',
                        operator: '陈大牛4',
                        origin: '系统'
                    },
                    {
                        type: '风控审核',
                        time: '2017-04-15 12:32:24',
                        operation: '发起违约',
                        remark: '测试测试测试',
                        planTime: '2017-04-15',
                        operator: '陈大牛5',
                        origin: '人工'
                    },
                    {
                        type: '风控审核',
                        time: '2017-04-15 12:32:24',
                        operation: '发起违约',
                        remark: '测试测试测试',
                        planTime: '2017-04-15',
                        operator: '陈大牛6',
                        origin: '系统'
                    },
                    {
                        type: '风控审核',
                        time: '2017-04-15 12:32:24',
                        operation: '发起违约',
                        remark: '测试测试测试',
                        planTime: '2017-04-15',
                        operator: '陈大牛6',
                        origin: '系统'
                    },
                    {
                        type: '风控审核',
                        time: '2017-04-15 12:32:24',
                        operation: '发起违约',
                        remark: '测试测试测试',
                        planTime: '2017-04-15',
                        operator: '陈大牛6',
                        origin: '系统'
                    }
                ],
                filters: [
                    {
                        text: '系统',
                        value: '系统'
                    },
                    {
                        text: '人工',
                        value: '人工'
                    },
                ],
            }
        },
        methods: {

        }
    }
</script>

<style lang="less">
    @import '../theme.less';
    hfq-contract-journal{
        .el-dialog__header {
            margin-bottom: 28px;
        }
    }
</style>

<template>
    <div class="hfq-pay-schedule hfq-component">

      <!-- showItem 只查看当前模式 -->
      <template v-if="type === 'showItem'">
      <div class="hfq-component-title">付款计划表</div>
      <div class="hfq-component-content">
        <div class="hfq-cell">
            <div class="hfq-cell-hd">会分期付款金额</div>
            <div class="hfq-cell-bd">16500.00</div>
        </div>
        <el-table :data="payScheduleData">
          <el-table-column prop="num" label="打款期次" width="120"></el-table-column>
          <el-table-column prop="amount" label="金额" width="120"></el-table-column>
          <el-table-column prop="planTime" label="应打款日期" width="120"></el-table-column>
          <el-table-column prop="status" label="打款状态" width="120"></el-table-column>
          <el-table-column prop="actualTime" label="实际打款时间" min-width="120"></el-table-column>
        </el-table>
      </div>
      </template>

      <!-- showAll 显示所有 -->
      <template v-if="type === 'showAll'">
        <div class="hfq-component-title">付款计划表
            <el-button type="text" @click="isShowAll = true">查看全部信息</el-button>
        </div>
        <div class="hfq-component-content">
          <el-table :data="payScheduleData">
            <el-table-column prop="num" label="打款期次" width="120"></el-table-column>
            <el-table-column prop="amount" label="金额" width="120"></el-table-column>
            <el-table-column prop="planTime" label="应打款日期" width="120"></el-table-column>
            <el-table-column prop="status" label="打款状态" width="120"></el-table-column>
            <el-table-column prop="actualTime" label="实际打款时间" min-width="120"></el-table-column>
          </el-table>
        </div>

        <!-- 嵌套表格的dialog -->
        <hfq-dialog-table v-model="isShowAll" title="全部付款计划表" :data="payScheduleDataAll" :page-size="11">
            <div slot="description" class="hfq-cell">
              <div class="hfq-cell-hd">会分期付款金额</div>
              <div class="hfq-cell-bd">16500.00</div>
            </div>
            <template slot="table-item">
              <el-table-column prop="num" label="打款期次" width="115"></el-table-column>
              <el-table-column prop="amount" label="金额" width="115"></el-table-column>
              <el-table-column prop="planTime" label="应打款日期" width="115"></el-table-column>
              <el-table-column prop="status" label="打款状态" width="115"></el-table-column>
              <el-table-column prop="actualTime" label="实际打款时间" width="168"></el-table-column>
            </template>

        </hfq-dialog-table>

      </template>

    </div>
</template>

<script>
    export default{
        name: 'hfq-pay-schedule',
        props:{
          /* showAll:可以查看全部;showItem: 只查看当期 ,默认showItem*/
          type:{
                type: String,
                default: 'showItem'
            }
        },
        data(){
            return {
                isShowAll: false,
                // 付款计划数据-showItem
                payScheduleData:[
                  {
                      num:'1',
                      amount:'7500.00',
                      planTime:'2017-04-16',
                      status:'已打款',
                      actualTime:'2017-04-15 12:23:23'
                  }
                ],
                // 付款计划数据-showAll
                payScheduleDataAll:[
                  {
                    num:'1',
                    amount:'7500.00',
                    planTime:'2017-04-16',
                    status:'已打款',
                    actualTime:'2017-04-15 12:23:23'
                  },
                  {
                    num:'2',
                    amount:'6500.00',
                    planTime:'2017-09-16',
                    status:'未打款',
                    actualTime:''
                  },
                  {
                    num:'3',
                    amount:'7500.00',
                    planTime:'2017-04-16',
                    status:'已打款',
                    actualTime:'2017-04-15 12:23:23'
                  },
                  {
                    num:'4',
                    amount:'6500.00',
                    planTime:'2017-09-16',
                    status:'未打款',
                    actualTime:''
                  },
                  {
                    num:'5',
                    amount:'7500.00',
                    planTime:'2017-04-16',
                    status:'已打款',
                    actualTime:'2017-04-15 12:23:23'
                  },
                  {
                    num:'6',
                    amount:'6500.00',
                    planTime:'2017-09-16',
                    status:'未打款',
                    actualTime:''
                  },
                ],
                // 表格数据
                tableData:[]
            }
        },
        watch:{

        },
        methods: {

        },
        mounted(){
          this.tableData = this.payScheduleData;
        }
    }
</script>

<style lang="less">
  .hfq-pay-schedule{
      .hfq-component-content{width: 660px;}
  }
</style>

<template>
  <div class="hfq-repay-schedule hfq-component">
    <!-- showItem 只查看当前模式 -->
    <template v-if="type === 'showItem'">
      <div class="hfq-component-title">还款计划表</div>
      <div class="hfq-component-content">
        <div class="hfq-cell" style="margin: 0 0 16px;padding: 0;">
          <div class="hfq-cell-hd">租客应还款</div>
          <div class="hfq-cell-bd">17324.00</div>

          <div class="hfq-cell-hd" style="margin-left: 30px;">租客已还款</div>
          <div class="hfq-cell-bd">0</div>
        </div>

        <el-table :data="repayData">
          <el-table-column prop="num" label="还款期次" width="90"></el-table-column>
          <el-table-column prop="planTime" label="应还款日期" width="110"></el-table-column>
          <el-table-column prop="currentAmount" label="本期金额" width="90"></el-table-column>
          <el-table-column prop="lateAmount" label="滞纳金" width="90"></el-table-column>
          <el-table-column prop="paidAmonut" label="已付金额" width="90"></el-table-column>
          <el-table-column prop="unpayAmount" label="未付金额" width="90"></el-table-column>
          <el-table-column prop="actuaRepayTime" label="实际还款日期" width="114"></el-table-column>
          <el-table-column prop="repayType" label="回款方式" width="126"></el-table-column>
            <el-table-column prop="operator" label="代扣信息" width="86"></el-table-column>

            <el-table-column prop="repayStatus" label="回款状态">
            <template scope="scope">
              {{scope.row.repayStatus}}
              <el-button type="text" @click="showDialogRefundInfo = true">退款信息</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>

    <!-- showAll 显示所有 -->
    <template v-if="type === 'showAll'">
      <div class="hfq-component-title">还款计划表
            <el-button type="text" @click="isShowAll = true">查看全部信息</el-button>
      </div>
      <div class="hfq-component-content">

      <div class="hfq-cell" style="margin: 0 0 16px;padding: 0;">
        <div class="hfq-cell-hd">是否代扣</div>
        <div class="hfq-cell-bd">否</div>
      </div>
      <el-table :data="repayData">
        <el-table-column prop="num" label="还款期次" width="90"></el-table-column>
        <el-table-column prop="planTime" label="应还款日期" width="110"></el-table-column>
        <el-table-column prop="currentAmount" label="本期金额" width="90"></el-table-column>
        <el-table-column prop="lateAmount" label="滞纳金" width="90"></el-table-column>
        <el-table-column prop="paidAmonut" label="已付金额" width="90"></el-table-column>
        <el-table-column prop="unpayAmount" label="未付金额" width="90"></el-table-column>
        <el-table-column prop="actuaRepayTime" label="实际还款日期" width="114"></el-table-column>
        <el-table-column prop="repayType" label="回款方式" width="126"></el-table-column>
          <el-table-column prop="operator" label="代扣信息" width="86"></el-table-column>
          <el-table-column prop="repayStatus" label="回款状态">
          <template scope="scope">
            {{scope.row.repayStatus}}
              <el-button type="text" @click="showDialogRefundInfo = true">退款信息</el-button>
          </template>
        </el-table-column>
      </el-table>
      </div>
      <!-- 嵌套表格的dialog -->
      <hfq-dialog-table v-model="isShowAll" title="全部还款计划表" :data="repayDataAll" :page-size="11">
          <div slot="description" class="hfq-cell">
            <div class="hfq-cell-hd">是否代扣</div>
            <div class="hfq-cell-bd">否</div>
            <div class="hfq-cell-hd">租客应还款</div>
            <div class="hfq-cell-bd">16500.00</div>
            <div class="hfq-cell-hd">租客已还款</div>
            <div class="hfq-cell-bd">16500.00</div>
          </div>
        <template slot="table-item">
        <el-table-column prop="num" label="还款期次" width="90"></el-table-column>
        <el-table-column prop="planTime" label="应还款日期" width="110"></el-table-column>
        <el-table-column prop="currentAmount" label="本期金额" width="90"></el-table-column>
        <el-table-column prop="lateAmount" label="滞纳金" width="90"></el-table-column>
        <el-table-column prop="paidAmonut" label="已付金额" width="90"></el-table-column>
        <el-table-column prop="unpayAmount" label="未付金额" width="90"></el-table-column>
        <el-table-column prop="actuaRepayTime" label="实际还款日期" width="114"></el-table-column>
        <el-table-column prop="repayType" label="回款方式" width="126"></el-table-column>
            <el-table-column prop="operator" label="代扣信息" width="86"></el-table-column>
            <el-table-column prop="repayStatus" label="回款状态" min-width="136">
          <template scope="scope">
            {{scope.row.repayStatus}}
              <el-button type="text" @click="showDialogRefundInfo = true">退款信息</el-button>
          </template>
        </el-table-column>
        </template>
      </hfq-dialog-table>

    </template>

    <!-- 退款信息弹框 -->
    <hfq-dialog-refund-info v-model="showDialogRefundInfo"></hfq-dialog-refund-info>
    </div>
</template>

<script>
  export default{
    name: 'hfq-repay-schedule',
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
        showDialogRefundInfo: false,
        repayDataAll: [
          {
            num: 1,
            planTime: '2016-12-04',
            currentAmount: '1000.00',
            lateAmount: '10.00',
            paidAmonut: '1000.00',
            operator: '陈可可',
            unpayAmount: '10.00',
            actuaRepayTime: '2017-04-26 12:45:34',
            repayType: '微信公众号支付',
            repayStatus: '未还款'
          },
          {
            num: 2,
            planTime: '2016-12-04',
            currentAmount: '1000.00',
            lateAmount: '10.00',
            paidAmonut: '1000.00',
            operator: '陈可可',
            unpayAmount: '10.00',
            actuaRepayTime: '2017-04-26 12:45:34',
            repayType: '微信公众号支付',
            repayStatus: '未还款'
          },
          {
            num: 3,
            planTime: '2016-12-04',
            currentAmount: '1000.00',
            lateAmount: '10.00',
            paidAmonut: '1000.00',
            operator: '陈可可',
            unpayAmount: '10.00',
            actuaRepayTime: '2017-04-26 12:45:34',
            repayType: '微信公众号支付',
            repayStatus: '未还款'
          },
          {
            num: 4,
            planTime: '2016-12-04',
            currentAmount: '1000.00',
            lateAmount: '10.00',
            paidAmonut: '1000.00',
            operator: '陈可可',
            unpayAmount: '10.00',
            actuaRepayTime: '2017-04-26 12:45:34',
            repayType: '微信公众号支付',
            repayStatus: '未还款'
          },
          {
            num: 5,
            planTime: '2016-12-04',
            currentAmount: '1000.00',
            lateAmount: '10.00',
            paidAmonut: '1000.00',
            operator: '陈可可',
            unpayAmount: '10.00',
            actuaRepayTime: '2017-04-26 12:45:34',
            repayType: '微信公众号支付',
            repayStatus: '未还款'
          },
          {
            num: 6,
            planTime: '2016-12-04',
            currentAmount: '1000.00',
            lateAmount: '10.00',
            paidAmonut: '1000.00',
            operator: '陈可可',
            unpayAmount: '10.00',
            actuaRepayTime: '2017-04-26 12:45:34',
            repayType: '微信公众号支付',
            repayStatus: '未还款'
          },
            {
                num: 7,
                planTime: '2016-12-04',
                currentAmount: '1000.00',
                lateAmount: '10.00',
                paidAmonut: '1000.00',
                operator: '陈可可',
                unpayAmount: '10.00',
                actuaRepayTime: '2017-04-26 12:45:34',
                repayType: '微信公众号支付',
                repayStatus: '未还款'
            },
            {
                num: 8,
                planTime: '2016-12-04',
                currentAmount: '1000.00',
                lateAmount: '10.00',
                paidAmonut: '1000.00',
                operator: '陈可可',
                unpayAmount: '10.00',
                actuaRepayTime: '2017-04-26 12:45:34',
                repayType: '微信公众号支付',
                repayStatus: '未还款'
            },
            {
                num: 9,
                planTime: '2016-12-04',
                currentAmount: '1000.00',
                lateAmount: '10.00',
                paidAmonut: '1000.00',
                operator: '陈可可',
                unpayAmount: '10.00',
                actuaRepayTime: '2017-04-26 12:45:34',
                repayType: '微信公众号支付',
                repayStatus: '未还款'
            },
            {
                num: 10,
                planTime: '2016-12-04',
                currentAmount: '1000.00',
                lateAmount: '10.00',
                paidAmonut: '1000.00',
                operator: '陈可可',
                unpayAmount: '10.00',
                actuaRepayTime: '2017-04-26 12:45:34',
                repayType: '微信公众号支付',
                repayStatus: '未还款'
            },
            {
                num: 11,
                planTime: '2016-12-04',
                currentAmount: '1000.00',
                lateAmount: '10.00',
                paidAmonut: '1000.00',
                operator: '陈可可',
                unpayAmount: '10.00',
                actuaRepayTime: '2017-04-26 12:45:34',
                repayType: '微信公众号支付',
                repayStatus: '未还款'
            },
            {
                num: 12,
                planTime: '2016-12-04',
                currentAmount: '1000.00',
                lateAmount: '10.00',
                paidAmonut: '1000.00',
                operator: '陈可可',
                unpayAmount: '10.00',
                actuaRepayTime: '2017-04-26 12:45:34',
                repayType: '微信公众号支付',
                repayStatus: '未还款'
            },
        ],
        repayData:[
          {
            num: 1,
            planTime: '2016-12-04',
            currentAmount: '1000.00',
            lateAmount: '10.00',
            paidAmonut: '1000.00',
            operator: '陈可可',
            unpayAmount: '10.00',
            actuaRepayTime: '2017-04-26 12:45:34',
            repayType: '微信公众号支付',
            repayStatus: '未还款'
          }
        ]
      }
    },
    watch:{
      showDialogRefundInfo(val){
      }
    },
    methods: {},
    created(){

    }
  }
</script>

<style lang="less">
 .hfq-repay-schedule {
     .el-dialog .hfq-cell-bd+.hfq-cell-hd{margin-left: 60px;}
 }
</style>

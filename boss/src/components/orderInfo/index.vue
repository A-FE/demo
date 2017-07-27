<template>
    <div class="hfq-order-info hfq-component">
      <div class="hfq-component-title">订单基本信息</div>
      <div class="hfq-component-content">
        <el-row type="flex">
          <el-col>
            <div class="hfq-cell">
              <div class="hfq-cell-hd">合同号</div>
              <div class="hfq-cell-bd">20170412003</div>
            </div>
            <div class="hfq-cell">
              <div class="hfq-cell-hd">合同手机号</div>
              <div class="hfq-cell-bd">18825144569</div>
            </div>
            <div class="hfq-cell">
              <div class="hfq-cell-hd">合同类型</div>
              <div class="hfq-cell-bd">B端</div>
            </div>
            <div class="hfq-cell">
              <div class="hfq-cell-hd">服务承担方</div>
              <div class="hfq-cell-bd">租客</div>
            </div>
            <div class="hfq-cell">
              <div class="hfq-cell-hd">中介公司</div>
              <div class="hfq-cell-bd">太空旅行公司</div>
            </div>
            <div class="hfq-cell">
              <div class="hfq-cell-hd">房源地址</div>
              <div class="hfq-cell-bd">天安门广场</div>
            </div>
            <div class="hfq-cell">
              <div class="hfq-cell-hd">crm备注</div>
              <div class="hfq-cell-bd">啦啦啦啦啦啦啦啦啦~</div>
            </div>
          </el-col>

          <el-col>
            <div class="hfq-cell">
              <div class="hfq-cell-hd">起租日期</div>
              <div class="hfq-cell-bd">2017-04-13</div>
            </div>
            <div class="hfq-cell">
              <div class="hfq-cell-hd">结束日期</div>
              <div class="hfq-cell-bd">2017-04-13</div>
            </div>
            <div class="hfq-cell">
              <div class="hfq-cell-hd">签约日期</div>
              <div class="hfq-cell-bd">2017-04-13</div>
            </div>
            <div class="hfq-cell">
              <div class="hfq-cell-hd">会找房付款方式</div>
              <div class="hfq-cell-bd">半年付</div>
            </div>
          </el-col>

          <el-col>
            <div class="hfq-cell">
              <div class="hfq-cell-hd">月服务费</div>
              <div class="hfq-cell-bd">75.00</div>
            </div>
            <div class="hfq-cell">
              <div class="hfq-cell-hd">月租金</div>
              <div class="hfq-cell-bd">1500.00</div>
            </div>
            <div class="hfq-cell">
              <div class="hfq-cell-hd">租客首付方式</div>
              <div class="hfq-cell-bd">押一付一</div>
            </div>
            <div class="hfq-cell">
              <div class="hfq-cell-hd">尾款支付方式</div>
              <div class="hfq-cell-bd">单独付</div>
            </div>
          </el-col>
        </el-row>
        <div class="hfq-cell">
          <div class="hfq-cell-hd">订单费率信息</div>
        </div>
        <div class="m-table">
            <el-table :data="orderRateData">
                <el-table-column prop="basicRate" label="基础费率" width="120"></el-table-column>
                <el-table-column prop="discount" label="优惠费率" width="120"></el-table-column>
                <el-table-column prop="rebate" label="线下返点费率" width="120"></el-table-column>
                <el-table-column prop="breakRate" label="违约费率" width="120"></el-table-column>
                <el-table-column prop="lateFee" label="滞纳金费率" ></el-table-column>
            </el-table>
        </div>
      </div>
    </div>
</template>

<script>
    export default{
        name: 'hfq-order-info',
        data(){
          return {
            /* 订单费率信息 */
            orderRateData: [
              {
                basicRate: '5%',
                discount: '0%',
                rebate:'0%',
                breakRate:'0%',
                lateFee:'0%'
              }
            ]
          }
        },
        methods: {},
        created(){

        }
    }
</script>

<style lang="less">

    .hfq-order-info {
        .m-table{width: 600px;}
        .hfq-cell{padding-left: 0;}
    }
</style>

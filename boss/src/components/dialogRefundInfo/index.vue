<template>
    <div class="hfq-dialog-refund-info" v-show="model">
      <el-dialog title="退款信息" v-model="model">
          <div class="hfq-cell">
            <div class="hfq-cell-hd">合同号</div>
            <div class="hfq-cell-bd">2017120723</div>
            <div class="hfq-cell-hd">还款日期</div>
            <div class="hfq-cell-bd">2017-12-21</div>
            <div class="hfq-cell-hd">租客姓名</div>
            <div class="hfq-cell-bd">陈珂珂</div>
            <div class="hfq-cell-hd">应还款</div>
            <div class="hfq-cell-bd">1234.00</div>
          </div>

        <!-- 租客银行账户信息 -->
          <div class="hfq-info-content">
              <div class="hfq-info-title">租客银行账户信息</div>
              <div class="hfq-cell">
                <div class="hfq-cell-hd">退款接收方</div>
                <div class="hfq-cell-bd">租客</div>
              </div>
              <div class="hfq-cell" style="margin: 0;padding: 0;">
                <div class="hfq-cell-hd hfq-cell" style="width: 300px;">
                  <div class="hfq-cell-hd">账户所在行</div>
                  <div class="hfq-cell-bd">招商银行</div>
                </div>
                <div class="hfq-cell-hd hfq-cell">
                  <div class="hfq-cell-hd">账户名</div>
                  <div class="hfq-cell-bd">李小宝</div>
                </div>
              </div>
            <div class="hfq-cell" style="margin: 0;padding: 0;">
              <div class="hfq-cell-hd hfq-cell" style="width: 300px;">
                <div class="hfq-cell-hd">账户卡号</div>
                <div class="hfq-cell-bd">622848****9788</div>
              </div>
              <div class="hfq-cell-hd hfq-cell">
                <div class="hfq-cell-hd">退款金额</div>
                <div class="hfq-cell-bd">100.00</div>
              </div>

            </div>
            <div class="hfq-cell">
              <div class="hfq-cell-hd">退款备注</div>
              <div class="hfq-cell-bd">我是备注</div>
            </div>
          </div>

        <!-- 退款审核信息 -->
        <div class="hfq-info-content">
          <div class="hfq-info-title">退款审核信息</div>
          <el-table :data="refundInfo">
            <el-table-column prop="time" label="审核时间" width="180"></el-table-column>
            <el-table-column prop="operator" label="审核人" width="120"></el-table-column>
            <el-table-column prop="result" label="审核结果" width="120"></el-table-column>
            <el-table-column prop="remark" label="审核备注" ></el-table-column>
          </el-table>
        </div>

      </el-dialog>
    </div>
</template>

<script>
    export default{
        name: 'hfq-dialog-refund-info',
        props:{
          value:{
              type: Boolean,
              default: false
          },
          title:{
            type: String
          },
        },
        data(){
            return {
                refundInfo:[
                  {
                    time: '2017-04-15 12:32:24',
                    operator: '陈珂珂',
                    result: '一审通过',
                    remark: '信誉良好,审核通过'
                  },
                  {
                    time:'2017-04-15 12:32:24',
                    operator:'陈珂珂',
                    result:'一审通过',
                    remark:'信誉良好,审核通过'
                  }
                ]
            }
        },
        computed:{
          model:{
            get(){
              return this.value
            },
            set(val){
              this.$emit('input', val);
            }
          }
        },
        methods: {},
        created(){

        }
    }
</script>

<style lang="less">
    .hfq-dialog-refund-info{
        .el-dialog{width: 1000px;}
        .el-dialog__body{padding-top: 22px;}

        /* 租客银行信息 */
        .hfq-info-content{
            border: 1px solid #E0E6ED;
            border-radius: 4px;
            padding: 20px;
            margin-top: 14px;
        }
        .hfq-info-content .hfq-info-title{margin-bottom: 14px;color: #1F2D3D;}
        .el-table{width: 720px;}
    }

</style>

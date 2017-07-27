<template>
    <div class="page-kefu-manage-detail">

        <!-- 面包屑 -->
        <div class="hfq-breadcrumb-wrap">
            <el-row type="flex" align="middle" class="hfq-breadcrumb-content">
                <el-col>
                    <el-breadcrumb>
                        <el-breadcrumb-item>合同管理</el-breadcrumb-item>
                        <el-breadcrumb-item>会分期合同管理</el-breadcrumb-item>
                        <el-breadcrumb-item>会分期合同详情</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
                <!-- 按钮 -->
                <el-col class="hfq-align-right">
                    <el-button >无纸化合同</el-button>
                    <el-button>删除</el-button>
                </el-col>
            </el-row>


        </div>

      <!-- 按钮组 -->
      <div class="button-group">
        <el-row type="flex">
          <el-col>
            <el-button>返回</el-button>
          </el-col>
          <el-col class="hfq-align-right">
            <el-button type="primary">添加合同备注</el-button>
          </el-col>
        </el-row>
      </div>
      <!-- 用户信息 -->
      <hfq-user-info></hfq-user-info>
      <!-- 合同备注 -->
      <hfq-contract-remark></hfq-contract-remark>
      <!-- 订单基本信息 -->
      <hfq-order-info></hfq-order-info>
      <!-- 银行卡信息 -->
      <hfq-bankcard-info type="showAll"></hfq-bankcard-info>
      <!-- 付款计划表 -->
      <hfq-pay-schedule type="showAll"></hfq-pay-schedule>
      <!-- 还款计划表 -->
      <hfq-repay-schedule type="showAll"></hfq-repay-schedule>
      <!-- 合同日志 -->
      <hfq-contract-journal></hfq-contract-journal>
      <!-- 还款单处理 -->
      <hfq-repay-handle></hfq-repay-handle>
      <!-- 代理合同 -->
      <hfq-agent-contract type="display"></hfq-agent-contract>
      <!-- 会分期合同 -->
      <hfq-hfq-contract type="display"></hfq-hfq-contract>

      <!-- 租赁合同 -->
      <hfq-rent-contract type="display"></hfq-rent-contract>

      <!-- 按钮组 -->
      <div class="button-group">
        <el-row type="flex">
          <el-col>
            <el-button>返回</el-button>
          </el-col>
          <el-col class="hfq-align-right">
            <el-button type="primary">添加合同备注</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
</template>

<script>
    export default{
        name: 'page-kefu-manage-detail',
        data(){
            return {}
        },
        methods: {},
        created(){

        }
    }
</script>

<style scoped>
  .button-group{width: 1120px;margin: 16px auto;font-size: 0; }

</style>

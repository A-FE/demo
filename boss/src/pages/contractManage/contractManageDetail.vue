<!-- 会分期合同管理详情 -->
<template>
    <div class="page-contract-manage-detail">
      <!-- 面包屑 -->
      <div class="hfq-breadcrumb-wrap">
          <el-row type="flex" align="middle" class="hfq-breadcrumb-content">
              <el-col>
                  <el-breadcrumb>
                      <el-breadcrumb-item to="/contractManage/contractManageList"><i class="el-icon-arrow-left"></i>会分期合同管理</el-breadcrumb-item>
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

      <!-- 用户信息 -->
      <hfq-user-info></hfq-user-info>

      <!-- 合同备注 -->
      <hfq-contract-remark></hfq-contract-remark>

      <!-- 订单基本信息 -->
      <hfq-order-info></hfq-order-info>

      <!-- 付款计划表 -->
      <hfq-pay-schedule type="showAll"></hfq-pay-schedule>

      <!-- 还款计划表 -->
      <hfq-repay-schedule type="showAll"></hfq-repay-schedule>

      <!-- 合同日志 -->
      <hfq-contract-journal></hfq-contract-journal>

      <!-- 租客证件 -->
      <hfq-renter-paper type="display"></hfq-renter-paper>

      <!-- 租赁合同-->
       <hfq-rent-contract type="display"></hfq-rent-contract>

        <!-- 代理合同 -->
        <hfq-agent-contract type="display"></hfq-agent-contract>

        <!-- 会分期合同 -->
        <hfq-hfq-contract type="display"></hfq-hfq-contract>

        <!-- 按钮组 -->
      <div class="button-group">
        <el-row type="flex">
          <el-col>
            <el-button @click="back">返回</el-button>
          </el-col>
          <el-col class="hfq-align-right">
            <el-button>无纸化合同</el-button>
            <el-button>删除</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
</template>

<script>
    import vueMethods from 'src/assets/js/vueMethods'

    export default{
        name: 'page-contract-manage-detail',
        mixins: [vueMethods],
        data(){
            return {}
        },
        methods: {

        },

    }
</script>

<style scoped>
  .button-group{width: 1120px;margin: 16px auto;font-size: 0; }

</style>

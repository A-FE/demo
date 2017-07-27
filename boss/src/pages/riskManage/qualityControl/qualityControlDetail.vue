<!-- 质检详情 -->
<template>
    <div class="page-quality-control-deatil">
        <!-- 面包屑 -->
        <div class="hfq-breadcrumb-wrap">
            <el-row type="flex" align="middle" class="hfq-breadcrumb-content">
                <el-col>
                    <el-breadcrumb>
                        <el-breadcrumb-item>资料审核</el-breadcrumb-item>
                        <el-breadcrumb-item>资料审核详情</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
                <!-- 按钮 -->
                <el-col class="hfq-align-right">
                    <el-button type="text">无纸化合同</el-button>
                    <el-button type="text">风控报告</el-button>
                    <el-button>历史合同</el-button>
                </el-col>
            </el-row>
        </div>

      <!-- 审核历史 -->
      <hfq-check-history></hfq-check-history>

      <!-- 录音 -->
      <hfq-record></hfq-record>

      <!-- 租客证件 -->
      <hfq-renter-paper type="upload"></hfq-renter-paper>

      <!-- 代理合同 -->
      <hfq-agent-contract type="upload"></hfq-agent-contract>

      <!-- 租赁合同 -->
      <hfq-rent-contract type="examine"></hfq-rent-contract>

      <!-- 会分期合同 -->
      <hfq-hfq-contract type="upload"></hfq-hfq-contract>

      <!-- 质检 -->
      <hfq-quality-control></hfq-quality-control>

      <!-- 按钮组 -->
      <div class="button-group">
        <el-row type="flex">
          <el-col>
            <el-button>返回</el-button>
          </el-col>
          <el-col class="hfq-align-right">
            <el-button type="text">无纸化合同</el-button>
            <el-button type="text">风控报告</el-button>
            <el-button>历史合同</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
</template>

<script>
    export default{
        name: 'page-quality-control-deatil',
        data(){
            return {}
        },
        methods: {},
        created(){

        }
    }
</script>

<style lang="less">
    .page-quality-control-deatil{
        .button-group{width: 1120px;margin: 16px auto;font-size: 0; }
    }

</style>

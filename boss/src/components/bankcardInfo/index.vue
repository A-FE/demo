<template>
  <div class="hfq-bankcard-info hfq-component">
    <!-- showItem 只查看当前模式 -->
    <template v-if="type === 'showItem'">
    <div class="hfq-component-title">银行卡信息</div>
    <div class="hfq-component-content">
      <el-table :data="bankcardData">
        <el-table-column prop="username" label="用户名" width="120"></el-table-column>
        <el-table-column prop="bankPhone" label="银行预留手机号" width="130"></el-table-column>
        <el-table-column prop="bankcardNo" label="银行卡号" width="130"></el-table-column>
        <el-table-column prop="shortName" label="银行简称" width="120"></el-table-column>
        <el-table-column prop="bankcardName" label="银行卡名称"></el-table-column>
      </el-table>
    </div>
    </template>
    <!-- showAll 显示所有 -->
    <template v-if="type === 'showAll'">
      <div class="hfq-component-title">银行卡信息
            <el-button type="text" @click="isShowAll = true">查看全部信息</el-button>
      </div>
      <div class="hfq-component-content">
        <el-table :data="bankcardData">
          <el-table-column prop="username" label="用户名" width="120"></el-table-column>
          <el-table-column prop="bankPhone" label="银行预留手机号" width="130"></el-table-column>
          <el-table-column prop="bankcardNo" label="银行卡号" width="130"></el-table-column>
          <el-table-column prop="shortName" label="银行简称" width="120"></el-table-column>
          <el-table-column prop="bankcardName" label="银行卡名称"></el-table-column>
        </el-table>
      </div>
      <!-- 嵌套表格的dialog -->
      <hfq-dialog-table v-model="isShowAll" title="全部银行卡信息" :data="bankcardDataAll" :page-size="2">
        <template slot="table-item">
          <el-table-column prop="username" label="用户名" width="120"></el-table-column>
          <el-table-column prop="bankPhone" label="银行预留手机号" width="128"></el-table-column>
          <el-table-column prop="bankcardNo" label="银行卡号" width="128"></el-table-column>
          <el-table-column prop="shortName" label="银行简称" width="120"></el-table-column>
          <el-table-column prop="bankcardName" label="银行卡名称" width="166"></el-table-column>
        </template>
      </hfq-dialog-table>
    </template>
  </div>
</template>

<script>
  export default{
    name: 'hfq-bankcard-info',
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
        bankcardData: [
          {
            username: '陈大牛',
            bankPhone: '66666666666',
            bankcardNo: ' 666666666666',
            shortName: 'CDN',
            bankcardName: '陈大牛银行'
          }
        ],
        bankcardDataAll:[
          {
            username: '陈大牛',
            bankPhone: '66666666666',
            bankcardNo: ' 666666666666',
            shortName: 'CDN',
            bankcardName: '陈大牛银行'
          },
          {
            username: '陈大牛',
            bankPhone: '66666666666',
            bankcardNo: ' 666666666666',
            shortName: 'CDN',
            bankcardName: '陈大牛银行'
          },
          {
            username: '陈大牛',
            bankPhone: '66666666666',
            bankcardNo: ' 666666666666',
            shortName: 'CDN',
            bankcardName: '陈大牛银行'
          },
          {
            username: '陈大牛',
            bankPhone: '66666666666',
            bankcardNo: ' 666666666666',
            shortName: 'CDN',
            bankcardName: '陈大牛银行'
          },
          {
            username: '陈大牛',
            bankPhone: '66666666666',
            bankcardNo: ' 666666666666',
            shortName: 'CDN',
            bankcardName: '陈大牛银行'
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
    .hfq-bankcard-info{
        .el-dialog__header{margin-bottom: 28px;}
    }
</style>

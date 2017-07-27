<template>
    <div class="hfq-contract-remark hfq-component">
        <div class="hfq-component-title">合同备注 <el-button type="text" @click="showDialog = true">添加合同备注</el-button></div>
        <div class="hfq-component-content">
          <el-table :data="remarkData">
            <el-table-column prop="remark" label="备注" ></el-table-column>
            <el-table-column prop="author" label="添加人" width="120"></el-table-column>
            <el-table-column prop="time" label="添加时间" width="180"></el-table-column>
          </el-table>
        </div>

        <!-- 弹框 -->
        <el-dialog v-model="showDialog" title="添加合同备注">
            <div class="hfq-cell" style="align-items: flex-start;">
              <div class="hfq-cell-hd" style="padding: 4px 0;">合同备注</div>
              <div class="hfq-cell-bd">
                  <el-input v-model="dialogValue" type="textarea" placeholder="请输入内容" class="m-dialog-textarea"></el-input>
              </div>
            </div>
          <div slot="footer" class="m-dialog-footer">
              <el-button @click="showDialog = false">取消</el-button>
              <el-button type="primary" @click="handleSubmit">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default{
        name: 'hfq-contract-remark',
        data(){
            return {
                /* 日志记录 */
                remarkData:[
                  {
                      remark:'咳咳咳咳咳咳咳咳咳咳咳咳咳咳咳咳咳咳',
                      author:'陈可可',
                      time:'2017-04-15 12:32:24'
                  },
                  {
                    remark:'咳咳咳咳咳咳咳咳咳咳咳咳咳咳咳咳咳咳',
                    author:'陈可可',
                    time:'2017-04-15 12:32:24'
                  }
                ],
                showDialog: false,
                dialogValue:''
            }
        },
        methods: {
          // 提交表单
          handleSubmit(){
            this.remarkData.push({
              remark:this.dialogValue,
              author:'陈可可',
              time:'2017-04-15 12:32:24'
            });
            this.showDialog = false;
          }
        }
    }
</script>

<style lang="less">
    .hfq-contract-remark{
        .hfq-component-content{width: 600px;}
        .m-dialog-textarea{width: 322px;height: 100px;}
        .el-dialog__body{padding-bottom: 0;}
        .el-dialog{width: 430px;}
        .el-dialog .el-button--default{background-color: #fff;}
    }
</style>

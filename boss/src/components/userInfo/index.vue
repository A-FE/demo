<template>
    <div class="hfq-user-info hfq-component">
        <div class="hfq-component-title">用户信息</div>
        <div class="hfq-component-content">
          <el-row type="flex">
            <el-col>
                <div class="hfq-cell">
                  <div class="hfq-cell-hd">用户姓名</div>
                  <div class="hfq-cell-bd">陈大牛</div>
                </div>
              <div class="hfq-cell">
                <div class="hfq-cell-hd">身份证号</div>
                <div class="hfq-cell-bd">4210****1234</div>
              </div>
              <div class="hfq-cell">
                <div class="hfq-cell-hd">手机号</div>
                <div class="hfq-cell-bd">18825144569</div>
              </div>
            </el-col>
            <el-col>
              <div class="hfq-cell">
                <div class="hfq-cell-hd">银行预留手机号</div>
                <div class="hfq-cell-bd">18811415416</div>
              </div>
              <div class="hfq-cell">
                <div class="hfq-cell-hd">用户余额</div>
                <div class="hfq-cell-bd">100.00</div>
              </div>
            </el-col>

            <el-col>
              <div class="hfq-cell">
                <div class="hfq-cell-hd">联系人关系</div>
                <div class="hfq-cell-bd">同学</div>
              </div>
              <div class="hfq-cell">
                <div class="hfq-cell-hd">紧急联系人</div>
                <div class="hfq-cell-bd">陈珂珂</div>
              </div>
              <div class="hfq-cell">
                <div class="hfq-cell-hd">联系人手机</div>
                <div class="hfq-cell-bd">13412341234</div>
              </div>
            </el-col>
          </el-row>
        </div>
    </div>
</template>

<script>
    export default{
        name: 'hfq-user-info',
        data(){
            return {}
        },
        methods: {},
        created(){

        }
    }
</script>

<style lang="less">
    .hfq-user-info{
        .hfq-cell{padding-left: 0;}
    }
</style>

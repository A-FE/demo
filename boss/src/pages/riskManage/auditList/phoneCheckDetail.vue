<!-- B端二审页面详情 -->
<template>
    <div class="page-phone-check-detail">
        <!-- 面包屑 -->
        <div class="hfq-breadcrumb-wrap">
            <el-row type="flex" align="middle" class="hfq-breadcrumb-content">
                <el-col>
                    <el-breadcrumb>
                        <el-breadcrumb-item>二审详情</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
                <!-- 按钮 -->
                <el-col class="hfq-align-right">
                    <el-button type="primary" @click="open2">重审</el-button>
                </el-col>
            </el-row>
        </div>

        <!-- 审核历史 -->
        <hfq-check-history></hfq-check-history>

        <!-- 二审信息 -->
        <hfq-phone-check-info v-model="phoneCheckTags"></hfq-phone-check-info>

        <!-- 审核提交 -->
        <hfq-check-submit v-model="submitResult" @submit="handlerSubmit"  @tags-change="tagsChange"></hfq-check-submit>

    </div>
</template>

<script>
    import vueMethods from 'src/assets/js/vueMethods'
    export default{
        name: 'page-phone-check-detail',
        mixins: [vueMethods],
        data(){
            return {
                // 二审信息表单
                phoneCheckTags:[],
                // 将要被提交的表单
                tag_ids:'',
                // 审核提交组件返回值
                submitResult:{
                    // 审核备注
                    remark:'',
                    tags:[]
                },
            }
        },
        watch: {
            phoneCheckTags(){
                this.tag_ids = [...this.phoneCheckTags, ...this.submitResult.tags];
            },
            tag_ids(val,oldVal){
                if(!Array.isArray(oldVal)){
                    this.submitResult.remark = this.getTagsFromTagsId(val);
                    return
                }

                if(val.length > oldVal.length){
                    // 增加
                    let addVal = this.getDiff(val,oldVal);
                    let addStr = this.getTagsFromTagsId(addVal);
                    this.submitResult.remark += addStr;
                }else if(val.length < oldVal.length){
                    // 减少
                    let cutVal = this.getDiff(val,oldVal);
                    let cutStr = this.getTagsFromTagsId(cutVal).replace(/;/,'');
                    let resultStr = this.submitResult.remark.split(';').filter( item => {
                        return item.indexOf(cutStr) === -1
                    })
                    this.submitResult.remark = resultStr.join(';');
                }else{
                    // 不变
                    this.submitResult.remark = this.getTagsFromTagsId(val);
                }

            },
        },
        methods: {
            handlerSubmit(){
                if( this.tag_ids.length == 0){
                    this.$message.error('至少选择一个标签');
                    return false
                }

                let param = {
                    tag_ids: this.tag_ids,
                    audit_desc: this.submitResult.remark
                }
                this.$axios.all([
                    this.$axios.patch(`/v2/api/audit/contracts/${this.contractNo}/tags/`,param)
                ]).then(this.$axios.spread( (res1) => {
                    this.$message.info('提交成功');
                    setTimeout(function(){
                        window.close();
                    },2000)
                }))
            },
            // 重审
            resetAudit(){
                this.$axios.all([
                    this.$axios.patch(`/v2/api/audit/contracts/${this.contractNo}/reset/`),
                ]).then(this.$axios.spread( (res1) => {
                    this.$message.info('重审成功');
                    setTimeout(function(){
                        location.reload();
                    },2000)
                }))
            },
            open2() {
                this.$confirm('是否确认重审？', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    this.resetAudit();
                }).catch(() => {});
            },
            // 找出两个数组中不同的值，并返回不同的值
            getDiff(arr1,arr2){
                if(Array.isArray(arr1) && Array.isArray(arr2)){
                    let diff1 = arr1.filter( item =>  arr2.findIndex(item2 => item2 === item) === -1);
                    let diff2 = arr2.filter( item =>  arr1.findIndex(item1 => item1 === item) === -1);
                    return [...diff1,...diff2]
                }else {
                    console.log("getDiff的参数(arr1,arr2)必须为数组");
                    return []
                }
            },
            tagsChange(arr){
                this.tag_ids = [...this.phoneCheckTags,...this.submitResult.tags];
            }
        },
        created(){
            this.contractNo = this.utils.getUrlParam('contractNo');
            // 设置当前激活菜单
            this.$store.commit('setActiveIndex','2-2');
        }
    }
</script>

<style lang="less">
    .page-phone-check-detail {
        .button-group {
            width: 1120px;
            margin: 16px auto;
            font-size: 0;
        }
    }
</style>

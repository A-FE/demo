<template>
    <div class="hfq-quality-control hfq-component">
        <div class="hfq-component-title">质检</div>
        <div class="hfq-component-content">

            <div class="hfq-cell">
                <div class="hfq-cell-hd">备注图片</div>
            </div>
            <div class="upload-group">
                <el-upload
                        action=""
                        list-type="picture-card"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </div>

            <div class="hfq-cell" style="margin-top: 32px;margin-bottom: 10px;">
                <div class="hfq-cell-hd">质检结果</div>
                <div class="hfq-cell-bd">
                    <el-select v-model="result" class="el-select-180">
                        <el-option label="审核通过" :value="1"></el-option>
                        <el-option label="残忍拒绝" :value="0"></el-option>
                    </el-select>
                </div>
            </div>

            <div class="hfq-cell" style="align-items: flex-start;">
                <div class="hfq-cell-hd" style="padding-top: 8px;">质检备注</div>
                <div class="hfq-cell-bd textarea">
                    <el-input type="textarea"></el-input>
                    <el-button type="primary">提交</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        name: 'hfq-quality-control',
        data(){
            return {
                result: 0
            }
        },
        methods: {
            handlePictureCardPreview(){

            },
            handleRemove(){

            }
        },
        created(){

        }
    }
</script>

<style lang="less">
    .hfq-quality-control{
        .hfq-cell-bd.textarea {
            width: 360px;
        }
        .hfq-cell-bd.textarea > button {
            margin-top: 16px;
        }
    }
</style>

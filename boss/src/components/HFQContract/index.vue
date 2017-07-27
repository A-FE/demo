<template>
    <div class="hfq-hfq-contract hfq-component">
        <div class="hfq-component-title">会分期合同</div>
        <div class="hfq-component-content">
            <!-- examine类型 -->
            <template v-if="type === 'examine'">
            <div class="hfq-cell-hd">
                <el-badge is-dot :hidden="isFiledNameChange('f_installment_contract')">会分期合同</el-badge>
            </div>
                <div class="hfq-img-content">
                    <img v-for="(url,index) in contractData.imgUrls" :src="url"
                         @click="setActiveItem(index,contractData,contractForm)">
                </div>
                <div class="hfq-tags">
                    <hfq-checkbox v-model="contractForm.tags" v-for="tag in contractData.tags" :label="tag.value"
                                  :key="tag">
                        {{tag.label}}

                    </hfq-checkbox>
                </div>
                <!-- 弹框轮播图组件 -->
                <keep-alive>
                    <hfq-dialog-carousel v-model="contractForm" tags-position-type="mix"
                                         :data="contractData"></hfq-dialog-carousel>
                </keep-alive>
            </template>

            <!-- upload 类型-->
            <template v-if="type === 'upload'">
                <div class="upload-group">
                    <el-upload
                        action=""
                        list-type="picture-card"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </div>
            </template>

            <!-- display 类型-->
            <template v-if="type === 'display'">
                <div class="hfq-img-content">
                    <img v-for="(url,index) in contractData.imgUrls" :src="url"
                         @click="setActiveItem(index,contractData,contractForm)">
                </div>
                <keep-alive>
                    <hfq-dialog-carousel v-model="contractForm" tags-position-type="display"
                                         :data="contractData"></hfq-dialog-carousel>
                </keep-alive>
            </template>
        </div>
    </div>
</template>

<script>
    import vueMethods from 'components/vueMethods'
    export default{
        name: 'hfq-hfq-contract',
        mixins:[vueMethods],
        props: {
            /* 三种类型，display: 查看模式；upload:上传模式；examine:审核模式*/
            type: {
                type: String,
                default: 'display'
            },
            value:{
                type: Array,
                default(){
                    return []
                }
            }
        },
        data(){
            return {
                contractNo: '',
                // 租赁合同照片信息
                contractData: {
                    imgUrls: [],
                    tags: []
                },
                // 租赁合同照片表单
                contractForm: {
                    initialIndex: 0,
                    showDialog: false,
                    tags: []
                },
            }
        },
        computed:{
          model:{
              get(){
                return this.value
              },
              set(val){
                  this.$emit('input',val);
              }
          }
        },
        watch:{
            contractForm:{
                handler(val){
                    this.model = val.tags;
                },
                deep: true
            }
        },
        methods: {
            // 显示轮播图,设置轮播图的第一页
            setActiveItem(index, data, form){
                this.carouselData = data;
                this.carouselForm = form;
                this.carouselForm.initialIndex = index;
                this.carouselForm.showDialog = true;
            },
            handlePictureCardPreview(){

            },
            handleRemove(){

            },
            // 初始化组件图片
            initComponentImg(){
                let contractNo = this.contractNo;
                this.$axios.all([
                    this.$axios.get(`/v2/api/contracts/images/${contractNo}`)
                ]).then(this.$axios.spread((res1)=>{
                    this.contractData.imgUrls = res1.data.f_installment_contract;
                }))
            },
            initComponentTags(){
                // 会分期合同
                this.contractData.tags = [];
                let examineTags = this.$store.state.examineTags;
                this.getExamineTagsFromAreaId(13, examineTags).forEach( tag =>{
                    this.contractData.tags.push({
                        label: tag.f_name,
                        value: tag.f_id
                    })
                });
            },
            globalAjaxSuccess(){
                this.contractNo = this.utils.getUrlParam('contractNo');
                this.initComponentImg();
                this.initComponentTags();
            }
        },
        created(){

        }
    }
</script>

<style lang="less">
    @import '../theme.less';
</style>

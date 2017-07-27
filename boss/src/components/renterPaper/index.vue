<!-- 4、租客证件 -->
<template>
    <div class="hfq-renter-paper hfq-component">
        <div class="hfq-component-title">租客证件</div>
        <div class="hfq-component-content">

            <!-- examine 类型 -->
            <template v-if="type === 'examine'">
                <!-- 身份证照片 -->
                <div class="hfq-photo-group">
                    <el-row type="flex" align="top" justify="start" >
                        <!--图片区-->
                        <el-col :span="14">
                            <el-row type="flex" align="top" justify="start" >
                                <el-col v-for="(title,index) in idcardData.imgTitles" :key="'idcard-'+index"  class="img-content">
                            <div class="gray img-title">
                                <el-badge is-dot :hidden="getImgField(index)">{{title}}</el-badge>
                            </div>
                            <img v-if="idcardData.imgUrls[index]" @click="setActiveItem(index,idcardData,idcardForm)"
                                 :src="idcardData.imgUrls[index]" class="small-img">
                            <img v-else class="small-img" src="../../assets/img/no_img.png" alt="">
                            <div class="hfq-tag" v-for="tag in idcardData.tags">
                                <hfq-checkbox v-if="tag.group == index" v-model="idcardForm.tags" :label="tag.value"
                                              :key="tag.value">
                                    {{tag.label}}
                                </hfq-checkbox>
                            </div>
                        </el-col>
                            </el-row>
                        </el-col>

                        <!--租客个人信息-->
                        <el-col :span="8" style="margin-top:-3px;">
                            <div class="hfq-cell">
                                <div><b class="hfq-cell-hd">租客证件信息</b></div>
                            </div>
                            <div class="hfq-cell">
                                <div class="hfq-cell-hd">
                                    <el-badge is-dot :hidden="isFiledNameChange('renterName')">租客姓名 </el-badge>
                                </div>
                                {{renterInfo.user_name}}
                            </div>
                            <div class="hfq-cell">
                                <div class="hfq-cell-hd">
                                    <el-badge is-dot :hidden="isFiledNameChange('idcardNo')"> 租客身份证</el-badge>
                                </div>
                                <div class="hfq-cell-bd"> {{renterInfo.user_id_no}}</div>
                            </div>
                        </el-col>
                    </el-row>
                </div>

                <!-- 弹框轮播图组件 -->
                <keep-alive>
                    <hfq-dialog-carousel v-model="carouselForm" tags-position-type="group"
                                         :data="carouselData"></hfq-dialog-carousel>
                </keep-alive>

            </template>

            <!-- upload 类型 -->
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

            <!-- display -->
            <template v-if="type === 'display'">
                <!-- 身份证照片 -->
                <div class="hfq-photo-group">
                    <el-row type="flex" align="top" justify="start">
                        <el-col v-for="(title,index) in idcardData.imgTitles" :key="'idcard-'+index">
                            <div class="gray img-title">{{title}}</div>
                            <img @click="setActiveItem(index,idcardData,idcardForm)" :src="idcardData.imgUrls[index]"
                                 class="small-img">
                        </el-col>
                    </el-row>
                </div>
                <!-- 弹框轮播图组件 -->
                <keep-alive>
                    <hfq-dialog-carousel v-model="carouselForm" tags-position-type="display"
                                         :data="carouselData"></hfq-dialog-carousel>
                </keep-alive>

            </template>
        </div>
    </div>
</template>

<script>
    import vueMethods from 'components/vueMethods'
    export default{
        name: 'hfq-renter-paper',
        mixins:[vueMethods],
        props: {
            /* 三种类型，display: 查看模式；upload:上传模式；examine:审核模式*/
            type: {
                type: String,
                default: 'display'
            },
            value: {
                type: Array
            },
        },
        data(){
            return {
                contractNo: '',

                renterInfo: {},

                // 弹框轮播图数据
                carouselData: {},
                // 弹框轮播图表单
                carouselForm: {
                    initialIndex: 0,
                    showDialog: false,
                    tags: []
                },

                // 身份证照片信息
                idcardData: {
                    imgTitles: ['正面', '反面', '手持', '身份证及其他'],
                    imgUrls: [],
                    tags: [
                        /*{
                         label: '缺钱',
                         value: '0001',
                         group: 0
                         }*/
                    ]
                },
                // 身份证照片表单
                idcardForm: {
                    initialIndex: 0,
                    showDialog: false,
                    tags: []
                },
            }
        },
        computed: {
            model: {
                get(){
                    return this.value !== undefined
                        ? this.value : false;
                },
                set(val){
                    this.$emit('input', val);
                }
            }
        },
        watch:{
            idcardForm:{
                handler(val){
                    this.model = val.tags;
                },
                deep:true
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
                let $axios = this.$axios;
                this.$axios.all([
                    $axios.get(`/v2/api/contracts/signusers/${contractNo}`)
                ]).then(this.$axios.spread((res1,res2) => {
                    this.idcardData.imgUrls[0] = res1.data.f_user_photo_pos;
                    this.idcardData.imgUrls[1] = res1.data.f_user_photo_neg;
                    this.idcardData.imgUrls[2] = res1.data.f_user_photo_face;
                    this.idcardData.imgUrls[3] = res1.data.f_user_poc[0];

                    this.idcardData.imgUrls = this.idcardData.imgUrls.concat(res1.data.f_user_poc.slice(1));
                    this.renterInfo = res1.data;
                }))
            },
            // 获取图片名称
            getImgField(index){
                let filed = '';
                switch (index) {
                    case 0:
                        filed = 'f_user_photo_pos';
                        break;
                    case 1:
                        filed = 'f_user_photo_neg';
                        break;
                    case 2:
                        filed = 'f_user_photo_face';
                        break;
                    case 3:
                        filed = 'f_user_poc';
                        break;
                }
                return this.isFiledNameChange(filed)
            },
            initComponentTags(){
                let examineTags = this.$store.state.examineTags;
                // 身份证正面
                this.getExamineTagsFromAreaId(1, examineTags).forEach(tag => {
                    this.idcardData.tags.push({
                        label: tag.f_name,
                        value: tag.f_id,
                        group: 0
                    })
                })
                // 身份证反面
                this.getExamineTagsFromAreaId(2, examineTags).forEach(tag => {
                    this.idcardData.tags.push({
                        label: tag.f_name,
                        value: tag.f_id,
                        group: 1
                    })
                })
                // 身份证手持
                this.getExamineTagsFromAreaId(3, examineTags).forEach(tag => {
                    this.idcardData.tags.push({
                        label: tag.f_name,
                        value: tag.f_id,
                        group: 2
                    })
                })
                // 身份证及其他
                this.getExamineTagsFromAreaId(4, examineTags).forEach(tag => {
                    this.idcardData.tags.push({
                        label: tag.f_name,
                        value: tag.f_id,
                        group: 3
                    })
                })
            },
            globalAjaxSuccess(){
                this.contractNo = this.utils.getUrlParam('contractNo');
                this.initComponentImg();
                this.initComponentTags();
            },
            // 点击查看时
            handleAudit(row){
                let lease_type = this.utils.getLeaseType(row.lease_type);
                let rc_status = Math.floor(Number(row.rc_status)/100);
                // url中的参数
                let params = {
                    contractNo: row.contract_no,
                    leaseType: row.lease_type,
                    rcStatus: rc_status,
                    agencyId: row.agency_id
                }
                let isProduction = process.env.NODE_ENV === 'production';
                let dist = isProduction ? 'dist/' : '';
                if(lease_type === 'B' && rc_status === 2){
                    // 如果为B端二审状态，则进入二审页面
                    return `/${dist}${this.utils.urlEncode(params)}#/riskManage/phoneCheckDetail`;
                }else{
                    return `/${dist}${this.utils.urlEncode(params)}#/riskManage/auditDetail`;
                }
            }
        },
        created(){

        }
    }
</script>

<style lang="less">
    @import '../theme.less';

    .hfq-renter-paper{
    .hfq-component-content{
        overflow: hidden;
    }
    /* 个人信息 */
    .hfq-li {
        display: inline-block;
        margin-right: 26px;
    }

    .hfq-li > span {
        margin-right: 8px;
    }

    /* 身份证照片 */
    .hfq-photo-group .img-content {
        display: inline-block;
        width: 100px;
        margin-right: 12px;
    }

    .hfq-photo-group .img-title {
        margin-bottom: 8px;
    }

    .hfq-photo-group .small-img {
        width: 100px;
        height: 100px;
        border-radius: 4px;
    }

    .hfq-photo-group .hfq-tag {
        display: block;
    }

    /* 轮播图弹窗区域 */
    .hfq-dialog-wrapper {
        z-index: 10000;
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }

    .hfq-dialog-wrapper .hfq-dialog {
        z-index: 2;
        position: absolute;
        left: 50%;
        top: 25%;
        transform: translateX(-50%);
        width: 600px;
        background: #fff;
        border-radius: 2px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
        box-sizing: border-box;
    }

    .hfq-dialog-wrapper .hfq-dialog .hfq-dialog-icons {
        text-align: right;
        padding: 15px 20px;
        font-size: 14px;
    }

    .hfq-dialog-wrapper .hfq-dialog .hfq-dialog-icons i {
        margin-left: 15px;
    }

    /* 轮播图 */
    .hfq-dialog-wrapper .el-carousel__container {
        height: 420px;
    }

    .hfq-dialog-wrapper .hfq-carousel-img-content {
        overflow: hidden;
        height: 360px;
    }

    .hfq-dialog-wrapper .hfq-tags {
        text-align: center;
        padding: 20px;
    }
}

</style>

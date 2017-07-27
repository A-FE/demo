<!-- 6-租赁合同 -->
<template>
    <div class="hfq-renter-contract hfq-component">
        <div class="hfq-component-title">租赁合同</div>
        <div class="hfq-component-content">

            <!-- examine模式 -->
            <template v-if="type === 'examine'">

                <el-row type="flex">
                    <!-- 左侧图片区 -->

                    <el-col :span="12">
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('f_lease_contract')">租赁合同</el-badge>
                            </div>
                        </div>
                        <div class="img-content">
                            <img v-for="(url,index) in renterImgData.imgUrls" :src="url"
                                 @click="setActiveItem(index,renterImgData,renterForm)">
                        </div>
                        <div class="hfq-tags">
                            <hfq-checkbox v-model="renterForm.tags" v-for="tag in renterImgData.tags" :label="tag.value"
                                          :key="tag">
                                {{tag.label}}

                            </hfq-checkbox>
                        </div>
                    </el-col>

                    <!-- 右侧文字区 -->
                    <el-col :span="10" style="margin-left:95px;">
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('contract_no')">合同号</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.contract_no}}</div>
                            <img v-if="gonghang" style="width:14px;margin-left:4px;" src="../../assets/img/bank_icon.png" alt="">
                            <el-badge is-dot :hidden="isFiledNameChange('collection_manager')"> （跟进人：{{renterData.collection_manager}}）</el-badge>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('user_name')">租客姓名</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.user_name}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('user_id_no')">身份证号</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.user_id_no}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('name')">中介公司</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.name}}</div>
                        </div>
                        <div class="hfq-cell" >
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('address')">房源地址</el-badge>
                            </div>
                            <div class="hfq-cell-bd hfq-cell-primary" style="color: #FF4949">{{renterData.address}}
                                <el-tooltip placement="top" v-if="otherName">
                                    <div slot="content" v-html="otherName"></div>
                                    <el-button type="text" style="width:14px;height:14px;background:#20A0FF;border-radius:7px;color:#fff;font-size: 12px;margin:0 4px;">
                                        别
                                    </el-button>
                                </el-tooltip>

                            </div>
                            <div class="hfq-cell-ft" style="margin-top:-8px;height:18px;">
                                <!-- 房源地址的标签 -->
                                <div class="hfq-tags" style="display: inline-block;margin-top: 0;margin-left: 8px;">
                                    <hfq-checkbox v-model="renterForm.tags" v-for="tag in houseAdressTags" :label="tag.value"
                                                  :key="tag">
                                        {{tag.label}}
                                    </hfq-checkbox>
                                </div>
                            </div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('f_address')">代理房源地址</el-badge>
                            </div>
                            <div class="hfq-cell-bd hfq-cell-primary">{{renterData.f_address}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('f_revised_address')">代理修订地址</el-badge>
                            </div>
                            <div class="hfq-cell-bd hfq-cell-primary">{{renterData.f_revised_address}}</div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot
                                          :hidden="isFiledNameChange('lease_begin') || isFiledNameChange('lease_end')">
                                    租期时间段
                                </el-badge>
                            </div>
                            <div class="hfq-cell-bd hfq-cell-primary">{{renterData.lease_begin}} &#160;至&#160; {{renterData.lease_end}} ({{renterData.total_months}}月{{renterData.total_days}}天)</div>
                            <div class="hfq-cell-ft" style="margin-top:-8px;height:18px;">
                                <!-- 租期的标签 -->
                                <div class="hfq-tags" style="display: inline-block;margin-top: 0px;">
                                    <hfq-checkbox v-model="renterForm.tags" v-for="tag in rentTimeTags" :label="tag.value"
                                                  :key="tag">
                                        {{tag.label}}
                                    </hfq-checkbox>
                                </div>
                            </div>
                        </div>

                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('monthly_amount')">月租金</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.monthly_amount}}</div>
                            <div class="hfq-cell-ft" style="margin-top:-8px;height:18px;">
                                <!-- 月租金的标签 -->
                                <div class="hfq-tags" style="display: inline-block;margin-top: 0;margin-left: 8px;">
                                    <hfq-checkbox v-model="renterForm.tags" v-for="tag in rentTags" :label="tag.value"
                                                  :key="tag">
                                        {{tag.label}}
                                    </hfq-checkbox>
                                </div>
                            </div>
                        </div>
                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('service_fee')">月服务费 </el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.service_fee}}</div>
                        </div>
                        <div class="hfq-cell" style="margin-bottom: 24px;">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('f_prepay_days')">提前还款天数</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{renterData.f_prepay_days}}</div>
                        </div>
                        <el-row type="flex">
                            <el-col>
                                <div class="hfq-cell">
                                    <div class="hfq-cell-hd">
                                        <el-badge is-dot :hidden="isFiledNameChange('hzf_pay_type')">会找房付款方式</el-badge>
                                    </div>
                                    <div class="hfq-cell-bd">{{renterData.hzf_pay_type_value}}</div>
                                    <div class="hfq-cell-ft" style="margin-top:-8px;height:18px;">
                                        <!-- 其他标签 -->
                                        <div class="hfq-tags" style="display: inline-block;margin-top: 0;margin-left: 8px;">
                                            <hfq-checkbox v-model="renterForm.tags" v-for="tag in otherTags" :label="tag.value"
                                                          :key="tag">
                                                {{tag.label}}
                                    </hfq-checkbox>
                                        </div>
                                    </div>
                                </div>
                                <div class="hfq-cell">
                                    <div class="hfq-cell-hd">
                                        <el-badge is-dot :hidden="isFiledNameChange('f_service_fee_payer')">服务费承担方
                                        </el-badge>
                                    </div>
                                    <div class="hfq-cell-bd">{{renterData.f_service_fee_payer_value}}</div>
                                </div>

                            </el-col>
                        </el-row>


                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('countPrice1')">租客还款总额</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{Number(renterData.countPrice1).toFixed(2)}}</div>
                        </div>

                        <div class="m-table" style="margin-top: 8px;">
                                    <!-- 表头 -->
                                    <div class="m-table-thead">
                                        <div class="m-table-tr">
                                            <div class="m-table-th column_1">期次</div>
                                            <div class="m-table-th column_2">还款日期</div>
                                            <div class="m-table-th column_3">还款金额</div>
                                        </div>
                                    </div>

                                    <!-- 表正文 -->
                                    <div class="m-table-tbody" v-if="renterData.total1">
                                        <!-- 第一期 -->
                                        <div class="m-table-tr">
                                            <div class="m-table-td  column_1" v-text="renterData.f_subpay_list[0].index"></div>
                                            <div class="m-table-td  column_2" v-text="renterData.f_subpay_list[0].pay_date.slice(6,7)+'月'+renterData.f_subpay_list[0].pay_date.slice(8,10)+'日'"></div>
                                            <div class="m-table-td  column_3" v-text="renterData.f_subpay_list[0].price"></div>
                                        </div>

                                        <!-- 中间期次-期次大于2 -->
                                        <div class="m-table-tr" v-if="renterData.total1 > 2">
                                            <div class="m-table-td  column_1" v-if="renterData.total1 === 3">2</div>
                                            <div class="m-table-td  column_1" v-if="renterData.total1 > 3">2-{{renterData.total1 - 1}}</div>
                                            <div class="m-table-td  column_2">{{renterData.f_subpay_list[1].pay_date.slice(-2)}}日</div>
                                            <div class="m-table-td  column_3" v-text="renterData.f_subpay_list[1].price"></div>
                                        </div>

                                        <!-- 最后一期 -->
                                        <div class="m-table-tr" v-if="renterData.total1 > 1">
                                            <div class="m-table-td  column_1" v-text="renterData.f_subpay_list[renterData.total1 -1].index"></div>
                                            <div class="m-table-td  column_2">{{renterData.f_subpay_list[renterData.total1 -1].pay_date.slice(-2)}}日</div>
                                            <div class="m-table-td  column_3" v-text="renterData.f_subpay_list[renterData.total1 -1].price"></div>
                                        </div>
                                    </div>

                                </div>


                        <!-- 打款期次和金额 -->
                        <el-row type="flex">
                            <el-col>
                                <el-popover
                                        ref="popover1"
                                        placement="right"
                                        trigger="hover">
                                    <el-table :data="renterData.f_subrent_list">
                                        <el-table-column width="100" property="index" label="期次"></el-table-column>
                                        <el-table-column width="100" property="price" label="金额"></el-table-column>
                                    </el-table>
                                </el-popover>
                            </el-col>
                        </el-row>

                        <div class="hfq-cell">
                            <div class="hfq-cell-hd">
                                <el-badge is-dot :hidden="isFiledNameChange('countPrice')">会分期付款总额</el-badge>
                            </div>
                            <div class="hfq-cell-bd">{{Number(renterData.countPrice).toFixed(2)}}</div>
                            <el-button type="text" v-popover:popover1>
                                <img  style="width:14px;cursor: pointer; margin-left:-10px;" src="../../assets/img/icon_question.png">
                            </el-button>
                        </div>

                    </el-col>
                </el-row>

                <!-- 弹框轮播图组件 -->
                <keep-alive>
                    <hfq-dialog-carousel v-model="renterForm" tags-position-type="mix"
                                         :data="renterImgData"></hfq-dialog-carousel>
                </keep-alive>
            </template>

            <!-- display模式 -->
            <template v-if="type === 'display'">
                <div class="hfq-cell">
                    <div class="hfq-cell-hd">
                        <el-badge is-dot :hidden="isFiledNameChange('f_lease_contract')">租赁合同</el-badge>
                    </div>
                </div>
                <div class="img-content">
                    <img v-for="(url,index) in renterImgData.imgUrls" :src="url"
                         @click="setActiveItem(index,renterImgData,renterForm)">
                </div>
                <!-- 弹框轮播图组件 -->
                <keep-alive>
                    <hfq-dialog-carousel v-model="renterForm" tags-position-type="display"
                                         :data="renterImgData"></hfq-dialog-carousel>
                </keep-alive>
            </template>

            <!-- upload 模式 -->
            <template v-if="type === 'upload'">
                <div class="hfq-cell">
                    <div class="hfq-cell-hd">
                        <el-badge is-dot :hidden="isFiledNameChange('f_lease_contract')">租赁合同</el-badge>
                    </div>
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
            </template>
        </div>
    </div>
</template>

<script>
    import vueMethods from 'components/vueMethods'
    export default{
        name: 'hfq-renter-contract',
        mixins: [vueMethods],
        props: {
            /* 三种类型，display: 查看模式；upload:上传模式；examine:审核模式*/
            type: {
                type: String,
                default: 'display'
            },
            value: {
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
                renterImgData: {
                    imgUrls: [],
                    tags: []
                },
                // 房源地址标签，6
                houseAdressTags:[],
                // 租期时间段标签
                rentTimeTags:[],
                // 租金标签
                rentTags:[],
                // 其他信息错误
                otherTags:[],
                // 租赁合同照片表单
                renterForm: {
                    initialIndex: 0,
                    showDialog: false,
                    tags: []
                },
                // 租赁合同租客信息
                renterData: {},
                // 小区别名
                otherName:'',
                gonghang: false,
                usersInfo:[]
            }
        },
        watch:{
            renterForm:{
                handler(val){
                    this.model = val.tags;
                },
                deep: true
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
        methods: {
            // 显示轮播图,设置轮播图的第一页
            setActiveItem(index, data, form){
                this.carouselData = data;
                this.carouselForm = form;
                this.carouselForm.initialIndex = index;
                this.carouselForm.showDialog = true;
            },
            // 初始化组件文字内容
            initComponentText(){
                //初始化组件
                let contractNo = this.contractNo;
                let agencyId = this.utils.getUrlParam('agencyId');
                this.$set(this.renterData, 'contract_no', contractNo);
                let $axios = this.$axios;
                $axios.all([
                    $axios.get(`/v2/api/contracts/signusers/${contractNo}`),
                    $axios.get(`/v2/api/contracts/installments/${contractNo}`),
                    $axios.get(`/v2/api/contracts/${contractNo}`),
                    $axios.get(`/v2/api/contracts/pays/${contractNo}`),
                    $axios.get(`/v2/api/contracts/agencies/${contractNo}`),
                    $axios.get(`/v2/api/agencys/${agencyId}`),
                    $axios.get(`/v2/api/audit/aliases/?f_state=1`),
                    $axios.get(`/api/auth/user/get/?page_no=1&page_limit=0`)
                ])
                    .then($axios.spread((perms1, perms2, perms3, perms4, perms5, perms6, perms7,perms8) => {
                        this.usersInfo = perms8.data.result.users;
                        //当这两个请求都完成的时候会触发这个函数，两个参数分别代表返回的结果
                        let count = 0;
                        let count1 = 0;
                        this.$set(this.renterData, 'countPrice', 0);
                        this.$set(this.renterData, 'countPrice1', 0);
                        this.renterData = Object.assign({}, perms1.data, perms2.data, perms3.data, perms4.data, perms5.data, perms6.data);
//                        会分期付款总额
                        this.renterData.f_subrent_list.map((val) => {
                            count += val.price;
                        })
                        this.renterData.collection_manager = this.getUserNameFromEmail(this.renterData.collection_manager, this.usersInfo);
                        this.$set(this.renterData, 'countPrice', count);
//                        租客还款总额
                        this.renterData.f_subpay_list.map((val) => {
                            count1 += val.price;
                        })
                        this.$set(this.renterData, 'countPrice1', count1);
                        this.$set(this.renterData, 'total1', this.renterData.f_subpay_list.length);

                        this.otherName = this.utils.getOtherName(this.renterData.address,perms7.data.results);
                        if(perms2.data.f_first_sources_capital === 'h002'){
                            this.gonghang = true;
                        }
                    }))
            },
            // 初始化组件图片
            initComponentImg(){
                let contractNo = this.contractNo;
                this.$axios.all([
                    this.$axios.get(`/v2/api/contracts/images/${contractNo}`)
                ]).then(this.$axios.spread((res1) => {
                    this.renterImgData.imgUrls = res1.data.f_lease_contract;
                }))
            },
            // 初始化页面标签
            initComponentTags(){
                let examineTags = this.$store.state.examineTags;

                // 房源地址标签
                this.houseAdressTags = [];
                this.getExamineTagsFromAreaId(6, examineTags).forEach(tag => {
                    this.houseAdressTags.push({
                        label: tag.f_name,
                        value: tag.f_id
                    })
                });

                // 租期标签
                this.rentTimeTags = [];
                this.getExamineTagsFromAreaId(7, examineTags).forEach(tag => {
                    this.rentTimeTags.push({
                        label: tag.f_name,
                        value: tag.f_id
                    })
                });

                // 租金标签
                this.rentTags = [];
                this.getExamineTagsFromAreaId(8, examineTags).forEach(tag => {
                    this.rentTags.push({
                        label: tag.f_name,
                        value: tag.f_id
                    })
                });

                // 其他标签
                this.otherTags = [];
                this.getExamineTagsFromAreaId(24, examineTags).forEach(tag => {
                    this.otherTags.push({
                        label: tag.f_name,
                        value: tag.f_id
                    })
                });

                // 租赁合同图片
                this.renterImgData.tags = [];
                this.getExamineTagsFromAreaId(5, examineTags).forEach(tag => {
                    this.renterImgData.tags.push({
                        label: tag.f_name,
                        value: tag.f_id
                    })
                });
            },
            globalAjaxSuccess(){
                this.contractNo = this.utils.getUrlParam('contractNo');
                this.initComponentText();
                this.initComponentImg();
                this.initComponentTags();
            }
        },
        mounted(){

        }
    }
</script>

<style lang="less">
    @import '../theme.less';

    .hfq-renter-contract {
        .hfq-cell{
            font-size: 0;
            padding: 6px 0;
            .el-badge{margin-bottom: 0;line-height: 18px;}
            -webkit-box-align: start;
            align-items: flex-start;
        }
        .hfq-cell-hd{
            font-size: 0;
        }

        /* 图片 */
        .img-content {
            font-size: 0;
        }
        .img-content img {
            border-radius: 4px;
            width: 100px;
            height: 100px;
        }
        .img-content img + img {
            margin-left: 12px;
        }
        /* 别名 */
        .hfq-cell .el-button {
            margin: 0 15px;
            padding: 0;
            line-height: 14px;
            vertical-align: middle;
        }
        /* 标签 */
        .hfq-tags {
            margin-top: 10px;
        }

        .hfq-checkbox.el-checkbox {
            margin: 3px 5px;
        }

        .hfq-tags .hfq-checkbox.el-checkbox {
            margin-left: 0;
        }
        .hfq-cell-hd{
            width: 100px;
        }
        /* 自定义表格 */
        .m-table {
            font-size: 0;
        }
        .m-table-tbody {
            .m-table-tr:last-of-type{
                margin-bottom: 8px;
            }
        }
        .m-table-tr {
            margin-bottom: 16px;
        }

        .m-table-th {
            display: inline-block;
            font-size: 14px;
            color: #5E6D82;
            line-height: 18px;
        }

        .m-table-td {
            display: inline-block;
            font-size: 14px;
            color: #1F2D3D;
            line-height: 18px;

        }

        .column_1 {
            width: 60px;
        }

        .column_2 {
            width: 100px;
            text-align: right;
        }

        .m-table-tbody .column_2{
            width: 100px;
            text-align: right;
        }

        .column_3 {
            width: 80px;
            margin-left: 50px;

        }
        .m-table-thead  .column_3{
            width: 80px;
            margin-left: 50px;
        }
        .hfq-tags{
            margin-top:0;
        }
    }

</style>

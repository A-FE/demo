<!-- 14-审核历史 -->
<template>
    <div class="hfq-check-history hfq-component">
        <div class="hfq-component-title">审核历史
            <el-button :disabled="viewAuditHistoryBtn" type="text" @click="isShowAll = true" style="padding: 0;margin-left: 10px;float:right;">查看全部信息</el-button>
        </div>
        <div class="hfq-component-content">
            <el-table :data="auditListDefault">
                <el-table-column prop="oper_time" label="审核时间" width="170" :resizable="false"></el-table-column>
                <el-table-column prop="oper_id_value" label="审核人" width="120" :resizable="false"></el-table-column>
                <el-table-column prop="oper_type_value" label="审核结果" width="120" :resizable="false"></el-table-column>
                <el-table-column prop="audit_tag_value" label="详情原因"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
            </el-table>
            <div class="hfq-remark">
                <el-badge is-dot :hidden="isFiledNameChange('f_area_a')">中介备注</el-badge>
                <span>{{comment}}</span></div>
        </div>
        <!-- 嵌套表格的dialog -->
        <hfq-dialog-table v-model="isShowAll" title="全部审核历史列表" :data="auditListAll" :page-size="10">
            <div slot="description" class="hfq-cell"></div>
            <template slot="table-item">
                <el-table-column prop="oper_time" label="审核时间" width="170" :resizable="false"></el-table-column>
                <el-table-column prop="oper_id_value" label="审核人"  width="120"
                                 :resizable="false"></el-table-column>
                <el-table-column prop="oper_type_value" label="审核结果" width="120" :resizable="false"></el-table-column>
                <el-table-column prop="audit_tag_value" label="详情原因" width="350"></el-table-column>
                <el-table-column prop="remark" label="备注" min-width="350"></el-table-column>
            </template>
        </hfq-dialog-table>
    </div>
</template>

<script>
    import vueMethods from 'components/vueMethods'
    export default{
        name: 'hfq-check-history',
        mixins: [vueMethods],
        props: {},
        data() {
            return {
                contractNo: '',
                isShowAll: false,
                // 审核历史组件数据
                checkHistoryData: [],
                comment: '',
                //审核历史全部数据
                auditListAll: [],
                auditListDefault: [],
                viewAuditHistoryBtn:false
            }
        },
        methods: {
            // 初始化表格数据
            initComponentData(){
                let $axios = this.$axios;
                $axios.all([
                    $axios.get(`/v2/api/audit/logs/${this.contractNo}`),
                    $axios.get(`/api/auth/user/get/?page_no=1&page_limit=0`),
                    $axios.get(`/v2/api/contracts/${this.contractNo}`),
                ]).then($axios.spread((prems1, prems2, prems3) => {
                    this.usersInfo = prems2.data.result.users;
                    let results = prems1.data.results;
                    this.comment = prems3.data.comment;
                    this.auditListAll = results.map(item => {
                        item.oper_id_value = this.getUserNameFromEmail(item.oper_id, this.usersInfo)
                        return item
                    })
                    this.auditListAll.length > 5 ? this.viewAuditHistoryBtn = false : this.viewAuditHistoryBtn = true; 
                    this.auditListDefault = this.auditListAll.slice(0, 5);
                }))
            },
            globalAjaxSuccess(){
                this.contractNo = this.utils.getUrlParam('contractNo');
                this.initComponentData();
            },
        }
    }
</script>

<style lang="less">
    @import '../theme.less';
    .hfq-check-history{
        .hfq-remark {
            font-size: 14px;
            color: #5E6D82;
            line-height: 14px;
            margin-top: 16px;
        }
        .hfq-remark span {
            margin-left: 8px;
            color: #1F2D3D;
        }
    }

</style>

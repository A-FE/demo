<template>
    <div class="hfq-dialog-table" v-show="model">
        <el-dialog :title="title" v-model="model">
            <slot name="description"></slot>
            <el-table :data="tableData" @filter-change="filterChange">
                <slot name="table-item"></slot>
            </el-table>
            <slot></slot>
            <div class="m-pagination">
                <el-pagination
                        v-if="total > pageSize"
                        :small="small"
                        :page-size="pageSize"
                        :total="total"
                        :page-count="pageCount"
                        :current-page="currentPage"
                        :layout="layout"
                        :page-sizes="pageSizes"
                        @current-change="currentPageChange"
                >
                </el-pagination>
            </div>

        </el-dialog>
    </div>
</template>

<script>
    export default{
        name: 'hfq-dialog-table',
        props: {
            value: {
                type: Boolean,
                default: false
            },
            title: {
                type: String
            },
            // 表格属性
            data: {
                type: Array,
                required: true
            },
            // 分页的属性
            small: {
                type: Boolean,
                default: true
            },
            pageSize: {
                type: Number,
                default: 2
            },
            pageCount: {
                type: Number
            },
            layout: {
                type: String,
                default: 'prev, pager, next',
            },
            pageSizes: {
                type: Array,
                defaule: [10, 20, 30, 40, 50, 100]
            },
        },
        data(){
            return {
                tableData: [],
                // 过滤条件
                filters:{},
                //过滤的数据
                filterData:[],
                // 当期页
                currentPage:1
            }
        },
        watch:{
            filters(){
                this.currentPage = 1;
                this.getFilterData();
            },
            filterData(){
                this.currentPage = 1;
                 this.getTableData();
            }
        },
        computed: {
            total(){
                return Array.isArray(this.filterData) ? this.filterData.length : 0;
            },
            model: {
                get(){
                    return this.value !== undefined && this.value
                },
                set(val){
                    this.getFilterData();
                    this.$emit('input', val);
                }
            }
        },
        methods: {
            // 当前页改变时
            currentPageChange(index){
                this.currentPage = index;
                this.getTableData();
            },
            // 表格赛选条件改变时
            filterChange(filters){
                this.filters = filters;
            },
            // 获取filterData的值
            getFilterData(){
                let filters = this.filters;
                let name = Object.keys(filters)[0];
                let filterArr = Object.values(filters)[0];
                if(!filterArr || filterArr.length === 0){
                    this.filterData = this.data;
                }else {
                    this.filterData = this.data.filter((item) => {
                        return filterArr.filter((val) => {
                            return item[name] === val || val === ''
                        }).length;
                    })
                }
            },
            // 获取tableData的值
            getTableData(){
                let startIndex = this.pageSize * (this.currentPage - 1);
                let endIndex = startIndex + this.pageSize;
                this.tableData = this.filterData.slice(startIndex, endIndex);
            }
        },
        mounted(){
            // 获取filterData的值
            this.getFilterData();
        }
    }
</script>

<style lang="less">
    .hfq-dialog-table{
        .el-dialog__body {
            padding-top: 0;
        }

        .el-dialog .el-table__column-filter-trigger{line-height: 14px;    }

        .hfq-cell {
            margin: 10px 0;
        }

        .m-pagination {
            text-align: center;
            margin-top: 16px;
        }
    }

</style>

<!-- 16-审核提交 -->
<template>
    <div class="hfq-check-submit hfq-component">
      <div class="hfq-component-title">审核提交</div>
      <div class="hfq-component-content">

      <div class="hfq-cell">
        <div class="hfq-cell-hd">
            <el-badge is-dot :hidden="isFiledNameChange('remark')">备注</el-badge>
        </div>
        <div class="hfq-cell-bd hfq-cell-primary">
          <div class="hfq-cell">
            <div class="hfq-cell-bd">
              <el-input v-model="remark" class="textarea" type="textarea" :rows="3"></el-input>
            </div>
            <div class="hfq-cell-bd" style="margin-left: 12px;">
                <template v-for="(tag,index) in displayTags">
                    <hfq-checkbox :key="index" v-model="tags" :label="tag.value">{{tag.label}}</hfq-checkbox>
                </template>
            </div>
          </div>
          <div style="margin-top: 8px;">
            <el-button style="width:360px;" type="primary" @click="handlerSubmit">提交</el-button>
          </div>
        </div>
      </div>
      </div>
    </div>
</template>

<script>
    import vueMethods from 'components/vueMethods'
    export default{
        name: 'hfq-check-submit',
        mixins:[vueMethods],
        props:{
          value:{
              type: Object,
              default: function(){
                  return {
                    remark:'',
                    tags:[]
                  }
              }
          }
        },
        computed:{
            model:{
              get() {
                return this.value !== undefined
                  ? this.value : {}
              },
              set(val) {
                this.$emit('input', val);
              }
            },
            remark:{
                get(){
                    return this.value.remark.replace(/;/g, "\r\n")
                },
                set(val){
                    this.model.remark = val.replace(/[\r\n]/g, ";");
                    this.$emit('remark-change', val.replace(/[\r\n]/g, ";"));
                }
            },
            tags:{
                get(){
                    return this.value.tags
                },
                set(val){
                    this.model.tags = val;
                    this.$emit('tags-change', val);
                }
            },
        },
        data(){
            return {
                displayTags:[]
            }
        },
        methods: {
            handlerSubmit(){
                this.$emit('submit');
            },
            initComponentTags(){
                // 审核标签
                this.displayTags = [];
                let examineTags = this.$store.state.examineTags;
                this.getExamineTagsFromAreaId(21, examineTags).forEach(tag => {
                    this.displayTags.push({
                        label: tag.f_name,
                        value: tag.f_id
                    })
                });
            },
            globalAjaxSuccess(){
                this.initComponentTags();
            }
        }
    }
</script>

<style lang="less">
  @import '../theme.less';
  .hfq-check-submit{
      .hfq-cell{  align-items: flex-start;}
      .hfq-cell .hfq-cell{padding: 0;}
      .hfq-cell-bd .textarea{width: 360px;}
  }
</style>

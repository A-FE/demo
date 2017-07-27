<!-- 搜索中介公司 -->
<template>
    <div class="hfq-search-agency">
        <el-autocomplete
            v-model="agencyName"
            class="inline-input"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="false"
            @select="handleSelect"
        ></el-autocomplete>
    </div>
</template>

<script>
    export default{
        name: 'hfq-search-agency',
        props:{
          value:{
              default: ''
          }
        },
        data(){
            return {
                agencyName:'',
                ifShow: false
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
            },
            agencyList(){
                return this.$store.state.agencyList.map( item => {
                    item.value = item.name;
                    return item
                })
            }
        },
        watch:{
            agencyName(val){
                if(val === ''){
                    this.model = '';
                }
            },
            model(val){
                if(val === ''){
                    this.agencyName = '';
                }
            }
        },
        methods: {
            querySearch(queryString,cb){
                let agencyList = this.agencyList;
                let results = [];
                let arr = ['有限','公司','有限公司'];
                if(!queryString || queryString.length < 2 || arr.find( item => item === queryString)){
                    results = [];
                }else {
                    results = agencyList.filter( item => item.value.indexOf(queryString) !== -1)
                }
                cb(results);
            },
            handleSelect(item){
                this.model = item.agencyid;
                this.$emit('select',item);
            },
        },
    }
</script>


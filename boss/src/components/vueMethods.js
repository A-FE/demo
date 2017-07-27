// 自定义组件公共部分
export default {
    methods: {
        // 查询某一个字段是否修改过
        isFiledNameChange(filedName){
            let changedfiledName = this.$store.state.changedfiledName;
            return !Object.keys(changedfiledName).find(n => n === filedName);
        },
        // 根据标签的区域的name获取审核标签
        getExamineTagsFromAreaId(key){
            let examineTags = this.$store.state.examineTags;
            let biaoqianAreas = {
                // 租客身份证正面,key页面DOM元素的id,value，返回数据的f_upstream_id
                1: [1],
                // 租客身份证反面
                2: [2],
                // 租客手持
                3: [3],
                // 身份证其他
                4: [4],
                // 租赁合同图片
                5: [5, 14],
                // 租赁合同信息
                6: [6],
                7: [7],
                8: [8],
                24: [24],
                // 房产证图片
                9: [9],
                // 业主身份证
                10: [10],
                // 代理合同图片,工作证明/实习证明
                11: [11, 15],
                // 房源标签
                12: [12],
                // 会分期纸质合同图片
                13: [13],
                // 黑名单
                16: [16],
                // 同盾信息
                17: [17],
                // 二审信息
                18: [18, 19, 20, 23],
                // 一审通过
                21: [21],
                // 租客证件信息
                22: [22]
            };
            return this.utils.getObjType(examineTags) !== 'Array' ? [] :
                examineTags.filter(item => {
                    return !!biaoqianAreas[key].find(n => item.f_upstream_id === n)
                })
        },
        // 根据邮箱获取用户的姓名
        getUserNameFromEmail(email, usersInfo){
            if (this.utils.getObjType(usersInfo) !== 'Array') {
                console.log('usersInfo必须是一个数组,实际上是一个' + this.utils.getObjType(usersInfo));
                return email
            } else {
                let user = usersInfo.filter(item => item.oper_id === email);
                return user.length ? user[0].oper_name : email
            }
        }
    },
    created(){
        let contractNo = this.utils.getUrlParam('contractNo');
        let leaseType = this.utils.getUrlParam('leaseType');

        this.$axios.all([
            this.$axios.get(`/v2/api/audit/modifylogs/${contractNo}`),
            this.$axios.get(`/v2/api/audit/tags/?f_lease_type=${leaseType}&limit=0`)
        ]).then(this.$axios.spread((res1, res2) => {
                this.$store.commit('setChangedfiledName', res1.data);
                this.$store.commit('setExamineTags', res2.data.results);
                // 执行全局回调
                this.globalAjaxSuccess && this.globalAjaxSuccess();
            }
        ))
    }
}

// 页面公共部分
export default {
    methods: {
        // 根据邮箱获取用户的姓名
        getUserNameFromEmail(email, usersInfo){
            if (this.utils.getObjType(usersInfo) !== 'Array') {
                console.log('usersInfo必须是一个数组,实际上是一个' + this.utils.getObjType(usersInfo));
                return email
            } else {
                let user = usersInfo.filter(item => item.oper_id === email);
                return user.length ? user[0].oper_name : email
            }
        },
        // 根据标签的id,读取标签的描述
        getTagsFromTagsId(ids){
            let examineTags = this.$store.state.examineTags;
            let result = '';
            ids.forEach(id => {
                let taget = examineTags.find(item => item.f_id == id);
                result += taget ? taget.f_desc : '';
                result += ';';
            })
            return result
        },
        // 跳转到xx页
        openUrl(url){
            window.open(url);
        }
    },
    created(){

    }
}

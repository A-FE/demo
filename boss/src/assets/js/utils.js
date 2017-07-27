let isProduction = process.env.NODE_ENV === 'production';
import {Message} from 'element-ui';
import axios from 'axios'
import store from '../../vuex/store'
import data from './mock'

let utils = {
    // 是否为生产环境
    isProduction(){
        return isProduction
    },
    // 跨域处理
    replaceUrl(string, reg, replacement){
        if (!isProduction) {
            return string.replace(reg, replacement || '');
        } else {
            return string
        }
    },
    /* 获取当前对象的类型
     * @param obj
     * @return
     * */
    getObjType(obj){
        return (obj === undefined || obj === null) ? obj : obj.constructor && (obj.constructor.toString().match(/function\s+([^(]+)/)[1]);
    },
    getUrlParam(name) {
        var result = "";
        var searchArr = decodeURIComponent(window.location.search).slice(1).split("&");
        searchArr.map(function (item) {
            var arr = item.split("=");
            if (arr[0] == name) {
                result = decodeURIComponent(arr[1]);
            }
        });
        return result
    },
    // 获取合同的类型,1、3是C端  2、4是B端
    getLeaseType(n){
        let leaseType = this.getUrlParam('leaseType');
        n = n ? n : leaseType;
        let contractType = '';
        switch (Number(n)) {
            case 1:
                contractType = 'B';
                break;
            case 2:
                contractType = 'B';
                break;
            case 3:
                contractType = 'C';
                break;
            case 4:
                contractType = 'B';
                break;
        }
        return contractType
    },
    /**
     * param 将要转为URL参数字符串的对象
     * key URL参数字符串的前缀
     * encode true/false 是否进行URL编码,默认为true
     * return URL参数字符串
     */
    urlEncode(param, key, encode) {
        return urlEncode(param, key, encode).replace(/^&/, '?')
    },
    /* 获取小区别名
     * @param name <String>小区中文名
     * @param origin <Array> 房源列表
     * @return <String> 匹配到的小区列表名拼接成的字符串
     * */
    getOtherName(name, origin){
        // 判断origin是否为数组
        if (Array.isArray(origin)) {
            let result = [];
            let resultStr = '';
            // 1、用房源中文名f_key筛选出符合条件的小区名
            let filters = origin.filter(item1 => {
                return item1.f_name.findIndex( item4 => name.indexOf(item4) !== -1) !== -1
            });
            // 2、用筛选出的房源的f_upstream_id去查找同一组的其他房源
            filters.forEach(item2 => {
                result = [...result,...item2.f_name]
            })
            // 3、将最终筛选出来的小区的f_name拼接成一个字符串
            return result.join(';<br/>')
        } else {
            throw TypeError('getOtherName的第二个参数必须为一个数组')
            return '';
        }
    },
    /* 比较时间的大小,第一个是否大于第二个时间
     * @param time1 <String>
     * @parma time2 <String>
     * @return <Blooen>
     * */
    compareTime(time1, time2){
        let reg = /^\d{4}-\d{2}-\d{2}/;
        if (reg.test(time1) && reg.test(time2)) {
            return new Date(time1) >= new Date(time2)
        } else {
            throw TypeError('参数类型错误')
        }
    }
}

function urlEncode(param, key, encode) {
    if (param == null) return '';
    var paramStr = '';
    var t = typeof (param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
        paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
    } else {
        for (var i in param) {
            var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
            paramStr += urlEncode(param[i], k, encode);
        }
    }
    return paramStr;
}

export default utils

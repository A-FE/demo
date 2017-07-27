### 组件说明
1. 用户信息 userInfo
2. 订单基本信息 orderInfo
3. 二审(电话审核)信息 phoneCheckInfo
4. 租客证件 renterPaper
5. 代理合同  agentContract
6/19. 租赁合同  rentContract
7. 会分期合同 HFQContract
8. 付款计划表 paySchedule
9. 还款计划表 repaySchedule
10. 合同备注 contractRemark
11. 违约退款信息 refundInfo
12. 按钮组(重申、删除、合同历史) btnGroup
13. 合同日志 contractJournal
14. 审核历史 checkHistory
15. 人工干涉 riskManageStrategy
16. 审核提交 checkSubmit
17. 录音 record
18. 质检 qualityControl
20. 还款单处理 repayHandle
21. tag类型的checkBox 
22. 弹窗-轮播图组件 dialogCarousel
24. 内嵌分页表格的弹框 dialogTable
26. 内嵌tabs和分页的表格弹框 dialogTabsTable
23. 银行卡信息 bankcardInfo
25. 退款信息弹窗 dialogRefundInfo

### 组件结构规范
以租赁合同组件为例,文件结构如下,所有组件都应该是这种结构，只是外层文件夹的名称不同
```
|--contranct/
	||-- index.vue 组件文件
	||-- README.md 组件说明
```

### 组件的命名规范(参考element)

* class类名----中划线命名法
组件的所有类名class都应以``hfq-``开头,采用下划线命名法,可以避免污染全局样式，也可以避免被其他样式污染
```
<div class="hfq-contract">
	...
</div>
```

* 组件属性命名规范 ----组件源码,使用驼峰命名法;在页面使用时,会自动转化为中划线命名法

* js变量名 ----驼峰命名法
```angular2html
var crmIfo = 'zhazha'
```

* 文件夹名 ---- 驼峰命名法
```angular2html
|--checkSubmit
```

### 组件的公共变量
* examineStep 审核到第几部了
    * 1 一审
    * 2 二审
* contractType 合同类型
    * B B端
    * C C端
  
    
### 所有组件的宽度一致，高度根据内容变化
`_**``**_`
### 组件字段的命名规范 -- 下划线命名法

### 组件README.md书写格式




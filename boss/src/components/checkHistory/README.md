### 14-审核历史
#### 1、属性
* data [array] 表格的数据来源,所需字段如下
  * time [string] 审核时间
  * name [string] 审核人
  * result [string] 审核结果
  * reason [string] 详情原因
  * remark [string] 备注
```
data:[
   {
     time: '2017-04-14 12:12:12',
     name: '陈可可',
     result:'发起违约',
     reason:'用户破产,用户破产,用户破产,用户破产',
     remark:'金额为0自动平账'
   }
]
```

* remark [remark] CRM备注

import { FormTypes, getListData } from '@/utils/JEditableTableUtil'
import { getAction,putAction } from '@/api/manage'
import { USER_INFO } from "@/store/mutation-types"
import Vue from 'vue'

export const GoodsModalMixin = {
  data() {
    return {
      action: '',
      price: '',
      isTenant: false,
      spans: {
        labelCol1: {span: 2},
        wrapperCol1: {span: 22},
        //1_5: 分为1.5列（相当于占了2/3）
        labelCol1_5: { span: 3 },
        wrapperCol1_5: { span: 21 },
        labelCol2: {span: 4},
        wrapperCol2: {span: 20},
        labelCol3: {span: 6},
        wrapperCol3: {span: 18},
        labelCol6: {span: 12},
        wrapperCol6: {span: 12}
      },
       url: {
         getbyids: "/test/cesShopGoods/queryByIds",
       },
       
    };
  },
  created () {
    let userInfo = Vue.ls.get(USER_INFO)
    this.isTenant = userInfo.id === userInfo.tenantId? true:false
    let realScreenWidth = window.screen.width * window.devicePixelRatio
    this.width = realScreenWidth<1600?'1300px':'1600px'
  },
  computed: {
    readOnly: function() {
      return this.action !== "add" && this.action !== "edit";
    }
  },
  methods: {
    /** 查询某个tab的数据 */
    requestSubTableData(url, params, tab, success) {
      tab.loading = true
      getAction(url, params).then(res => {
         console.log("requestSubTable res = ",res)
        if(res.success && res.code === 200){
          tab.dataSource = res.result;
          console.log("tab.dataSource = ",tab.dataSource)
          for(let i=0; i<tab.dataSource.length; i++){
            let info = tab.dataSource[i]
            this.changeColumnShow(info)
          }
          typeof success === 'function' ? success(res) : ''
        }
      }).finally(() => {
        tab.loading = false
      })
    },
    //使得商品名称，价格等为显示
    changeColumnShow(info) { 
      if(info.name) {
        this.changeFormTypes(this.cesOrderGoodsTable.columns, 'goodName', 1)
      }
      if(info.code) {
        this.changeFormTypes(this.cesOrderGoodsTable.columns, 'goodCode', 1)
      }
    },
    //改变字段的状态，1-显示 0-隐藏
    changeFormTypes(columns, key, type) {
      console.log("changeFormTypes columns key",columns,key);
      for(let i=0; i<columns.length; i++){
        if(columns[i].key === key) {
          if(type)
          {
            console.log("columns[i].key,key",columns[i].key,key)
            if (key === 'goodCode') {
              columns[i].type = FormTypes.popupGoods; //显示
              //columns[i].type = FormTypes.input; //显示
            }
            else if( (key === 'num') || (key === 'price') || (key === 'zongPrice') ) 
            {
              columns[i].type = FormTypes.input; //显示
            }
            else
            {
              columns[i].type = FormTypes.normal;//显示
            }
          } else {
            columns[i].type = FormTypes.hidden; //隐藏
          }
        }
      }
    },
    //单元值改变一个字符就触发一次
    onValueChange(event) {
      console.log("onValueChange(event)");
      let that = this
      const { type, row, column, value, target } = event
      let param,num,price,zongprice
      switch(column.key) {
        case "goodCode":
          param = {
            ids: value,
          }
          getAction(this.url.getbyids,param).then((res) => {
            console.log("onValueChange res",res)
            if (res && res.code === 200) {
              let mList = res.result;
              console.log("onValueChange mList,value",mList,value)
                //多个条码
                this.$refs.cesOrderGoods.getValues((error, values) => {
                  values.pop()  //移除最后一行数据
                  let mArr = []
                  for (let i = 0; i < mList.length; i++) {
                    let mInfo = mList[i]
                    this.changeColumnShow(mInfo)
                    let mObj = this.parseInfoToObj(mInfo)
                    mArr.push(mObj)
                  }
                  let totalPrice = 0
                  for (let j = 0; j < mArr.length; j++) {
                    totalPrice += mArr[j].zongprice-0
                  }
                  console.log("onValueChange mArr2",mArr)
                  this.cesOrderGoodsTable.dataSource = mArr
                  //target.statisticsColumns.zongprice = totalPrice
                  //target.setValues(mArrValues)
                  //target.recalcAllStatisticsColumns()
                  // 更新form表单的值
                  that.autoChangePrice(target) 
               })
            }  
          });
          break;
        case "num":
          num = value-0
          price = row.price-0 //单价
          zongprice = (price*num).toFixed(2)-0
          console.log("row.goodCode",row.goodCode)
          target.setValues([{rowKey: row.id, values: {zongPrice: zongprice}}])
          target.recalcAllStatisticsColumns()
          break;
        case "price":
          num = row.num-0 //数量
          price = value-0 //单价
          zongprice = (price*num).toFixed(2)-0
          target.setValues([{rowKey: row.id, values: {zongPrice: zongprice}}])
          target.recalcAllStatisticsColumns()
          break;
        case "zongPrice":
          num = row.num-0 //数量
          zongprice = value-0
          price = (zongprice/num).toFixed(2)-0 //单价
          target.setValues([{rowKey: row.id, values: {price: price}}])
          target.recalcAllStatisticsColumns()
          break;
      }
    },
    
    //改变一些需要统计的值
    autoChangePrice(target) {
      
    },
  
    //使得型号、颜色、扩展信息、sku等为隐藏
    changeColumnHide() {
      //this.changeFormTypes(this.cesOrderGoodsTable.columns, 'goodname', 0)
    },
    //转为商品对象
    parseInfoToObj(mInfo) {
      return {
        goodCode: mInfo.code,
        goodName: mInfo.name,
        num: mInfo.num,
        price: mInfo.price,
        zongPrice: mInfo.zongprice,
      }
    },
    //删除一行或多行的时候触发
    onDeleted(ids, target) {
      target.recalcAllStatisticsColumns()
    },
   }
}
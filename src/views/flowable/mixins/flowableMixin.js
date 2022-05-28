import {filterObj} from '@/utils/util';
import {deleteAction, downFile, getAction} from '@/api/manage'
import Vue from 'vue'
import {ACCESS_TOKEN} from "@/store/mutation-types"
import JEllipsis from '@/components/jeecg/JEllipsis'
import { listCustomForm } from "@/api/form";

export const flowableMixin = {
  components: {
    JEllipsis
  },
  data(){
    return {
      //token header
      //tokenHeader: {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)},
      customformList: [],
      formQueryParams:{
        pageNum: 1,
        pageSize: 1000,
      },
    }
  },
  created() {
    //this.ListCustomForm();
  },
  computed:{
    /*todo 所有的流程表单，组件化注册，在此维护*/
    allFormComponent:function(){
      //return this.customformList;
      return [
          {
            text:'单表示例',
            routeName:'@/views/flowable/demo/modules/TestDemoForm',
            component:() => import(`@/views/flowable/demo/modules/TestDemoForm`),
            businessTable:'test_demo'
          },
          {
            text:'主子表示例',
            routeName:'@/views/flowable/demo/modules/CesOrderMainForm',
            component:() => import(`@/views/flowable/demo/modules/CesOrderMainForm`),
            businessTable:'ces_order_main'
          }
      ]
    }
  },
  methods:{
    /*StringToComponent (str) {
      return function (resolve) {
        require([`${str}.vue`], resolve)
      }
    },
    replacer(key, value) {
      if ( key === "component") {
        console.log("key-value=",key,value);
        return StringToComponent (value);
      }
      return value;
    },*/
    /** 挂载自定义业务表单列表 */
    /*ListCustomForm() {
       console.log("flowableMixin ListCustomForm");
      listCustomForm(this.formQueryParams).then(res => {
        console.log("flowableMixin res");
        console.log("res.result.records",res.result.records);
        
        this.customformList = JSON.stringify(res.result.records,this.replacer);
        
        console.log("this.customformList =",this.customformList);
      })
    },*/
    getFormComponent(routeName){
      return _.find(this.allFormComponent,{routeName:routeName})||{};
    },
   
    handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field;
        this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
      }
      this.ipagination = pagination;
      // this.loadData();
    },
    millsToTime(mills) {
      if (!mills) {
        return "";
      }
      let s = mills / 1000;
      if (s < 60) {
        return s.toFixed(0) + " 秒"
      }
      let m = s / 60;
      if (m < 60) {
        return m.toFixed(0) + " 分钟"
      }
      let h = m / 60;
      if (h < 24) {
        return h.toFixed(0) + " 小时"
      }
      let d = h / 24;
      if (d < 30) {
        return d.toFixed(0) + " 天"
      }
      let month = d / 30
      if (month < 12) {
        return month.toFixed(0) + " 个月"
      }
      let year = month / 12
      return year.toFixed(0) + " 年"
    
    },
  }

}
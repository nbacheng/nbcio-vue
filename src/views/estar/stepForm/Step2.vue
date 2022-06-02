<template>
  <div>
    <a-form style="max-width: 1024px; margin: 20px auto 0;">
      <a-alert :closable="true" message="请先确认好审批内容,提交审批后就进入钉钉审批流程了。" style="margin-bottom: 24px;" />
      <!-- <a-row type="flex" :gutter="168">
        <a-col span={12}>
          <a-form-item label="部门" :labelCol="{span: 8}" :wrapperCol="{span: 16}" class="stepFormText">
            信息工程部
          </a-form-item>
        </a-col>
        <a-col span={12}>
          <a-form-item label="年月" :labelCol="{span: 12}" :wrapperCol="{span: 12}" class="stepFormText">
            202112
          </a-form-item>
        </a-col>
      </a-row> -->
      <a-row>
        <a-col :sm="2" :xs="2">部门：</a-col>
        <a-col :sm="9" :xs="16">{{depname}}</a-col>
        <a-col :sm="2" :xs="2">年月：</a-col>
        <a-col :sm="9" :xs="16">{{yearmonth}}</a-col>
      </a-row>
      <a-table rowKey="rowIndex" bordered :columns="colDepSalary" :dataSource="dsDepSalary" :pagination="false">
        <template slot="title" slot-scope="currentPageData">
          本部门薪资汇总表
        </template>
      </a-table>

      <a-table v-if="havesubdep == true"  rowKey="rowIndex" bordered :columns="colSubTotal" :dataSource="dsSubTotal" :pagination="false">
        <template slot="title" slot-scope="currentPageData">
          下级部门薪资汇总表
        </template>
      </a-table>
      <a-divider orientation="left">
      </a-divider>
      <a-form-item :wrapperCol="{span: 19, offset: 10}">
        <a-button :loading="loading" type="primary" @click="nextStep">提交</a-button>
        <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
      </a-form-item>
    </a-form>
  </div>


</template>

<script>
  /*
  desc:  第二步，从store里取出上一步选择部门与年月，调用两个后端接口获取部门汇总薪资与子部门薪资汇总并用表格方式显示出来，
         并进行汇总
  author: nbacheng
  date:   2022-02-28
  */
  import {
    getAction
  } from '@/api/manage'
  import Vue from 'vue'
  import store from '@/store/'

  export default {
    name: "Step2",
    data() {
      return {
        depno: "",
        depname: "",
        yearmonth: "",
        havesubdep: false,
        loading: false,
        colDepSalary: [{
            title: '#',
            width: '180px',
            align: 'center',
            dataIndex: 'rowIndex',
            customRender: function(text, r, index) {
              return (text !== '合计') ? (parseInt(index) + 1) : text
            }
          },
          {
            title: '姓名',
            align: "center",
            dataIndex: 'realname'
          },
          {
            title: '部门',
            align: "center",
            dataIndex: 'depname'
          },

          {
            title: '个人奖金',
            align: "center",
            dataIndex: 'bysfjj'
          },
          {
            title: '个人工资',
            align: "center",
            dataIndex: 'bysfgz'
          },
          {
            title: '入司时间',
            align: "center",
            dataIndex: 'createTime',
            customRender: function(text) {
              return !text ? "" : (text.length > 10 ? text.substr(0, 10) : text)
            }
          },
        ],

        dsDepSalary: [],
        colSubTotal: [{
            title: '#',
            width: '180px',
            align: 'center',
            dataIndex: 'rowIndex',
            customRender: function(text, r, index) {
              return (text !== '合计') ? (parseInt(index) + 1) : text
            }
          },
          {
            title: '部门',
            align: "center",
            dataIndex: 'depname'
          },
          {
            title: '人数',
            align: "center",
            dataIndex: 'rs'
          },
          {
            title: '本月实发工资',
            align: "center",
            dataIndex: 'bysfgz'
          },
          {
            title: '本月加班费',
            align: "center",
            dataIndex: 'byjbf'
          },
          {
            title: '本月实发奖金',
            align: "center",
            dataIndex: 'bysfjj'
          },
          {
            title: '上月实发工资',
            align: "center",
            dataIndex: 'sysfgz'
          },
          {
            title: '上月加班费',
            align: "center",
            dataIndex: 'syjbf'
          },
          {
            title: '上月实发奖金',
            align: "center",
            dataIndex: 'sysfjj'
          },
        ],
        dsSubTotal: [],
        url: {
          listsalarybydep: "/estar/oaSalary/listsalarybydep",
          listtotalbysubdep: "/estar/oaSalaryTotal/listtotalbysubdep",
          listsubdep: "/estar/oaSalary/listsubdep",
        },
        newArr: [],
        newDataSource: [],
      }
    },
    mounted() {
      //this.depname = Vue.ls.get("depname")
      this.yearmonth = Vue.ls.get("yearmonth")
    },
    created() {
      const paramsDepSalary = {
        depno: Vue.ls.get("depno"),
        salaryyear: Vue.ls.get("yearmonth").trim().substring(0, 4),
        salarymonth: Vue.ls.get("yearmonth").trim().substring(4, 6),
      };

      const paramsSubDep = {
        depno: Vue.ls.get("depno"),
      };
      this.loadDepSalaryData(this.url.listsalarybydep, paramsDepSalary);      
      this.getSubDep(this.url.listsubdep, paramsSubDep);
      console.log("havesubdep1="+this.havesubdep)
      
    },
    computed: {
      //token header
      tokenHeader() {
        let head = {
          'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)
        }
        let tenantid = Vue.ls.get(TENANT_ID)
        if (tenantid) {
          head['tenant-id'] = tenantid
        }
        return head;
      }
    },
    methods: {
      loadDepSalaryData(url, params) {
        if (!url) {
          this.$message.error("请设置url属性!")
          return
        }
        this.loading = true;
        getAction(url, params).then((res) => {
          if (res.success) {
             console.log("loadDepSalaryData res",res)
             if (res.result.length>0) {
               this.depname = res.result[0].depname;
               Vue.ls.set("depname", this.depname);
               console.log("this.depname=",this.depname)
             }
            this.dsDepSalary = res.result;
            let arraytotal = ['bysfjj', 'bysfgz'];
            this.tableAddTotalRow(this.colDepSalary, this.dsDepSalary, arraytotal)
          } else {
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      loadSubTotalData(url, params) {
        if (!url) {
          this.$message.error("请设置url属性!")
          return
        }
        this.loading = true;
        getAction(url, params).then((res) => {
          if (res.success) {
            console.log("loadSubTotalData res",res)
            
            this.dsSubTotal = res.result.records || res.result;
            let arraytotal = ['rs', 'bysfgz', 'byjbf', 'bysfjj', 'sysfgz', 'syjbf', 'sysfjj'];
            this.tableAddTotalRow(this.colSubTotal, this.dsSubTotal, arraytotal)
          } else {
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      getSubDep(url, params) {
        if (!url) {
          this.$message.error("请设置url属性!")
          return
        }
        this.loading = true;
        const paramsSubTotal = {
          depno: Vue.ls.get("depno"),
          salaryyear: Vue.ls.get("yearmonth").trim().substring(0, 4),
          salarymonth: Vue.ls.get("yearmonth").trim().substring(4, 6),
        };
        getAction(url, params).then((res) => {
          if (res.success) {
            var Length = 0;
            console.log(res.result);
            for (var item in res.result) {
                       Length++;
            }
           if(Length>0) {
             this.havesubdep = true;
             console.log("havesubdep2="+this.havesubdep)
             this.loadSubTotalData(this.url.listtotalbysubdep, paramsSubTotal);
           }
          } else {
            this.$message.warning(res.message)
          }
        }).finally(() => {
          this.loading = false
        })
      },
      
      /** 表格增加合计行  根据传入的合计columns,dataSource和totallist 来合计  totallist是需要合计的项目*/
      tableAddTotalRow(columns, dataSource, totallist) {
        let numKey = 'rowIndex'
        let totalRow = {
          [numKey]: '合计'
        }
        columns.forEach(column => {
          let {
            dataIndex
          } = column
          let total = 0
          for (var value of totallist) {
            if (value == dataIndex) {
                  dataSource.forEach(data => {
                  total += data[dataIndex]
                  console.log(total)
                })
            if (Number.isInteger(total)){
              totalRow[dataIndex] = total   
            } else {
              totalRow[dataIndex] = total.toFixed(2)   
            }   
            }
          }
        })
        dataSource.push(totalRow)  
      },
      nextStep() {
        let that = this
        that.loading = true
        setTimeout(function() {
          that.$emit('nextStep')
        }, 1000)
      },
      prevStep() {
        this.$emit('prevStep')
      }
    }
  }
</script>

<style lang="less" scoped>
  .stepFormText {
    margin-bottom: 12px;

    .ant-form-item-label,
    .ant-form-item-control {
      line-height: 12px;
    }
  }
</style>

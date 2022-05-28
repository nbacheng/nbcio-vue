<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="empno" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="empno">
              <a-input v-model="model.empno" placeholder="请输入empno"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="depno" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="depno">
              <a-input v-model="model.depno" placeholder="请输入depno"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="salaryyear" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="salaryyear">
              <a-input-number v-model="model.salaryyear" placeholder="请输入salaryyear" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="salarymonth" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="salarymonth">
              <a-input-number v-model="model.salarymonth" placeholder="请输入salarymonth" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="qts" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="qts">
              <a-input-number v-model="model.qts" placeholder="请输入qts" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="shouldworkdays" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="shouldworkdays">
              <a-input-number v-model="model.shouldworkdays" placeholder="请输入shouldworkdays" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="factworkdays" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="factworkdays">
              <a-input-number v-model="model.factworkdays" placeholder="请输入factworkdays" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="absentworkdays" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="absentworkdays">
              <a-input-number v-model="model.absentworkdays" placeholder="请输入absentworkdays" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="middleworkdays" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="middleworkdays">
              <a-input-number v-model="model.middleworkdays" placeholder="请输入middleworkdays" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="nightworkdays" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="nightworkdays">
              <a-input-number v-model="model.nightworkdays" placeholder="请输入nightworkdays" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="lates" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="lates">
              <a-input-number v-model="model.lates" placeholder="请输入lates" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="overtimehours" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="overtimehours">
              <a-input-number v-model="model.overtimehours" placeholder="请输入overtimehours" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="overtimedays" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="overtimedays">
              <a-input-number v-model="model.overtimedays" placeholder="请输入overtimedays" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="qjb" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="qjb">
              <a-input-number v-model="model.qjb" placeholder="请输入qjb" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="absentdays" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="absentdays">
              <a-input-number v-model="model.absentdays" placeholder="请输入absentdays" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="latetime" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="latetime">
              <a-input-number v-model="model.latetime" placeholder="请输入latetime" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="sj" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sj">
              <a-input-number v-model="model.sj" placeholder="请输入sj" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="bj" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bj">
              <a-input-number v-model="model.bj" placeholder="请输入bj" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="cj" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="cj">
              <a-input-number v-model="model.cj" placeholder="请输入cj" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="gsj" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="gsj">
              <a-input-number v-model="model.gsj" placeholder="请输入gsj" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="hsj" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="hsj">
              <a-input-number v-model="model.hsj" placeholder="请输入hsj" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="dxnxj" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="dxnxj">
              <a-input-number v-model="model.dxnxj" placeholder="请输入dxnxj" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="wpznxj" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="wpznxj">
              <a-input-number v-model="model.wpznxj" placeholder="请输入wpznxj" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="basepay" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="basepay">
              <a-input-number v-model="model.basepay" placeholder="请输入basepay" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="skillpay" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="skillpay">
              <a-input-number v-model="model.skillpay" placeholder="请输入skillpay" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="positionpay" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="positionpay">
              <a-input-number v-model="model.positionpay" placeholder="请输入positionpay" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="addpay" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="addpay">
              <a-input-number v-model="model.addpay" placeholder="请输入addpay" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="jbf" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="jbf">
              <a-input-number v-model="model.jbf" placeholder="请输入jbf" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="subconfficient" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="subconfficient">
              <a-input-number v-model="model.subconfficient" placeholder="请输入subconfficient" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="sumpay" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sumpay">
              <a-input-number v-model="model.sumpay" placeholder="请输入sumpay" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="ykgz" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="ykgz">
              <a-input-number v-model="model.ykgz" placeholder="请输入ykgz" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="bkgz" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bkgz">
              <a-input-number v-model="model.bkgz" placeholder="请输入bkgz" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="yfgz" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="yfgz">
              <a-input-number v-model="model.yfgz" placeholder="请输入yfgz" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="nightallowance" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="nightallowance">
              <a-input-number v-model="model.nightallowance" placeholder="请输入nightallowance" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="zfbt" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="zfbt">
              <a-input-number v-model="model.zfbt" placeholder="请输入zfbt" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="treatment" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="treatment">
              <a-input-number v-model="model.treatment" placeholder="请输入treatment" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="tcbt" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="tcbt">
              <a-input-number v-model="model.tcbt" placeholder="请输入tcbt" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="lyf" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="lyf">
              <a-input-number v-model="model.lyf" placeholder="请输入lyf" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="nxjbt" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="nxjbt">
              <a-input-number v-model="model.nxjbt" placeholder="请输入nxjbt" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="gwjt" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="gwjt">
              <a-input-number v-model="model.gwjt" placeholder="请输入gwjt" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="zybbt" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="zybbt">
              <a-input-number v-model="model.zybbt" placeholder="请输入zybbt" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="bk" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bk">
              <a-input-number v-model="model.bk" placeholder="请输入bk" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="qtbt" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="qtbt">
              <a-input-number v-model="model.qtbt" placeholder="请输入qtbt" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="allowance" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="allowance">
              <a-input-number v-model="model.allowance" placeholder="请输入allowance" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="rewards" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="rewards">
              <a-input-number v-model="model.rewards" placeholder="请输入rewards" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="punishment" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="punishment">
              <a-input-number v-model="model.punishment" placeholder="请输入punishment" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="wholeaward" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="wholeaward">
              <a-input-number v-model="model.wholeaward" placeholder="请输入wholeaward" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="sumrp" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sumrp">
              <a-input-number v-model="model.sumrp" placeholder="请输入sumrp" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="ybkk" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="ybkk">
              <a-input-number v-model="model.ybkk" placeholder="请输入ybkk" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="zsf" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="zsf">
              <a-input-number v-model="model.zsf" placeholder="请输入zsf" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="txf" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="txf">
              <a-input-number v-model="model.txf" placeholder="请输入txf" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="gzzyj" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="gzzyj">
              <a-input-number v-model="model.gzzyj" placeholder="请输入gzzyj" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="wyj" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="wyj">
              <a-input-number v-model="model.wyj" placeholder="请输入wyj" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="kjk" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="kjk">
              <a-input-number v-model="model.kjk" placeholder="请输入kjk" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="dkkx" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="dkkx">
              <a-input-number v-model="model.dkkx" placeholder="请输入dkkx" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="ylbxjs" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="ylbxjs">
              <a-input-number v-model="model.ylbxjs" placeholder="请输入ylbxjs" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="ylbx" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="ylbx">
              <a-input-number v-model="model.ylbx" placeholder="请输入ylbx" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="sybx" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sybx">
              <a-input-number v-model="model.sybx" placeholder="请输入sybx" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="zfgjj" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="zfgjj">
              <a-input-number v-model="model.zfgjj" placeholder="请输入zfgjj" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="dkbx" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="dkbx">
              <a-input-number v-model="model.dkbx" placeholder="请输入dkbx" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="tax" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="tax">
              <a-input-number v-model="model.tax" placeholder="请输入tax" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="toyalpay" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="toyalpay">
              <a-input-number v-model="model.toyalpay" placeholder="请输入toyalpay" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="grgz" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="grgz">
              <a-input-number v-model="model.grgz" placeholder="请输入grgz" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="gzzh" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="gzzh">
              <a-input v-model="model.gzzh" placeholder="请输入gzzh"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="xj" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="xj">
              <a-input v-model="model.xj" placeholder="请输入xj"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="zj" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="zj">
              <a-input v-model="model.zj" placeholder="请输入zj"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="bak7" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bak7">
              <a-input v-model="model.bak7" placeholder="请输入bak7"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="hzj" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="hzj">
              <a-input v-model="model.hzj" placeholder="请输入hzj"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="hxj" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="hxj">
              <a-input v-model="model.hxj" placeholder="请输入hxj"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="gzkhbak" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="gzkhbak">
              <a-input v-model="model.gzkhbak" placeholder="请输入gzkhbak"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="khhjngz" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="khhjngz">
              <a-input-number v-model="model.khhjngz" placeholder="请输入khhjngz" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="ylbxgs" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="ylbxgs">
              <a-input-number v-model="model.ylbxgs" placeholder="请输入ylbxgs" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="sybxgs" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sybxgs">
              <a-input-number v-model="model.sybxgs" placeholder="请输入sybxgs" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="zfgjjgs" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="zfgjjgs">
              <a-input-number v-model="model.zfgjjgs" placeholder="请输入zfgjjgs" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="jjzj" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="jjzj">
              <a-input v-model="model.jjzj" placeholder="请输入jjzj"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="jjxj" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="jjxj">
              <a-input v-model="model.jjxj" placeholder="请输入jjxj"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="lastjjxj" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="lastjjxj">
              <a-input v-model="model.lastjjxj" placeholder="请输入lastjjxj"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="bonuscoefficient" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bonuscoefficient">
              <a-input-number v-model="model.bonuscoefficient" placeholder="请输入bonuscoefficient" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="bonus" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bonus">
              <a-input-number v-model="model.bonus" placeholder="请输入bonus" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="ydjj" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="ydjj">
              <a-input-number v-model="model.ydjj" placeholder="请输入ydjj" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="jdjj" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="jdjj">
              <a-input-number v-model="model.jdjj" placeholder="请输入jdjj" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="jjze" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="jjze">
              <a-input-number v-model="model.jjze" placeholder="请输入jjze" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="bkjj" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bkjj">
              <a-input-number v-model="model.bkjj" placeholder="请输入bkjj" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="ykjj" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="ykjj">
              <a-input-number v-model="model.ykjj" placeholder="请输入ykjj" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="khhjjxs" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="khhjjxs">
              <a-input-number v-model="model.khhjjxs" placeholder="请输入khhjjxs" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="jjkhbak" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="jjkhbak">
              <a-input v-model="model.jjkhbak" placeholder="请输入jjkhbak"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="totalbonus" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="totalbonus">
              <a-input-number v-model="model.totalbonus" placeholder="请输入totalbonus" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="jjzh" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="jjzh">
              <a-input v-model="model.jjzh" placeholder="请输入jjzh"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="xzze" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="xzze">
              <a-input-number v-model="model.xzze" placeholder="请输入xzze" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="ykxz" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="ykxz">
              <a-input-number v-model="model.ykxz" placeholder="请输入ykxz" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="bkxz" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bkxz">
              <a-input-number v-model="model.bkxz" placeholder="请输入bkxz" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="sfxz" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sfxz">
              <a-input-number v-model="model.sfxz" placeholder="请输入sfxz" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="sumpay1" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sumpay1">
              <a-input-number v-model="model.sumpay1" placeholder="请输入sumpay1" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="sumpay2" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sumpay2">
              <a-input-number v-model="model.sumpay2" placeholder="请输入sumpay2" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="yfgz1" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="yfgz1">
              <a-input-number v-model="model.yfgz1" placeholder="请输入yfgz1" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="yfgz2" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="yfgz2">
              <a-input-number v-model="model.yfgz2" placeholder="请输入yfgz2" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="ykgz1" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="ykgz1">
              <a-input-number v-model="model.ykgz1" placeholder="请输入ykgz1" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="ykgz2" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="ykgz2">
              <a-input-number v-model="model.ykgz2" placeholder="请输入ykgz2" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="toyalpay1" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="toyalpay1">
              <a-input-number v-model="model.toyalpay1" placeholder="请输入toyalpay1" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="toyalpay2" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="toyalpay2">
              <a-input-number v-model="model.toyalpay2" placeholder="请输入toyalpay2" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="comsubsidy" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="comsubsidy">
              <a-input-number v-model="model.comsubsidy" placeholder="请输入comsubsidy" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="corpsubsidy" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="corpsubsidy">
              <a-input-number v-model="model.corpsubsidy" placeholder="请输入corpsubsidy" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="kshbt" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="kshbt">
              <a-input-number v-model="model.kshbt" placeholder="请输入kshbt" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="allowancenew" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="allowancenew">
              <a-input-number v-model="model.allowancenew" placeholder="请输入allowancenew" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="tax1" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="tax1">
              <a-input-number v-model="model.tax1" placeholder="请输入tax1" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="tax2" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="tax2">
              <a-input-number v-model="model.tax2" placeholder="请输入tax2" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="yilbx" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="yilbx">
              <a-input-number v-model="model.yilbx" placeholder="请输入yilbx" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="yilbxgs" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="yilbxgs">
              <a-input-number v-model="model.yilbxgs" placeholder="请输入yilbxgs" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="bak9" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bak9">
              <a-input v-model="model.bak9" placeholder="请输入bak9"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="bak10" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bak10">
              <a-input v-model="model.bak10" placeholder="请输入bak10"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="bak8" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bak8">
              <a-input v-model="model.bak8" placeholder="请输入bak8"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="taxfj1" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="taxfj1">
              <a-input-number v-model="model.taxfj1" placeholder="请输入taxfj1" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="taxfj2" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="taxfj2">
              <a-input-number v-model="model.taxfj2" placeholder="请输入taxfj2" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="taxfj3" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="taxfj3">
              <a-input-number v-model="model.taxfj3" placeholder="请输入taxfj3" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="taxfj4" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="taxfj4">
              <a-input-number v-model="model.taxfj4" placeholder="请输入taxfj4" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="taxfj5" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="taxfj5">
              <a-input-number v-model="model.taxfj5" placeholder="请输入taxfj5" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="taxyj" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="taxyj">
              <a-input-number v-model="model.taxyj" placeholder="请输入taxyj" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="ym" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="ym">
              <a-input-number v-model="model.ym" placeholder="请输入ym" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="taxmonth" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="taxmonth">
              <a-input-number v-model="model.taxmonth" placeholder="请输入taxmonth" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="registerdate" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="registerdate">
              <j-date placeholder="请选择registerdate" v-model="model.registerdate"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="username" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="username">
              <a-input v-model="model.username" placeholder="请输入username"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="depname" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="depname">
              <a-input v-model="model.depname" placeholder="请输入depname"  ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'OaGzspbForm',
    components: {
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        model:{
         },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
           empno: [
              { required: true, message: '请输入empno!'},
           ],
           salaryyear: [
              { required: true, message: '请输入salaryyear!'},
           ],
           salarymonth: [
              { required: true, message: '请输入salarymonth!'},
           ],
        },
        url: {
          add: "/estar/oaGzspb/add",
          edit: "/estar/oaGzspb/edit",
          queryById: "/estar/oaGzspb/queryById"
        }
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }
         
        })
      },
    }
  }
</script>
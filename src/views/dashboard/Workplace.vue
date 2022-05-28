<template>
  <page-layout :avatar="avatar">
    <div slot="headerContent" style="height:60px;position:relative;">
      <div class="title" style="font-size:14px;">
        <span class="welcome-text" :style="welcomeStyle">{{ welcome }}</span>
      </div>
      <div :style="postStyle">
        『 {{ userInfo.realname }} | {{ postName }} |
        {{ departName || '上级单位' }} 』
      </div>
    </div>

    <div>
      <a-row :gutter="24">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            :loading="loading"
            title="任务面板"
            :bordered="false"
            style="margin-bottom: 24px;"
            :body-style="{padding: 0}"
          >
            <a-card-grid style="width:25%;textAlign:'center'">
              <a-card-meta>
                <div
                  slot="title"
                  class="card-title"
                  style="width:90%;height:90%;"
                  @click="handleWait()"
                >
                  <div style="float:left;width:30%">
                    <a-avatar size="large" src="/images/time_00.png" />
                  </div>
                  <div style="float:left;width:65%;">
                    <a style="margin-left:10px;margin-top:-10px;color:black;font-size:14px;">我的待办</a>
                    <div style="margin-left:10px;font-size:12px;font-weight:300;">处理待办消息记录</div>
                  </div>
                </div>
              </a-card-meta>
            </a-card-grid>
            <a-card-grid style="width:25%;textAlign:'center'">
              <a-card-meta>
                <div
                  slot="title"
                  class="card-title"
                  style="width:90%;height:90%;"
                  @click="handleDone()"
                >
                  <div style="float:left;width:30%">
                    <a-avatar size="large" src="/images/home_00.png" />
                  </div>
                  <div style="float:left;width:65%;">
                    <a style="margin-left:10px;margin-top:-10px;color:black;font-size:14px;">我的已办</a>
                    <div style="margin-left:10px;font-size:12px;font-weight:300;">查看已办消息记录</div>
                  </div>
                </div>
              </a-card-meta>
            </a-card-grid>
            <a-card-grid style="width:25%;textAlign:'center'">
              <a-card-meta>
                <div
                  slot="title"
                  class="card-title"
                  style="width:90%;height:90%;"
                  @click="handleAnnounce()"
                >
                  <div style="float:left;width:30%">
                    <a-avatar size="large" src="/images/tongzhi_00.png" />
                  </div>
                  <div style="float:left;width:65%;">
                    <a style="margin-left:10px;margin-top:-10px;color:black;font-size:14px;">我的消息</a>
                    <div style="margin-left:10px;font-size:12px;font-weight:300;">重要信息全员播报</div>
                  </div>
                </div>
              </a-card-meta>
            </a-card-grid>
            <a-card-grid style="width:25%;textAlign:'center'">
              <a-card-meta>
                <div slot="title" class="card-title" style="width:90%;height:90%;">
                  <div style="float:left;width:30%">
                    <a-avatar size="large" src="/images/icon-chat-ok.png" />
                  </div>
                  <div style="float:left;width:65%;">
                    <a style="margin-left:10px;margin-top:-10px;color:black;font-size:14px;">我的云聊</a>
                    <div style="margin-left:10px;font-size:12px;font-weight:300;">员工沟通、高效、安全、快捷</div>
                  </div>
                </div>
              </a-card-meta>
            </a-card-grid>
          </a-card>

          <a-card
            :loading="loading"
            title="系统管理"
            :bordered="false"
            style="margin-bottom: 24px;"
            :body-style="{padding: 0}"
          >
            <a-card-grid style="width:25%;textAlign:'center'">
              <a-card-meta>
                <div
                  slot="title"
                  class="card-title"
                  style="width:90%;height:90%;"
                  @click="handleUserManage()"
                >
                  <div style="float:left;width:30%">
                    <a-avatar size="large" src="/images/list_00.png" />
                  </div>
                  <div style="float:left;width:65%;">
                    <a style="margin-left:10px;margin-top:-10px;color:black;font-size:14px;">用户管理</a>
                    <div style="margin-left:10px;font-size:12px;font-weight:300;">用户添加、删除、修改等功能</div>
                  </div>
                </div>
              </a-card-meta>
            </a-card-grid>
            <a-card-grid style="width:25%;textAlign:'center'">
              <a-card-meta>
                <div
                  slot="title"
                  class="card-title"
                  style="width:90%;height:90%;"
                  @click="handleDepartManage()"
                >
                  <div style="float:left;width:30%">
                    <a-avatar size="large" src="/images/sweet_00.png" />
                  </div>
                  <div style="float:left;width:65%;">
                    <a style="margin-left:10px;margin-top:-10px;color:black;font-size:14px;">部门管理</a>
                    <div style="margin-left:10px;font-size:12px;font-weight:300;">部门添加、删除等功能</div>
                  </div>
                </div>
              </a-card-meta>
            </a-card-grid>
            <a-card-grid style="width:25%;textAlign:'center'">
              <a-card-meta>
                <div
                  slot="title"
                  class="card-title"
                  style="width:90%;height:90%;"
                  @click="handleRoleSetupManage()"
                >
                  <div style="float:left;width:30%">
                    <a-avatar size="large" src="/images/xiuxi_09.png" />
                  </div>
                  <div style="float:left;width:65%;">
                    <a style="margin-left:10px;margin-top:-10px;color:black;font-size:14px;">角色维护</a>
                    <div style="margin-left:10px;font-size:12px;font-weight:300;">角色添加、删除等功能</div>
                  </div>
                </div>
              </a-card-meta>
            </a-card-grid>
            <a-card-grid style="width:25%;textAlign:'center'">
              <a-card-meta>
                <div
                  slot="title"
                  class="card-title"
                  style="width:90%;height:90%;"
                  @click="handleRoleManage()"
                >
                  <div style="float:left;width:30%">
                    <a-avatar size="large" src="/images/xiuxi_00.png" />
                  </div>
                  <div style="float:left;width:65%;">
                    <a style="margin-left:10px;margin-top:-10px;color:black;font-size:14px;">角色管理</a>
                    <div style="margin-left:10px;font-size:12px;font-weight:300;">角色授权、添加、删除等功能</div>
                  </div>
                </div>
              </a-card-meta>
            </a-card-grid>
            
            <a-card-grid style="width:25%;textAlign:'center'">
              <a-card-meta>
                <div
                  slot="title"
                  class="card-title"
                  style="width:90%;height:90%;"
                  @click="handleMenuManage()"
                >
                  <div style="float:left;width:30%">
                    <a-avatar size="large" src="/images/caidan.png" />
                  </div>
                  <div style="float:left;width:65%;">
                    <a style="margin-left:10px;margin-top:-10px;color:black;font-size:14px;">菜单管理</a>
                    <div style="margin-left:10px;font-size:12px;font-weight:300;">菜单添加、删除、修改等功能</div>
                  </div>
                </div>
              </a-card-meta>
            </a-card-grid>
            <a-card-grid style="width:25%;textAlign:'center'">
              <a-card-meta>
                <div
                  slot="title"
                  class="card-title"
                  style="width:90%;height:90%;"
                  @click="handleTableManage()"
                >
                  <div style="float:left;width:30%">
                    <a-avatar size="large" src="/images/jiushui_00.png" />
                  </div>
                  <div style="float:left;width:65%;">
                    <a style="margin-left:10px;margin-top:-10px;color:black;font-size:14px;">表单管理</a>
                    <div style="margin-left:10px;font-size:12px;font-weight:300;">表单开发&设计等功能</div>
                  </div>
                </div>
              </a-card-meta>
            </a-card-grid>
            <a-card-grid style="width:25%;textAlign:'center'">
              <a-card-meta>
                <div
                  slot="title"
                  class="card-title"
                  style="width:90%;height:90%;"
                  @click="handleDictManage()"
                >
                  <div style="float:left;width:30%">
                    <a-avatar size="large" src="/images/game_00.png" />
                  </div>
                  <div style="float:left;width:65%;">
                    <a style="margin-left:10px;margin-top:-10px;color:black;font-size:14px;">数据字典</a>
                    <div style="margin-left:10px;font-size:12px;font-weight:300;">数据字典设计功能</div>
                  </div>
                </div>
              </a-card-meta>
            </a-card-grid>
            <a-card-grid style="width:25%;textAlign:'center'">
              <a-card-meta>
                <div
                  slot="title"
                  class="card-title"
                  style="width:90%;height:90%;"
                  @click="handleOperateLogManage()"
                >
                  <div style="float:left;width:30%">
                    <a-avatar size="large" src="/images/email_00.png" />
                  </div>
                  <div style="float:left;width:65%;">
                    <a style="margin-left:10px;margin-top:-10px;color:black;font-size:14px;">操作记录</a>
                    <div style="margin-left:10px;font-size:12px;font-weight:300;">用户操作记录查看</div>
                  </div>
                </div>
              </a-card-meta>
            </a-card-grid>
          </a-card>

          <a-card :loading="loading" title="动态" :bordered="false">
            <a-list>
              <a-list-item :key="index" v-for="(item, index) in nodelist">
                <a-list-item-meta>
                  <a-avatar
                    slot="avatar"
                    src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
                  />
                  <div slot="title" style="font-size:15px;" v-html="item.title"></div>
                  <div slot="description" style="font-size:12px;">{{ item.create_time }}</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
        <a-col style="padding: 0 12px" :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            title="便捷导航"
            style="margin-bottom: 24px"
            :bordered="false"
            :body-style="{padding: 0}"
          >
            <div class="item-group">
              <div style="margin:5px 0px;">
                <a-tag color="purple" @click="handleWait()" style="margin-bottom:10px;">我的待办</a-tag>
                <a-tag color="cyan" @click="handleDone()" style="margin-bottom:10px;">我的已办</a-tag>
                <a-tag color="pink" @click="handleAnnounce()" style="margin-bottom:10px;">我的消息</a-tag>
                <a-tag color="red" @click="handleMyCenter()" style="margin-bottom:10px;">个人中心</a-tag>
                <a-tag color="green" @click="handleLeave()" style="margin-bottom:10px;">请假申请</a-tag>
                <a-tag color="orange" @click="handleTravel()" style="margin-bottom:10px;">出差申请</a-tag>
              </div>
            </div>
          </a-card>
          <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
                <div class="salesCard">
                  <a-tabs
                    size="large"
                    defaultActiveKey="1"
                    v-model="activeKey"
                    @change="getData"
                    :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}"
                  >
                    <div class="extra-wrapper" slot="tabBarExtraContent">
                      <div class="extra-item">
                        <a-tag color="cyan" @click="reloadData()">&nbsp;刷&nbsp;新&nbsp;</a-tag>
                      </div>
                    </div>
                    <a-tab-pane loading="true" tab="我的待办" key="1" style>
                      <template>
                        <div style="top:50px;">
                          <a-spin :spinning="spinning" style="top:50px;">
                            <div class="spin-content"></div>
                          </a-spin>
                        </div>
                        <a-table
                          :columns="columns"
                          :dataSource="dataWaitList"
                          :pagination="false"
                          style="padding-top:-10px;margin-top:-10px"
                        >
                          <a slot="type" slot-scope="text, record">
                            <a-menu-item>
                              <a :data-info="JSON.stringify(record)" @click="handleDetailWF(record)">
                                <span v-html="record.type"></span>
                              </a>
                            </a-menu-item>
                          </a>
                          <a slot="topic" slot-scope="text, record">
                            <a-menu-item>
                              <a
                                :data-info="JSON.stringify(record)"
                                @click="handleDetailWF(record)"
                                style="color:#303030;"
                              >
                                <span style="color:#303030;" v-html="record.topic"></span>
                              </a>
                            </a-menu-item>
                          </a>
          
                          <span slot="name" slot-scope="text, record">
                            <a-tag
                              :color="record.name.length > 5 ? 'geekblue' : 'green'"
                              :key="record.name"
                              @click="handleDetailWF(record)"
                            >{{ record.name.toUpperCase() }}</a-tag>
                          </span>
          
                          <span slot="username" slot-scope="username">
                            <a-tag
                              v-for="tag in username"
                              :color="
                                tag === 'admin'
                                  ? 'volcano'
                                  : tag.length > 5
                                  ? 'geekblue'
                                  : 'green'
                              "
                              :key="tag"
                            >{{ tag }}</a-tag>
                          </span>
          
                          <span slot="proponents" slot-scope="text, record">
                            <a-tag color="volcano" :key="record.proponents">
                              {{
                              record.proponents
                              }}
                            </a-tag>
                          </span>
          
                          <span slot="create_time" slot-scope="text, record">
                            <a-tag color="red" :key="record.create_time">{{ record.create_time }}</a-tag>
                          </span>
                        </a-table>
                      </template>
                    </a-tab-pane>
                    <a-tab-pane loading="true" tab="我的已办" key="2">
                      <template>
                        <div style="top:50px;">
                          <a-spin :spinning="spinning" style="top:50px;">
                            <div class="spin-content"></div>
                          </a-spin>
                        </div>
                        <a-table
                          :columns="columns"
                          :dataSource="dataDoneList"
                          :pagination="false"
                          style="padding-top:-10px;margin-top:-10px"
                        >
                          <a slot="type" slot-scope="text, record">
                            <a-menu-item>
                              <a :data-info="JSON.stringify(record)" @click="handleDetailWF(record)">
                                <span v-html="record.type"></span>
                              </a>
                            </a-menu-item>
                          </a>
          
                          <a slot="topic" slot-scope="text, record">
                            <a-menu-item>
                              <a
                                :data-info="JSON.stringify(record)"
                                @click="handleDetailWF(record)"
                                style="color:#303030;"
                              >
                                <span style="color:#303030;" v-html="record.topic"></span>
                              </a>
                            </a-menu-item>
                          </a>
          
                          <span slot="name" slot-scope="text, record">
                            <a-tag
                              :color="record.name.length > 5 ? 'geekblue' : 'green'"
                              :key="record.name"
                              @click="handleDetailWF(record)"
                            >{{ record.name }}</a-tag>
                          </span>
          
                          <span slot="username" slot-scope="text, record">
                            <a-tag
                              v-for="tag in record.username"
                              :color="
                                tag === 'admin'
                                  ? 'volcano'
                                  : tag.length > 5
                                  ? 'geekblue'
                                  : 'green'
                              "
                              :key="tag"
                            >{{ tag }}</a-tag>
                          </span>
          
                          <span slot="proponents" slot-scope="text, record">
                            <a-tag color="volcano" :key="record.proponents">
                              {{
                              record.proponents
                              }}
                            </a-tag>
                          </span>
          
                          <span slot="create_time" slot-scope="text, record">
                            <a-tag color="blue" :key="record.create_time">{{ record.create_time }}</a-tag>
                          </span>
                        </a-table>
                      </template>
                    </a-tab-pane>
                    <a-tab-pane loading="true" tab="新闻资讯" key="7">
                      <template>
                        <div style="top:50px;">
                          <a-spin :spinning="spinning" style="top:50px;">
                            <div class="spin-content"></div>
                          </a-spin>
                        </div>
                        <a-table
                          :columns="announce_columns"
                          :dataSource="dataNewsList"
                          :pagination="false"
                          style="padding-top:-10px;margin-top:-10px"
                        >
                          <span slot="announce_type" slot-scope="text, record">
                            <a-tag
                              color="cyan"
                              :key="record.announce_type"
                              @click="handleAnnounceInfo(record, record.table_name)"
                            >{{ record.announce_type }}</a-tag>
                          </span>
                          <span slot="ctitle" slot-scope="text, record">
                            <a
                              :key="record.title"
                              @click="handleAnnounceInfo(record, record.table_name)"
                              style="color:#303030;"
                            >{{ record.title }}</a>
                          </span>
                          <span slot="create_by" slot-scope="text, record">
                            <a-tag color="geekblue" :key="record.create_by">
                              {{
                              record.create_by
                              }}
                            </a-tag>
                          </span>
                          <span slot="create_time" slot-scope="text, record">
                            <a-tag color="pink" :key="record.create_time">
                              {{
                              record.create_time
                              }}
                            </a-tag>
                          </span>
                        </a-table>
                      </template>
                    </a-tab-pane>
                    
                  </a-tabs>
                </div>
              </a-card>
        
          <template>
            <div>
              <!-- 向上箭头 -->
              <a-back-top style="right:10px;" />
            </div>
          </template>
        </a-col>
      </a-row>
    </div>
  </page-layout>
</template>

<script>
import { timeFix, welcome } from "@/utils/util";
import { mapGetters } from "vuex";

import PageLayout from "@/components/page/PageLayout";
import HeadInfo from "@/components/tools/HeadInfo";
import Radar from "@/components/chart/Radar";
import * as manageAPI from "@/api/manage";
import * as tools from "@/utils/util";

const DataSet = require("@antv/data-set");

export default {
  name: "Workplace",
  components: {
    PageLayout,
    HeadInfo,
    Radar
  },
  data() {
    return {
      timeFix: timeFix(),
      welcome: welcome(),
      postName: "",
      departName: "",
      avatar: "",
      user: {},
      welcomeStyle: {},
      postStyle: {
        "margin-top": "-5px",
        "margin-left": "-113px",
        flex: "auto",
        position: "absolute",
        left: "92px",
        transform: "scale(0.8)"
      },
      projects: [],
      loading: true,
      radarLoading: true,
      activities: [],
      nodelist: [],
      teams: [],
      radarData: []
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo;
    }
  },
  async created() {
    this.user = this.userInfo;

    console.log("this.avatar :" + this.avatar);

    //设置员工岗位信息/部门信息
    try {
      let params = {username: this.user.username};
      this.v_user = await manageAPI.queryByUsername(params);
      console.log("this.v_user",this.v_user);
      this.postName = this.v_user.result.post;

      //设置头像信息
      this.avatar =
        window._CONFIG["imgDomainURL"] + "/" + this.v_user[0]["avatar"];
    } catch (error) {
      console.log("工作台设置员工岗位信息/部门信息异常：" + error);
    }

  },
  mounted() {
    try {
      //this.getActivity();
      this.loading = false;
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    //...mapGetters(["nickname", "welcome"]),
    getActivity() {
      this.$http.get("/api/workplace/activity").then(res => {
        this.activities = res.result;
      });
    },

    /**
     * @function 跳转到个人中心
     */
    handleMyCenter() {
      //跳转到相应页面
      this.$router.push(`/account/center`);
    },
    /**
     * @function 跳转到我的待办
     */
    handleWait() {
      //跳转到我的待办
      this.$router.push(`/flowable/task/todo/index`);
    },
    /**
     * @function 跳转到我的已办
     */
    handleDone() {
      //跳转到我的已办
      this.$router.push(`/flowable/task/finished/index`);
    },
    /**
     * @function 跳转到我的公告
     */
    handleAnnounce() {
      //跳转到我的公告
      this.$router.push(`/isps/userAnnouncement`);
    },
    /**
     * @function 跳转到我的收藏
     */
    handleCollect() {
      //跳转到我的收藏
      this.$router.push(`/workflow/collection`);
    },
    /**
     * @function 跳转到消息通知页面
     */
    handleMessage() {
      //跳转到相应页面
      this.$router.push(`/account/settings/notification`);
    },
  
    /**
     * @function 跳转到部门管理界面
     */
    handleDepartManage() {
      let path = `/isystem/depart`;
      //跳转到相应页面
      this.$router.push({
        path: path,
        fullPath: path,
        meta: { title: "部门管理" }
      });
    },
    /**
     * @function 跳转到角色维护界面中
     */
    handleRoleSetupManage() {
      let path = `/isystem/roleUserList`;
      //跳转到相应页面
      this.$router.push({
        path: path,
        fullPath: path,
        meta: { title: "角色维护" }
      });
    },
    
    /**
     * @function 跳转到用户管理页面
     */
    handleUserManage() {
      var path = "/isystem/user";
      //跳转到相应页面
      this.$router.push({
        path: path,
        fullPath: path,
        meta: { title: "用户管理" }
      });
    },
    /**
     * @function 跳转到角色管理页面
     */
    handleRoleManage() {
      var path = "/isystem/role";
      //跳转到相应页面
      this.$router.push({
        path: path,
        fullPath: path,
        meta: { title: "角色管理" }
      });
    },
   
    /**
     * @function 跳转到菜单管理界面中
     */
    handleMenuManage() {
      var path = "/isystem/permission";
      //跳转到相应页面
      this.$router.push({
        path: path,
        fullPath: path,
        meta: { title: "菜单管理" }
      });
    },
    /**
     * @function 跳转到表单管理界面中
     */
    handleTableManage() {
      var path = "/online/cgform";
      //跳转到相应页面
      this.$router.push({
        path: path,
        fullPath: path,
        meta: { title: "表单管理" }
      });
    },
    /**
     * @function 跳转到数据字典界面中
     */
    handleDictManage() {
      var path = "/isystem/dict";
      //跳转到相应页面
      this.$router.push({
        path: path,
        fullPath: path,
        meta: { title: "数据字典" }
      });
    },
   
  }
};
</script>

<style lang="scss" scoped>
.project-list {
  .card-title {
    font-size: 0;

    a {
      color: rgba(0, 0, 0, 0.85);
      margin-left: 12px;
      line-height: 24px;
      height: 24px;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;

      &:hover {
        color: #1890ff;
      }
    }
  }
  .card-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }
  .project-item {
    display: flex;
    margin-top: 8px;
    overflow: hidden;
    font-size: 12px;
    height: 20px;
    line-height: 20px;
    a {
      color: rgba(0, 0, 0, 0.45);
      display: inline-block;
      flex: 1 1 0;

      &:hover {
        color: #1890ff;
      }
    }
    .datetime {
      color: rgba(0, 0, 0, 0.25);
      flex: 0 0 auto;
      float: right;
    }
  }
  .ant-card-meta-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }
}

.item-group {
  padding: 20px 0 8px 24px;
  font-size: 0;
  a {
    color: rgba(0, 0, 0, 0.65);
    display: inline-block;
    font-size: 14px;
    margin-bottom: 13px;
    width: 25%;
  }
}

.members {
  a {
    display: block;
    margin: 12px 0;
    line-height: 24px;
    height: 24px;
    .member {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 24px;
      max-width: 100px;
      vertical-align: top;
      margin-left: 12px;
      transition: all 0.3s;
      display: inline-block;
    }
    &:hover {
      span {
        color: #1890ff;
      }
    }
  }
}

.ant-back-top {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  -webkit-font-feature-settings: "tnum";
  font-feature-settings: "tnum";
  position: fixed;
  right: 10px;
  bottom: 50px;
  z-index: 10;
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.mobile {
  .project-list {
    .project-card-grid {
      width: 100%;
    }
  }

  .more-info {
    border: 0;
    padding-top: 16px;
    margin: 16px 0 16px;
  }

  .headerContent .title .welcome-text {
    display: none;
  }
}
</style>
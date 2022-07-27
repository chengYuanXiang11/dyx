<template>
  <div class="form-warp">
    <el-form
      class="form-apply"
      :ref="type.formRef"
      label-position="left"
      label-width="120px"
      label-suffix=":"

    >
    <div  v-for="ie in 2" :key="ie">

   <form-create
        class="form-create"
        v-model="fApi"
        :rule="cope"
        :option="option"
        :rows="8"
        prefix-icon="el-icon-date"
        @change="changeValidate"
        @leave-type-input="resetForm"
        @leave-time-change="dayChange('leave')"
        @leave-end-time-change="dayChange('leave')"
        @clockin-time-input="clockinChange"
        @overtime-time-change="dayChange('overtime')"
        @overtime-end-time-change="dayChange('overtime')"
        @group-change="dayChange('businesstrip')"
        @group-businesstrip-time-input="dayChange('businesstrip')"
        @goout-time-change="dayChange('goout')"
        @goout-end-time-change="dayChange('goout')"
        @native-diaoban-input-click="openSelectUsersDialog"
        @native-diaoban-input-change="diaobanNameChange"
        @diaoban-time-change="substituteTime('start')"
        @diaoban-end-time-change="substituteTime('end')"
      >
        <template slot="type-date-picker">
          <!-- <el-link type="info">信息链接</el-link> -->
        </template>
      </form-create>

    </div>
      <!-- 动态表单 -->

      <!-- 出差申请时才会出现 -->
      <el-button
        @click="addBusinesstrip"
        v-if="this.$route.query.code === 'businesstrip'"
        >+添加行程</el-button
      >
      <el-form-item
        v-if="this.$route.query.code === 'businesstrip'"
        class="examine-label"
        label="同行人"
        :style="{ marginLeft: '8px' }"
      >
        <el-timeline>
          <el-timeline-item>
            <template slot="dot">
              <SelectUsersDialog
                :visible.sync="PeerShowDialog"
                :data="datas"
                :users="users"
                model="user"
                :multiple="true"
                placeholder="请选择人员"
                @confirm="peerGetDatas"
              ></SelectUsersDialog>
              <div
                v-for="item in PeerUsers"
                :key="item.user_id"
                class="Approver-warp"
              >
                <el-badge value="一">
                  <el-avatar class="Approver" size="large">
                    <template #default>
                      <div>
                        {{
                          item.user_name.substring(item.user_name.length - 2)
                        }}
                      </div>
                    </template>
                  </el-avatar>
                </el-badge>
                <span class="Approver-font">
                  {{ item.user_name }}
                </span>
              </div>
              <!-- 添加按钮在满足一定条件下才会展示 -->
              <el-button
                :circle="true"
                icon="el-icon-plus"
                @click="peerSelectUsers"
              ></el-button>
            </template>
          </el-timeline-item>
        </el-timeline>
      </el-form-item>
      <!-- 换班申请 -->
      <Substitute
        :SubstituteShowDialog.sync="SubstituteShowDialog"
        :SubstituteData.sync="SubstituteData"
        type="diaobanInput"
        @setValue="setValue"
        @diaobanNameChange="diaobanNameChange"
        :multiple="false"
      ></Substitute>
      <!-- 审核流程 -->
      <Examine :process.sync="process" :examineData.sync="examineData">
      </Examine>
    </el-form>
    <!-- 底部提交 -->

    <ApplyFoot>
      <el-button @click="goBack" plain>取消</el-button>
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </ApplyFoot>
  </div>
</template>

<script>
// 组件
import HolidayTypes from "@/views/system/form/components/form/module/holiday-types.vue";
import PunchTimeSelect from "@/views/system/form/components/form/module/punchTime-select.vue";
import DictSelect from "@/views/system/form/components/form/module/dict-select.vue";
import Examine from "./Examine .vue";
import ApplyFoot from "./ApplyFoot.vue";
import Substitute from "./Substitutes.vue";
//接口
import axios from "axios";
// 拿到假期的详细规则
import { getInfo } from "@/request/api/personnel/checking/holiday";
import { getUserProfile } from "@/request/api/organization/user.js";
import { flowDetails, getJson } from "@/request/api/system/form.js";
import { getProcess, setFoundflow } from "@/request/api/system/flow.js";
import { getToken } from "@/utils/auth.js";
// 实验多选接口（非正式数据）
import { getDicts } from "@/request/api/basis/dict/data.js";
import { calcDay, calcHour } from "./day";
// 日期处理库
import moment from "moment";

// 多选请求接口
formCreate.register({
  name: "selectData",
  init({ value }, rule) {
    switch (value) {
      case "makeup":
        // 请求补卡数据
        getDicts("usingLaborType").then((res) => {
          res.data.map((v) => {
            v.value = v.label;
          });
          rule.options = res.data;
        });
        break;
      case "overtime":
        getDicts("usingLaborType").then((res) => {
          res.data.map((v) => {
            v.value = v.label;
          });
          rule.options = res.data;
        });
        break;
      case "businesstripDestination":
        getDicts("usingLaborType").then((res) => {
          res.data.map((v) => {
            v.value = v.label;
          });
          rule.options = res.data;
        });
        break;
      case "businesstripBecity":
        getDicts("usingLaborType").then((res) => {
          res.data.map((v) => {
            v.value = v.label;
          });
          rule.options = res.data;
        });
        break;
      default:
        break;
    }
  },
});

export default {
  name: "Apply",
  data() {
    return {
      // 数据
      type: {},
      // 动态表单数据
      fApi: {},
      // 表单全局配置
      option: {
        submitBtn: false,
        resetBtn: false,
      },
      // 表单规则
      rulfs: [],
      // 审核人和抄送人
      examineData: [],
      // 申请名称
      name: "",
      // 是否显示流程
      process: false,
      datas: [],
      users: [],
      PeerUsers: [],
      PeerShowDialog: false,
      // 调班申请
      SubstituteShowDialog: false,
      SubstituteData: {},
      //控制是否继续验证,防止频繁请求接口
      key: true,
    };
  },
  components: {
    HolidayTypes,
    DictSelect,
    PunchTimeSelect,
    ApplyFoot,
    Examine,
    Substitute,
  },
  computed:{
      cope(){
          return JSON.parse( JSON.stringify(this.rulfs) )
      },

  },
  watch: {
    $route: {
      handler() {
        axios.get("http://localhost:8081/a.json").then((res) => {
          console.log(res);
          //               let date = this.fApi.getRule("group");
        //   res[0].props.rules[0].children[2].validate[1] = {
        //     validator: (rule, value, callback) => {
        //         let data = this.fApi.formData()
        //         // data.group.forEach((v,k)=>{
        //         //     // if(v.businesstripTime)
        //         //     // console.log(v.businesstripTime,v.businesstripEndTime)
        //         //     if(new Date(v.businesstripEndTime).getTime()<new Date(v.businesstripTime).getTime()){
        //         //         console.log(k)
        //         //         callback("请选择正确的时间");
        //         //     }else{
        //         //         callback()
        //         //     }

        //         // })
        //             if(new Date(   data.group[0].businesstripEndTime).getTime()<new Date(   data.group[0].businesstripTime).getTime()){
        //                 callback("请选择正确的时间");
        //             }else{
        //                 callback()
        //             }

        //       // 打卡时间
        //     //   let clockinTime = this.fApi.getValue("clockinTime");
        //     //   // 未选择打开时间则提示选择打开时间
        //     //   if (clockinTime === undefined) {
        //     //     this.setTips("makeupTime", "");
        //     //     callback("请选择正确的时间");
        //     //   } else {
        //     //     // 补卡时间不在正确时间内
        //     //     let time = new Date(value).getTime();
        //     //     let startTime = new Date().getTime() - 60 * 60 * 1000;
        //     //     let endTime = new Date().getTime() + 60 * 30 * 1000;
        //     //     if (time > endTime || time < startTime) {
        //     //       callback("请选择正确的补卡时间");
        //     //     } else {
        //     //       // 补卡时间正确，显示提示语
        //     //       callback();
        //     //     }
        //     //   }
        //     },
        //   };
          this.rulfs = res;

          this.$nextTick(() => {
            // 添加验证规则
            // this.addValidate(this.$route.query.code);
          });
        });
        // 根据code获取数据
        // flowDetails(this.$route.query.code).then((res) => {
        //     this.type = res.data.results[0];
        //     this.rulfs = JSON.parse(this.type.config).formData;
        //     this.name = this.type.name;
        //     this.num = 1;
        //     this.$nextTick(() => {
        //         // 添加验证规则
        //         this.addValidate(this.$route.query.code);
        //     });
        // });
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    // dayTime(){
    //     let holidayType = this.fApi.getValue('leaveType')
    //     // 工作时间固定为8-12 13-18点(班次)
    //     console.log(holidayType)

    //     // (count_type)
    //     // getInfo(holidayType.id).then(res=>{
    //         // console.log(res)
    //         // let
    //     // })
    // },
    // 假期类型改变是否重置表单（保留需求）
    resetForm() {
      //重置表单
      // this.fApi.reload()
    },
    // 提交
    onSubmit() {
      this.fApi.submit((formData, fApi) => {
        this.fApi.validate((valid, fail) => {
          if (valid) {
            this.key = false;
            //todo 字段验证通过
            // setFoundflow({
            //     examine_id: this.$route.query.id,
            //     flow_var: formData,
            //     node_list: this.examineData,
            // }).then((res) => {
            //     // console.log(res)
            //     console.log("请假提交成功");
            //     console.log("触发后返回上一层");
            // });
            console.log("数据---------", formData);
            // 删除警示语，无用数据
            if (Reflect.has(formData, "makeupTimeAlert")) {
              Reflect.deleteProperty(formData, "makeupTimeAlert");
            }
            console.log({
              examine_id: this.$route.query.id,
              flow_var: formData,
              node_list: this.examineData,
            });
            console.log("数据---------");

            // 发起请求拿到审核数据
          } else {
            this.key = true;
            //todo 字段验证未通过
          }
        });
        //   });
      });
    },
    // 取消返回请假列表页面
    goBack() {},
    // 计算日期差距
    /**
     * newV    (开始时间)
     * enV    (结束时间)
     * type  (申请类型)
     * k      (数组时候有用,数组下标)
     */
    day(newV, endV, type, k = 0) {
      let day = calcHour(newV, endV);
      if (day === 0 || day < 0) {
        // 当时间差距为0或者有一个小于0时,赋值为0
        if (type === "businesstrip") {
          this.setGroup(`${type}Duration`, k, "0");
          this.fApi.validateField(`${type}EndTime`);
          return;
        } else {
          this.setValue(`${type}Duration`, "0");
          this.fApi.validateField(`${type}EndTime`);
          return;
        }
      }
      if (type === "businesstrip") {
        this.setGroup(`${type}Duration`, k, String(day));
      } else {
        this.setValue(`${type}Duration`, String(day));
      }
      // 时间更改触发结束时间的验证
    },
    // 计算日期差距
    /**
     * type : 申请类型(请假:leave,加班:overtime)
     */
    dayChange(type) {
      // console.log(type)
      if (type === "businesstrip") {
        let arr = this.fApi.formData().group;
        arr.forEach((v, k) => {
          this.day(
            new Date(v[`${type}Time`]),
            new Date(v[`${type}EndTime`]),
            type,
            k
          );
        });
      } else if (
        this.fApi.getValue(`${type}Time`) &&
        this.fApi.getValue(`${type}EndTime`)
      ) {
        this.day(
          new Date(this.fApi.getValue(`${type}Time`)),
          new Date(this.fApi.getValue(`${type}EndTime`)),
          type
        );
      }
    },
    // 直接修改值,比如请假
    setValue(type, value) {
      this.fApi.setValue({ [type]: value });
    },
    // 需要修改group的值,比如出差
    setGroup(type, index, value) {
      let arr = this.fApi.formData().group;
      arr[index][type] = value;
      this.fApi.setValue({ group: arr });
    },

    addValidate(type) {
      console.log(type);
      // this.fApi.updateValidate(
      //     "businesstripEndTime",
      //     [
      //         {
      //             validator: (rule, value, callback) => {
      //                 console.log(value)
      //                 // let startTime = this.fApi.getValue([`${type}Time`]);
      //                 // if (value !== null) {
      //                 //     if (new Date(value) - new Date(startTime) < 0) {
      //                 //         callback("结束时间不得小于开始时间");
      //                 //     }
      //                 //     if (
      //                 //         new Date(value) - new Date(startTime) ==
      //                 //         0
      //                 //     ) {
      //                 //         callback("时长应该大于0");
      //                 //     }
      //                 //     // console.log(endTime,new Date(endTime), value,new Date(endTime)-new Date(value));
      //                 // }
      //                 // callback();
      //             },
      //         },
      //     ],
      //     true
      // );
      // 结束时间日期验证
      this.fApi.updateValidate(
        [`${type}EndTime`],
        [
          {
            validator: (rule, value, callback) => {
              let startTime = this.fApi.getValue([`${type}Time`]);
              if (value !== null) {
                if (new Date(value) - new Date(startTime) < 0) {
                  callback("结束时间不得小于开始时间");
                }
                if (new Date(value) - new Date(startTime) == 0) {
                  callback("时长应该大于0");
                }
                // console.log(endTime,new Date(endTime), value,new Date(endTime)-new Date(value));
              }
              callback();
            },
          },
        ],
        true
      );

      // 补卡时间验证
      this.fApi.updateValidate(
        "makeupTime",
        [
          {
            validator: (rule, value, callback) => {
              // 打卡时间
              let clockinTime = this.fApi.getValue("clockinTime");
              // 未选择打开时间则提示选择打开时间
              if (clockinTime === undefined) {
                this.setTips("makeupTime", "");
                callback("请先选择打卡时间");
              } else {
                // 补卡时间不在正确时间内
                let time = new Date(value).getTime();
                let startTime = new Date().getTime() - 60 * 60 * 1000;
                let endTime = new Date().getTime() + 60 * 30 * 1000;
                if (time > endTime || time < startTime) {
                  callback("请选择正确的补卡时间");
                } else {
                  // 补卡时间正确，显示提示语
                  callback();
                }
              }
            },
          },
        ],
        true
      );
    },
    // 修改时全局验证（用于显示隐藏审批流程，限制是为了优化显示，只有所有表单都有值，并且通过验证才显示审核）
    onChange(boolean) {
      if (boolean) {
        this.fApi.validate((valid, fail) => {
          if (valid) {
            if (this.key) {
              this.fApi.submit((formData, fApi) => {
                this.key = false;

                // 发起请求拿到审核数据
                getProcess({
                  examine_id: this.$route.query.id,
                  var: formData,
                }).then((res) => {
                  this.examineData = res.data;
                  this.process = true;
                });
                //   });
              });
            }
          } else {
            if (!this.key) {
              // 如果是因为事由说明导致验证不通过,则不需要改变数据
              if (
                this.fApi.getValue(`${this.$route.query.code}Reason`) === ""
              ) {
                return;
              } else {
                this.process = false;
                this.key = true;
              }
            }
            // 清除验证状态
            // this.fApi.clearValidateState();
          }
        });
      }
    },
    // 根据条件禁止全局验证,优化显示
    changeValidate() {
      switch (this.$route.query.code) {
        case "leave":
          // 当请假时间不为0，并且请假理由和请假类型确定时，才触发验证
          this.onChange(
            this.key
              ? this.fApi.getValue("leaveDuration") !== "0" &&
                  this.fApi.getValue("leaveType") &&
                  this.fApi.getValue("leaveReason")
              : true
          );
          break;
        case "makeup":
          this.onChange(
            this.key
              ? this.fApi.getValue("clockinTime") &&
                  this.fApi.getValue("makeupReason") &&
                  this.fApi.getValue("makeupTime")
              : true
          );
          break;
        case "overtime":
          this.onChange(
            this.key
              ? this.fApi.getValue("overtimeDuration") &&
                  this.fApi.getValue("issueType") &&
                  this.fApi.getValue("overtimeReason")
              : true
          );
          break;
        // case "chuchai":
        //     // 必须每个值都有才会触发全局验证
        //     this.changeValidate(
        //         this.fApi.formData().group.every((v) => {
        //             let boolean = Object.values(v).every((value) => {
        //                 return value !== undefined && value !== ""&& value !== null;
        //             });
        //             return boolean === true
        //         })
        //     );
        //     break;
        // case "外出":
        //     // 必须每个值都有才会触发全局验证
        //     this.changeValidate(
        //         this.fApi.formData().group.every((v) => {
        //             let boolean = Object.values(v).every((value) => {
        //                 return value !== undefined && value !== ""&& value !== null;
        //             });
        //             return boolean === true
        //         })
        //     );
        //     break;
        default:
          break;
      }
    },
    // 补卡操作
    // 原打开时间
    clockinChange() {
      // 修改补卡提示
      this.setAlert(
        "makeupTimeAlert",
        `可补卡时间：${moment(
          new Date(new Date().getTime() - 60 * 60 * 1000)
        ).format("YYYY-MM-DD HH:mm")} - ${moment(
          new Date(new Date().getTime() + 60 * 30 * 1000)
        ).format("YYYY-MM-DD HH:mm")}`
      );
    },
    // 添加行程
    addBusinesstrip() {
      // 获取表单数据
      let arr = this.fApi.formData().group;
      //添加数据
      this.fApi.setValue({ group: [...arr, {}] });
      this.$nextTick(() => {
        document.getElementsByClassName("cardName").forEach((v, k) => {
          v.innerHTML = `出差行程(${k + 1})`;
        });
      console.log(this.fApi.getRule("group"))

      });
    },
    //删除行程
    removeBusinesstrip(e) {
      let arr = this.fApi.formData().group;
      arr = [];
      //添加数据
      this.fApi.setValue({ group: [...arr] });
    },
    peerSelectUsers(e) {
      this.PeerShowDialog = true;
    },
    // 同行人选人
    peerGetDatas(e, close) {
      this.PeerUsers = e;
      close();
    },
    // 打开选人
    openSelectUsersDialog() {
      this.SubstituteShowDialog = true;
    },
    // 提示语替换
    setTips(type, font) {
      this.fApi.updateRule([type], {
        suffix: {
          type: "el-link",
          children: [font],
        },
      });
    },
    // 警告替换
    setAlert(type, font) {
      this.fApi.updateRule([type], {
        children: [font],
      });
    },
    // 调班提示语句
    substituteTime(type) {
      // 如果替班人存在
      if (this.fApi.getValue("diaobanInput")) {
        getUserProfile().then((res) => {
          console.log(this.SubstituteData.user_name);
          this.substituteShift(
            type,
            res.data.username,
            this.SubstituteData.user_name
          );
        });
      } else {
        //触发名字验证
        //未选择人先清除
        this.fApi.resetFields();
        // 再触发名字验证
        this.fApi.validateField("diaobanInput", (valid, fail) => {
          if (valid) {
            //todo 字段验证通过
            return;
          } else {
            return;
          }
        });
      }
      // if(this.fApi.getValue('diaobanInput'))

      //请求之后
    },
    substituteShift(type, name1, name2 = false) {
      if (type === "start") {
        this.fApi.updateRule("diaobanTime", {
          suffix: {
            type: "el-link",
            children: [
              `${name1}从${"早班"}换为${"休息"},${
                name2 ? `${name2}从${"休息"}换为${"早班"}` : ""
              }`,
            ],
          },
        });
      } else if (type === "end") {
        this.fApi.updateRule("diaobanEndTime", {
          suffix: {
            type: "el-link",
            children: [
              `${name1}从${"早班"}换为${"休息"}，${
                name2 ? `${name2}从${"休息"}换为${"早班"}` : ""
              }`,
            ],
          },
        });
      }
    },
    // 替班名称替换
    diaobanNameChange() {
      this.fApi.resetFields();
      this.fApi.updateRule("diaobanTime", {
        suffix: {
          type: "el-link",
          children: [""],
        },
      });
      this.fApi.updateRule("diaobanEndTime", {
        suffix: {
          type: "el-link",
          children: [""],
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
// 输入框等所有表单宽度
$inputWidth: 360px;
// 多行文本输入高度
$textarea: 120px;
::v-deep .fdasf {
  margin: 20px;
}
.form-warp {
  background-color: #fff;
  border-radius: 2px;
  overflow: auto;
  // overflow: hidden;
  // overflow-x: hidden;
  h1 {
    padding: 16px 24px;
  }
  :v-deep .el-textarea__inner {
    height: 120px;
  }
  .form-apply {
    width: 650px;

    padding: 32px 0px 64px 64px;
    ::v-deep .el-select,
    .el-input__inner,
    .el-input--medium {
      width: $inputWidth;
    }
    .form-create {
      // 添加图标
      ::v-deep .el-icon-circle-plus-outline {
        position: fixed;
        bottom: -20px;
        left: 0px;
      }
      // 行程头标题
      ::v-deep .el-card__header div {
        position: absolute;
        top: 0px;
        padding-right: 20px;
      }
      // 删除图标
      ::v-deep .el-icon-remove-outline {
        position: absolute;
        left: 500px;
        left: -80px;
        top: -300px;
        transform: scale(0.8);
      }
    }

    .inputPublic {
      width: $inputWidth;
    }
    .examine {
      width: 42px;
      height: 22px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(1, 6, 33, 0.9);
      line-height: 22px;
      margin-right: 10px;
    }
    .lastItem {
      margin-top: 45px;
      ::v-deep
        .el-timeline
        .el-timeline-item:last-child
        .el-timeline-item__tail {
        display: none;
      }
    }
    .Approver-warp {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      color: #010621;
      margin-right: 10px;
      position: relative;
      ::v-deep .el-badge__content.is-fixed {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        padding: 0;
        margin: 0;
        top: 6px;
        left: 11px;
        background: #333333;
        text-align: center;
        vertical-align: middle;
        border: none;
        cursor: pointer;
      }
      .Approver {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #048790;
        color: #fff;
        border: 1px solid #e6e6e6;
        cursor: pointer;
      }
      .Approver-font {
        position: absolute;
        top: 50px;
        width: 50px;
        left: 0px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(1, 6, 33, 0.55);
        line-height: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .CC {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      font-size: 22px;
      color: #048790;
      border: 1px solid #048790;
    }
    ::v-deep .el-input__prefix i {
      position: absolute;
      right: -350px;
    }
    ::v-deep .el-input--medium .el-input__inner {
      padding-left: 15px;
    }
  }

  ::v-deep .el-timeline-item {
    padding-bottom: 80px;
    padding-left: 20px;
  }
  ::v-deep .el-timeline-item:last-child {
    padding-bottom: 20px;
    padding-left: 20px;
  }
  // 时间线默认样式更改
  ::v-deep .el-timeline-item__tail {
    height: 60px;
    width: 1px;
    top: 18px;
    left: 22px;
  }
  ::v-deep .el-timeline-item__dot {
    position: absolute;
    left: 0px;
    top: 0px;
    transform: translate(0, -25%);
  }

  // 折叠边框去除
  ::v-deep .el-collapse {
    border: none;
  }
  ::v-deep .el-collapse-item__header {
    border: none;
  }
  // 输入框宽度
  ::v-deep .el-input--medium .el-input__inner {
    width: $inputWidth;
    cursor: pointer;
  }
  ::v-deep .el-textarea {
    width: $inputWidth;
  }
  ::v-deep .el-textarea__inner {
    height: $textarea;
  }
  // 输入框清除按钮样式
  ::v-deep .el-icon-circle-close {
    position: absolute;
    left: 100px;
  }
  // 提示语句
  ::v-deep .el-link.el-link--default {
    position: absolute;
    left: 0px;
    top: 27px;
    font-size: 13px;
    transform: scale(0.9);
    color: #c0c4cc;
  }
  //警示语句
  ::v-deep .el-alert--info.is-light {
    background-color: #fff;
    height: 20px;
    position: relative;
    left: 110px;
  }
}
</style>

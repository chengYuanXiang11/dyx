<template>
  <div class="app-container">
    <div>
      <span class="addInfo">租赁信息</span>
      <el-button type="primary" class="el-icon-plus" size="small" @click="addTags">添加商位</el-button>
    </div>
    <div class="tags-list">
      <el-tag
        :type="tagIndex == tagsActive ? 'primary' : 'info'"
        :key="tagIndex"
        v-for="(tag,tagIndex) in dynamicTags"
        closable
        size="medium"
        :disable-transitions="false"
        @click="handleClick(tagIndex)"
        @close="handleClose(tagIndex)"
      >{{ tag }}</el-tag>
    </div>
    <el-form ref="form" :model="form[tagsActive]" label-width="120px">
      <div class="lease" v-for="(formItem,formIndex) in form" :key="formIndex">
        <div v-if="tagsActive == formIndex">
          <div>租赁</div>
          <el-form-item
            label="租赁类型"
            prop="one"
            :rules="[
              { required: true, message: '请输入租赁类型', trigger: 'change' },
            ]"
          >
            <el-select v-model="formItem.one" placeholder="请选择租赁类型" clearable>
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="(item,index) in optionsOne"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="位置">
            <div class="select-more">
              <el-select v-model="formItem.pzOne" placeholder="请选择区域" filterable clearable>
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="(item,index) in pzOneList"
                  :key="index"
                ></el-option>
              </el-select>
              <el-select v-model="formItem.pzTwo" placeholder="请选择建筑" filterable clearable>
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="(item,index) in pzTwoList"
                  :key="index"
                ></el-option>
              </el-select>
              <el-select v-model="formItem.pzThree" placeholder="请选择楼层" filterable clearable>
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="(item,index) in pzThreeList"
                  :key="index"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="商位号">
            <el-select
              v-model="formItem.two"
              @change="changeShow"
              placeholder="请选择商位号"
              filterable
              clearable
            >
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="(item,index) in optionsTwo"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              v-model="formItem.three"
              type="date"
              placeholder="选择日期时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              v-model="formItem.four"
              type="date"
              placeholder="选择日期时间"
            ></el-date-picker>
          </el-form-item>
        </div>
        <div v-if="tagsActive == formIndex">
          <div>租金</div>
          <el-form-item label="支付方案">
            <el-radio-group v-model="formItem.zjOne" v-if="isShow == 1">
              <el-radio label="每1年100元"></el-radio>
              <el-radio label="每6月500元"></el-radio>
              <el-radio label="每1月100元"></el-radio>
              <el-radio label="自定义">
                <span class="zj-custom">自定义</span>
                <span class="zj-radio">
                  <span class="text">每</span>
                  <el-input v-model.number="formItem.zjTwo"></el-input>
                  <el-select v-model="formItem.zjfour" placeholder>
                    <el-option
                      v-for="item in optionsZjTwo"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-input v-model.number="formItem.zjThree"></el-input>
                  <span class="text">元</span>
                </span>
              </el-radio>
            </el-radio-group>
            <span class="zj-radio" v-else-if="isShow == 2">
              <span class="text">每</span>
              <el-input v-model.number="formItem.zjTwo"></el-input>
              <el-select v-model="formItem.zjfour" placeholder>
                <el-option
                  v-for="item in optionsZjTwo"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input v-model.number="formItem.zjThree"></el-input>
              <span class="text">元</span>
            </span>
          </el-form-item>
          <el-form-item label="缴费方式">
            <el-radio-group v-model="formItem.zjFive">
              <el-radio label="按合同日期"></el-radio>
              <el-radio label="按固定日期">
                <span class="select-more">
                  <span class="text">按固定日期</span>
                  <span class="text">每月</span>
                  <el-input v-model="formItem.zjSix"></el-input>
                  <span class="text">日</span>
                </span>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="正常缴费时间">
            <el-input v-model="formItem.zjSeven" disabled></el-input>
          </el-form-item>
          <el-form-item label="首次缴费金额(元)">
            <el-input v-model="formItem.zjEight" disabled></el-input>
          </el-form-item>
          <el-form-item label="保证金金额(元)">
            <el-input v-model="formItem.zjNine"></el-input>
          </el-form-item>
          <el-form-item label="提醒时间">
            <el-switch v-model="formItem.ten"></el-switch>
            <span class="select-more">
              <span class="text">提前</span>
              <el-input v-model="formItem.ele"></el-input>
              <span class="text">天</span>
              <el-input v-model="formItem.twe"></el-input>
              <span class="text">点</span>
            </span>
          </el-form-item>
          <el-form-item label="自动扣费">
            <el-switch v-model="formItem.thir"></el-switch>
            <span class="text">到达缴费时间时,自动扣费</span>
          </el-form-item>
          <div>水费</div>
          <el-form-item label="水费价格">
            <span class="text">每吨</span>
            <el-input v-model="formItem.sfOne"></el-input>
            <span class="text">元</span>
          </el-form-item>
          <el-form-item label="提醒时间">
            <span class="text">水卡余额低于</span>
            <el-input v-model="formItem.sfTwo"></el-input>
            <span class="text">元时,提醒缴费</span>
          </el-form-item>
          <el-form-item label="自动充值">
            <el-switch v-model="formItem.sfThree"></el-switch>
            <span class="text">水卡余额低于</span>
            <span class="select-more">
              <el-input v-model="formItem.sfFour"></el-input>
              <span class="text">元时,自动充值</span>
              <el-input v-model="formItem.sfFive"></el-input>
              <span class="text">元</span>
            </span>
          </el-form-item>
          <div>电费</div>
          <el-form-item label="电费价格">
            <span class="text">每kw/h</span>

            <el-input v-model="formItem.dfOne"></el-input>
            <span class="text">元</span>
          </el-form-item>
          <el-form-item label="提醒时间">
            <span class="text">电费余额低于</span>
            <el-input v-model="formItem.dfTwo"></el-input>
            <span class="text">元时,提醒缴费</span>
          </el-form-item>
          <el-form-item label="自动充值">
            <el-switch v-model="formItem.dfThree"></el-switch>
            <span class="select-more">
              <span class="text">水卡余额低于</span>
              <el-input v-model="formItem.dfFour"></el-input>
              <span class="text">元时,自动充值</span>
              <el-input v-model="formItem.dfFive"></el-input>
              <span class="text">元</span>
            </span>
          </el-form-item>
          <div>卫生费</div>
          <el-form-item label="收费周期">
            <span class="select-more">
              <span class="text">每</span>
              <el-input v-model="formItem.wsfOne"></el-input>
              <span class="text"></span>
              <el-select v-model="formItem.wsfTwo">
                <el-option
                  v-for="item in optionsZjTwo"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </span>
          </el-form-item>
          <el-form-item label="收费金额(元)">
            <el-input v-model="formItem.wsfThree"></el-input>
          </el-form-item>
          <el-form-item label="缴费方式">
            <el-radio-group v-model="formItem.wsfFour">
              <el-radio label="按固定日期">按固定日期</el-radio>
              <el-radio label="按合同日期">按合同日期</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="正常缴费时间">
            <el-input v-model="formItem.wsfFive"></el-input>
          </el-form-item>
          <el-form-item label="首次缴费金额(元)">
            <el-input v-model="formItem.wsfSix"></el-input>
          </el-form-item>
          <el-form-item label="提醒时间">
            <el-switch v-model="formItem.wsfSeven"></el-switch>
            <span class="text">提前</span>
            <el-input v-model="formItem.wsfNine"></el-input>
            <span class="text">天</span>
            <el-input v-model="formItem.wsfTen"></el-input>
            <span class="text">点</span>
          </el-form-item>
          <el-form-item label="自动扣费">
            <el-switch v-model="formItem.wsfEight"></el-switch>
            <span class="text">到达缴费时间时自动扣费</span>
          </el-form-item>
          <div>物业费</div>
          <el-form-item label="收费周期">
            <span class="select-more">
              <span class="text">每</span>
              <el-input v-model="formItem.wyfOne"></el-input>
              <span class="text"></span>
              <el-select v-model="formItem.wyfTwo">
                <el-option
                  v-for="item in optionsZjTwo"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </span>
          </el-form-item>
          <el-form-item label="收费金额(元)">
            <el-input v-model="formItem.wyfThree"></el-input>
          </el-form-item>
          <el-form-item label="缴费方式">
            <el-radio-group v-model="formItem.wyfFour">
              <el-radio label="label">按固定日期</el-radio>
              <el-radio label="label">按合同日期</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="正常缴费时间">
            <el-input v-model="formItem.wyfFive"></el-input>
          </el-form-item>
          <el-form-item label="首次缴费金额(元)">
            <el-input v-model="formItem.wyfSix"></el-input>
          </el-form-item>
          <el-form-item label="提醒时间">
            <el-switch v-model="formItem.wyfSeven"></el-switch>
            <span class="text">提前</span>
            <el-input v-model="formItem.wyfNine"></el-input>
            <span class="text">天</span>
            <el-input v-model="formItem.wyfTen"></el-input>
            <span class="text">点</span>
          </el-form-item>
          <el-form-item label="自动扣费">
            <el-switch v-model="formItem.wyfEight"></el-switch>
            <span class="text">到达缴费时间时自动扣费</span>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submit">提交</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: [],
      dynamicTags: [],
      tagsActive: 0,
      optionsOne: [
        { label: "商铺", value: 1 },
        { label: "仓库", value: 2 },
        { label: "宿舍", value: 3 },
      ],
      optionsTwo: [
        { label: "A1", value: 1 },
        { label: "A2", value: 2 },
        { label: "A3", value: 3 },
      ],
      num: 0,
      pzOneList: [],
      pzTwoList: [],
      pzThreeList: [],
      optionsZjTwo: [
        { label: '年', value: 1 },
        { label: '月', value: 2 },
        { label: '日', value: 3 },
      ],
      isShow: 0,

    }
  },
  created() {

  },
  methods: {
    // 监控商位号的变化  测试 1代表有数据  2代码无数据 X
    // 此状态值需要后台从数据中一起返回来控制显示隐藏
    changeShow(val) {
      console.log(val);
      if(val==2){//测试
        this.isShow = 1
      }else{
        this.isShow = 2
      }
    },
    // 提交
    submit() {
      this.$refs.form.validate(function (valid) {
        if (valid) {
          alert('submit!')
        }
      })
    },
    // 删除商位
    handleClose(tagIndex) {
      this.$confirm('确定删除此商户吗?', '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.dynamicTags.splice(tagIndex, 1);
        this.form.splice(tagIndex, 1)
        this.tagsActive = this.dynamicTags.length - 1
      }).catch(() => { })
    },
    // 切换商位
    handleClick(tagIndex) {
      let _this = this
      // 表单必填信息填写完整才允许切换
      this.$refs.form.validate(function (valid) {
        if (valid) {
          _this.tagsActive = tagIndex
        } else {
          alert("请将此商位必填信息填写完整!")
        }
      })
    },
    // 添加商位
    addTags() {
      // 表单必填信息填写完整才允许添加
      let flag = false
      if (this.dynamicTags.length == 0) {
        flag = true
      }
      this.$refs.form.validate(function (valid) {
        if (valid) {
          flag = true
        } else {
          alert("请将此商位必填信息填写完整!")
        }
      })
      if (flag) {
        this.num += 1
        this.dynamicTags.push(`商位${this.num}`)
        this.form.push({
          one: 1,
          two: "",
          three: "",
          four: "",
          pzOne: "",
          pzTwo: "",
          pzThree: "",

          zjOne: '',
          zjTwo: '',
          zjThree: '',
          zjFour: '',
          zjFive: '',
          zjSix: '',
          zjSeven: '',
          zjEight: '',
          zjNine: '',
          zjTen: '',
          ele: '',
          twe: '',
          thir: '',

          sfOne: '',
          sfTwo: '',
          sfThree: '',
          sfFour: '',
          sfFive: '',

          dfOne: '',
          dfTwo: '',
          dfThree: '',
          dfFour: '',
          dfFive: '',

          wsfOne: '',
          wsfTwo: '',
          wsfThree: '',
          wsfFour: '',
          wsfFive: '',
          wsfSix: '',
          wsfSeven: '',
          wsfEight: '',
          wsfNine:'',
          wsfTen:'',

          wyfOne: '',
          wyfTwo: '',
          wyfThree: '',
          wyfFour: '',
          wyfFive: '',
          wyfSix: '',
          wyfSeven: '',
          wyfEight: '',
          wyfNine:'',
          wyfTen:''

        })
        this.tagsActive = this.form.length - 1
      }



    },
  }

}
</script>

<style lang="scss" scoped>
.addInfo {
  margin-right: 15px;
}

.tags-list {
  margin: 20px 0;
  ::v-deep .el-tag {
    cursor: pointer;
  }
  ::v-deep .el-tag + .el-tag {
    margin-left: 10px;
  }
}
.lease {
  .text {
    margin: 0 5px;
  }
  ::v-deep .el-input {
    width: 440px;
  }
  ::v-deep .el-select + .el-select {
    margin-left: 10px;
  }
  .select-more {
    ::v-deep .el-select .el-input {
      width: 140px;
    }
    ::v-deep .el-input {
      width: 140px;
    }
  }

  .zj-custom {
    margin-right: 20px;
  }
  .zj-radio {
    ::v-deep .el-input {
      width: 70px;
    }
    ::v-deep .el-select .el-input {
      width: 64px;
      margin: 0 15px;
    }
  }
}
</style>
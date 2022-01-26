<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted(){ 
    //页面刷新，重新添加路由和菜单自动展开
    this.$store.commit("ROOT_AUOT_SELECT_ROUTER", {that: this});    
    setTimeout(()=>{   //全局设置
      $("#navHome .el-submenu__title .el-submenu__icon-arrow").css({display: "none"});//隐藏首页菜单箭头样式
      $("#navHome .el-menu").remove(); // 解决首页菜单点击抖动问题
      $("#navHome .el-menu").unbind('mouseenter').unbind('mouseleave');
    },500)
  }
}
</script>

<style lang="scss">
  @import '~normalize.css/normalize.css';// normalize.css 样式格式化
  @import './styles/index.scss'; // 全局自定义的css样式
  html, body, #app{ width: 100%;height: 100%;padding: 0;margin: 0; }
  #app{ }
  #navHome .submenu__title i { display: none !important; }  //隐藏首页下拉箭头
  .dialogOperator { text-align: right; }
  // 全局弹出层样式
  .el-dialog__header{
    padding: 10px 20px !important;
    background-color: #304156;
    .el-dialog__title{
      color: #fff;
    }
  }
  .listTemplateContainer{
    width: 100%;
    height: 100%;
  }
  .listTemplateSearch{
    width: 100%;
    padding-top: 10px;
    .el-form{ overflow: hidden }
    .el-form-item { margin-bottom: 5px !important;}
    .el-input, .el-select { width: 180px !important; }
    .searchButton{
      height: 40px;
      line-height: 35px;
      .el-button{ width: 100px; }
    }
  } 
  .listTemplateDialog{
    .el-select, .el-input, .el-textarea, .el-cascader{ width: 100%}
  }
  .listTemplateOperator{
    padding: 10px 0;
    .el-button{ width: 100px;height: 35px; }
  }
  .listTemplateTable{
      td, th{
        padding: 10px 0;
        font-size: 14px;
      }
      .el-table th.gutter{
        display: table-cell!important;
      }
      .curreny-date-picker .el-input__inner {
        padding-left: 28px !important
      }
      .el-table__header{
        th{
          background-color: #f5f5f5 !important;
          color: #666;
          font-size: 14px;
        }
      }
      .el-table__row{
        .el-button--mini{
          padding: 2px;
          i {
            font-size: 14px;
          }
        }
      }
      .el-table__expanded-cell{
        padding: 0px;
        .el-table__header-wrapper{
          display: none
        }
      }
      .el-input__inner{ padding:0 0 0 5px !important; }
      .el-date-editor{
        .el-input__inner{ padding:0 0 0 30px !important; }
      }
    }

  
</style>

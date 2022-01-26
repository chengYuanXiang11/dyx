<template>
  <el-table
    :data="tableData"
    style="width: 100%"
    :cell-class-name="tableRowClassName">
    <el-table-column
      prop="date"
      label="日期"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址">
    </el-table-column>
  </el-table>
</template>
<script>
export default {
     name: "engFrom",
      methods: {
      tableRowClassName({row, column, rowIndex, columnIndex}) {
        // console.log(this.tableData2[rowIndex]);
        if (row.name !==this.tableData2[rowIndex].name ) {
        
          if (rowIndex === 3) {
          return 'success-row';
        } 
         return 'warning-row';
        } else if (rowIndex === 5) {
          return 'success-row';
        }
        return '';
      }
    },
    data() {
      return {
        tableData2:[{
          date: '2016-05-02',
          name: '王王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        }, {
          date: '2016--04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀沙江路 1518 弄',
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        tableData: [{
          date: '2016-05-02',
          name: '王虎',
          address: '上海市普陀区金沙江路 1518 弄',
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }]
      }
    }
};
</script>
<style >

</style
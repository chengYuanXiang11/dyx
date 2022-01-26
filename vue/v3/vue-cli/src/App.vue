<template>
  <div>
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld></HelloWorld>---------------
    <com></com>
    <Message></Message>

    <input type="file" @change="uploadFile($event)" />
  </div>
</template>

<script>
import cyx from 'cyx-cli-model'
import localforage from 'localforage'
export default {
  name: 'App',
  data() {
    return {
      file: null
    }
  },

  created() {
    console.log(cyx)
    localforage.setItem('ar', [1, 2, 34])
    this.$message.add({
      visible: true,
      message:"123",
      closed:false
    })
  },
  methods: {
    uploadFile(e) {
      var reader = new FileReader();
      reader.onload = function (e) {
        console.log(e.target.result);
      }
      reader.readAsArrayBuffer(e.target.files[0]);

      reader.onload = function (e) {
        localforage.setItem('file', e.target.result)
      };
      // const formData = new FormData();  // 创建一个formdata对象
      // formData.append('res', e.target.files[0]);
    }
  },

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

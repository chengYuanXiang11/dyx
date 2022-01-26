<template>
  <div class="hello">
    <input type="text" v-model="name" />
    <!-- v-model  -->
    <!-- <input type="text" :value="value" @input="changValue"> -->
    <input type="text" :value="namePr" @input="changValue1">
    <ul>
      <li v-for="(v, k) in data" :key="k" v-html="dataHtml(v)"></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      name: "",
      dataArr: [
        {
          id: 1,
          name: "this is 1",
        },
        {
          id: 12,
          name: "this is 12",
        },
        {
          id: 13,
          name: "this is 13",
        },
        {
          id: 14,
          name: "this is 14",
        },
        {
          id: 15,
          name: "this is 15",
        },
      ],
      data: [],
    };
  },
  created(){
    console.log(this.namePr)
  },
  computed: {
    dataArrCom() {
      if (this.name == "") return this.dataArr;
      let replaceString = '<span style="color:red;">' + this.name + "</span>";
      let replaceReg = new RegExp(this.name, "g");
      return this.dataArr.filter((v) => {
        v.name = v.name.replace(replaceReg, replaceString);
        return v.name.includes(this.name);
      });
    },
  },
  watch: {
    name: {
      handler(newV) {
        this.data = JSON.parse(JSON.stringify(this.dataArr));
        let replaceString = '<span style="color:red;">' + newV + "</span>";
        let replaceReg = new RegExp(newV, "g");
        this.data = this.data.filter((v) => {
          v.name = v.name.replace(replaceReg, replaceString);
          return v.name.includes(newV);
        });
      },
    },
  },
  methods: {
    dataHtml(arr) {
      console.log(arr);
      return arr.id + "-----" + arr.name;
    },
    changValue(e){
      this.$emit('input',e.target.value)
    },
    changValue1(e){
      this.$emit('update:namePr',e.target.value)

    }
  },
  props: {
    value: String,
    namePr:{
      type:String,
      default:""
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

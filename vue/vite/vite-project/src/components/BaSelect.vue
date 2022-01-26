<template>
  <el-tag v-for="tag in tags" :key="tag.id" closable :type="tag.type">
    {{ tag.key }}:{{ tag.value }}
  </el-tag>
  <el-select v-show="currvalue === ''" v-model="currvalue" v-bind="$attrs">
    <el-option
      v-for="item in options"
      :key="item.value"
      :value="item.value"
      :label="item.label"
    />
  </el-select>
  <span v-show="currvalue !== ''" v-bind="$attrs"> 
    <el-input v-model="input1" @keydown.enter="setDataArray()">
      <template #prepend>{{ currvalue }}</template>
    </el-input>
    
  </span>
  <el-col :span="8" v-for="(item, index) in att" :key="index" style="margin-top:20px;">
            <slot :row="item"></slot>
        </el-col>
 <!-- <slot name="footer2" :input1="input1"> 23213434 </slot> -->
</template>

<script>
import { ref, reactive, computed } from "vue";
export default {
  name: "BaSelect",
  inheritAttrs: false,
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    tags: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Array,
      default: () => [],
    },
    keys: {
      type: String,
    },
  },
  emits: ["update:value", "update:tags"],
  setup(props, { emit }) {
    const att =[1,2,3,4,5]
    const id = ref(0);
    const input1 = ref("default");
    const currvalue = computed({
      get: () => {
        return props.value[props.keys];
      },
      set: (value) => {
        emit(
          "update:value",
          Object.assign(props.value, { [props.keys]: value })
        );
      },
    });
    const setDataArray = () => {
      id.value += 1;  
      emit(
        "update:tags",
        props.tags.push({
          id: id.value,
          key: currvalue.value,
          value: input1.value,
        })
      );
      emit("update:value", Object.assign(props.value, { [props.keys]: "" }));
    };
    return {
      input1,
      setDataArray,
      currvalue,
      att
    };
  },
};
</script>
<template>
  <!-- model="form" -->
  <el-form ref="form" :model="form" label-width="120px">
    <!-- :span="item.span || 24" -->
    <el-col v-for="item in fileItem" :key="item.key">
      <!-- v-if="item._isShow" -->
      <el-form-item :rules="item._rule" :prop="item.key" :label="item.title">
        <div :class="isEle(item.type)">
          <!-- {{ item }} -->
          <component
            :is="item.type"
            v-model:value="form"
            v-model:tags="tags"
            :keys="item.key"
            :options="item.options"
            :a="25215"
            @click="ser"
            ref="root"
          >
            <template #default="slotProps">
              <ul>
               dasf{{slotProps}}
              </ul>
            </template>
            <!-- <div>25</div> -->
          </component>
        </div>
      </el-form-item>
    </el-col>
    <el-button type="primary" @click="onSubmit">Create</el-button>
  </el-form>
</template>

<script lang="ts">
import { computeFormItem } from "./core";
import { ref, reactive, computed, watch, onMounted } from "vue";
export default {
  inheritAttrs: false,
  props: {
    xm: {
      type: Boolean,
      default: false,
    },
    selectOptions: {
      type: Array,
      default: () => [],
    },
  },

  setup(props, { emit }) {
    const tags = reactive([]);
    const fileItem = computed(() =>
      props.selectOptions.map((item) => {
        return computeFormItem(item);
      })
    );
    const form = reactive({});
    const root = ref(null);
    const value = ref("");
    const inputValue = ref("");
    const isEle = (value) => {
      var reg = /^[el-](\w+)/gi;
      return reg.test(value) ? value : "";
    };
    props.selectOptions.forEach((item) => {
      form[item.key] = "";
    });
    // watch(
    //   [selectOptions],
    //   (newValues, prevValues) => {
    //     console.log(newValues, prevValues);
    //   },
    //   { deep: true }
    // );
    onMounted(() => {
      // DOM 元素将在初始渲染后分配给 ref
      console.log(root.value); // <div>This is a root element</div>
    });
    const onSubmit = () => {
      console.log(tags);
    };
    const ser = () => {
      console.log("sd");
    };
    return {
      value,
      isEle,
      tags,
      inputValue,
      fileItem,
      onSubmit,
      form,
      ser,
      root,
    };
  },
  methods: {},
};
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}
.xm {
  width: 90%;
}
.xg {
  width: 70%;
}
code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>

<template>
    <!-- 封装Form-item -->
    <!-- :prop="getProps(fieldsItem.vModel)" -->
    <!-- fieldsItem.required,  -->
    <el-form-item
        :ref="fieldsItem.vModel"
        :label="`${fieldsItem.label}:`"
        :prop="fieldsItem.vModel"
        :rules="[
            {
                required: true,
                trigger: 'blur',
            },
        ]"
    >
        <HolidayTypes
            v-if="fieldsItem.tag == 'holiday-types'"
            :placeholder="fieldsItem.placeholder"
            v-model="data"
        ></HolidayTypes>
        <TimeDuration
            v-if="fieldsItem.tag == 'time-duration'"
            :placeholder="fieldsItem.placeholder"
            v-model="data"
        ></TimeDuration>
        <el-input
            type="textarea"
            resize="none"
            :row="4"
            :placeholder="fieldsItem.placeholder"
            v-model="data"
            v-if="fieldsItem.tag == 'textarea'"
        ></el-input>
    </el-form-item>
</template>

<script>
import HolidayTypes from "@/views/system/form/components/form/module/holiday-types.vue";
import TimeDuration from "@/views/system/form/components/form/module/time-duration.vue";

export default {
    inheritAttrs: false,
    name: "Item",
    data() {
        return {
            data: this.value,
            leaveReason: 4234,
            vas: (rule, value, callback) => {
                console.log(value);
                if (value === "") {
                    callback(new Error("请输入密码"));
                } else {
                    if (this.ruleForm.checkPass !== "") {
                        this.$refs.ruleForm.validateField("checkPass");
                    }
                    callback();
                }
            },
        };
    },
    components: {
        HolidayTypes,
        TimeDuration,
    },
    props: {
        value: {
            type: [String, Number, Object, Array, Boolean],
        },
        fieldsItem: {
            type: Object,
            default: () => {},
        },
        formData: {
            type: Object,
            default: () => {},
        },
        data2: {
            type: String,
            default: "",
        },
    },
    watch: {
        value(newVal) {
            this.data = newVal;
        },
        data(newVal) {
            // this.$refs[this.fieldsItem.vModel].validate((valid) => {
            //     console.log(valid);
            //     if (valid) {
            //         console.log(this.formData, this.datas, this.users);
            //         alert("submit!");
            //     } else {
            //         console.log("error submit!!");
            //         return false;
            //     }
            // });
            console.log(newVal);
            this.$emit("input", newVal);
        },
    },
    created() {
        console.log(this.fieldsItem.vModel);
        console.log(this.formData);
        console.log(this.$attrs);
    },
    methods: {
        getProps(val) {
            if (typeof this.formData[val] !== "string") {
                return `${val}2`;
            } else {
                return val;
            }
        },
    },
};
</script>

<style scoped lang="scss"></style>

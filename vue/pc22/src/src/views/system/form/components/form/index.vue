<template>
    <el-form label-width="140px" :ref="data.formRef" :model="formData" disabled>
        <el-form-item
            v-for="(item, index) in data.fields"
            :key="'form-item' + index"
            :label="item.label"
            :rules="[
                {
                    required: item.required,
                },
            ]"
        >
            <HolidayTypes
                v-model="formData[item.vModel]"
                v-if="item.tag == 'holiday-types'"
            ></HolidayTypes>
            <el-input
                type="textarea"
                resize="none"
                :row="4"
                v-model="formData[item.vModel]"
                :placeholder="item.placeholder"
                v-if="item.tag == 'textarea'"
            ></el-input>
            <el-input
                v-model="formData[item.vModel]"
                :placeholder="item.placeholder"
                v-if="item.tag == 'input'"
                :disabled="item.disabled"
            ></el-input>
            <el-date-picker
                v-model="formData[item.vModel]"
                type="datetime"
                :placeholder="item.placeholder"
                v-if="item.tag == 'datetime'"
            >
            </el-date-picker>
            <el-date-picker
                v-model="formData[item.vModel]"
                type="datetimerange"
                :placeholder="item.placeholder"
                v-if="item.tag == 'datetimerange'"
            >
            </el-date-picker>
            <PunchTimeSelect
                v-model="formData[item.vModel]"
                v-if="item.tag == 'punchTime-select'"
            ></PunchTimeSelect>
            <DictSelect
                v-model="formData[item.vModel]"
                v-if="item.tag == 'dict-select'"
                :placeholder="item.placeholder"
                :dictCode="item.dictCode"
            ></DictSelect>
        </el-form-item>
        <!-- <el-button @click="sumit">确定</el-button> -->
    </el-form>
</template>

<script>
import HolidayTypes from "./module/holiday-types";
import TimeDuration from "./module/time-duration";
import PunchTimeSelect from "./module/punchTime-select";
import DictSelect from "./module/dict-select";

export default {
    name: "FormComponent",
    data() {
        return {
            formData: {},
        };
    },
    components: {
        HolidayTypes,
        TimeDuration,
        PunchTimeSelect,
        DictSelect
    },
    props: {
        data: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    methods: {
        sumit() {
            console.log(this.formData);
        },
    },
    created() {},
};
</script>

<style lang="scss" scoped>
.block {
    background: #f5f5f5;
    margin-bottom: 22px;
    padding: 22px;
    .title {
        font-size: 22px;
        padding-bottom: 22px;
    }
}
.small-block {
    background: #f5f5f5;
    padding: 12px;
    .title {
        font-size: 16px;
        padding-bottom: 12px;
        line-height: normal;
    }
}
::v-deep .el-form-item.table {
    .el-form-item__label {
        float: none;
        display: block;
    }
    .el-form-item__content {
        margin-left: 0 !important;
    }
}
</style>

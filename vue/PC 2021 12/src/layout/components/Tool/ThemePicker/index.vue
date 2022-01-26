<template>
    <el-color-picker
        v-model="theme"
        :predefine="[
            '#409EFF',
            '#1890ff',
            '#304156',
            '#212121',
            '#048790',
            '#11a983',
            '#13c2c2',
            '#6959CD',
            '#f5222d',
        ]"
        class="theme-picker"
        popper-class="theme-picker-dropdown"
    />
</template>

<script>
import themeMixin from "../../../mixin/theme";
export default {
    mixins: [themeMixin],
    data() {
        return {
            chalk: "", // content of theme-chalk css
            theme: "",
        };
    },
    computed: {
        defaultTheme() {
            return this.$store.state.settings.theme;
        },
    },
    watch: {
        defaultTheme: {
            handler: function (val, oldVal) {
                this.theme = val;
            },
            immediate: true,
        },
        theme: {
            handler: function (val, oldVal) {
                this.updateTheme(val)
            },
            immediate: true,
        },
        
    },

    methods: {
    },
};
</script>

<style>
.theme-message,
.theme-picker-dropdown {
    z-index: 99999 !important;
}

.theme-picker .el-color-picker__trigger {
    height: 26px !important;
    width: 26px !important;
    padding: 2px;
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
    display: none;
}
</style>

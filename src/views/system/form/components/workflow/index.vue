<template>
    <div>
        <div class="fd-nav-content">
            <section class="dingflow-design">
                <div class="box-scale" id="box-scale">
                    <nodeWrap v-model="nodeConfig" :disabled="disabled"></nodeWrap>
                    <div class="end-node">
                        <div class="end-node-circle"></div>
                        <div class="end-node-text">流程结束</div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>
<script>
import nodeWrap from "./nodeWrap.vue";
export default {
    components: {
        nodeWrap,
    },
    data() {
        return {
            nodeConfig: this.value,
        };
    },
    props:{
        value:{
            type:Object,
            default:() => {
                return {}
            }
        },
        disabled: {
            type: Boolean,
            default: false
        },
    },
    watch: {
        value(newVal) {
            this.nodeConfig = newVal;
        },
        nodeConfig(newVal) {
            this.$emit("input", newVal);
        },
    },
    methods: {
    },
};
</script>
<style lang="scss" scoped>
@import "../../../../../assets/styles/workflow.css";
.error-modal-list {
    width: 455px;
}
</style>
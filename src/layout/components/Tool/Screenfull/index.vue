<template>
    <div>
        <svg-icon
            :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
            @click="click"
        />
    </div>
</template>

<script>
import screenfull from "screenfull";

export default {
    name: "Screenfull",
    data() {
        return {
            isFullscreen: false,
        };
    },
    mounted() {
        this.init();
    },
    beforeDestroy() {
        this.destroy();
    },
    methods: {
        click() {
            if (!screenfull.enabled) {
                this.$warning('浏览器不支持');
                return false;
            }
            screenfull.toggle();
        },
        change() {
            this.isFullscreen = screenfull.isFullscreen;
        },
        init() {
            if (screenfull.enabled) {
                screenfull.on("change", this.change);
            }
        },
        destroy() {
            if (screenfull.enabled) {
                screenfull.off("change", this.change);
            }
        },
    },
};
</script>

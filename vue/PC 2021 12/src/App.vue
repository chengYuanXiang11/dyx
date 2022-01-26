<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
import themeMixin from "./layout/mixin/theme";
export default {
    name: "App",
    mixins: [themeMixin],
    async created() {
        this.updateTheme(this.$store.state.settings.theme);
    },
};
</script>
<style>
#nprogress .bar {
    background: var(--default-color) !important;
}
</style>
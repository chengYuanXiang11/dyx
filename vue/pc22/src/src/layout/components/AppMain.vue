<template>
    <section class="app-main">
        <TagsView></TagsView>
        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
        <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
                <router-view :key="key" />
            </keep-alive>
        </transition>
    </section>
</template>

<script>
import TagsView from "./TagsView/index.vue";
import Breadcrumb from "@/components/Breadcrumb";
export default {
    name: "AppMain",
    computed: {
        cachedViews() {
            return this.$store.state.tagsView.cachedViews;
        },
        key() {
            return this.$route.path;
        },
    },
    components:{
        Breadcrumb,
        TagsView
    }
};
</script>

<style lang="scss" scoped>
.app-main {
    /* 50= navbar  50  */
    height:100vh;
    width: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}

.fixed-header + .app-main {
    padding-top: 50px;
}

.hasTagsView {
    .app-main {
        /* 84 = navbar + tags-view = 50 + 34 */
        min-height: calc(100vh - 84px);
    }

    .fixed-header + .app-main {
        padding-top: 66px;
    }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
    .fixed-header {
        padding-right: 15px;
    }
}
</style>

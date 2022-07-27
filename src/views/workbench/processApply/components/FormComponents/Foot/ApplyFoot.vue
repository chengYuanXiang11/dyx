    <template>
    <div class="foot-warp">
        <div class="foot-content">
            <slot />
        </div>
    </div>
</template>
<script>
export default {
    name: "ApplyFoot",
    data() {
        return {};
    },
    props: {
        num: {
            type: Number,
            default: 0,
        },
    },
};
</script>
<style lang="scss" scoped>
.foot-warp {
    transform: translateZ(0);
    position: fixed;
    bottom: 0px;
    overflow: hidden;
    margin-left: -28px;
    margin-top: 20px;
    background-color: #fff;
    transition: all .2s;
    width: calc(100% - 56px);
    height: 54px;
    -webkit-overflow-scrolling: touch;
    .foot-content {
        margin-right: 54px;
        display: inline-block;
        position: absolute;
        right: 0px;
        top: 50%;
        transform: translateY(-50%);
    }
}

@media screen and (max-width: 990px) {
    .foot-warp {
        width: 100%;
        margin-left: 0px;
    }
}
</style>

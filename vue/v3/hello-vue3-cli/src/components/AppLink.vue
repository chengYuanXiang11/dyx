<template>
  <a
    v-bind="$attrs"
    v-if="isExternalLink"
    :href="to"
    target="_blank"
    rel="noopener"
  >
    <slot name="a"></slot>
  </a>
  <router-link v-else v-bind="$props"><slot name="a"></slot></router-link>
</template>

<script>
import { RouterLink, useLink } from "vue-router";
import { computed } from "vue";
export default {
  name: "AppLink",
  props: {
    ...RouterLink.props,
  },
  setup(props) {
    const { href, isActive, navigate } = useLink(props);

    const isExternalLink = computed(
      () => typeof props.to === "string" && props.to.startsWith("http")
    );
    return { isExternalLink, href, navigate, isActive };
  },
  // computed:{
  //      isExternal(){
  //   return typeof this.to === 'string' && this.to.startsWith('http')
  // }
  // }
};
</script>

<style>
</style>
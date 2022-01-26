<template>
  <!-- :class="{hideSidebar:!sidebar.opened}" -->
  <div class="Engineering">
    <!-- <engFrom1></engFrom1> -->
  </div>
</template>

<script>
import engFrom1 from "./table1";
export default {
  name: "Engineering",
  data() {
    return {
      lock: false
    };
  },
  components: {
    engFrom1
  },
  methods: {}
};
</script>
<style scoped>
</style>
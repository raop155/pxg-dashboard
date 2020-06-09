<template>
  <div id="footer">
    Copyright &copy; {{ new Date().getFullYear() }} {{companyName}}. All rights
    reserved
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "footer-view",
  computed: {
    companyName() {
      return sessionStorage.getItem("companyName");
    }
  }
});
</script>

<style lang="scss" scoped>
#footer {
  grid-area: footer;
  font-size: 1rem;
  display: flex;
  //position: fixed;
  //bottom: 0px;
  width: 100%;
  height: 100%;
  // border: 1px solid;
  justify-content: center;
  align-items: center;
  color: $text_secondary_color;
  background-color: $secondary_color;
}
</style>

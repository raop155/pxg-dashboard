<template>
  <div
    id="nav-button"
    :class="{ 'nav-button--on': button.on }"
    @mouseover="mouseOver"
    @mouseout="mouseOut"
    @click="onClickButton(index)"
  >
    <div id="icon">
      <img :src="iconPath" />
    </div>
    <div id="description">{{button.description}}</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "nav-button",
  props: {
    index: Number,
    button: Object,
    onClickButton: Function
  },
  data() {
    return {
      currentIcon: this.button.icon.off
    };
  },
  methods: {
    onClick() {
      console.log("onClick");
      // this.button.on = true;
    },
    mouseOver() {
      // this.currentIcon = this.button.icon.on;
    },
    mouseOut() {
      this.currentIcon = this.button.icon.off;
    }
  },
  computed: {
    iconPath(): object {
      return require("@/assets/navbar/" + this.currentIcon);
    }
  }
  /* watch: {
    on: function(newVal, oldVal) {
      // watch it
      console.log("Prop changed: ", newVal, " | was: ", oldVal);
    }
  } */
});
</script>

<style lang="scss" scoped>
#nav-button {
  width: 100%;
  height: 90px;
  // border: 1px solid;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: $text_color;

  cursor: pointer;
}

.nav-button--on {
  background-color: $secondary-color;
  color: white !important;

  & #icon img {
    filter: brightness(0) invert(1);
  }
}

#nav-button:hover {
  background-color: $secondary-color;
  color: white;

  & #icon img {
    filter: brightness(0) invert(1);
  }
}

#description {
  font-size: $xs_size;
  text-align: center;
}
</style>

<template>
  <div id="navbar">
    <nav>
      <NavButton
        v-for="(button, index) in enableButtons"
        :key="button.tab"
        :index="index"
        :button="button"
        :onClickButton="onClickButton"
      />
    </nav>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import NavButton from "@/components/dashboard/navbar/NavButton.vue";
import { mapMutations } from "vuex";

export default Vue.extend({
  name: "navbar",
  components: {
    NavButton
  },
  props: {
    changeTab: Function
  },
  mounted() {
    this.filterButtons();
    this.onClickButton(0);
  },
  data() {
    return {
      buttons: [
        {
          icon: {
            on: "ico_redSucursales_ON.png",
            off: "ico_redSucursales_OFF.png"
          },
          tab: "branchTab",
          description: "Red de Sucursales",
          on: false,
          enable: true,
          position: 1
        },
        {
          icon: {
            on: "ico_clientesPerfilamiento_ON.png",
            off: "ico_clientesPerfilamiento_OFF.png"
          },
          tab: "clientTab",
          description: "Clientes / Perfilamiento",
          on: false,
          enable: true,
          position: 2
        },
        {
          icon: {
            on: "ico_Dispositivos_ON.png",
            off: "ico_Dispositivos_OFF.png"
          },
          tab: "deviceTab",
          description: "Dispositivos",
          on: false,
          enable: true,
          position: 3
        },
        {
          icon: {
            on: "ico_demografico_ON.png",
            off: "ico_demografico_OFF.png"
          },
          tab: "demographyTab",
          description: "Demografía",
          on: false,
          enable: true,
          position: 4
        },
        {
          icon: {
            on: "ico_filaVirtual_ON.png",
            off: "ico_filaVirtual_OFF.png"
          },
          tab: "queueTab",
          description: "Fila Virtual",
          on: false,
          enable: true,
          position: 5
        }
      ],
      enableButtons: new Array<any>()
    };
  },
  methods: {
    ...mapMutations(["changeTabDescription"]),
    onClickButton(index: number) {
      console.log("onClickButton", index);
      console.log("this.enableButtons[index].on", this.enableButtons[index].on);

      this.enableButtons.forEach(button => {
        button.on = false;
      });

      this.enableButtons[index].on = true;
      this.changeTab(this.enableButtons[index]);
      this.changeTabDescription(this.enableButtons[index].description);
    },
    filterButtons(): void {
      console.log("filterButtons");
      const enableButtonsArray: Array<object> = this.buttons.filter(button => {
        if (button.enable) return button;
      });
      enableButtonsArray.sort((a: any, b: any) => a.position - b.position);

      this.enableButtons = [...enableButtonsArray];
    }
  },
  computed: {}
});
</script>

<style lang="scss" scoped>
#navbar {
  grid-area: navigation;
  width: 100%;
  height: 100%;
  //border: 1px solid;
  background-color: lighten($base_color, 10%);
  overflow: auto;
}
</style>

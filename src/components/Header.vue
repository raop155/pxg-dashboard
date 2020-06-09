<template>
  <div id="header">
    <div id="header__content">
      <div v-if="state.status" id="header__leftside">
        <div id="header__title">
          <div id="title__company">{{companyName}}</div>
          <div id="title__description">// {{tabDescription}}</div>
        </div>
      </div>

      <div id="header__image">
        <img src="@/assets/pxg_logo.png" />
      </div>

      <div v-if="state.status" id="header__rightside">
        <div id="header__icon">
          <img height="20px" :src="require('@/assets/dashboard/ico_user.png')" />
        </div>
        <div id="header__user">{{state.name}} {{state.lastname}}</div>
        <div id="header__button">
          <button @click="onLogout">Log out</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
//import { mapGetters, mapActions } from "vuex";
//import { mapState, mapGetters } from "vuex";
import { mapGetters, mapMutations } from "vuex";

export default Vue.extend({
  name: "header-view",
  props: {
    name: String
  },
  methods: {
    ...mapMutations("auth", ["LOG_OUT"]),
    onLogout: function() {
      console.log("Logout success!");
      this.$toasted.success("Logout succeeded!");

      this.LOG_OUT();

      sessionStorage.clear();
      this.$router.push("/");
    }
  },
  computed: {
    ...mapGetters("config", ["CONF"]),
    ...mapGetters("auth", ["state"]),
    ...mapGetters(["tabDescription"]),
    companyName() {
      return sessionStorage.getItem("companyName");
    }
  }
});
</script>

<style lang="scss" scoped>
#header {
  grid-area: header;
  width: 100%;
  height: 100%;
  // border: 1px solid;
  background-color: lighten($base_color, 5%);
}

#header__content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    flex: 1;
    // text-align: center;
  }
}

#header__leftside {
  font-size: $default_size;
  padding-left: 15px;

  > * {
    &:not(:last-child) {
      margin-bottom: 5px;
    }
  }
}

#header__rightside {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: $default_size;
  padding-right: 15px;
  > * {
    &:not(:last-child) {
      margin-right: 5px;
    }
  }
}

#header__title {
  display: flex;
  align-items: center;

  > #title__company {
    color: white;
    font-size: $m_size;
  }
}

#header__user {
  display: flex;
  font-size: $s_size;
  text-align: end;
  justify-content: flex-end;
  align-items: center;

  > button {
    @include button();
    font-size: $xs_size;
    height: 100%;
    padding: 5px 5px;
  }
}

#header__button {
  > button {
    @include button();
    font-size: $xs_size;
    height: 100%;
    padding: 5px 5px;
  }
}

#header__image {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    height: 85%;
    //display: block;
    //margin: auto;
  }
}
</style>

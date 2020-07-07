<template>
  <div id="login">
    <div id="login__box">
      <div id="box__title">
        <h1>Welcome</h1>
      </div>

      <form id="box__form" @submit.prevent="onLogin">
        <label for="form__username">Username</label>
        <input type="text" placeholder v-model="username" id="form__username" />
        <div></div>
        <label for="form__password">Password</label>
        <input type="password" placeholder v-model="password" id="form__password" />
        <button type="submit">Log in</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import { mapMutations } from "vuex";

export default Vue.extend({
  name: "login",
  props: {
    test: String
  },
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    ...mapMutations("auth", ["LOG_IN"]),
    onLogin: function() {
      // console.log(this.username, this.password);
      if (this.username === "admin" && this.password === "admin") {
        console.log("Login success!");
        this.$toasted.success("Login succeeded!");

        this.LOG_IN({
          username: "raop155",
          name: "Ricardo",
          lastname: "Olarte Puell",
          status: true
        });

        sessionStorage.setItem("logged_in", "yes");
        this.$router.push("dashboard");
      } else {
        this.$toasted.error("Login failed!");
      }
    }
  },
  beforeCreate() {
    console.log("Nothing gets called before me!");
  },
  created() {
    /*asdasd*/
  }
});
</script>

<style lang="scss" scoped>
#login {
  grid-area: content;
  width: 100%;
  height: 100%;
}

#login__box {
  margin: 20px auto;
  width: 300px;

  margin: 0;
  position: relative;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);

  background-color: $primary_color;
  padding: 20px;
  border-radius: 5px;
}

#box__title {
  text-align: center;
  font-size: 1.25rem;
  color: $text_color;
  margin: 10px;
}

#box__form > * {
  margin-bottom: 7.5px;
}

#box__form {
  > label {
    display: block;
  }

  > input {
    @include input();
    width: 100%;
  }

  > button {
    @include button();
    height: 100%;
    width: 100%;
  }
}
</style>

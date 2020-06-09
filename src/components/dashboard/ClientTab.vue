<template>
  <div id="clientTab">
    <div id="cards">
      <div class="rectangle-container">
        <div class="container__icon">
          <img height="38.99" :src="require('@/assets/dashboard/ico_userRegister.png')" />
        </div>
        <div class="container__info">
          <div class="rectangle-container__description">Usuarios Registrados</div>
          <div class="rectangle-container__number">{{ countRegisterUsers }}</div>
        </div>
      </div>
      <div class="rectangle-container">
        <div class="container__icon">
          <img height="38.99" :src="require('@/assets/dashboard/ico_facial.png')" />
        </div>
        <div class="container__info">
          <div class="rectangle-container__description">Usuarios Registrados Facialmente</div>
          <div class="rectangle-container__number">{{ countFacialRecognitions }}</div>
        </div>
      </div>
      <div class="rectangle-container">
        <div class="container__icon">
          <img height="38.99" :src="require('@/assets/dashboard/ico_transaction.png')" />
        </div>
        <div class="container__info">
          <div class="rectangle-container__description">Transacciones</div>
          <div class="rectangle-container__number">{{ countTransactions }}</div>
        </div>
      </div>
      <div class="rectangle-container">
        <div class="container__icon">
          <img height="38.99" :src="require('@/assets/dashboard/ico_coffee.png')" />
        </div>
        <div class="container__info">
          <div class="rectangle-container__description">Solicitudes de Café</div>
          <div class="rectangle-container__number">{{ countCoffees }}</div>
        </div>
      </div>
    </div>

    <div id="lists">
      <div id="segment-list">
        <div class="list__title">Segmentos</div>
        <div class="square-container">
          <div class="container__icon">
            <img height="38.99" :src="require('@/assets/dashboard/ico_user.png')" />
          </div>
          <div class="container__info">
            <div class="info">
              <div class="square-container__description">Clientes</div>
              <div class="square-container__number">{{ countUsersBySegment.clients }}</div>
            </div>
            <div class="info">
              <div class="square-container__description">No Clientes</div>
              <div class="square-container__number">{{ countUsersBySegment.noClients }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "clientTab",
  props: {
    transactions: Array
  },
  computed: {
    countRegisterUsers(): any {
      if (this.transactions.length > 0) {
        return this.transactions.reduce((total: any, item: any) => {
          //console.log(item.recognition_type);
          const recognitionType: string = item.recognition_type;
          if (recognitionType.toUpperCase() === "NEW") {
            total = total + 1;
            console.log("item.recognition_type", total);
          }
          return total;
        }, 0);
      } else {
        return 0;
      }
    },
    countFacialRecognitions(): any {
      if (this.transactions.length > 0) {
        return this.transactions.reduce((total: any, item: any) => {
          // console.log(item.recognition_type);
          const recognitionType: string = item.recognition_type;
          if (recognitionType.toUpperCase() === "FACE") {
            total = total + 1;
            console.log("item.recognition_type", total);
          }
          return total;
        }, 0);
      } else {
        return 0;
      }
    },
    countTransactions(): any {
      return this.transactions.length;
    },
    countUsersBySegment(): any {
      if (this.transactions.length > 0) {
        return this.transactions.reduce(
          (total: any, item: any) => {
            // console.log(item.is_client);
            const isClient: string = item.is_client;

            if (
              isClient.toUpperCase() === "1" ||
              isClient.toUpperCase() === "SI"
            ) {
              total["clients"] = (total["clients"] || 0) + 1;
            } else {
              total["noClients"] = (total["noClients"] || 0) + 1;
            }
            return total;
          },
          { clients: 0, noClients: 0 }
        );
      } else {
        return { clients: 0, noClients: 0 };
      }
    },
    countCoffees(): any {
      if (this.transactions.length > 0) {
        return this.transactions.reduce((total: any, item: any) => {
          // console.log(item.additional_data);
          const json = JSON.parse(item.additional_data);
          if (json && json.coffee) {
            console.log(json.coffee);
            const coffee: string = json.coffee;
            if (coffee.toUpperCase() === "SI") {
              total = total + 1;
              console.log("json.coffee", total);
            }
          }
          return total;
        }, 0);
      } else {
        return 0;
      }
    }
  }
});
</script>

<style lang="scss" scoped>
#clientTab {
  grid-area: content;
  width: 100%;
  height: 100%;
  padding: 15px;
  overflow: auto;
}

#cards {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 25px;
  //height: 100%;

  > div {
    margin-bottom: 15px;
  }

  > div:not(:last-child) {
    margin-right: 15px;
  }
}

#lists {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 25px;
  //height: 100%;

  > div {
    margin-bottom: 15px;
  }

  > div:not(:last-child) {
    margin-right: 15px;
  }
}

#segment-list {
  height: 100%;
}

.list__title {
  margin-bottom: 15px;
}

.rectangle-container {
  display: inline-flex;
  justify-content: space-evenly;
  align-items: center;
  /* width: 250px;
  height: 75px; */
  height: 100%;
  background: lighten($base_color, 5%);
  border: 1px solid $primary_color;
  border-radius: 5px;
  box-shadow: 5px 5px 5px lighten(black, 10%);

  > div {
    padding: 15px;
  }

  &__description {
    color: darken($text_color, 25%);
    font-size: $s_size;
  }

  &__number {
    color: $text_color;
    font-size: $xl_size;
  }

  .container__icon,
  .container__info {
    display: inline-block;
  }
}

.square-container {
  display: inline-flex;
  justify-content: space-evenly;
  align-items: center;
  /* width: 250px;
  height: 75px; */
  height: 100%;
  background: lighten($base_color, 5%);
  border: 1px solid $primary_color;
  border-radius: 5px;
  box-shadow: 5px 5px 5px lighten(black, 10%);

  > div {
    padding: 15px;
  }

  &__description {
    color: darken($text_color, 25%);
    font-size: $s_size;
  }

  &__number {
    color: $text_color;
    font-size: $xl_size;
  }

  .container__icon,
  .container__info {
    display: inline-block;

    > div:not(:last-child) {
      margin-bottom: 10px;
    }
  }

  .container__info .info {
    display: flex;
    justify-content: space-between;
    align-items: center;

    > .square-container__number {
      margin-left: 15px;
    }
  }
}

.column {
  flex-direction: column;
}
</style>

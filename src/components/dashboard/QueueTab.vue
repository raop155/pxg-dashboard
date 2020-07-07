<template>
  <div id="queueTab">
    <div id="cards">
      <div class="rectangle-container">
        <div class="container__icon">
          <img height="38.99" :src="require('@/assets/dashboard/ico_transaction.png')" />
        </div>
        <div class="container__info">
          <div class="rectangle-container__description">Turnos</div>
          <div class="rectangle-container__number">{{countTurns}}</div>
        </div>
      </div>

      <div class="rectangle-container">
        <div class="container__icon">
          <img height="38.99" :src="require('@/assets/dashboard/ico_time.png')" />
        </div>
        <div class="container__info">
          <div class="rectangle-container__description">Tiempo Promedio de Espera</div>
          <div class="rectangle-container__number">{{averageWaitTime}} m</div>
        </div>
      </div>

      <div class="rectangle-container">
        <div class="container__icon">
          <img height="38.99" :src="require('@/assets/dashboard/ico_time.png')" />
        </div>
        <div class="container__info">
          <div class="rectangle-container__description">Tiempo Promedio de Atención</div>
          <div class="rectangle-container__number">{{averageAttentionTime}} m</div>
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
              <div class="square-container__number">{{countTurnsBySegment.clients}}</div>
            </div>
            <div class="info">
              <div class="square-container__description">No Clientes</div>
              <div class="square-container__number">{{countTurnsBySegment.noClients}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="executives">
      <div class="list__container">
        <div class="list__title">
          <div>Ejecutivos</div>
          <div class="list__search">
            Buscar:
            <input type="text" placeholder v-model.trim="executiveSearch" />
          </div>
        </div>
        <div id="executives-list">
          <div class="list__headers">
            <div>ID</div>
            <div>NOMBRES</div>
            <div>POSICIÓN</div>
            <div>ATENDIDOS</div>
            <div>ESTADO</div>
          </div>
          <div v-if="filteredExecutives.length > 0">
            <div
              v-for="executive in filteredExecutives"
              :key="executive.executive_id"
              class="list__item"
            >
              <div>{{ executive.executive_id }}</div>
              <div>{{ executive.name.toUpperCase() }} {{ executive.lastname.toUpperCase() }}</div>
              <div>{{ executive.position }}</div>
              <div class="item__number">{0}</div>
              <div>{Conectado}</div>
            </div>
          </div>
          <div v-else>
            <div class="list__item">
              <div>NO HAY EJECUTIVOS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";

export default Vue.extend({
  name: "queueTab",
  props: {
    turns: Array,
    executives: Array
  },
  data() {
    return {
      executiveSearch: ""
    };
  },
  computed: {
    countTurns(): number {
      return this.turns.length;
    },
    countTurnsBySegment(): any {
      if (this.turns.length > 0) {
        return this.turns.reduce(
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
    averageWaitTime(): string {
      if (this.turns.length > 0) {
        const dataArray: any = this.turns.filter((turn: any) => {
          if (turn.creation_time && turn.atention_time) return turn;
        });

        let totalMinutes = 0;

        dataArray.forEach((turn: any) => {
          const atentionTime = moment(turn.atention_time);
          const creationTime = moment(turn.creation_time);

          const duration = moment.duration(atentionTime.diff(creationTime));
          const minutes = duration.asMinutes();

          totalMinutes = totalMinutes + minutes;
        });

        return (totalMinutes / dataArray.length).toFixed(2);
      } else {
        return "0.00";
      }
    },
    averageAttentionTime(): string {
      if (this.turns.length > 0) {
        const dataArray: any = this.turns.filter((turn: any) => {
          if (turn.atention_time && turn.end_time) return turn;
        });

        let totalMinutes = 0;

        dataArray.forEach((turn: any) => {
          const endTime = moment(turn.end_time);
          const atentionTime = moment(turn.atention_time);

          const duration = moment.duration(endTime.diff(atentionTime));
          const minutes = duration.asMinutes();

          totalMinutes = totalMinutes + minutes;
        });

        return (totalMinutes / dataArray.length).toFixed(2);
      } else {
        return "0.00";
      }
    },
    filteredExecutives(): any {
      return this.executives.filter((executive: any) => {
        if (this.executiveSearch) {
          const search = this.executiveSearch.toUpperCase();

          if (
            executive.executive_id.toUpperCase().includes(search.toUpperCase()) ||
            executive.name.toUpperCase().includes(search.toUpperCase()) ||
            executive.lastname.toUpperCase().includes(search.toUpperCase()) ||
            executive.position.toUpperCase().includes(search.toUpperCase())
          ) {
            return executive;
          }
        } else {
          return executive;
        }
      });
    }
  }
});
</script>

<style lang="scss" scoped>
#queueTab {
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

  > .list__container {
    width: 100%;
    height: 100%;
  }
}

#segment-list {
  height: 100%;
}

#executives {
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

  > .list__container {
    width: 100%;
    height: 100%;

    > .list__title {
      display: flex;
      justify-content: space-between;
      align-items: center;

      > .list__search {
        // padding-right: 15px;
        > input {
          @include input();
          padding: 5px;
        }
      }
    }
  }
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

#executives-list {
  width: 100%;
  height: 100%;
  padding: 15px;
  border: 1.5px solid $primary_color;
  border-radius: 10px;

  .list__headers {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin-bottom: 15px;
    color: darken($text_color, 25%);
    font-size: $s_size;
    padding: 5px;

    > div {
      flex: 1;
      text-align: center;
    }
  }

  .list__item {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 5px;

    &:not(:last-child) {
      margin-bottom: 5px;
    }

    &:nth-child(odd) {
      background: $primary_color;
    }

    > div {
      flex: 1;
      text-align: center;
    }

    > .item__number {
      font-weight: bold;
    }
  }
}

.column {
  flex-direction: column;
}
</style>

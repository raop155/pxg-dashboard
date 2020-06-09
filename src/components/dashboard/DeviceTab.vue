<template>
  <div id="deviceTab">
    <div id="cards">
      <div class="rectangle-container">
        <div class="container__icon">
          <img height="38.99" :src="require('@/assets/dashboard/ico_transaction.png')" />
        </div>
        <div class="container__info">
          <div class="rectangle-container__description">Transacciones Promedio</div>
          <div class="rectangle-container__number">{{ averageTransactions }}</div>
        </div>
      </div>
      <div class="rectangle-container">
        <div class="container__icon">
          <img height="38.99" :src="require('@/assets/dashboard/ico_time.png')" />
        </div>
        <div class="container__info">
          <div class="rectangle-container__description">Tiempo Promedio de Sesión</div>
          <div class="rectangle-container__number">{{ averageSesionTime }} s</div>
        </div>
      </div>
    </div>

    <div id="lists">
      <div class="list__container">
        <div class="list__title">Dispositivos</div>
        <div id="devices-list">
          <div class="list__headers">
            <div>ID</div>
            <div>SUCURSAL</div>
            <div>VERSIÓN</div>
            <div>TRANSACCIONES</div>
            <!-- <div>TIEMPO PROMEDIO</div> -->
            <div>ACTIVO</div>
          </div>
          <div v-if="devices.length > 0">
            <div v-for="(device, index) in modifyDevices" :key="index" class="list__item">
              <div>{{ device.device_id }}</div>
              <div>{{ device.branchName }}</div>
              <div>{{ device.version }}</div>
              <div class="item__number">{{ device.countTransactions }}</div>
              <!-- <div class="item__number">0</div> -->
              <div :class="chechIfOnline(device.update_time)">
                {{
                moment
                .utc(device.update_time)
                .local()
                .locale('es')
                .fromNow()
                }}
              </div>
            </div>
          </div>
          <div v-else>
            <div class="list__item">
              <div>NO HAY DISPOSITIVOS</div>
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
  name: "deviceTab",
  props: {
    devices: Array,
    transactions: Array
  },
  data() {
    return {
      moment: moment
    };
  },
  methods: {
    chechIfOnline(updateTime: any): string {
      const now = moment(); //todays date
      const pastTime = moment.utc(updateTime).local();

      const duration = moment.duration(now.diff(pastTime));
      const minutes = duration.asMinutes();
      console.log("minutes", minutes);

      if (minutes <= 6) {
        return "online";
      } else if (minutes > 6 && minutes <= 31) {
        return "warning";
      } else {
        return "offline";
      }
    }
  },
  computed: {
    averageTransactions(): string {
      const reduceObject: any = this.transactions.reduce(
        (total: any, item: any) => {
          total[item.branch_id + "_" + item.device_id] =
            (total[item.branch_id + "_" + item.device_id] || 0) + 1;
          return total;
        },
        {}
      );

      // Convert to array
      let average = 0;
      let objectLength = 0;
      for (const key in reduceObject) {
        objectLength++;
        average = average + reduceObject[key];
      }
      if (objectLength > 0) return (average / objectLength).toFixed(2);
      else return "0.00";
    },
    averageSesionTime(): string {
      const sumSessionTime: any = this.transactions.reduce(
        (total: any, item: any) => {
          total = total + item.session_time;
          return total;
        },
        0
      );

      if (this.transactions.length > 0)
        return (sumSessionTime / this.transactions.length).toFixed(2);
      else return "0.00";
    },
    modifyDevices(): any {
      // Count transactions by branchName and device_id
      const devicesTransactionsObject: any = this.transactions.reduce(
        (total: any, item: any) => {
          total[item.branchName + "_" + item.device_id] =
            (total[item.branchName + "_" + item.device_id] || 0) + 1;
          return total;
        },
        {}
      );

      const cloneDevices = [...this.devices];
      cloneDevices.forEach((device: any) => {
        device.countTransactions = 0;
        if (
          devicesTransactionsObject[device.branchName + "_" + device.device_id]
        ) {
          device.countTransactions =
            devicesTransactionsObject[
              device.branchName + "_" + device.device_id
            ];
        }
      });

      return cloneDevices;
    }
  }
});
</script>

<style lang="scss" scoped>
#deviceTab {
  grid-area: content;
  width: 100%;
  height: 100%;
  padding: 15px;
  overflow: auto;
}

.online {
  color: $success_color;
}

.warning {
  color: $warning_color;
}

.offline {
  color: $error_color;
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

#lists {
  display: flex;
  // flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 25px;
  // padding: 0 15px;
  width: 100%;
  //height: 100%;

  > div:not(:last-child) {
    margin-right: 15px;
    margin-bottom: 15px;
  }

  > .list__container {
    width: 100%;
    height: 100%;
  }
}

.list__title {
  margin-bottom: 15px;
}

#devices-list {
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
</style>

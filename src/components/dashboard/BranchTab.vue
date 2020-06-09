<template>
  <div id="branchTab">
    <div id="cards">
      <div class="rectangle-container">
        <div class="container__icon">
          <img :src="require('@/assets/dashboard/ico_branch.png')" />
        </div>
        <div class="container__info">
          <div class="rectangle-container__description">Sucursales Registradas</div>
          <div class="rectangle-container__number">{{ countBranches }}</div>
        </div>
      </div>
    </div>

    <div id="lists">
      <div id="branches-list">
        <div class="list__headers">
          <div>SUCURSAL</div>
          <div>Total Registrados</div>
        </div>
        <div v-if="countUsersByBranch.length > 0">
          <div v-for="(branch, index) in countUsersByBranch" :key="index" class="list__item">
            <div>{{ branch.branchName }}</div>
            <div class="item__number">{{ branch.users }}</div>
          </div>
        </div>
        <div v-else>
          <div class="list__item">
            <div>NO HAY SUCURSALES</div>
          </div>
        </div>
      </div>
      <div id="affluence-list">
        <!-- <div class="list__title">
          <div>D-ONES</div>
        </div>-->
        <div id="affluence-list__high">
          <div class="list__headers">
            <img :src="require('@/assets/dashboard/ico_green_check.png')" />
            <div>SUCURSALES CON MAYOR AFLUENCIA</div>
          </div>
          <div v-if="countTransactionsByBranch.length > 0">
            <div
              v-for="(branch, index) in countTransactionsByBranch
                .slice(-3, 3)
                .reverse()"
              :key="index"
              class="list__item"
            >
              <div>{{ branch.branchName }}</div>
              <div class="item__number">
                <span>Transacciones:</span>
                {{ branch.transactions }}
              </div>
            </div>
          </div>
          <div v-else>
            <div class="list__item">NO HAY SUCURSALES</div>
          </div>
        </div>

        <div id="affluence-list__low">
          <div class="list__headers">
            <img :src="require('@/assets/dashboard/ico_red_error.png')" />
            <div>SUCURSALES CON MENOR AFLUENCIA</div>
          </div>
          <div v-if="countTransactionsByBranch.length > 0">
            <div
              v-for="(branch, index) in countTransactionsByBranch.slice(0, 3)"
              :key="index"
              class="list__item"
            >
              <div>{{ branch.branchName }}</div>
              <div class="item__number">
                <span>Transacciones:</span>
                {{ branch.transactions }}
              </div>
            </div>
          </div>
          <div v-else>
            <div class="list__item">NO HAY SUCURSALES</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "branchTab",
  props: {
    branches: Array,
    users: Array,
    transactions: Array
  },
  components: {},
  computed: {
    countBranches(): number {
      return this.branches.length;
    },
    countUsersByBranch(): any {
      // Count users by branch
      const reduceObject: any = this.users.reduce((total: any, item: any) => {
        total[item.branchName] = (total[item.branchName] || 0) + 1;
        return total;
      }, {});

      // Convert to array
      const array = [];
      for (const key in reduceObject) {
        //console.log(key, reduceObject[key]);
        array.push({
          branchName: key,
          users: reduceObject[key]
        });
      }

      // sort asc
      array.sort((a: any, b: any) => a.branchName.localeCompare(b.branchName));
      return array;
    },
    countTransactionsByBranch(): any {
      // Count users by branch
      const reduceObject: any = this.transactions.reduce(
        (total: any, item: any) => {
          total[item.branchName] = (total[item.branchName] || 0) + 1;
          return total;
        },
        {}
      );

      // Convert to array
      const array = [];
      for (const key in reduceObject) {
        //console.log(key, reduceObject[key]);
        array.push({
          branchName: key,
          transactions: reduceObject[key]
        });
      }

      // sort asc
      array.sort((a: any, b: any) => a.transactions - b.transactions);
      return array;
    }
  }
});
</script>

<style lang="scss" scoped>
#branchTab {
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
  //height: 100%;

  > div:not(:last-child) {
    margin-right: 15px;
    margin-bottom: 15px;
  }
}

#branches-list {
  width: 50%;
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

#affluence-list {
  width: 50%;
  height: 100%;
  padding: 15px 15px 0 15px;
  border: 1.5px solid $primary_color;
  border-radius: 10px;

  > div {
    margin-bottom: 15px;
  }

  .list__title {
    display: flex;
    // justify-content: center;
    align-items: center;
    color: $secondary_color;
    font-size: $default_size;
  }

  .list__headers {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin-bottom: 15px;
    color: darken($text_color, 25%);
    font-size: $s_size;

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

    span {
      color: $secondary_color;
      font-weight: 100;
      font-size: 1.3rem;
    }

    > .item__number {
      font-weight: bold;
    }
  }
}

#affluence-list__high {
  margin-bottom: 50px !important;
}
</style>

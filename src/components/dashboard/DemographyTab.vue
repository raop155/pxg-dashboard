<template>
  <div id="demography">
    <div id="cards" v-if="false">
      <div class="rectangle-container">
        <div class="container__icon">
          <img height="38.99" :src="require('@/assets/dashboard/ico_transaction.png')" />
        </div>
        <div class="container__info">
          <div class="rectangle-container__description">Transacciones</div>
          <div class="rectangle-container__number">{{ countTransactions }}</div>
        </div>
      </div>
    </div>

    <div id="lists">
      <div id="gender-list">
        <div class="list__title">Género</div>
        <div class="square-container">
          <div class="container__icon">
            <img height="38.99" :src="require('@/assets/dashboard/ico_user.png')" />
          </div>
          <div class="container__info">
            <div class="info">
              <div class="square-container__description">Hombres</div>
              <div class="square-container__number">{{ percentageGender.male }}%</div>
            </div>
            <div class="info">
              <div class="square-container__description">Mujeres</div>
              <div class="square-container__number">{{ percentageGender.female }}%</div>
            </div>
          </div>
        </div>
      </div>

      <div id="emotion-list">
        <div class="list__title">Emoción</div>
        <div class="square-container">
          <div class="container__icon">
            <img height="38.99" :src="require('@/assets/dashboard/ico_happy.png')" />
          </div>
          <div class="container__info">
            <div class="info">
              <div class="square-container__description">Feliz</div>
              <div class="square-container__number">{{ percentageEmotion.joy }}%</div>
            </div>
            <div class="info">
              <div class="square-container__description">Sorpresa</div>
              <div class="square-container__number">{{ percentageEmotion.surprise }}%</div>
            </div>
            <div class="info">
              <div class="square-container__description">Neutral</div>
              <div class="square-container__number">{{ percentageEmotion.neutral }}%</div>
            </div>
            <div class="info">
              <div class="square-container__description">Miedo</div>
              <div class="square-container__number">{{ percentageEmotion.fear }}%</div>
            </div>
            <div class="info">
              <div class="square-container__description">Disgusto</div>
              <div class="square-container__number">{{ percentageEmotion.disgust }}%</div>
            </div>
          </div>
        </div>
      </div>

      <div id="age-list">
        <div class="list__title">Edad</div>
        <div class="square-container">
          <div class="container__icon">
            <img height="38.99" :src="require('@/assets/dashboard/ico_user.png')" />
          </div>
          <div class="container__info">
            <div class="info">
              <div class="square-container__description">menor a 25</div>
              <div class="square-container__number">{{ percentageAge["-25"] }}%</div>
            </div>
            <div class="info">
              <div class="square-container__description">25 a 35</div>
              <div class="square-container__number">{{ percentageAge["25a35"] }}%</div>
            </div>
            <div class="info">
              <div class="square-container__description">36 a 50</div>
              <div class="square-container__number">{{ percentageAge[">35a50"] }}%</div>
            </div>
            <div class="info">
              <div class="square-container__description">mayor a 50</div>
              <div class="square-container__number">{{ percentageAge[">50"] }}%</div>
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
  name: "demographyTab",
  props: {
    transactions: Array
  },
  computed: {
    countTransactions(): any {
      return this.transactions.length;
    },
    percentageGender(): any {
      const genderCount: any = this.transactions.reduce(
        (total: any, item: any) => {
          console.log("item.user_gender", item.user_gender);
          if (item.user_gender) {
            if (item.user_gender.toUpperCase() === "MALE") {
              total["male"] = (total["male"] || 0) + 1;
            } else if (item.user_gender.toUpperCase() === "FEMALE") {
              total["female"] = (total["female"] || 0) + 1;
            }
          }
          return total;
        },
        { male: 0, female: 0 }
      );

      const total = genderCount.male + genderCount.female;
      const genderPercentage: any = {
        male: 0,
        female: 0
      };
      if (genderCount.male)
        genderPercentage["male"] = ((genderCount.male / total) * 100).toFixed(
          2
        );
      if (genderCount.female)
        genderPercentage["female"] = (
          (genderCount.female / total) *
          100
        ).toFixed(2);

      return genderPercentage;
    },
    percentageEmotion(): any {
      const emotionCount: any = this.transactions.reduce(
        (total: any, item: any) => {
          console.log("item.user_emotion", item.user_emotion);
          if (item.user_emotion) {
            if (item.user_emotion.toUpperCase() === "NEUTRAL") {
              total["neutral"] = (total["neutral"] || 0) + 1;
            } else if (item.user_emotion.toUpperCase() === "SURPRISE") {
              total["surprise"] = (total["surprise"] || 0) + 1;
            } else if (item.user_emotion.toUpperCase() === "JOY") {
              total["joy"] = (total["joy"] || 0) + 1;
            } else if (item.user_emotion.toUpperCase() === "DISGUST") {
              total["disgust"] = (total["disgust"] || 0) + 1;
            } else if (item.user_emotion.toUpperCase() === "FEAR") {
              total["fear"] = (total["fear"] || 0) + 1;
            }
          }
          return total;
        },
        { neutral: 0, surprise: 0, joy: 0, disgust: 0, fear: 0 }
      );

      const total =
        emotionCount.neutral +
        emotionCount.surprise +
        emotionCount.joy +
        emotionCount.disgust +
        emotionCount.fear;
      const emotionPercentage: any = {
        neutral: 0,
        surprise: 0,
        joy: 0,
        disgust: 0,
        fear: 0
      };
      if (emotionCount.neutral)
        emotionPercentage["neutral"] = (
          (emotionCount.neutral / total) *
          100
        ).toFixed(2);
      if (emotionCount.surprise)
        emotionPercentage["surprise"] = (
          (emotionCount.surprise / total) *
          100
        ).toFixed(2);
      if (emotionCount.joy)
        emotionPercentage["joy"] = ((emotionCount.joy / total) * 100).toFixed(
          2
        );
      if (emotionCount.disgust)
        emotionPercentage["disgust"] = (
          (emotionCount.disgust / total) *
          100
        ).toFixed(2);
      if (emotionCount.fear)
        emotionPercentage["fear"] = ((emotionCount.fear / total) * 100).toFixed(
          2
        );

      return emotionPercentage;
    },
    percentageAge(): any {
      const angeCount: any = this.transactions.reduce(
        (total: any, item: any) => {
          console.log("item.user_age", item.user_age);
          if (item.user_age) {
            if (item.user_age < 25) {
              total["-25"] = (total["-25"] || 0) + 1;
            } else if (item.user_age >= 25 && item.user_age <= 35) {
              total["25a35"] = (total["25a35"] || 0) + 1;
            } else if (item.user_age > 35 && item.user_age <= 50) {
              total[">35a50"] = (total[">35a50"] || 0) + 1;
            } else if (item.user_age > 50) {
              total[">50"] = (total[">50"] || 0) + 1;
            }
          }
          return total;
        },
        { "-25": 0, "25a35": 0, ">35a50": 0, ">50": 0 }
      );

      const total =
        angeCount["-25"] +
        angeCount["25a35"] +
        angeCount[">35a50"] +
        angeCount[">50"];
      const agePercentage: any = {
        "-25": 0,
        "25a35": 0,
        ">35a50": 0,
        ">50": 0
      };
      if (angeCount["-25"])
        agePercentage["-25"] = ((angeCount["-25"] / total) * 100).toFixed(2);
      if (angeCount["25a35"])
        agePercentage["25a35"] = ((angeCount["25a35"] / total) * 100).toFixed(
          2
        );
      if (angeCount[">35a50"])
        agePercentage[">35a50"] = ((angeCount[">35a50"] / total) * 100).toFixed(
          2
        );
      if (angeCount[">50"])
        agePercentage[">50"] = ((angeCount[">50"] / total) * 100).toFixed(2);

      return agePercentage;
    }
  }
});
</script>

<style lang="scss" scoped>
#demography {
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

#gender-list {
  height: 100%;
}

#emotion-list {
  height: 100%;
}

#age-list {
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

<template>
  <div id="filter-view">
    <div id="filter__region" v-if="disabled === false && getRegions.length > 0">
      <label class="filter__label" for="region__options">Región</label>
      <select
        name="region"
        id="region__options"
        v-model="regionFilter"
        @change="changeRegionFilter"
      >
        <option value>Todas</option>
        <option v-for="(region, index) in getRegions" :key="index" :value="region">{{ region }}</option>
      </select>
    </div>

    <div id="filter__branch" v-if="disabled === false && filteredBranches.length > 0">
      <label class="filter__label" for="branch__options">Sucursal</label>
      <select
        name="branch"
        id="branch__options"
        v-model="branchFilter"
        @change="changeBranchFilter"
      >
        <option value>Todas</option>
        <option
          v-for="branch in filteredBranches"
          :key="branch.branch_id"
          :value="branch.branch_id"
        >{{ branch.name }}</option>
      </select>
    </div>

    <div id="filter__period">
      <label class="filter__label" for="filters__buttons">Periodo</label>
      <div id="filters__buttons">
        <button
          :class="period === 'today' ? 'button--selected' : ''"
          name="today"
          @click="changePeriod"
        >Día</button>
        <button
          :class="period === 'week' ? 'button--selected' : ''"
          name="week"
          @click="changePeriod"
        >Semana</button>
        <button
          :class="period === 'month' ? 'button--selected' : ''"
          name="month"
          @click="changePeriod"
        >Mes</button>
        <button
          :class="period === 'trimester' ? 'button--selected' : ''"
          name="trimester"
          @click="changePeriod"
        >Trimestre</button>

        <!-- <button :disabled="disabled">Día</button>
        <button :disabled="disabled">Semana</button>
        <button :disabled="disabled">Mes</button>
        <button :disabled="disabled">Trimestre</button>-->
      </div>
    </div>
  </div>
</template>

<script lang>
import Vue from "vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  name: "filter-view",
  props: {
    disabled: Boolean,
    branches: Array,
    setFilter: Function,
    setFilterDates: Function,
    availableModules: String
  },
  data() {
    return {
      period: "today",
      currentPeriod: "today",
      regionFilter: "",
      subregionFilter: "",
      branchFilter: ""
    };
  },
  mounted() {
    //mounted
  },
  updated() {
    console.log("FilterView UPDATED");

    // Check if region exist in select[region]
    if (!this.getRegions.includes(this.regionFilter)) {
      this.setFilter("REGION", "");
      this.regionFilter = "";
    }

    // Check if branch exist in select[branch]
    if (
      !this.filteredBranches.some(branch => {
        if (
          branch.branch_id.toUpperCase() === this.branchFilter.toUpperCase()
        ) {
          return branch;
        }
      })
    ) {
      this.setFilter("BRANCH", "");
      this.branchFilter = "";
    }
  },
  methods: {
    changeRegionFilter(e) {
      const target = e.currentTarget;
      const value = target.value;
      console.log(value);

      this.regionFilter = value;
      this.subregionFilter = "";
      this.branchFilter = "";

      this.setFilter("REGION", value);
    },
    changeSubregionFilter(e) {
      const target = e.currentTarget;
      const value = target.value;
      console.log(value);

      this.branchFilter = "";
      this.setFilter("SUBREGION", value);
    },
    changeBranchFilter(e) {
      const target = e.currentTarget;
      const value = target.value;
      console.log(value);

      this.setFilter("BRANCH", value);
    },
    changePeriod(e) {
      const target = e.currentTarget;
      const name = target.name;
      console.log(name);

      const currentDate = new Date();
      const pastDate = new Date();
      if (name.toUpperCase() === "TODAY") {
        pastDate.setDate(pastDate.getDate() + 0);
        this.period = "today";
      } else if (name.toUpperCase() === "WEEK") {
        pastDate.setDate(pastDate.getDate() - 7);
        this.period = "week";
      } else if (name.toUpperCase() === "MONTH") {
        pastDate.setDate(pastDate.getDate() - 30);
        this.period = "month";
      } else if (name.toUpperCase() === "TRIMESTER") {
        pastDate.setDate(pastDate.getDate() - 90);
        this.period = "trimester";
      }

      if (this.currentPeriod === this.period) {
        // this.period = this.currentPeriod;
        return;
      }

      this.currentPeriod = this.period;

      console.log("pastDate", pastDate);
      console.log("currentDate", currentDate);

      // this.setFilterDates(currentDate, pastDate);
      this.setFilterDates(pastDate, currentDate);
    },
    addDays(date, days) {
      const copy = new Date(Number(date));
      copy.setDate(date.getDate() + days);
      return copy;
    }
  },
  computed: {
    ...mapGetters("auth", ["state"]),
    availableBranches() {
      return this.branches.filter(branch => {
        if (this.availableModules) {
          if (
            branch.modules
              .toUpperCase()
              .includes(this.availableModules.toUpperCase())
          ) {
            return branch;
          }
        } else {
          return branch;
        }
      });
    },
    filteredBranches() {
      return this.availableBranches
        .map(branch => {
          branch.name = branch.name
            .toLowerCase()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          return branch;
        })
        .filter(branch => {
          if (branch.region.toUpperCase() === this.regionFilter.toUpperCase()) {
            return branch;
          }
        })
        .sort((a, b) => a.name.localeCompare(b.name));
    },
    getRegions() {
      const regions = [
        ...new Set(
          this.availableBranches.map(branch => {
            return branch.region
              .toLowerCase()
              .split(" ")
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          })
        )
      ];

      return regions.sort();
    }
  }
});
</script>

<style lang="scss" scoped>
#filter-view {
  grid-area: filter;
  width: 100%;
  height: 100%;
  //border: 1px solid;
  background-color: lighten($base_color, 15%);

  display: flex;
  // flex-wrap: wrap;
  align-items: center;

  padding: 0 10px;

  > div {
    // margin-bottom: 5px;
  }

  > div:not(:last-child) {
    margin-right: 15px;
  }
}

select {
  @include select($bg-color: $base_color, $text-color: $text_color);

  font-size: $s_size;
  padding: 5px 10px;
}

.filter__label {
  display: block;
  font-size: $xs_size;
  margin-bottom: 5px;
}

#filters__buttons {
  display: flex;
  width: 100%;
  height: 100%;
  /* position: relative;
  right: 0; */
  text-align: right;
  padding-right: 15px;

  > button {
    @include button();
    font-size: $xs_size;
    height: 100%;
    padding: 5px 5px;

    // margin-bottom: 5px;

    &:not(:last-child) {
      margin-right: 5px;
    }
  }
  > .button--selected {
    background: $primary_color;
  }
}
</style>

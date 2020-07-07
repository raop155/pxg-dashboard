<template>
  <div id="dashboard">
    <vue-topprogress
      ref="topProgress"
      :color="progressBar.color"
      :trickle="progressBar.trickle"
      :trickleSpeed="progressBar.trickleSpeed"
    ></vue-topprogress>
    <Navbar :changeTab="changeTab" />
    <FilterView
      :disabled="checkIfDisabled"
      :branches="branches"
      :setFilter="setFilter"
      :setFilterDates="setFilterDates"
      :availableModules="availableModules"
    />
    <BranchTab
      v-show="showTab === 'branchTab'"
      :branches="branches"
      :users="users"
      :transactions="transactions"
    />
    <ClientTab v-show="showTab === 'clientTab'" :transactions="filteredTransactions" />
    <DeviceTab
      v-show="showTab === 'deviceTab'"
      :devices="filteredDevices"
      :transactions="filteredTransactions"
    />
    <DemographyTab v-show="showTab === 'demographyTab'" :transactions="filteredTransactions" />
    <QueueTab
      v-show="showTab === 'queueTab'"
      :turns="filteredTurns"
      :executives="filteredExecutives"
    />
  </div>
</template>

<script lang="">
import Vue from "vue";
import axios from "axios";
import { mapGetters } from "vuex";

import Navbar from "@/components/dashboard/Navbar.vue";
import FilterView from "@/components/dashboard/FilterView.vue";

import BranchTab from "@/components/dashboard/BranchTab.vue";
import ClientTab from "@/components/dashboard/ClientTab.vue";
import DeviceTab from "@/components/dashboard/DeviceTab.vue";
import DemographyTab from "@/components/dashboard/DemographyTab.vue";
import QueueTab from "@/components/dashboard/QueueTab.vue";

import { vueTopprogress } from "vue-top-progress";

export default Vue.extend({
  name: "dashboard",
  components: {
    vueTopprogress,
    Navbar,
    FilterView,
    BranchTab,
    ClientTab,
    DeviceTab,
    DemographyTab,
    QueueTab
  },
  props: {
    test: String
  },
  data() {
    return {
      progressBar: {
        color: "#c3996c",
        trickle: true,
        trickleSpeed: 500
      },
      getBranchesURL: "",
      getUsersURL: "",
      getTransactionsURL: "",
      getDevicesURL: "",
      getTurnsURL: "",
      getExecutivesURL: "",
      showTab: "",
      branches: [],
      users: [],
      transactions: [],
      devices: [],
      turns: [],
      executives: [],
      startDate: "",
      endDate: "",
      filterRegion: "",
      filterSubregion: "",
      filterBranch: "",
      apiCalls: 6,
      apiResponses: 0,
      tabDescription: "",
      availableModules: ""
    };
  },
  mounted() {
    //this.$refs.topProgress.start();
    //this.$refs.topProgress.pause();

    this.startDate = this.getCurrentDate();
    this.endDate = this.getCurrentDate();
    this.setURLs();
    this.getData();

    setInterval(() => {
      this.getData();
    }, 60000 * 5);
  },
  methods: {
    changeTab(navButton) {
      console.log("changeTab", navButton.tab, navButton.description);
      this.tabDescription = navButton.description;
      this.showTab = navButton.tab;

      if (this.showTab === "queueTab") {
        this.availableModules = "queue";
      } else {
        this.availableModules = "";
      }
    },
    setFilter(option, value) {
      if (option.toUpperCase() === "REGION") {
        this.filterRegion = value;
        this.filterSubregion = "";
        this.filterBranch = "";
        console.log("this.filterRegion", this.filterRegion);
      } else if (option.toUpperCase() === "SUBREGION") {
        this.filterSubregion = value;
        this.filterBranch = "";
        console.log("this.filterSubregion", this.filterSubregion);
      } else if (option.toUpperCase() === "BRANCH") {
        this.filterBranch = value;
        console.log("this.filterBranch", this.filterBranch);
      }
    },
    getCurrentDate() {
      const today = new Date();
      const date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      /* const time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const dateTime = date + " " + time; */
      return date;
    },
    setURLs() {
      // pxg_core
      this.getBranchesURL =
        this.config.server.core.domain +
        this.config.server.core.folder +
        "/php/statistics/getBranches.php";

      this.getUsersURL =
        this.config.server.core.domain +
        this.config.server.core.folder +
        "/php/statistics/getUsers.php";

      this.getTransactionsURL =
        this.config.server.core.domain +
        this.config.server.core.folder +
        "/php/statistics/getTransactions.php";

      this.getDevicesURL =
        this.config.server.core.domain +
        this.config.server.core.folder +
        "/php/statistics/getDevices.php";

      //pxgp_db_queue
      this.getTurnsURL =
        this.config.server.vq.domain +
        this.config.server.vq.folder +
        "/php/statistics/getTurns.php";

      this.getExecutivesURL =
        this.config.server.vq.domain +
        this.config.server.vq.folder +
        "/php/statistics/getExecutives.php";

      console.log(this.getBranchesURL);
      console.log(this.getUsersURL);
      console.log(this.getTransactionsURL);
      console.log(this.getDevicesURL);
      console.log(this.getTurnsURL);
      console.log(this.getExecutivesURL);
    },
    setFilterDates(startDate, endDate) {
      const stringStartDate =
        startDate.getFullYear() +
        "-" +
        (startDate.getMonth() + 1) +
        "-" +
        startDate.getDate();

      const stringEndDate =
        endDate.getFullYear() +
        "-" +
        (endDate.getMonth() + 1) +
        "-" +
        endDate.getDate();

      this.startDate = stringStartDate;
      this.endDate = stringEndDate;
      this.getData();
    },
    getData() {
      // Quatity of api calls
      this.apiResponses = 0;

      // Start Top Progress Bar
      // this.$refs.topProgress.set(0);
      if (this.$refs.topProgress) this.$refs.topProgress.done();
      this.$refs.topProgress.start();

      console.log("getData");
      console.log("startDate", this.startDate);
      console.log("endDate", this.endDate);

      const params = new FormData();
      params.append("start_date", this.startDate);
      params.append("end_date", this.endDate);
      /* params.append("start_date", "2020-2-29");
      params.append("end_date", "2020-5-29"); */

      axios
        .get(this.getBranchesURL)
        .then(response => {
          const status = response.data.status;
          const data = response.data.data;
          if (status.toUpperCase() === "SUCCESS") {
            this.branches = data;
            console.log("this.branches SUCCESS");
            console.log(this.branches);
          }

          this.apiResponses++;
          this.checkLoadData();
        })
        .catch(error => {
          console.log(error);
          this.apiResponses++;
          this.checkLoadData();
        });

      axios
        .get(this.getUsersURL)
        .then(response => {
          const status = response.data.status;
          const data = response.data.data;
          if (status.toUpperCase() === "SUCCESS") {
            this.users = data;
            console.log("this.users SUCCESS");
            console.log(this.users);
          }
          this.apiResponses++;
          this.checkLoadData();
        })
        .catch(error => {
          console.log(error);
          this.apiResponses++;
          this.checkLoadData();
        });

      axios
        .post(this.getTransactionsURL, params)
        .then(response => {
          const status = response.data.status;
          const data = response.data.data;
          console.log(response);
          if (status.toUpperCase() === "SUCCESS") {
            this.transactions = data;
            console.log("this.transactions SUCCESS");
            console.log(this.transactions);
          }
          this.apiResponses++;
          this.checkLoadData();
        })
        .catch(error => {
          console.log(error);
          this.apiResponses++;
          this.checkLoadData();
        });

      axios
        .get(this.getDevicesURL)
        .then(response => {
          const status = response.data.status;
          const data = response.data.data;
          if (status.toUpperCase() === "SUCCESS") {
            this.devices = data;
            console.log("this.devices SUCCESS");
            console.log(this.devices);
          }
          this.apiResponses++;
          this.checkLoadData();
        })
        .catch(error => {
          // Error 😨
          if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            console.log(error.request);
          } else {
            // Something happened in setting up the request and triggered an Error
            console.log("Error", error.message);
          }
          console.log(error.config);

          this.apiResponses++;
          this.checkLoadData();
        });

      axios
        .post(this.getTurnsURL, params)
        .then(response => {
          const status = response.data.status;
          const data = response.data.turns;
          console.log(response);
          if (status.toUpperCase() === "SUCCESS") {
            this.turns = data;
            console.log("this.turns SUCCESS");
            console.log(this.turns);
          }
          this.apiResponses++;
          this.checkLoadData();
        })
        .catch(error => {
          console.log(error);
          this.apiResponses++;
          this.checkLoadData();
        });

      axios
        .get(this.getExecutivesURL)
        .then(response => {
          const status = response.data.status;
          const data = response.data.executives;
          if (status.toUpperCase() === "SUCCESS") {
            this.executives = data;
            console.log("this.executives SUCCESS");
            console.log(this.executives);
          }

          this.apiResponses++;
          this.checkLoadData();
        })
        .catch(error => {
          console.log(error);
          this.apiResponses++;
          this.checkLoadData();
        });
    },
    checkLoadData() {
      if (this.apiResponses === this.apiCalls) this.$refs.topProgress.done();
    }
  },
  computed: {
    ...mapGetters(["config"]),
    checkIfDisabled() {
      console.log("checkIfDisabled");
      if (this.showTab === "branchTab") return true;
      return false;
    },
    filteredTransactions() {
      console.log("filteredTransactions", "filterBranch", this.filterBranch);
      return this.transactions.filter(item => {
        // Region - Branch
        const region = this.filterRegion.toUpperCase();
        // const subregion = this.filterSubregion.toUpperCase();
        const branch = this.filterBranch.toUpperCase();

        const iRegion = item["branchRegion"].toUpperCase();
        // const iSubregion = item["branchSubregion"].toUpperCase();
        const iBranch = item["branch_id"].toUpperCase();

        // Region - Branch
        if (region && branch) {
          if (iRegion === region && iBranch === branch) {
            console.log(item);
            return item;
          }
        } else if (region) {
          if (iRegion === region) {
            console.log(item);
            return item;
          }
        } else if (branch) {
          if (iBranch === branch) {
            console.log(item);
            return item;
          }
        } else {
          return item;
        }

        // Branch
        /*  if (this.filterBranch) {
          if (item["branch_id"].toUpperCase() === this.filterBranch.toUpperCase()) {
            console.log(item);
            return item;
          }
        } else {
          return item;
        } */
      });
    },
    filteredDevices() {
      return this.devices.filter(item => {
        // Region - Branch
        const region = this.filterRegion.toUpperCase();
        // const subregion = this.filterSubregion.toUpperCase();
        const branch = this.filterBranch.toUpperCase();

        const iRegion = item["branchRegion"].toUpperCase();
        // const iSubregion = item["branchSubregion"].toUpperCase();
        const iBranch = item["branch_id"].toUpperCase();

        // Region - Branch
        if (region && branch) {
          if (iRegion === region && iBranch === branch) {
            console.log(item);
            return item;
          }
        } else if (region) {
          if (iRegion === region) {
            console.log(item);
            return item;
          }
        } else if (branch) {
          if (iBranch === branch) {
            console.log(item);
            return item;
          }
        } else {
          return item;
        }

        // Branch
        /*  if (this.filterBranch) {
          if (item["branch_id"].toUpperCase() === this.filterBranch.toUpperCase()) {
            console.log(item);
            return item;
          }
        } else {
          return item;
        } */
      });
    },
    filteredTurns() {
      return this.turns.filter(item => {
        // Region - Branch
        const region = this.filterRegion.toUpperCase();
        // const subregion = this.filterSubregion.toUpperCase();
        const branch = this.filterBranch.toUpperCase();

        const iRegion = item["branchRegion"].toUpperCase();
        // const iSubregion = item["branchSubregion"].toUpperCase();
        const iBranch = item["branch_id"].toUpperCase();

        // Region - Branch
        if (region && branch) {
          if (iRegion === region && iBranch === branch) {
            console.log(item);
            return item;
          }
        } else if (region) {
          if (iRegion === region) {
            console.log(item);
            return item;
          }
        } else if (branch) {
          if (iBranch === branch) {
            console.log(item);
            return item;
          }
        } else {
          return item;
        }

        // Branch
        /*  if (this.filterBranch) {
          if (item["branch_id"].toUpperCase() === this.filterBranch.toUpperCase()) {
            console.log(item);
            return item;
          }
        } else {
          return item;
        } */
      });
    },
    filteredExecutives() {
      return this.executives.filter(item => {
        // Region - Branch
        const region = this.filterRegion.toUpperCase();
        // const subregion = this.filterSubregion.toUpperCase();
        const branch = this.filterBranch.toUpperCase();

        const iRegion = item["branchRegion"].toUpperCase();
        // const iSubregion = item["branchSubregion"].toUpperCase();
        const iBranch = item["branch_id"].toUpperCase();

        // Region - Branch
        if (region && branch) {
          if (iRegion === region && iBranch === branch) {
            console.log(item);
            return item;
          }
        } else if (region) {
          if (iRegion === region) {
            console.log(item);
            return item;
          }
        } else if (branch) {
          if (iBranch === branch) {
            console.log(item);
            return item;
          }
        } else {
          return item;
        }

        // Branch
        /*  if (this.filterBranch) {
          if (item["branch_id"].toUpperCase() === this.filterBranch.toUpperCase()) {
            console.log(item);
            return item;
          }
        } else {
          return item;
        } */
      });
    }
  }
});
</script>

<style lang="scss" scoped>
#dashboard {
  grid-area: content;
  width: 100%;
  height: 100%;
  min-height: 100%;

  display: grid;
  grid-template-columns: 100px auto;
  grid-template-rows: 75px auto;
  // align-items: stretch;

  grid-template-areas:
    "navigation filter"
    "navigation content";
}
</style>

<template>
  <v-app>
    <v-container>
      <div>
        <v-text-field
          v-model="serverURL"
          label="Enter Server URL"
          placeholder="eg: https://192.168.44.95:8443"
        ></v-text-field>
        <v-text-field
          v-model="token"
          label="Enter Token"
          placeholder="Token"
          type="password"
        ></v-text-field>
        <v-btn @click="fetchData" color="primary" elevation="2">Fetch</v-btn>
      </div>
      <v-progress-circular v-if="loading" indeterminate></v-progress-circular>
      <data-table
        v-if="!loading"
        :columns="columns"
        :headers="headers"
        @search-text="performSearch"
        @go-next="goNext"
        @go-previous="goPrevious"
      ></data-table>
    </v-container>
  </v-app>
</template>

<script>
import DataTable from "./components/DataTable.vue";

export default {
  name: "App",
  components: {
    DataTable,
  },
  data() {
    return {
      serverURL: "",
      token: "",
      headers: [
        { text: "Name", value: "label" },
        { text: "Table", value: "table.label" },
        { text: "Database", value: "database.label" },
        { text: "Schema", value: "schema.label" },
        { text: "Application", value: "application.label" },
      ],
      columns: [],
      offset: 0,
      limit: 15,
      loading: false,
      searchText: "",
      selectedCategory: "",
    };
  },
  methods: {
    async fetchData() {
      if (!this.serverURL || !this.token) {
        console.error("Server URL or Token is missing");
        return;
      }

      this.loading = true;
      let endpoint = `${this.serverURL}/api/v2.1/columns?offset=${this.offset}&limit=${this.limit}&sortBy=label&sortOrder=asc`;

      if (
        this.searchText &&
        this.selectedCategory &&
        this.selectedCategory !== "None"
      ) {
        this.filterExpression = `${this.selectedCategory.toLowerCase()} co '${encodeURIComponent(
          this.searchText
        )}'`;
        endpoint += `&filter=${encodeURIComponent(this.filterExpression)}`;
      }

      try {
        let response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        let columnsData = await response.json();
        if (columnsData && columnsData.columns) {
          this.columns = columnsData.columns;
          // console.log(this.columns)
        } else {
          console.warn("No columns data found in response");
          this.columns = [];
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },
    goNext() {
      this.offset += this.limit;
      this.fetchData();
    },
    goPrevious() {
      if (this.offset > 0) {
        this.offset -= this.limit;
        console.log("Offset: ", this.offset);
      }
      this.fetchData();
    },
    performSearch(search, selectedCategory) {
      console.log("searchText: ", search);
      console.log("selectedCategory: ", selectedCategory);
      this.searchText = search;
      this.selectedCategory = selectedCategory;
      this.fetchData();
    },
  },
};
</script>

<style>
.v-container {
  margin-top: 20px;
}
</style>

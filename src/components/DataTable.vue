<template>
  <div>
    <v-card style="padding: 20px">
      <v-card-title>
        Columns
        <v-spacer></v-spacer>
        <v-text-field
          label="Search"
          single-line
          hide-details
          v-model="search"
          auto-grow
          outlined
          rows="1"
          row-height="15"
          append-icon="mdi-magnify"
          @keypress.enter="fetchData"
        ></v-text-field>
      </v-card-title>
      <v-data-table
        v-if="loading"
        :headers="headers"
        :loading="loading"
        hide-default-footer
      ></v-data-table>
      <v-data-table
        v-else
        :headers="headers"
        :items="columns"
        :items-per-page="10"
        class="elevation-1"
        :loading="loading"
        hide-default-footer
        @update:sort-by="editSortBy"
        @update:sort-desc="editSortOrder"
      ></v-data-table>
      <v-card-actions>
        <v-btn
          :disabled="offset === 0"
          @click="previousPage"
          style="margin: 10px"
          >Previous</v-btn
        >
        <v-btn :disabled="columns.length < sum" @click="nextPage">Next</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "DataTable",
  data() {
    return {
      search: "",
      headers: [
        { text: "Name", value: "label" },
        { text: "Status", value: "profileStatus" },
        { text: "Tables", value: "table.label" },
        { text: "Schema", value: "schema.label" },
        { text: "Database", value: "database.label" },
        { text: "Application", value: "application.label" },
        { text: "Data Type", value: "sourceType" },
        { text: "Size", value: "size" },
        { text: "Order", value: "order" },
      ],
      rows: [
        "label",
        "profileStatus",
        "table.label",
        "schema.label",
        "database.label",
        "application.label",
        "sourceType",
        "size",
        "order",
      ],
      columns: [],
      token: "eef798271c0d6538732f31c1e34feae7f6b7e08892dd5159fbf70e8063ffd1c9",
      offset: 0,
      sum: 15,
      filter: "",
      loading: false,
      sortBy: "label",
      sortOrder: "asc",
    };
  },

  computed: {
    searchFilter: function () {
      return `(label co '${this.search}' or table co '${this.search}' or schema co '${this.search}' or database co '${this.search}' or application co '${this.search}' or sourceType co '${this.search}' or tagValue co '${this.search}')`;
    },
    apiUrl: function () {
      let baseUrl = `https://dq44107.globalids.com:8443/api/v2.1/columns?limit=15&sortOrder=${this.sortOrder}&sortBy=${this.sortBy}&token=eef798271c0d6538732f31c1e34feae7f6b7e08892dd5159fbf70e8063ffd1c9`;
      if (this.offset) {
        baseUrl = baseUrl + `&offset=${this.offset}`;
      }
      if (this.search) {
        baseUrl = baseUrl + `&filter=${this.searchFilter}`;
      }
      console.log("BaseURL: " + this.baseUrl);
      return baseUrl;
    },
  },
  methods: {
    iterateValue(obj, row) {
      var value = row.split(".");
      let obj1 = obj;

      value.forEach((e) => {
        obj1 = obj1[e];
      });
      return obj1;
    },

    async fetchData() {
      try {
        this.loading = true;
        const response = await fetch(this.apiUrl);
        let data = await response.json();
        // console.log("data: ", data);
        if (data.errorCode == 40402) {
          this.columns = [];
        } else {
          data = data.columns;
          this.columns = data;
        }

        console.log("Columns", this.columns);
      } catch (error) {
        console.log("error");
      } finally {
        this.loading = false;
      }
    },

    nextPage() {
      this.offset += this.sum;
      this.fetchData();
    },

    previousPage() {
      if (this.offset > 0) {
        this.offset -= this.sum;
        this.fetchData();
      }
    },
    editSortBy(sortValue) {
      if (this.sortValue.includes(".label")) {
        this.sortValue = sortValue.replace(".label", "");
      }
      this.sortBy = sortValue;
      this.fetchData();
    },
    editSortOrder() {
      this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
      this.fetchData();
    },
  },
  async mounted() {
    await this.fetchData();
  },
};
</script>

<template>
  <v-card>
    <v-card-title>
      Tables
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        @keypress.enter="fetchSearchedTables"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="tables"
      :no-data-text="errorMessage"
      :search="searchText"
      :hide-default-footer="true"
      @update:sort-by="updateSortBy"
      @update:sort-desc="updateSortOrder"
    ></v-data-table>
    <v-card-actions>
      <v-btn @click="previousPage" icon medium :disabled="offset === 0">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <v-btn @click="nextPage" icon medium :disabled="tables.length < limit">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: "Name", value: "label" },
        { text: "Schema", value: "schema.label" },
        { text: "Database", value: "database.label" },
        { text: "Application", value: "application.label" },
        { text: "Columns", value: "columnsTotal" },
        { text: "Records", value: "recordCount" },
        { text: "Profilable Columns", value: "columnsProfilable" },
        { text: "Profiled Columns", value: "columnsProfiled" },
      ],
      tables: [],
      offset: 0,
      limit: 15,
      filter: "",
      searchText: "",
      errorMessage: "",
      sortBy: "label",
      sortOrder: "asc",
    };
  },
  async mounted() {
    await this.fetchTables();
  },

  methods: {
    async fetchTables() {
      try {
        let url = `https://192.168.44.85:8443/api/v2.1/tables?offset=${this.offset}&limit=${this.limit}&sortOrder=${this.sortOrder}&sortBy=${this.sortBy}&token=457c64ac5f4808e4977572dbf75ee11590ec567ee99200aa818c8be1caa54f9d
        `;
        if (this.filter) {
          url += this.filter;
        }
        const response = await fetch(url);
        const tableData = await response.json();
        if (tableData.errorCode) {
          this.errorMessage = tableData.userMessage;
          this.tables = [];
        } else {
          this.tables = tableData.tables;
          this.errorMessage = "";
        }
      } catch (error) {
        console.error(error);
      }
    },
    async nextPage() {
      this.offset += this.limit;
      await this.fetchTables();
    },
    async previousPage() {
      this.offset -= this.limit;
      if (this.offset < 0) {
        this.offset = 0;
      }
      await this.fetchTables();
    },
    async fetchSearchedTables() {
      this.filter = `&filter=${`label co '${this.search}'`}`;
      await this.fetchTables();
    },
    updateSortBy(newSortBy) {
      if (newSortBy) {
        if (
          newSortBy === "schema.label" ||
          newSortBy === "database.label" ||
          newSortBy === "application.label"
        ) {
          this.sortBy = newSortBy.replace(".label", "");
        } else {
          this.sortBy = newSortBy;
        }
        this.sortOrder = "asc";
        this.fetchTables();
      }
    },
    updateSortOrder(isDesc) {
      this.sortOrder = isDesc ? "desc" : "asc";
      this.fetchTables();
    },
  },
};
</script>

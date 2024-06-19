<template>
  <v-app>
    <v-card>
      <v-card-title>
        <v-col class="d-flex" cols="12" sm="6">
          <v-select
            v-model="selectedCategory"
            :items="categories"
            label="Select Category"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
        <v-btn @click="performSearch" color="primary" elevation="2"
          >Search</v-btn
        >
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :search="search"
        :items-per-page="15"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Columns</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>
      </v-data-table>
      <v-card-actions>
        <div>
          <v-btn class="ma-2" color="orange-darken-2" @click="goPrevious">
            <v-icon>mdi-arrow-left</v-icon>
            Prev
          </v-btn>
        </div>
        <div>
          <v-btn class="ma-2" color="orange-darken-2" @click="goNext">
            Next
            <v-icon>mdi-arrow-right</v-icon>
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-app>
</template>
  
  <script>
export default {
  name: "DataTable",
  props: {
    columns: Array,
    headers: Array,
  },
  data() {
    return {
      search: "",
      selectedCategory: "None",
      categories: [
        "None",
        "Name",
        "Table",
        "Database",
        "Schema",
        "Application",
      ],
      //   offset: 0,
      //   limit: 15,
    };
  },
  computed: {
    filteredItems() {
      if (this.selectedCategory === "None" || !this.search) {
        console.log(this.columns);
        return this.columns;
      }
      return this.columns.filter((column) =>
        column[this.selectedCategory.toLowerCase()]
          ?.toLowerCase()
          .includes(this.search.toLowerCase())
      );
    },
  },
  methods: {
    goPrevious() {
      this.$emit("go-previous");
    },
    goNext() {
      this.$emit("go-next");
    },
    performSearch() {
      this.$emit("search-text", this.search, this.selectedCategory);
    },
  },
};
</script>
  
  <style scoped>
.v-data-table {
  width: 100%;
}
</style>
  
<template>
  <div style="margin: 20px">
    <v-card>
      <v-card-title>
        Columns
        <v-spacer></v-spacer>
        <v-text-field
          v-model="searchInput"
          append-icon="mdi-magnify"
          clearable
          label="Search"
          single-line
          hide-details
          @keyup.enter="onSearch"
          @click:clear="clearSearch"></v-text-field>
      </v-card-title>
      <v-data-table
        multi-sort
        :headers="headers"
        :items="items"
        hide-default-footer
        :loading="loading"
        loading-text="Loading....Please wait">
        <template v-slot:footer>
          <div class="footer">
            <v-btn
              icon
              :disabled="offset == 0 || loading"
              @click="previousPage">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn icon :disabled="!hasNext || loading" @click="nextPage">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "DataTable",
  data() {
    return {
      searchInput: "",
    };
  },
  props: {
    headers: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    hasNext: {
      type: Boolean,
      required: true,
    },
    offset: {
      type: Number,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    onSearch() {
      this.$emit("search-changed", this.searchInput);
    },
    clearSearch() {
      this.searchInput = "";
      this.onSearch();
    },
    previousPage() {
      this.$emit("previous-page");
    },
    nextPage() {
      this.$emit("next-page");
    },
  },
};
</script>

<template>
    <v-card>
      <v-card-title>
        Scanned Tables
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          @input="debounceSearch"
        ></v-text-field>
        <v-btn icon @click="refreshTableData">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="tables"
        :loading="loading"
        :items-per-page="limit"
        @update:options="updateOptions"
        :hide-default-footer="true"
      ></v-data-table>
      <div class="flex-row">
        <v-btn @click="prevTableData" :disabled="page <= 1">
          Previous
        </v-btn>
        <v-btn @click="nextTableData" :disabled="!hasNext">
          Next
        </v-btn>
      </div>
    </v-card>
  </template>
  
  <script>
  import debounce from 'lodash/debounce';

    export default {
    name: 'DataTable',
    data() {
        return {
        search: '',
        headers: [
            { text: 'Name', value: 'label', sortable: true },
            { text: 'Schema', value: 'schema.label', sortable: true },
            { text: 'Database', value: 'database.label', sortable: true },
            { text: 'Application', value: 'application.label', sortable: true },
            { text: 'Columns', value: 'columnsTotal', sortable: true },
            { text: 'Records', value: 'recordCount', sortable: true },
        ],
        tables: [],
        loading: true,
        page: 1,
        limit: 10,
        token: "0dde2ea03760ee3e6995a32d47db05c9f8138ae675a599c75d546ed6341e910a",
        ip: "https://dq44107.globalids.com:8443/api/v2.1/",
        hasNext: false,
        offset: 0,
        options: {
            sortBy: [],
            sortDesc: []
        },
        };
    },
    created() {
        this.debounceSearch = debounce(this.searchTableData, 300);
    },
    methods: {
        async fetchTableData() {
        try {
            this.loading = true;
            const { sortBy, sortDesc } = this.options;
            this.offset = (this.page - 1) * this.limit;
            const sortField = sortBy[0] || 'label';
            const sortOrder = sortDesc[0] ? 'desc' : 'asc';
            const res = await fetch(`${this.ip}tables?offset=${this.offset}&limit=${this.limit}&filter=%28%20label%20co%20%27${this.search}%27%20or%20database%20co%20%27${this.search}%27%20or%20schema%20co%20%27${this.search}%27%20or%20application%20co%20%27${this.search}%27%20or%20tagValue%20co%20%27${this.search}%27%20%29&sortBy=${sortField.split(".")[0]}&sortOrder=${sortOrder}&token=${this.token}`);
            const tableData = await res.json();
            this.tables = tableData.tables;
            this.hasNext = tableData._meta.hasNext;
            this.totalItems = tableData.totalCount;
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            this.loading = false;
        }
        },
        async prevTableData() {
        if (this.page > 1) {
            this.page--;
            await this.fetchTableData();
        }
        },
        async nextTableData() {
        if (this.hasNext) {
            this.page++;
            await this.fetchTableData();
        }
        },
        async searchTableData() {
        this.page = 1;
        await this.fetchTableData();
        },
        async refreshTableData() {
        this.search = '';
        this.page = 1;
        this.offset = 0;
        this.options = {
            sortBy: [],
            sortDesc: []
        };
        await this.fetchTableData();
        },
        async updateOptions(newOptions) {
        this.options = newOptions;
        await this.fetchTableData();
        }
    },
    async mounted() {
        await this.fetchTableData();
    },
    };
</script>

<style scoped>

.flex-row{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

</style>

<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <h3>My Table</h3>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row class="mt-2">
          <v-text-field class="mr-2" v-model="serverIp" label="Enter Server IP here" outlined clearable id="serverUrl">
          </v-text-field>
          <v-text-field v-model="token" label="Enter Bearer token here" outlined clearable id="apiToken"></v-text-field>
        </v-row>
        <v-row align="center" justify="space-around">
          <!-- <v-btn @click="ShowTable(showData)">{{ !showData ? "Fetch Data" : "Reset" }}</v-btn> demo data to show table-->
          <v-btn @click="GetTables()">{{ "Fetch Data" }}</v-btn>
        </v-row>
        <v-card class="mt-8">
          <v-card-title>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
              hide-details></v-text-field>
          </v-card-title>
          <MyTable :headers="headers" :items="tables" :search="search" />
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import MyTable from './components/MyTable';

export default {
  name: 'App',

  components: {
    MyTable,
  },
  data() {
    return {
      search: '',
      showData: false,
      serverIp: "",
      token: "",
      tables: [],
      headers: [
        {
          text: 'Name', align: 'start', value: 'label',
        },
        { text: 'Schema', value: 'schema.label' },
        { text: 'Database', value: 'database.label' },
        { text: 'Application', value: 'application.label' },
        { text: 'Tags', value: 'tagValues.label' },
        { text: 'Columns', value: 'columnsTotal' },
        { text: 'Records', value: 'columnsTotal' },
        { text: 'Profilable Columns', value: 'columnsTotal' },
        { text: 'Profiled Columns', value: 'columnsTotal' },
        { text: 'Classified Columns', value: 'columnsTotal' },
      ],
    }
  },
  methods: {
    ShowTable(v) {
      this.showData = !v
    },
    async GetTables() {
      console.log(this.token);
      console.log(this.serverIp);
      try {
        const response = await fetch(
          this.serverIp + '/api/v2.1/tables?limit=100&token=' + this.token
        );
        const tablesData = await response.json();
        this.tables = tablesData.tables;
        console.log(tablesData);
      } catch (error) {
        console.error(error);
      }

    }
  }
};



</script>

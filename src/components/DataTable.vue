<template>
  <v-card>
    <v-card-title>
      <h2>Tables</h2>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="searchText"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        @keyup.enter="search"
      ></v-text-field>
    <v-icon @click="refresh">mdi-refresh</v-icon>
    </v-card-title>
      <v-data-table v-if="load"
        :headers="headers"
        loading
        :loading-text="loadingText"
        :hide-default-footer="true"        
      ></v-data-table>
      <v-data-table v-else
        :headers="headers"
        :items="tables"
        :no-data-text="errorMessage"
        :hide-default-footer="true"     
        :show-select="true"
        :disable-sort="disableSort"
        @update:sort-desc="updateSortDesc"
        @update:sort-by="updateSortBy"
      ></v-data-table>
    <v-pagination
        v-model="page"
        :length="pages"
        :total-visible="0"
        @next="nextPage"
        @previous="previousPage"
    ></v-pagination>
  </v-card>
</template>
<script>
  export default {
    data () {
      return {
            headers: [
              { text: 'Name', align: 'start', value: 'label'},
              { text: 'Schema', value: 'schema' },
              { text: 'Database', value: 'database' },
              { text: 'Application', value: 'application' },
              { text: 'Columns', value: 'columnsTotal' },
              { text: 'Records', value: 'recordCount' },
              { text: 'Profilable Columns', value: 'columnsProfilable' },
              { text: 'Profiled Columns', value: 'columnsProfiled' },
              { text: 'Classified Columns', value: 'columnsClassified' },
            ],
            tables: [],
            page: 1,
            pages: 1,
            searchText: "",
            load: false,
            loadingText: "Loading... Please wait",
            sortBy: "label",
            sortDesc: "false",
            sortOrder: "asc",
            disableSort: false,
            offset: 0,
            limit: 10,
            hasNext: true,
            apiEndpoint: 'https://192.168.33.98:8443/api/v2.1/tables',
            token: '65637d4d742c4a0e4b49c08d4747e933cce9ef8518bc466093ef57b06f3b13a8',
            errorMessage: "",
      }
    },

    methods: {
      setNestedColumnsLabel(tables) {
          var nestedColumnsHeader = ['schema', 'database', 'application'];

          tables.forEach(table => {
              nestedColumnsHeader.forEach(columnHeader => {
                  table[columnHeader] = table[columnHeader]['label'];
              });
          });
      },

      updateSortBy(sortBy) {
        if(this.tables.length>0 && sortBy){
          this.sortBy=sortBy;
          this.sortOrder="asc";
          this.fetchTables(); 
        }
      },

      updateSortDesc() {
        if(this.tables.length>0){
          this.sortOrder="desc";
          this.fetchTables(); 
        }
      },

      async refresh() {
          this.offset=0;
          this.searchText="";
          this.filter="";
          this.sortBy="label";
          this.sortOrder="asc";
          this.page=1;
          this.sortDesc="false";
          this.disableSort=false;
          await this.fetchTables();
          this.pages=this.hasNext?2:1;
        },               

      async nextPage() {
        this.offset+=10;
        await this.fetchTables();
        if(this.hasNext && this.page==this.pages){
          this.pages++;
        }
      },

      async previousPage() {
          this.offset-=10;
          await this.fetchTables();     
      },

      async search() {
        this.searchText=this.searchText.trim();
        this.offset=0;
        await this.fetchTables();
        this.pages=this.hasNext?2:1;
        this.page=1;
      },

      postErrorHandling(){
        if(this.searchText){
            this.errorMessage=this.searchText.length<256?`No results found for "${this.searchText}"`:`Please input a valid text of less than 256 characters`;
        } else {
          if(!this.errorMessage) {
            this.errorMessage=`Something went wrong, please refresh`;
          }
        }
        this.tables=[];
        this.pages=1;
        this.page=1;
        this.disableSort=true;
        this.hasNext=false;
        this.offset=0;
        this.limit=10;
      },

      isValidParameters(){
        var validParams = this.apiEndpoint!="" && this.offset>=0 && this.limit>0 && this.sortBy!="" && this.sortOrder!="" && this.token!="";
        if(this.searchText){
          validParams =  this.searchText.length<256;
        } 
        return validParams;
      },

      async fetchTables() {
        if(this.isValidParameters()){
          try {
            this.load = true;
            var url=`${this.apiEndpoint}?offset=${this.offset}&limit=${this.limit}&sortBy=${this.sortBy}&sortOrder=${this.sortOrder}&token=${this.token}`;
            if(this.searchText){
                url+=`&filter=( label co '${this.searchText}' or database co '${this.searchText}' or schema co '${this.searchText}' or application co '${this.searchText}' )`;
            }
            var response = await fetch(`${url}`);
            if(response.status=='200'){
                const tableData = await response.json();
                this.tables = tableData.tables;
                this.hasNext=tableData._meta.hasNext;
                this.setNestedColumnsLabel(this.tables);
                this.errorMessage='';
                this.disableSort=false;
            } else {
                var errorResponse = await response.json();
                this.errorMessage = errorResponse.userMessage;
                this.postErrorHandling();
            }
          } catch (error) {
              console.error(error);
          } finally {
              this.load = false;
          }
        } else {
          this.postErrorHandling();
        }
      },
    },
    
    async mounted() {
        await this.fetchTables();
        this.pages=this.hasNext?2:1;
        this.page=1;
    }
  }
</script>

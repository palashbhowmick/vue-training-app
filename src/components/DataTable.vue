<template>
    <v-card>
        <v-card-title>
            <h2>GlobalIDs Table Columns Data</h2>
            <v-spacer></v-spacer>
            <v-text-field v-model="filter" label="Search" @keyup.enter="search"></v-text-field>
            <v-icon @click="reset">mdi-refresh</v-icon>
        </v-card-title>
        <v-data-table v-if="loading" :headers="headers" loadinging loadinging-text="Loadinging..."
            :hide-default-footer="true"></v-data-table>
        <v-data-table v-else :headers="headers" :items="columns" :no-data-text="errorMessage" :hide-default-footer="true"
            :show-select="true" @update:sort-desc="updateSortDesc" @update:sort-by="updateSortBy"></v-data-table>
        <v-pagination v-model="page" total-visible="0" @next="next" :length="nextPage" @previous="back"></v-pagination>
    </v-card>
</template>
<script>
export default {
    data() {
        return {
            headers: [
                { text: 'Name', value: 'label' },
                { text: 'Table', value: 'table' },
                { text: 'Schema', value: 'schema' },
                { text: 'Database', value: 'database' },
                { text: 'Application', value: 'application' },
            ],
            columns: [],
            offset: 0,
            limit: 10,
            sortBy: "",
            sortDesc: false,
            filter: "",
            loading: false,
            page: 1,
            nextPage: 1,
            hasNext: false
        }
    },

    methods: {

        async fetchData() {
            let url = `https://192.168.44.95:8443/api/v2.1/columns`;

            url += `?offset=${this.offset}&limit=${this.limit}`;

            const token = 'eb736f3feb05e99f4f6d8a61443464bb26c289736d7ec639d95642c8da92b307';

            try {
                if (this.sortBy != "" && this.sortBy != undefined) {
                    let order = this.sortDesc ? "desc" : "asc"
                    url += `&sortBy=${this.sortBy}&sortOrder=${order}`;
                }

                if (this.filter) {
                    url += `&filter=( label co '${this.filter}' or database co '${this.filter}' or schema co '${this.filter}' or application co '${this.filter}' )`;
                }

                let response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();

                console.log("data: ", data)

                this.columns = this.getFormattedData(data.columns);

                this.hasNext = data._meta.hasNext;

                this.loading = true;

            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        getFormattedData(columns) {
            let array = [];

            columns.forEach(column => {

                let colObj = {};
                
                colObj["label"] = column?.label;
                colObj["table"] = column?.table?.label;
                colObj["schema"] = column.schema?.label;
                colObj["database"] = column.database?.label;
                colObj["application"] = column.application?.label;

                array.push(colObj);
            })
            return array;
        },

        updateSortBy(sortBy) {
            console.log("sortBy: ", sortBy);
            this.sortBy = sortBy;
            this.fetchData();
        },

        updateSortDesc(sortDesc) {
            console.log("sortDesc: ", sortDesc);
            this.sortDesc = sortDesc;
            this.fetchData();
        },

        async reset() {

            this.offset = 0;
            this.filter = "";
            this.sortBy = "label";
            this.page = 1;
            this.sortDesc = "false";
            this.disableSort = false;

            await this.fetchData();

            this.nextPage = this.hasNext ? 2 : 1;
        },

        async next() {
            this.offset += 10;
            await this.fetchData();
            if (this.hasNext && this.page == this.nextPage) {
                this.nextPage++;
            }
        },

        async back() {
            this.offset -= 10;
            await this.fetchData();
        },

        async search() {
            this.filter = this.filter.trim();
            this.offset = 0;
            await this.fetchData();
            this.nextPage = this.hasNext ? 2 : 1;
            this.page = 1;
        }

    },

    async mounted() {
        await this.fetchData();
        this.nextPage = this.hasNext ? 2 : 1;
        this.page = 1;
    }

}

</script>
  
<template>
  <v-dialog
    v-model="dialog"
    height="500"
  >
    <!--    <template v-slot:activator="{ on }">-->
    <!--      <v-btn-->
    <!--        color="red lighten-2"-->
    <!--        dark-->
    <!--        v-on="on"-->
    <!--      >-->
    <!--        Click Me-->
    <!--      </v-btn>-->
    <!--    </template>-->

    <v-card>
      <v-card-title
        class="headline grey lighten-2"
        primary-title
      >
        상품선택
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="searchSubmit">
          <v-row>
            <v-col cols="12" md="2">
              <v-select :items="searchKeys" v-model="searchKey" label="검색분류" placeholder="검색분류 선택">
              </v-select>
            </v-col>
            <v-col cols="12" md="10">
              <v-text-field v-model="searchKeyword" label="검색어" placeholder="상품명 또는 상품코드로 검색">
                <v-btn type="submit" text slot="append" color="green">
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </v-text-field>
            </v-col>

            <v-col cols="12" md="12">
              <v-data-table
                show-select
                :single-select="false"
                v-model="selected"
                :items="products"
                item-key="product_id"
                :headers="productTableHeader"
                :server-items-length="totalCount"
                :options.sync="options"
                :footer-props="{'items-per-page-options':[3, 4, 5, -1]}"
              >
                <template v-slot:item.thumb_image="{value}">
                  <v-img width="70" :src="value || ''"></v-img>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          text
          @click="selectProduct"
        >
          선택
        </v-btn>
        <v-btn
          color="primary"
          text
          @click="closeDialog"
        >
          닫기
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
    export default {
        name: "DialogProductSelect",
        props: ['dialog'],
        data() {
            return {
                selectedProducts: [],
                searchKey: 'product_name',
                searchKeys: [{
                    text: '상품명',
                    value: 'product_name',
                }, {
                    text: '상품코드',
                    value: 'product_id',
                }],
                searchKeyword: '',
                selected: [],
                products: [],
                productTableHeader: [{
                    text: '',
                    value: 'thumb_image',
                    width: 90
                }, {
                    text: '상품명',
                    value: 'name'
                }],
                options: {
                    page: 1,
                    itemsPerPage: 3
                },
                totalCount: 0,
            }
        },
        watch: {
            options: {
                async handler(newVal) {
                    this.search({
                        page: newVal.page,
                        pageLimit: newVal.itemsPerPage
                    });
                },
                deep: true
            }
        },
        async mounted() {
            let response = await this.$store.dispatch('product/getAll', {});

            if (response.error) {
                return alert(response.msg);
            }

            this.products = response.data.data;
        },
        methods: {
            closeDialog() {
                this.$emit('closeDialog', 'dialogProductSelect');
                this.reset();
            },
            selectProduct() {
                this.$emit('selectProduct', this.selected);
                this.$emit('closeDialog', 'dialogProductSelect');
            },
            async searchSubmit() {
                await this.search();
            },
            async search(queries) {
                const searchQuery = {};

                if (this.searchKey && this.searchKeyword) {
                    searchQuery[this.searchKey] = this.searchKeyword
                }

                const response = await this.$store.dispatch('product/getAll', {
                    ...queries,
                    ...searchQuery,
                    page: this.options.page,
                    pageLimit: this.options.itemsPerPage
                });

                this.products = response.data.data;
                this.pagination = response.data.pagination;
                this.totalCount = response.data.pagination.totalCount;
            },
            reset() {
                this.selectedProducts = [];
                this.searchKey = 'product_name';
                this.searchKeys = [{
                    text: '상품명',
                    value: 'product_name',
                }, {
                    text: '상품코드',
                    value: 'product_id',
                }];
                this.searchKeyword = '';
                this.selected = [];
                this.products = [];
                this.productTableHeader = [{
                    text: '',
                    value: 'thumb_image',
                    width: 90
                }, {
                    text: '상품명',
                    value: 'name'
                }];
                this.options = {
                    page: 1,
                    itemsPerPage: 3
                };
                this.totalCount = 0;
            }
        }
    }
</script>

<style scoped>

</style>

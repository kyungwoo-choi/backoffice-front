<template>
  <v-card flat>
    <!--    <v-card-title class="headline">-->
    <!--      회원목록-->
    <!--    </v-card-title>-->
    <v-card-text>
      <div class="title">검색</div>
      <v-form @submit.prevent="searchSubmit">
        <v-row>
          <v-col cols="12" md="2">
            <v-select
              v-model="filter.status"
              placeholder="판매상태 선택"
              outlined
              dense
              :items="statusItems"
              label="판매상태">
            </v-select>
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="filter.stock_status"
              placeholder="재고여부 선택"
              outlined
              dense
              :items="stockOutItems"
              label="재고여부">
            </v-select>
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="filter.brand_id"
              placeholder="브랜드 선택"
              outlined
              dense
              :items="brandList"
              :item-text="'brand_name'"
              :item-value="'brand_id'"
              label="브랜드">
            </v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="2">
            <v-select :items="searchKeys" v-model="searchKey" label="필터선택" placeholder="선택"></v-select>
          </v-col>
          <v-col cols="12" md="10">
            <v-text-field v-model="filter.searchKeyword" label="검색어" placeholder="검색어 입력"></v-text-field>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-btn cols="12" md="3" width="100px" outlined type="submit">
            검색
          </v-btn>
        </v-row>
      </v-form>
      <v-row>
        <v-spacer></v-spacer>
        <v-btn to="/products/create" class="ma-2" outlined color="green">
          상품등록
        </v-btn>
      </v-row>
      <v-divider></v-divider>
      <v-data-table
        :headers="headers"
        :items="products"
        :server-items-length="totalCount"
        :options.sync="options"
        :footer-props="{'items-per-page-options':[30, 50, 100, -1]}"
      >
        <template v-slot:item.thumb_image="{value}">
          <v-img width="70" :src="value || ''"></v-img>
        </template>
        <template v-slot:item.product_id="{value}">
          <router-link :to="`/products/${value}`">
            {{value}}
          </router-link>
        </template>
        <template v-slot:item.brand_name="{value, item}">
          <router-link :to="`/brands/${item.brand_id}`">
            {{value}}
          </router-link>
        </template>
        <template v-slot:item.store_name="{value, item}">
          <router-link :to="`/stores/${item.store_id}`">
            {{value}}
          </router-link>
        </template>
        <template v-slot:item.name="{value, item}">
          <router-link :to="`/products/${item.product_id}`">
            {{value}}
          </router-link>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn text>
            판매종료
            <v-icon
              small
              @click="deleteProduct(item)"
              right
            >
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
    export default {
        name: "index",
        async fetch({store, query}) {
            try {
                const response = await store.dispatch('product/getAll', query);

                if (response.data.error) {
                    throw response.data.msg;
                }

                return {
                    products: response.data.data,
                    pagination: response.data.pagination,
                    totalCount: response.data.pagination.totalCount
                }
            } catch (e) {
                console.error(e);

                return {
                    products: []
                };
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
        async created() {
            console.log(this.$route.query);
            let response = await this.$store.dispatch('brand/getAll');

            this.brandList = response.data.data;
        },
        data() {
            return {
                products: [],
                searchKeyword: '',
                options: {
                    page: 1,
                    itemsPerPage: 30
                },
                totalCount: 0,
                headers: [{
                    text: '이미지',
                    value: "thumb_image",
                    width: 70
                }, {
                    text: '상품코드',
                    value: "product_id"
                }, {
                    text: '입점사명',
                    value: "store_name"
                }, {
                    text: '상품명',
                    value: "name"
                }, {
                    text: '브랜드명',
                    value: "brand_name"
                }, {
                    text: '카테고리명',
                    value: "category_name"
                }, {
                    text: '가격',
                    value: "cost"
                }, {
                    text: '판매상태',
                    value: "status"
                }, {
                    text: '위시리스트 수',
                    value: "wish_count"
                }, {
                    text: '제품생성일시',
                    value: "created_at"
                }, {
                    text: '',
                    value: "actions"
                }],
                status: '',
                statusItems: [{
                    text: '대기',
                    value: 'ready'
                }, {
                    text: '판매중',
                    value: 'sale'
                }, {
                    text: '판매중지',
                    value: 'pending'
                }],
                stockOutItems: [{
                    text: '재고품절',
                    value: '1'
                }, {
                    text: '재고있음',
                    value: '2'
                }],
                brandList: [],
                filter: {
                    status: '',
                    brand_id: '',
                    stock_status: ''
                },
                searchKey: '',
                searchKeys: [{
                    text: '상품명',
                    value: 'product_name',
                }, {
                    text: '상품코드',
                    value: 'product_id',
                }]
            }
        },
        methods: {
            deleteProduct(item) {
                if (confirm('상품을 판매종료 하시겠습니까?')) {
                    this.$store.dispatch('product/')
                }
            },
            async searchSubmit() {
                await this.search();
            },
            async search(queries) {
                const searchQuery = {};

                if (this.searchKey && this.filter.searchKeyword) {
                    searchQuery[this.searchKey] = this.filter.searchKeyword
                }

                for (const filterKey in this.filter) {
                    if (!this.filter[filterKey]) {
                        continue;
                    }
                    searchQuery[filterKey] = this.filter[filterKey];
                }

                const response = await this.$store.dispatch('product/getAll', {
                    ...this.$route.query,
                    ...queries,
                    ...searchQuery,
                    page: this.options.page,
                    pageLimit: this.options.itemsPerPage
                });

                this.products = response.data.data;
                this.pagination = response.data.pagination;
                this.totalCount = response.data.pagination.totalCount;
            }
        }
    }
</script>

<style scoped>

</style>


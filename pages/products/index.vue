<template>
  <v-card flat>
    <!--    <v-card-title class="headline">-->
    <!--      회원목록-->
    <!--    </v-card-title>-->
    <v-card-text>
      <div class="title">검색</div>
      <v-form>
        <v-row align="start">
          <v-col cols="12" md="6">
            <v-combobox
              v-model="select"
              :items="items"
              label="브랜드"
              multiple
              chips
              clearable
              dense
            >
              <template v-slot:selection="{ attrs, item, parent, selected }">
                <v-chip
                  v-if="item === Object(item)"
                  v-bind="attrs"
                  :input-value="selected"
                  label
                  small
                >
                  <span class="pr-2">
                    {{ item.text }}
                  </span>
                  <v-icon
                    small
                    @click="parent.selectItem(item)"
                  >mdi-close
                  </v-icon>
                </v-chip>
              </template>
            </v-combobox>
          </v-col>
          <v-col cols="12" md="6">
            <v-combobox
              v-model="select"
              :items="items"
              label="입점사"
              multiple
              chips
              clearable
              dense
            >
              <template v-slot:selection="{ attrs, item, parent, selected }">
                <v-chip
                  v-if="item === Object(item)"
                  v-bind="attrs"
                  :color="`${item.color} lighten-3`"
                  :input-value="selected"
                  label
                  small
                >
                  <span class="pr-2">
                    {{ item.text }}
                  </span>
                  <v-icon
                    small
                    @click="parent.selectItem(item)"
                  >mdi-close
                  </v-icon>
                </v-chip>
              </template>
            </v-combobox>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="2">
            <v-select
              outlined
              dense
              :items="statusItems"
              label="판매상태">
            </v-select>
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              outlined
              dense
              :items="statusItems"
              label="재고여부">
            </v-select>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
            <v-btn cols="12" md="3" width="100px" outlined>
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
          <v-img width="70" :src="value"></v-img>
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
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
    export default {
        name: "index",
        async asyncData({store}) {
            try {
                const response = await store.dispatch('product/getAll');

                if (response.data.error) {
                    throw response.data.msg;
                }

                return {
                    products: response.data.data,
                    pagination: response.data.pagination
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
                    const response = await this.$store.dispatch('product/getAll', {
                        page: newVal.page,
                        pageLimit: newVal.itemsPerPage
                    });

                    this.products = response.data.data;
                    this.totalCount = response.data.pagination.totalCount;
                },
                deep: true
            }
        },
        data() {
            return {
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
                }],
                statusItems: [{
                    text: '대기',
                    value: 'ready'
                }, {
                    text: '판매중',
                    value: 'sell'
                }, {
                    text: '판매중지',
                    value: 'stop'
                }],
                stockOutItems: [{
                    text: '재고있음',
                    value: '1'
                }, {
                    text: '재고없음',
                    value: '2'
                }],
                select: [],
                items: [{
                    text: '브랜드1',
                    value: 1
                }, {
                    text: '브랜드2',
                    value: 2
                }, {
                    text: '브랜드3',
                    value: 3
                }]
            }
        }
    }
</script>

<style scoped>

</style>


<template>
  <v-card flat>
    <!--    <v-card-title class="headline">-->
    <!--      회원목록-->
    <!--    </v-card-title>-->
    <v-card-text>
      <div class="title">검색</div>
      <v-form>
        <v-row align="start">
        </v-row>
      </v-form>
      <v-divider></v-divider>
      <v-data-table
        :headers="headers"
        :items="promotions"
        :server-items-length="totalCount"
        :options.sync="options"
        :footer-props="{'items-per-page-options':[30, 50, 100, -1]}"
      >
<!--        <template v-slot:item.name="{value, item}">-->
<!--          <router-link :to="`/products/${item.product_id}`">-->
<!--            {{value}}-->
<!--          </router-link>-->
<!--        </template>-->
        <template v-slot:item.actions="{ item }">
          <v-btn text>
            프로모션 종료
            <v-icon
              small
              @click="deletePromotion(item)"
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
        async asyncData({store}) {
            try {
                const response = await store.dispatch('promotion/getAll');

                if (response.data.error) {
                    throw response.data.msg;
                }
                console.log(response.data.data);
                return {
                    promotions: response.data.data,
                    pagination: response.data.pagination
                }
            } catch (e) {
                console.error(e);

                return {
                    promotions: []
                };
            }
        },
        watch: {
            options: {
                async handler(newVal) {
                    const response = await this.$store.dispatch('promotion/getAll', {
                        page: newVal.page,
                        pageLimit: newVal.itemsPerPage
                    });

                    this.promotions = response.data.data;
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
                    text: '프로모션 코드',
                    value: "promotion_code"
                }, {
                    text: '프로모션 명',
                    value: "promotion_name"
                }, {
                    text: '프로모션 유형',
                    value: "discount_type"
                }, {
                    text: '할인액',
                    value: "discount"
                }, {
                    text: '만료날짜',
                    value: "expiration_date"
                }, {
                    text: '상태',
                    value: "status"
                }, {
                    text: '',
                    value: "actions",
                    width: 50
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
                }]
            }
        },
        methods: {
            deletePromotion() {
            }
        }
    }
</script>

<style scoped>

</style>


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
        :items="orders"
        :server-items-length="totalCount"
        :options.sync="options"
        :footer-props="{'items-per-page-options':[30, 50, 100, -1]}"
      >
        <template v-slot:item.order_id="{value, item}">
          <router-link :to="`/orders/${item.order_id}`">
            {{value}}
          </router-link>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
    export default {
        name: "OrderList",
        async asyncData({store}) {
            try {
                const response = await store.dispatch('order/getAll');

                if (response.data.error) {
                    throw response.data.msg;
                }
                console.log(response.data.data);
                return {
                    orders: response.data.data,
                    pagination: response.data.pagination
                }
            } catch (e) {
                console.error(e);

                return {
                    orders: []
                };
            }
        },
        watch: {
            options: {
                async handler(newVal) {
                    console.log('handler');
                    const response = await this.$store.dispatch('order/getAll', {
                        page: newVal.page,
                        pageLimit: newVal.itemsPerPage
                    });

                    this.orders = response.data.data;
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
                    text: '주문코드',
                    value: "order_id"
                }, {
                    text: '주문자명',
                    value: "orderer_name"
                }, {
                    text: '주문자 핸드폰',
                    value: "orderer_mobile"
                }, {
                    text: '주문자 이메일',
                    value: "orderer_email"
                }, {
                    text: '주문금액',
                    value: "amount"
                }, {
                    text: '주문상태',
                    value: "order_status"
                }, {
                    text: '주문날짜',
                    value: "created_at"
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
        methods: {}
    }
</script>

<style scoped>

</style>

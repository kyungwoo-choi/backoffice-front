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
        :items="payments"
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
        name: "PaymentList",
        async asyncData({store}) {
            try {
                const response = await store.dispatch('payment/getAll');

                if (response.data.error) {
                    throw response.data.msg;
                }
                console.log(response.data.data);
                return {
                    payments: response.data.data,
                    pagination: response.data.pagination
                }
            } catch (e) {
                console.error(e);

                return {
                    payments: []
                };
            }
        },
        watch: {
            options: {
                async handler(newVal) {
                    const response = await this.$store.dispatch('payment/getAll', {
                        page: newVal.page,
                        pageLimit: newVal.itemsPerPage
                    });

                    this.payments = response.data.data;
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
                    text: '결제번호',
                    value: "payment_idx"
                }, {
                    text: '주문코드',
                    value: "order_id"
                }, {
                    text: '결제수단',
                    value: "pay_method"
                }, {
                    text: '결제금액',
                    value: "paid_amount"
                }, {
                    text: '결제일자',
                    value: "paid_at"
                }, {
                    text: '결제상태',
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

        }
    }
</script>

<style scoped>

</style>


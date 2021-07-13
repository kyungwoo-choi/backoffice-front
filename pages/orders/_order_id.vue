<template>
  <v-card flat>
    <v-card-text>
      <div class="title">
        주문 상세
      </div>
      <v-row>
        <v-col cols="12" md="12">
          <div class="subtitle-1">주문번호: {{order.order_id}}</div>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field v-model="order.orderer_name" label="주문자명"></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field v-model="order.orderer_mobile" label="주문자 핸드폰번호"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field v-model="order.orderer_email" label="주문자 이메일"></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="2">
          <v-text-field v-model="order.postal_code" label="우편번호"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field v-model="order.address" label="기본주소"></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field v-model="order.address_detail" label="상세주소"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4">
          <div class="subtitle-1"><span>총 주문금액: </span><span class="font-weight-bold">{{order.amount}}</span></div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-btn-toggle v-model="order.order_status" tile >
            <v-btn value="ordered">
              주문완료
            </v-btn>
            <v-btn value="paid">
              결제완료
            </v-btn>
            <v-btn value="cancelled">
              주문취소
            </v-btn>
            <v-btn value="approved">
              상품확인(상품수령/구매확정)
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
    export default {
        name: "OrderDetail",
        data() {
            return {
                order: {}
            }
        },
        async created() {
            try {
                await this.fetch();
            } catch (e) {
                console.error(e)
            }
        },
        methods: {
            async fetch() {
                let response = await this.$store.dispatch('order/getDetail', this.$route.params.order_id);

                if (response.data.error) {
                    alert(response.data.msg);
                    return this.$router.back();
                }

                this.order = response.data.data;
            }
        }
    }
</script>

<style scoped>

</style>

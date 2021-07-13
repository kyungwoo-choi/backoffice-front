<template>
  <v-card flat>
    <v-card-text>
<!--      <div class="title">검색</div>-->
      <v-form>
        <v-row align="start">
        </v-row>
      </v-form>
      <v-divider></v-divider>
      {{inquiries}}
      <v-data-table
        :headers="headers"
        :items="inquiries"
        :server-items-length="totalCount"
        :options.sync="options"
        :footer-props="{'items-per-page-options':[30, 50, 100, -1]}"
      >
<!--        <template v-slot:item.order_id="{value, item}">-->
<!--          <router-link :to="`/cs/product_inquiries/${item.product_inquiry_idx}`">-->
<!--            {{value}}-->
<!--          </router-link>-->
<!--        </template>-->
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
    export default {
        name: "UserInquiries",
        async asyncData({store}) {
            try {
                const response = await store.dispatch('cs/fetchProductInquiries');

                if (response.data.error) {
                    throw response.data.msg;
                }

                return {
                    inquiries: response.data.data,
                    pagination: response.data.pagination
                }
            } catch (e) {
                console.error(e);

                return {
                    inquiries: []
                };
            }
        },
        watch: {
            options: {
                async handler(newVal) {
                    const response = await this.$store.dispatch('cs/fetchProductInquiries', {
                        page: newVal.page,
                        pageLimit: newVal.itemsPerPage
                    });

                    this.inquiries = response.data.data;
                    this.totalCount = response.data.pagination.totalCount;
                },
                deep: true
            }
        },
        data() {
            return {
                inquiries: [],
                options: {
                    page: 1,
                    itemsPerPage: 30
                },
                totalCount: 0,
                headers: [{
                    text: '문의번호',
                    value: "product_inquiry_idx"
                }, {
                    text: '문의상품코드',
                    value: "product_id"
                }, {
                    text: '사용자코드',
                    value: "user_id"
                }, {
                    text: '문의제목',
                    value: "product_inquiry_title"
                }, {
                    text: '문의시간',
                    value: "created_at"
                }, {
                    text: '답변시간',
                    value: "product_inquiry_reply_at"
                }]
            }
        }
    }
</script>

<style scoped>

</style>

<template>
  <v-row>
    <!--    <v-col cols="12" md="12">-->
    <!--      <v-toolbar short tile>-->
    <!--        <v-toolbar-title>Title</v-toolbar-title>-->

    <!--        <v-spacer></v-spacer>-->

    <!--        <v-btn icon>-->
    <!--          <v-icon>mdi-magnify</v-icon>-->
    <!--        </v-btn>-->

    <!--        <v-btn icon>-->
    <!--          <v-icon>mdi-heart</v-icon>-->
    <!--        </v-btn>-->

    <!--        <v-btn icon>-->
    <!--          <v-icon>mdi-dots-vertical</v-icon>-->
    <!--        </v-btn>-->
    <!--      </v-toolbar>-->
    <!--    </v-col>-->
    <v-col cols="12" md="2">
      <v-card flat>
        <v-card-title>
          회원그룹
        </v-card-title>
        <v-card-text>
          <v-list dense>
            <v-list-item-group color="primary">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>전체 사용자</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>그룹없음</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>일반 사용자</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>VIP</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>VVIP</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn block text>
            회원그룹추가
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" md="10">
      <v-card flat>
        <!--    <v-card-title class="headline">-->
        <!--      회원목록-->
        <!--    </v-card-title>-->
        <v-card-text>
          <form name="form-user-keyword-search" @submit.prevent="search">
            <v-row>
              <v-col cols="12" md="2">
                <v-select :items="searchKeys" v-model="searchKey"></v-select>
              </v-col>
              <v-col cols="12" md="9">
                <v-text-field label="검색" v-model="searchKeyword">
                  <v-icon slot="prepend" color="red">mdi-magnify</v-icon>
                </v-text-field>
              </v-col>
              <v-col cols="12" md="1">
                <v-btn type="submit">검색</v-btn>
              </v-col>
            </v-row>
          </form>

          <v-data-table
            :headers="headers"
            :items="users"
            :server-items-length="totalCount"
            :options.sync="options"
            :footer-props="{'items-per-page-options':[30, 50, 100, -1]}"
          >
            <template v-slot:item.email="{item, value}">
              <router-link :to="`/users/${item.user_id}`">
                {{value}}
              </router-link>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
    export default {
        name: "UserList",
        async asyncData({store, query}) {
            try {
                const response = await store.dispatch('user/getAll', query);

                if (response.data.error) {
                    throw response.data.msg;
                }

                return {
                    users: response.data.data,
                    pagination: response.data.pagination
                }
            } catch (e) {
                console.error(e);
                alert(e.message);

                return {
                    users: []
                };
            }
        },
        created() {
          console.log(this.$route.query);
        },
        watch: {
            options: {
                async handler(newVal) {
                    const response = await this.$store.dispatch('user/getAll', {
                        page: newVal.page,
                        pageLimit: newVal.itemsPerPage,
                        ...this.$route.query
                    });

                    this.users = response.data.data;
                    this.totalCount = response.data.pagination.totalCount;
                },
                deep: true
            }
        },
        watchQuery: true,
        data() {
            return {
                // 'user_name': 'name',
                // 'mobile': 'phone_number',
                // 'email': 'email',
                // 'status': 'status',
                // 'user_code': 'user_id'
                searchKeys: [{
                    text: '이메일',
                    value: 'email'
                }, {
                    text: '닉네임',
                    value: 'user_nickname'
                }, {
                    text: '전화번호',
                    value: 'mobile'
                }],
                searchKey: '',
                options: {
                    page: this.$route.query.page || 1,
                    itemsPerPage: this.$route.query.pageLimit || 30
                },
                totalCount: 0,
                headers: [{
                    text: '닉네임',
                    value: 'nickname'
                }, {
                    text: '이메일',
                    value: 'email'
                }, {
                    text: '가입 SNS',
                    value: 'sns'
                }, {
                    text: '휴대폰',
                    value: 'phone_number'
                }, {
                    text: '회원상태',
                    value: 'status'
                }, {
                    text: '회원 활성 날짜',
                    value: 'active_date'
                }, {
                    text: '가입날짜',
                    value: 'created_at'
                }],
                searchKeyword: ''
            }
        },
        methods: {
            search() {
                console.log('search');
                const searchKeyword = this.searchKeyword;
                console.log(searchKeyword);
                let query = this.$route.query;
                console.log(2);
                query[this.searchKey] = searchKeyword;

                console.log(3);
                const response = this.$store.dispatch('user/getAll', {
                    ...this.$route.query
                });
                console.log(response);

                this.users = response.data.data;
                this.pagination = response.data.pagination;
                this.$router.push({
                    query: {
                        ...query
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>

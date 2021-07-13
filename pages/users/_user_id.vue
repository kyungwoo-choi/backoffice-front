<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-card class="mb-12">
        <v-card-title>
          회원정보
        </v-card-title>
        <v-card-text>
          <v-text-field label="닉네임" v-model="userData.nickname">
          </v-text-field>

          <v-text-field label="이메일" v-model="userData.email">
          </v-text-field>

          <v-text-field label="휴대폰번호" v-model="userData.phone_number">
          </v-text-field>

          <v-btn outlined @click="passwordChanging = true">
            비밀번호 변경
          </v-btn>

          <v-text-field v-show="passwordChanging" label="비밀번호 입력(비밀번호 변경시에만 입력)" type="password">
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text right>저장</v-btn>
        </v-card-actions>
      </v-card>
      <v-card>
        <v-card-title>
          관리자메모
        </v-card-title>
        <v-card-text>
          <v-textarea
            flat
            label="메모입력(최대500자)"
            v-model="userData.memo"
          ></v-textarea>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text right>저장</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <v-card>
        <v-card-title>
          활동정보
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <p>가입일</p>
              <p>2020-04-13 13:36</p>
            </v-col>
            <v-col cols="12" md="4">
              <p>로그인</p>
              <p>2020-04-13 13:36(1회)</p>
            </v-col>
            <v-col cols="12" md="4">
              <p>최종 로그인 IP</p>
              <p>125.179.198.64</p>
            </v-col>
          </v-row>
          <v-row>
            <!--            <p class="bolder">작성</p>-->
            <v-col cols="12" md="12" class="pb-0">
              <div class="font-weight-bold">작성</div>
            </v-col>
            <v-col cols="12" md="4">
              <p>상품리뷰</p>
              <p>
                <router-link :to="`/users/${$route.params.user_id}/product-reviews`">
                  4개
                </router-link>
              </p>
            </v-col>
            <v-col cols="12" md="4">
              <p>상품문의</p>
              <p>
                <router-link :to="`/users/${$route.params.user_id}/product-inquiries`">
                  3개
                </router-link>
              </p>
            </v-col>
            <v-col cols="12" md="4">
              <p>1:1문의</p>
              <p>
                <router-link :to="`/users/${$route.params.user_id}/user-inquiries`">
                  12개
                </router-link>
              </p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
    export default {
        name: "UserInfo",
        async asyncData({store, params}) {
            let response;
            response = await store.dispatch('user/getDetail', params.user_id);

            console.log(response);
            return {
                userData: response.data.data
            }
        },
        data() {
            return {
                passwordChanging: false,
                changePassword: '',
                userData: null
            }
        }
    }
</script>

<style scoped>

</style>

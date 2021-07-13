<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-list dense>
        <template v-for="item in items">
          <v-row
            v-if="item.heading"
            :key="item.heading"
            align="center"
          >
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col
              cols="6"
              class="text-center"
            >
              <a
                href="#!"
                class="body-2 black--text"
              >EDIT</a>
            </v-col>
          </v-row>
          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon=""
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              link
              :to="child.link"
            >
              <v-list-item-action>
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            :key="item.text"
            link
            :to="item.link"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="darken-3"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-4"
      >
        <span class="hidden-sm-and-down">Admin</span>
      </v-toolbar-title>
      <v-spacer/>
      <v-btn icon>
        <v-icon>mdi-apps</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content style="background-color:#eee;">
      <v-container
        fluid
      >
        <!--        <v-row-->
        <!--          align="center"-->
        <!--          justify="center"-->
        <!--        >-->
        <nuxt/>
        <!--        </v-row>-->
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
    export default {
        data() {
            return {
                dialog: false,
                drawer: null,
                items: [{
                    icon: 'mdi-home',
                    text: '메인',
                    link: '/'
                }, {
                    // icon: 'mdi-account',
                    text: '회원관리',
                    link: '/users',
                    icon: 'mdi-account',
                    'icon-alt': 'mdi-account',
                    children: [{
                        icon: '',
                        text: '회원목록',
                        link: '/users'
                    },{
                        icon: '',
                        text: '메일보내기',
                        link: '/mail'
                    }]
                }, {
                    // icon: 'mdi-format-list-bulleted',
                    text: '상품관리',
                    link: '/products',
                    icon: 'mdi-format-list-bulleted',
                    'icon-alt': 'mdi-format-list-bulleted',
                    children: [{
                        icon: '',
                        text: '상품목록',
                        link: '/products/list'
                    }, {
                        icon: '',
                        text: '상품등록',
                        link: '/products/create'
                    }, {
                        icon: '',
                        text: '카테고리 관리',
                        link: '/categories'
                    }]
                }, {
                    // icon: 'mdi-ticket-percent',
                    icon: 'mdi-ticket-percent',
                    'icon-alt': 'mdi-ticket-percent',
                    text: '프로모션관리',
                    link: '/promotions',
                    children: [{
                        icon: '',
                        text: '프로모션 코드 목록',
                        link: '/promotions/list'
                    }, {
                        icon: '',
                        text: '프로모션 코드 등록',
                        link: '/promotions/create'
                    }]
                }, {
                    // icon: 'mdi-newspaper-variant-outline',
                    icon: 'mdi-newspaper-variant-outline',
                    'icon-alt': 'mdi-newspaper-variant-outline',
                    text: '주문관리',
                    link: '/orders',
                    children: [{
                        icon: '',
                        text: '주문 목록',
                        link: '/orders/list'
                    }]
                }, {
                    icon: 'mdi-credit-card-multiple-outline',
                    'icon-alt': 'mdi-credit-card-multiple-outline',
                    text: '결제정보관리',
                    link: '/payments',
                    children: [{
                        icon: '',
                        text: '결제 목록',
                        link: '/payments/list'
                    },
                        //     {
                        //     icon: '',
                        //     text: '프로모션 등록',
                        //     link: '/promotions/create'
                        // }
                    ]
                }, {
                    icon: 'mdi-phone-classic',
                    'icon-alt': 'mdi-phone-classic',
                    text: '고객상담',
                    link: '/cs',
                    children: [{
                        icon: '',
                        text: '유저문의목록',
                        link: '/cs/user_inquiries'
                    }, {
                        icon: '',
                        text: '상품문의목록',
                        link: '/cs/product_inquiries'
                    }]
                }, {
                    icon: 'mdi-storefront-outline',
                    'icon-alt': 'mdi-storefront-outline',
                    text: '입점관리',
                    link: '/stores',
                    children: [{
                        icon: '',
                        text: '입점목록',
                        link: '/stores'
                    }, {
                        icon: '',
                        text: '입점등록',
                        link: '/stores/create'
                    }]
                }]
            }
        }
    }
</script>

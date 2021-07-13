<template>
  <v-card flat>

    <v-card-title>
      <div class="title">프로모션 생성</div>
      <v-spacer></v-spacer>
      <v-btn text @click="createPromotion">
        저장
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="promotionCode" placeholder="미입력시 랜덤으로 생성됩니다." label="프르모션 코드"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="promotionName" placeholder="프로모션 이름 입력" label="프로모션 이름"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="3">
            <v-select
              v-model="promotionType"
              :items="promotionTypeList"
              label="프로모션 유형"
              placeholder="유형선택"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field v-model="discount" placeholder="할인율은 1~99까지 입력 가능합니다." label="할인율/할인금액"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="2">
            <v-menu
              ref="datePicker"
              v-model="showDatePicker"
              :close-on-content-click="false"
              :return-value.sync="expirationDate"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="expirationDate"
                  label="만료일자"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="expirationDate" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="showDatePicker = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.datePicker.save(expirationDate)">OK</v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" md="2">
            <v-menu
              ref="timePicker"
              v-model="showTimePicker"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="expirationTime"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="expirationTime"
                  label="만료시간"
                  prepend-icon="mdi-clock-outline"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="showTimePicker"
                v-model="expirationTime"
                full-width
                @click:minute="$refs.timePicker.save(expirationTime)"
              ></v-time-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-radio-group v-model="status" row>
              <v-radio
                v-for="(promotionStatus, index) of promotionStatusList"
                :key="index"
                :label="promotionStatus.label"
                :value="promotionStatus.value">
              </v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-checkbox label="알림발송" class="mx-2" v-model="sendAlarm"></v-checkbox>
            <v-checkbox label="프로모션 시작시 알림발송" class="mx-2" v-model="alarmPromotionStart"></v-checkbox>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-select label="프로모션 대상" placeholder="대상선택" v-model="promotionTargetType" :items="targetItems"></v-select>
          </v-col>
          <template v-if="promotionTargetType === 'product'">
            <v-col cols="12" md="4">
              <v-btn @click="dialogProductSelect = true">
                프로모션 적용 상품 선택
              </v-btn>
            </v-col>
            <v-col cols="12" md="12">
              <v-data-table
                :items="promotionTarget.product"
                :headers="headerProductTargetTable"
              >
                <template v-slot:item.thumb_image="{value}">
                  <v-img width="70" :src="value || ''"></v-img>
                </template>
                <template v-slot:item.usable="{value, item}">
                  <v-select :items="headerUsableSelect" v-model="item.usable">
                  </v-select>
                </template>
                <template v-slot:item.actions="{value, item}">
                  <v-btn text @click="deleteProductTarget(item)">
                    <v-icon>
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </template>

          <template v-else-if="promotionTargetType === 'category'">
            <v-col cols="12" md="4">
              <v-select></v-select>
            </v-col>
          </template>

          <template v-else-if="promotionTargetType === 'brand'">
            <v-col cols="12" md="12">
              <v-select
                v-model="promotionTarget.brand"
                placeholder="브랜드 선택"
                outlined
                dense
                :items="brandList"
                :item-text="'brand_name'"
                :item-value="'brand_id'"
                multiple
                chips
                label="브랜드">
              </v-select>
            </v-col>
          </template>
        </v-row>
      </v-form>
    </v-card-text>
    <component :is="'DialogProductSelect'" :dialog="dialogProductSelect" @closeDialog="closeDialog"
               @selectProduct="selectProduct"></component>
  </v-card>
</template>

<script>
    import DialogMixin from '@/assets/mixins/dialog'
    import DialogProductSelect from "@/components/DialogProductSelect";

    import moment from 'moment';

    export default {
        name: "PromotionCreate",
        mixins: [DialogMixin],
        components: {
            DialogProductSelect
        },
        async created() {
            let response = await this.$store.dispatch('brand/getAll');

            this.brandList = response.data.data;
        },
        data() {
            return {
                showDatePicker: false,
                showTimePicker: false,
                promotionCode: '',
                promotionName: '',
                promotionType: '',
                discount: '',
                expirationDate: new Date().toISOString().substr(0, 10),
                expirationTime: null,
                status: '',
                targetItems: [{
                    text: '특정 상품',
                    value: 'product'
                }, {
                    text: '특정 카테고리 상품',
                    value: 'category'
                }, {
                    text: '특정 브랜드',
                    value: 'brand'
                }],
                promotionTypeList: [{
                    text: '정률할인',
                    value: 'rate'
                }, {
                    text: '정액할인',
                    value: 'price'
                }],
                promotionStatusList: [{
                    label: '사용대기',
                    value: 'ready'
                }, {
                    label: '사용중',
                    value: 'expired'
                }, {
                    label: '만료',
                    value: 'active'
                }],
                promotionBrandList: [],
                promotionCategoryList: [],
                promotionProductList: [],
                dialogProductSelect: false,
                sendAlarm: '',
                alarmPromotionStart: '',
                promotionTargetType: '',
                brandList: [],
                promotionTarget: {
                    brand: [],
                    category: [],
                    product: []
                },

                headerProductTargetTable: [{
                    text: '',
                    value: 'thumb_image',
                    width: 90
                }, {
                    text: '상품명',
                    value: 'name'
                }, {
                    text: '사용가능여부',
                    value: 'usable'
                }, {
                    text: '',
                    value: 'actions'
                }],
                headerUsableSelect: [{
                    text: '사용가능',
                    value: 1
                }, {
                    text: '사용불가',
                    value: 0
                }]
            }
        },
        methods: {
            selectProduct(products) {
                console.log(products);
                for (const product of products) {
                    product.usable = 1;
                }

                this.promotionTarget.product = products;
                this.promotionTarget = Object.assign({}, this.promotionTarget)
            },
            closeDialog() {
                this.dialogProductSelect = false;
            },
            deleteProductTarget(product) {
                console.log(product);
                const index = this.promotionTarget.product.indexOf(product);
                this.promotionTarget.product.splice(index, 1);

                this.promotionTarget = Object.assign({}, this.promotionTarget)
            },
            async createPromotion() {
                const data = {
                    promotion_code: this.promotionCode,
                    promotion_name: this.promotionName,
                    discount_type: this.promotionType,
                    discount: this.discount,
                    // usable_discount_product: 1,
                    expiration_date: moment(`${this.expirationDate} ${this.expirationTime}`).format('YYYY-MM-DD HH:mm:ss'),
                    products: [],
                    categories: [],
                    brands: []
                };

                for (const product of this.promotionTarget.product) {
                    data.products.push({
                        product_id: product.product_id,
                        usable: product.usable
                    });
                }

                for (const category of this.promotionTarget.category) {
                    data.categories.push({
                        category_id: category.product_id,
                        usable: category.usable
                    });
                }

                for (const brand of this.promotionTarget.brand) {
                    data.brands.push({
                        brand_id: brand.brand_id,
                        usable: brand.usable
                    });
                }

                const response = await this.$store.dispatch('promotion/post', data);

                if(response.data.error) {
                    return alert(response.data.msg)
                }

                console.log(response)
            }
        }
    }
</script>

<style scoped>

</style>

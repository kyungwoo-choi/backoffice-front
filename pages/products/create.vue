<template>
  <v-form>
    <v-row>
      <v-col cols="12" md="9">
        <v-card flat>
          <v-card-text>
            <div class="title">상품등록</div>
            <v-row>
              <v-col cols="12" md="12">
                <v-radio-group v-model="status" row dense>
                  <template v-slot:label>
                    <strong>판매상태</strong>
                  </template>
                  <v-radio label="대기" value="ready"></v-radio>
                  <v-radio label="판매중" value="sell"></v-radio>
                  <v-radio label="판매중지" value="stop"></v-radio>
                </v-radio-group>
              </v-col>

              <v-col cols="12" md="12">
                <v-text-field outlined dense label="상품명" v-model="product_name"></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field outlined dense label="상품가격" v-model="cost"></v-text-field>
              </v-col>
            </v-row>

            <v-divider></v-divider>
            <v-row>
              <v-col cols="12" md="4">
                <p class="body-1">카테고리</p>
                <template v-for="(category, index) of categories">
                  <div class="body-2">{{index + 1}}차 카테고리</div>
                  <v-combobox
                    v-model="selectedCategory[index]"
                    :items="categories[index]"
                    :item-text="'name'"
                    :item-value="'category_id'"
                    placeholder="선택"
                    clearable
                    dense
                    @change="changeCategory(index)"
                    :key="index"
                  >
                  </v-combobox>
                </template>
              </v-col>
            </v-row>
            <v-divider></v-divider>

            <v-row>
              <v-col cols="12" md="4">
                <v-combobox
                  v-model="selectedBrand"
                  :items="brandItems"
                  item-text="brand_name"
                  item-value="brand_id"
                  label="브랜드"
                  clearable
                  dense
                >
                </v-combobox>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col cols="12" md="6">
                <p class="body-1">상품 메인 이미지</p>
                <dropzone id="product-main-image"
                          :options="{url: 'http://localhost:3000/', addRemoveLinks:true, maxFiles: 1}" ref="main_image"
                          :destroyDropzone="true"></dropzone>
              </v-col>
              <v-col cols="12" md="6">
                <p class="body-1">상품 리스트 이미지(썸네일)</p>
                <dropzone id="product-list-image"
                          :options="{url: 'http://localhost:3000/', addRemoveLinks:true, maxFiles: 1}" ref="list_image"
                          :destroyDropzone="true"></dropzone>
              </v-col>
              <v-col cols="12" md="12">
                <p class="body-1">상품 상세 이미지</p>
                <dropzone id="product-image"
                          :options="{url: 'http://localhost:3000/', multiple:true, duplicateCheck:true, autoProcessQueue:false, addRemoveLinks:true}"
                          ref="detail_images"
                          :destroyDropzone="true"
                          @vdropzone-queue-complete="uploadDetailImageComplete"
                ></dropzone>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col cols="12" md="12">
                <p class="body-1">상품옵션</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-data-table
                  disable-pagination
                  hide-default-footer
                  :items="optionKeys"
                  :headers="optionKeyTableHeader"
                  hide-details
                  disable-sort
                >
                  <template v-slot:top>
                    <v-toolbar flat color="white">
                      <v-toolbar-title class="body-2">
                        옵션정보(최대 5차)
                      </v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn outlined @click="addOptionKey">
                        추가
                      </v-btn>
                    </v-toolbar>
                  </template>
                  <template v-slot:item.name="{item, index}">
                    <v-text-field
                      placeholder="입력"
                      outlined
                      dense
                      hide-details
                      flat
                      v-model="item['name']"
                    >
                    </v-text-field>
                  </template>
                  <template v-slot:item.displayName="{item, index}">
                    <v-text-field
                      placeholder="입력"
                      outlined
                      dense
                      hide-details
                      flat
                      v-model="item['displayName']"
                    >
                    </v-text-field>
                  </template>

                  <template v-slot:item.actions="{ item }">
                    <v-icon
                      small
                      @click="deleteOptionKey(item)"
                    >
                      mdi-delete
                    </v-icon>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <v-data-table disable-pagination
                              hide-default-footer
                              :headers="optionHeader"
                              :items="options"
                              disable-sort
                >
                  <template v-slot:top>
                    <v-toolbar flat color="white">
                      <v-toolbar-title class="body-2">
                        옵션목록
                      </v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn outlined @click="addOption">
                        추가
                      </v-btn>
                    </v-toolbar>
                  </template>
                  <template v-slot:item.option_1="{item, index}">
                    <v-text-field
                      placeholder="입력"
                      outlined
                      dense
                      hide-details
                      flat
                      v-model="item['option_1']"
                    >
                    </v-text-field>
                  </template>
                  <template v-slot:item.option_2="{item, index}">
                    <v-text-field
                      placeholder="입력"
                      outlined
                      dense
                      hide-details
                      flat
                      v-model="item['option_2']"
                    >
                    </v-text-field>
                  </template>
                  <template v-slot:item.option_3="{item, index}">
                    <v-text-field
                      placeholder="입력"
                      outlined
                      dense
                      hide-details
                      flat
                      v-model="item['option_3']"
                    >
                    </v-text-field>
                  </template>
                  <template v-slot:item.option_4="{item, index}">
                    <v-text-field
                      placeholder="입력"
                      outlined
                      dense
                      hide-details
                      flat
                      v-model="item['option_4']"
                    >
                    </v-text-field>
                  </template>
                  <template v-slot:item.option_5="{item, index}">
                    <v-text-field
                      placeholder="입력"
                      outlined
                      dense
                      hide-details
                      flat
                      v-model="item['option_5']"
                    >
                    </v-text-field>
                  </template>
                  <template v-slot:item.addPrice="{item, index}">
                    <v-text-field
                      placeholder="입력"
                      outlined
                      dense
                      hide-details
                      flat
                      v-model="item['addPrice']"
                    >
                    </v-text-field>
                  </template>
                  <template v-slot:item.stock="{item, index}">
                    <v-text-field
                      placeholder="입력"
                      outlined
                      dense
                      hide-details
                      flat
                      v-model="item['stock']"
                    >
                    </v-text-field>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-icon
                      small
                      @click="deleteOption(item)"
                    >
                      mdi-delete
                    </v-icon>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <v-divider></v-divider>

            <v-row>
              <v-col cols="12" md="12">
                <p class="body-1">상품설명</p>
                <client-only>
                  <vue-editor placeholder="상품 설명" v-model="description"></vue-editor>
                </client-only>
              </v-col>
            </v-row>
            <v-row align="center" justify="center">
              <v-btn
                @click="createProduct"
                depressed
                color="green">
                등록
              </v-btn>
            </v-row>

          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card flat class="mb-12">
          <v-card-title>
            정보
          </v-card-title>
          <v-card-text>
            <v-col cols="12" md="12">
              뱃지
              <v-radio-group>
                <v-radio label="신상품" value="is_new">
                </v-radio>
                <v-radio label="베스트" value="is_best">
                </v-radio>
                <v-radio label="주문폭주" value="is_hot">
                </v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field label="원산지" placeholder=""></v-text-field>
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field label="제조사" placeholder="예: LG전자"></v-text-field>
            </v-col>
          </v-card-text>
        </v-card>
        <v-card flat>
          <v-card-title>
            기타 설정
          </v-card-title>
          <v-card-text>
            <v-col cols="12" md="12">
              <v-text-field label="최소 구매수량" placeholder="숫자만 입력"></v-text-field>
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field label="1회 구매시 최대 수량" placeholder="숫자만 입력"></v-text-field>
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field label="1인 구매시 최대 수량" placeholder="숫자만 입력"></v-text-field>
            </v-col>
          </v-card-text>
        </v-card>
      </v-col>

    </v-row>
  </v-form>
</template>

<script>
    import Dropzone from 'nuxt-dropzone'
    import 'nuxt-dropzone/dropzone.css';

    export default {
        name: "create",
        components: {
            Dropzone
        },
        async asyncData({store}) {
            let response;
            let result = {
                categories: [
                    []
                ],
                brandItems: []
            };

            try {
                response = await store.dispatch('product/getCategories', {
                    type: 'tree'
                });

                if (response.data.error) {
                    return result
                }

                for (const category of response.data.data) {
                    if (category.depth !== 1) {
                        continue
                    }

                    result.categories[0].push(category);
                }

                response = await store.dispatch('brand/getAll');

                if (response.data.error) {
                    return result
                }

                result.brandItems = response.data.data;

                return result;
            } catch (e) {
                return result;
            }
        },
        data() {
            return {
                completeCreate: false,
                status: 'ready',
                product_name: '',
                cost: 0,
                selectedBrand: [],
                selectedCategory: [''],
                test: [],
                brandItems: [{
                    text: '브랜드1',
                    value: 1
                }, {
                    text: '브랜드2',
                    value: 2
                }, {
                    text: '브랜드3',
                    value: 3
                }],
                optionKeyTableHeader: [{
                    text: '옵션명',
                    value: 'name'
                }, {
                    text: '옵션표현명(화면에 보일 이름)',
                    value: 'displayName'
                }, {
                    text: '삭제',
                    value: 'actions'
                }],
                optionKeys: [{
                    name: null,
                    displayName: null
                }],
                optionHeader: [{
                    text: '1차 옵션',
                    value: 'option_1'
                }, {
                    text: '2차 옵션',
                    value: 'option_2'
                }, {
                    text: '3차 옵션',
                    value: 'option_3'
                }, {
                    text: '4차 옵션',
                    value: 'option_4'
                }, {
                    text: '5차 옵션',
                    value: 'option_5'
                }, {
                    text: '추가가격',
                    value: 'addPrice'
                }, {
                    text: '재고',
                    value: 'stock'
                }, {
                    text: '삭제',
                    value: 'actions'
                }],
                options: [{
                    option_1: null,
                    option_2: null,
                    option_3: null,
                    option_4: null,
                    option_5: null,
                    addPrice: 0,
                    stock: 0
                }],
                description: ''
            }
        },
        watch: {
            completeCreate(newVal) {
                if (newVal === true) {
                    this.$router.push('/products/list')
                }
            }
        },
        methods: {
            uploadDetailImageComplete() {
                this.completeCreate = true;
            },
            changeCategory(index) {
                if (!this.selectedCategory[index]) {
                    for (let i = this.categories.length; i > 0; i--) {
                        if (i > index) {
                            this.categories.splice(i, 1);
                            this.selectedCategory.splice(i, 1);
                        }
                    }
                    return;
                }

                if (this.selectedCategory[index].children.length) {
                    this.categories[index + 1] = this.selectedCategory[index].children;
                }
            },
            addOptionKey() {
                if (this.optionKeys.length === 5) {
                    return alert('옵션정보는 5차까지 추가가 가능합니다.')
                }

                this.optionKeys.push({
                    name: '',
                    displayName: ''
                })
            },
            deleteOptionKey(item) {
                const index = this.optionKeys.indexOf(item);
                this.optionKeys.splice(index, 1);
            },
            addOption() {
                this.options.push({
                    option_1: null,
                    option_2: null,
                    option_3: null,
                    option_4: null,
                    option_5: null,
                    addPrice: 0,
                    stock: 0
                })
            },
            deleteOption(item) {
                const index = this.options.indexOf(item);
                this.options.splice(index, 1);
            },
            async uploadImages(product_id) {
                this.$refs.detail_images.setOption('url', process.env.BASE_URL + `/products/${product_id}/images`);
                // this.$refs.detail_images.setOption('uploadMultiple', true);
                this.$refs.detail_images.setOption('parallelUploads', 10);
                this.$refs.detail_images.setOption('paramName', 'images');
                this.$refs.detail_images.processQueue();
            },
            async createProduct() {
                try {
                    const selectedCategory = this.selectedCategory[this.selectedCategory.length - 1];

                    const data = {
                        "name": this.product_name,
                        "store_id": "11ea2179114e1230b5460326e5c90e20",
                        "category_id": selectedCategory.category_id,
                        "cost": this.cost,
                        "brand_id": this.selectedBrand.brand_id,
                        "description": this.description,
                        "status": this.status,
                        "option": {
                            "keys": this.optionKeys,
                            "groups": this.options
                        }
                    };

                    const response = await this.$store.dispatch('product/createProduct', data)
                    console.log(response)
                    if (response.data.error) {
                        return alert(response.data.msg);
                    }

                    await this.uploadImages(response.data.data.product_id);
                    // const formData = new FormData();
                    //
                    // formData.append('images', this.$refs.detail_images);
                    // console.log(this.$refs.detail_images.dropzone.getUploadingFiles())
                    // console.log(this.$refs.detail_images.dropzone.getAcceptedFiles())
                    // await this.$store.dispatch('product/saveProductImages', {
                    //     product_id: response.data.data.product_id,
                    //     formData: formData
                    // })
                    // this.$router.push('/products/list')
                } catch (e) {
                    console.error(e);
                    // alert(e.msg);
                }
            }
        }
    }
</script>

<style scoped>

</style>

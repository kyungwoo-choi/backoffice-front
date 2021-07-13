<template>
  <v-card flat>
    <!--    <v-card-title class="headline">-->
    <!--      회원목록-->
    <!--    </v-card-title>-->
    <v-card-text>
      <div class="title">카테고리 목록</div>

      <v-row>
        <v-col cols="12" md="6">
          <v-card outlined>
            <v-treeview
              :items="categories"
              item-text="name"
              item-key="category_id"
              activatable
              item-children="children"
              open-all
              return-object
              @update:active="changeActive"
            ></v-treeview>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-form class="mb-4">
            <div class="subtitle-1">
              카테고리 정보
            </div>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field dense hide-details outlined label="카테고리 ID" readonly
                              v-model="selectedCategory.category_id"></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-text-field dense hide-details outlined label="카테고리 명" v-model="selectedCategory.name"></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-text-field dense hide-details outlined label="영문명" v-model="selectedCategory.name_en"></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-btn outlined block color="success" @click="submitCategory">
                  저장
                </v-btn>
              </v-col>
              <v-col cols="12" md="2">
                <v-btn outlined block color="error" @click="deleteCategory">
                  삭제
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
          <v-form @submit.prevent="addChildCategory">
            <div class="subtitle-1">
              하위 카테고리
            </div>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field dense hide-details outlined label="카테고리 명" v-model="childCategoryName"></v-text-field>
              </v-col>
              <v-col cols="12" md="3" offset-md="9">
                <v-btn type="submit" outlined block color="success">
                  하위 카테고리 추가
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
    export default {
        name: "CategoryList",
        async asyncData({store}) {
            let response = await store.dispatch('product/getCategories', {
                type: 'tree'
            });

            console.log(response);
            const categories = [];
            categories.push({
                name: '전체',
                category_id: null,
                depth: 0,
                children: []
            });

            categories[0].children = categories[0].children.concat(response.data.data);

            return {
                categories
            }
        },
        data() {
            return {
                selectedCategory: {},
                childCategoryName: ''
            }
        },
        methods: {
            changeActive(value) {
                if (!value.length) {
                    this.selectedCategory = Object.assign({}, {});
                    this.childCategoryName = '';
                    return
                }

                this.childCategoryName = '';
                this.selectedCategory = Object.assign({}, value[0]);
            },
            async fetch() {
                let response = await this.$store.dispatch('product/getCategories', {
                    type: 'tree'
                });

                const categories = [];
                categories.push({
                    name: '전체',
                    category_id: null,
                    depth: 0,
                    children: []
                });

                categories[0].children = categories[0].children.concat(response.data.data);

                this.categories = categories;
            },
            async addChildCategory() {
                const data = {};

                data.parent_id = this.selectedCategory.category_id;
                data.name = this.childCategoryName;
                data.depth = this.selectedCategory.depth + 1;

                await this.$store.dispatch('product/createCategory', data);
                await this.fetch();
            },
            async submitCategory() {
                const data = {};

                data.name = this.selectedCategory.name;
                data.name_en = this.selectedCategory.name_en;
                data.category_id = this.selectedCategory.category_id;
                data.depth = this.selectedCategory.depth;


                await this.$store.dispatch('product/updateCategory', data);
                await this.fetch();
            },
            async deleteCategory() {
                let response;
                try {
                    response = await this.$store.dispatch('product/deleteCategory', this.selectedCategory.category_id);
                    if (response.data.error) {
                        return alert(response.data.msg)
                    }

                    await this.fetch();
                } catch (e) {

                }
            }
        }
    }
</script>

<style scoped>

</style>

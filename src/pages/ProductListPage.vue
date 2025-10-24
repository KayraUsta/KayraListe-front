<template>
  <q-page padding>
    <div class="text-h4 q-mb-md">Tüm Ürünler</div>
    
    <!-- Filtre Seçenekleri -->
    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-sm-6 col-md-4">
            <q-select
              v-model="filterStatus"
              :options="statusOptions"
              label="Durum Filtresi"
              outlined
              emit-value
              map-options
            >
              <template v-slot:prepend>
                <q-icon name="filter_list" />
              </template>
            </q-select>
          </div>
          <div class="col-12 col-sm-6 col-md-4">
            <q-input
              v-model="searchQuery"
              label="Ürün Ara"
              outlined
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Ürün Sayısı -->
    <div class="q-mb-md text-grey-7">
      Toplam {{ filteredProducts.length }} ürün bulundu
    </div>

    <!-- Ürün Listesi -->
    <div v-if="filteredProducts.length > 0" class="row q-col-gutter-md">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card class="product-card">
          <!-- Ürün Görseli -->
          <q-img
            :src="product.image"
            ratio="1"
            style="height: 200px;"
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
                <q-icon name="broken_image" size="50px" />
              </div>
            </template>
            
            <!-- Durum Badge -->
            <div class="absolute-top-right q-ma-sm">
              <q-badge
                :color="product.active ? 'positive' : 'grey-6'"
                :label="product.active ? 'Aktif' : 'Pasif'"
              />
            </div>
          </q-img>

          <q-card-section>
            <!-- Ürün Adı -->
            <div class="text-h6 ellipsis">{{ product.name }}</div>
            
            <!-- Ürün Fiyatı -->
            <div class="text-subtitle1 text-primary text-weight-bold q-mt-xs">
              {{ formatPrice(product.price) }}
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="between">
            <!-- Aktif/Pasif Toggle -->
            <q-toggle
              v-model="product.active"
              color="positive"
              :label="product.active ? 'Aktif' : 'Pasif'"
              @update:model-value="(val) => toggleProductStatus(product.id, val)"
            />

            <!-- Detay Butonu -->
            <q-btn
              flat
              dense
              icon="info"
              color="primary"
              @click="showProductDetails(product)"
            >
              <q-tooltip>Detayları Gör</q-tooltip>
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Ürün Bulunamadı -->
    <div v-else class="text-center q-pa-xl">
      <q-icon name="inventory_2" size="80px" color="grey-5" />
      <div class="text-h6 text-grey-7 q-mt-md">Ürün bulunamadı</div>
      <div class="text-body2 text-grey-6 q-mt-sm">
        {{ filterStatus !== 'all' ? 'Bu filtreye uygun ürün yok' : 'Henüz ürün eklenmemiş' }}
      </div>
      <q-btn
        color="primary"
        label="Ürün Ekle"
        icon="add"
        to="/add-product"
        class="q-mt-md"
        unelevated
      />
    </div>

    <!-- Ürün Detay Dialog -->
    <q-dialog v-model="detailDialog">
      <q-card style="min-width: 350px">
        <q-card-section v-if="selectedProduct">
          <div class="text-h6">{{ selectedProduct.name }}</div>
        </q-card-section>

        <q-card-section v-if="selectedProduct" class="q-pt-none">
          <q-img
            :src="selectedProduct.image"
            style="max-height: 300px;"
            fit="contain"
          />
          
          <div class="q-mt-md">
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <div class="text-caption text-grey-7">Fiyat</div>
                <div class="text-h6 text-primary">{{ formatPrice(selectedProduct.price) }}</div>
              </div>
              <div class="col-6">
                <div class="text-caption text-grey-7">Durum</div>
                <div class="text-h6">
                  <q-badge
                    :color="selectedProduct.active ? 'positive' : 'grey-6'"
                    :label="selectedProduct.active ? 'Aktif' : 'Pasif'"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Kapat" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

export default {
  name: 'ProductListPage',
  setup() {
    const $q = useQuasar()

    // Örnek ürünler (normalde API'den gelir)
    const products = ref([
      {
        id: 1,
        name: 'Klasik Tişört',
        price: 299.90,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        active: true
      },
      {
        id: 2,
        name: 'Spor Ayakkabı',
        price: 2199.00,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        active: false
      },
      {
        id: 3,
        name: 'Sırt Çantası',
        price: 849.50,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        active: true
      },
      {
        id: 4,
        name: 'Kulaklık',
        price: 1599.00,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        active: true
      },
      {
        id: 5,
        name: 'Akıllı Saat',
        price: 3499.00,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        active: false
      },
      {
        id: 6,
        name: 'Laptop Çantası',
        price: 599.00,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        active: true
      }
    ])

    const filterStatus = ref('all')
    const searchQuery = ref('')
    const detailDialog = ref(false)
    const selectedProduct = ref(null)

    const statusOptions = [
      { label: 'Tümü', value: 'all' },
      { label: 'Aktif', value: 'active' },
      { label: 'Pasif', value: 'passive' }
    ]

    const filteredProducts = computed(() => {
      let filtered = products.value

      // Durum filtreleme
      if (filterStatus.value === 'active') {
        filtered = filtered.filter(p => p.active)
      } else if (filterStatus.value === 'passive') {
        filtered = filtered.filter(p => !p.active)
      }

      // Arama filtreleme
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(query)
        )
      }

      return filtered
    })

    const formatPrice = (price) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    }

    const toggleProductStatus = (id, newStatus) => {
      const product = products.value.find(p => p.id === id)
      if (product) {
        product.active = newStatus
        $q.notify({
          type: 'info',
          message: `${product.name} ${newStatus ? 'aktif' : 'pasif'} yapıldı`,
          position: 'top',
          timeout: 2000
        })
      }
    }

    const showProductDetails = (product) => {
      selectedProduct.value = product
      detailDialog.value = true
    }

    return {
      products,
      filterStatus,
      searchQuery,
      statusOptions,
      filteredProducts,
      detailDialog,
      selectedProduct,
      formatPrice,
      toggleProductStatus,
      showProductDetails
    }
  }
}
</script>

<style scoped>
.product-card {
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

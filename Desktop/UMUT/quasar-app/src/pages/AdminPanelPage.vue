<template>
  <q-page class="admin-page" padding>
    <!-- Header -->
    <div class="row items-center q-mb-xl">
      <div class="col">
        <div class="text-h3 text-weight-bold gradient-title">Admin Paneli</div>
        <div class="text-h6 text-grey-4 q-mt-sm">
          Ürün yönetimi ve kontrol
        </div>
      </div>
      <div class="col-auto">
        <q-btn
          color="purple-6"
          icon="add"
          label="Yeni Ürün Ekle"
          to="/add-product"
          unelevated
          class="modern-btn"
        />
      </div>
    </div>

    <!-- İstatistikler -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-4">
        <q-card flat class="stat-card">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-caption text-grey-4">Toplam Ürün</div>
                <div class="text-h3 text-weight-bold text-white">{{ products.length }}</div>
              </div>
              <div class="col-auto">
                <q-icon name="inventory_2" size="56px" color="purple-4" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4">
        <q-card flat class="stat-card stat-card-active">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-caption text-grey-3">Aktif Ürünler</div>
                <div class="text-h3 text-weight-bold text-white">{{ activeCount }}</div>
              </div>
              <div class="col-auto">
                <q-icon name="check_circle" size="56px" color="white" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4">
        <q-card flat class="stat-card stat-card-passive">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-caption text-grey-3">Pasif Ürünler</div>
                <div class="text-h3 text-weight-bold text-white">{{ passiveCount }}</div>
              </div>
              <div class="col-auto">
                <q-icon name="cancel" size="56px" color="white" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Filtreler -->
    <q-card flat class="filter-card q-mb-lg">
      <q-card-section>
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-sm-6 col-md-4">
            <q-select
              v-model="filterStatus"
              :options="statusOptions"
              label="Durum Filtresi"
              dark
              standout="bg-grey-9"
              dense
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
              placeholder="Ürün ara..."
              dark
              standout="bg-grey-9"
              dense
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-4">
            <q-btn-group spread>
              <q-btn
                unelevated
                color="purple-6"
                icon="check_circle"
                label="Tümünü Aktif Yap"
                @click="bulkToggle(true)"
                :disable="filteredProducts.length === 0"
                class="modern-btn"
              />
              <q-btn
                unelevated
                color="grey-8"
                icon="cancel"
                label="Tümünü Pasif Yap"
                @click="bulkToggle(false)"
                :disable="filteredProducts.length === 0"
                class="modern-btn"
              />
            </q-btn-group>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Ürün Tablosu -->
    <q-card flat class="table-card">
      <q-table
        :rows="filteredProducts"
        :columns="columns"
        row-key="id"
        :pagination="pagination"
        flat
        dark
        :rows-per-page-options="[10, 25, 50]"
        class="modern-table"
      >
        <!-- Görsel -->
        <template v-slot:body-cell-image="props">
          <q-td :props="props">
            <q-avatar size="60px" square>
              <q-img :src="props.row.image" />
            </q-avatar>
          </q-td>
        </template>

        <!-- Fiyat -->
        <template v-slot:body-cell-price="props">
          <q-td :props="props">
            <div class="text-weight-bold text-primary">
              {{ formatPrice(props.row.price) }}
            </div>
          </q-td>
        </template>

        <!-- Durum -->
        <template v-slot:body-cell-active="props">
          <q-td :props="props">
            <q-badge
              :color="props.row.active ? 'positive' : 'grey-6'"
              :label="props.row.active ? 'Aktif' : 'Pasif'"
              class="q-px-md q-py-xs"
            />
          </q-td>
        </template>

        <!-- İşlemler -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="row q-gutter-sm no-wrap">
              <q-toggle
                v-model="props.row.active"
                color="positive"
                size="lg"
                @update:model-value="(val) => toggleProductStatus(props.row.id, val)"
              />
              <q-btn
                flat
                dense
                round
                icon="edit"
                color="orange"
                @click="editProduct(props.row)"
              >
                <q-tooltip>Düzenle</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                icon="visibility"
                color="primary"
                @click="showProductDetails(props.row)"
              >
                <q-tooltip>Detayları Gör</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                round
                icon="delete"
                color="negative"
                @click="deleteProduct(props.row)"
              >
                <q-tooltip>Sil</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Ürün Düzenleme Dialog -->
    <q-dialog v-model="editDialog" persistent>
      <q-card class="modern-dialog" style="min-width: 500px">
        <q-card-section>
          <div class="text-h4 text-weight-bold text-white">Ürün Düzenle</div>
        </q-card-section>

        <q-separator dark />

        <q-card-section v-if="editingProduct" class="q-pt-md">
          <q-form @submit="saveProduct" class="q-gutter-md">
            <!-- Ürün Görseli URL -->
            <q-input
              v-model="editingProduct.image"
              label="Ürün Görseli URL"
              dark
              standout="bg-grey-9"
              :rules="[val => !!val || 'Görsel URL gerekli']"
            >
              <template v-slot:prepend>
                <q-icon name="image" />
              </template>
            </q-input>

            <!-- Görsel Önizleme -->
            <div v-if="editingProduct.image" class="q-mt-md">
              <div class="text-caption q-mb-sm">Görsel Önizleme:</div>
              <q-img
                :src="editingProduct.image"
                style="max-width: 300px; max-height: 200px; border-radius: 8px;"
                fit="contain"
              >
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
                    <q-icon name="broken_image" size="50px" />
                  </div>
                </template>
              </q-img>
            </div>

            <!-- Ürün Adı -->
            <q-input
              v-model="editingProduct.name"
              label="Ürün Adı"
              dark
              standout="bg-grey-9"
              :rules="[val => !!val || 'Ürün adı gerekli']"
            >
              <template v-slot:prepend>
                <q-icon name="shopping_bag" />
              </template>
            </q-input>

            <!-- Ürün Fiyatı -->
            <q-input
              v-model.number="editingProduct.price"
              type="number"
              label="Ürün Fiyatı (TRY)"
              dark
              standout="bg-grey-9"
              step="0.01"
              min="0"
              :rules="[
                val => val !== null && val !== '' || 'Fiyat gerekli',
                val => val >= 0 || 'Fiyat 0\'dan küçük olamaz'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="attach_money" />
              </template>
            </q-input>

            <!-- Aktif/Pasif Durumu -->
            <div class="q-mt-md">
              <q-toggle
                v-model="editingProduct.active"
                label="Ürün Durumu"
                color="positive"
                size="lg"
              >
                <template v-slot:default>
                  <div class="q-ml-sm">
                    <div class="text-weight-medium">
                      {{ editingProduct.active ? 'Aktif' : 'Pasif' }}
                    </div>
                    <div class="text-caption text-grey-7">
                      {{ editingProduct.active ? 'Ürün satışa sunulacak' : 'Ürün satışa sunulmayacak' }}
                    </div>
                  </div>
                </template>
              </q-toggle>
            </div>

            <!-- Butonlar -->
            <div class="q-mt-lg q-gutter-sm">
              <q-btn
                type="submit"
                label="Kaydet"
                color="purple-6"
                icon="save"
                unelevated
                :loading="saving"
                class="modern-btn"
              />
              <q-btn
                label="İptal"
                color="grey-8"
                unelevated
                @click="cancelEdit"
                :disable="saving"
                class="modern-btn"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Ürün Detay Dialog -->
    <q-dialog v-model="detailDialog">
      <q-card class="modern-dialog" style="min-width: 450px">
        <q-card-section v-if="selectedProduct">
          <div class="text-h4 text-weight-bold text-white">{{ selectedProduct.name }}</div>
          <q-badge
            :color="selectedProduct.active ? 'positive' : 'grey-6'"
            :label="selectedProduct.active ? 'Aktif' : 'Pasif'"
            class="q-mt-xs"
          />
        </q-card-section>

        <q-card-section v-if="selectedProduct">
          <q-img
            :src="selectedProduct.image"
            style="max-height: 300px; border-radius: 8px;"
            fit="contain"
          />
          
          <div class="q-mt-md">
            <div class="text-h5 price-gradient text-weight-bold">
              {{ formatPrice(selectedProduct.price) }}
            </div>
            
            <q-separator dark class="q-my-md" />
            
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <div class="text-caption text-grey-4">Ürün ID</div>
                <div class="text-body1 text-white">#{{ selectedProduct.id }}</div>
              </div>
              <div class="col-6">
                <div class="text-caption text-grey-4">Durum</div>
                <div class="text-body1 text-white">
                  {{ selectedProduct.active ? 'Satışta' : 'Satışta Değil' }}
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn unelevated label="Kapat" color="purple-6" class="modern-btn" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

export default {
  name: 'AdminPanelPage',
  setup() {
    const $q = useQuasar()

    // Örnek ürünler
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
    const editDialog = ref(false)
    const editingProduct = ref(null)
    const saving = ref(false)
    const pagination = ref({ rowsPerPage: 10 })

    const columns = [
      { name: 'image', label: 'Görsel', field: 'image', align: 'left' },
      { name: 'name', label: 'Ürün Adı', field: 'name', align: 'left', sortable: true },
      { name: 'price', label: 'Fiyat', field: 'price', align: 'left', sortable: true },
      { name: 'active', label: 'Durum', field: 'active', align: 'center', sortable: true },
      { name: 'actions', label: 'İşlemler', align: 'center' }
    ]

    const statusOptions = [
      { label: 'Tümü', value: 'all' },
      { label: 'Aktif', value: 'active' },
      { label: 'Pasif', value: 'passive' }
    ]

    const activeCount = computed(() => products.value.filter(p => p.active).length)
    const passiveCount = computed(() => products.value.filter(p => !p.active).length)

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
          type: newStatus ? 'positive' : 'info',
          message: `${product.name} ${newStatus ? 'aktif' : 'pasif'} yapıldı`,
          icon: newStatus ? 'check_circle' : 'cancel',
          position: 'top',
          timeout: 2000
        })
      }
    }

    const bulkToggle = (status) => {
      $q.dialog({
        title: 'Onay',
        message: `Filtrelenmiş ${filteredProducts.value.length} ürünü ${status ? 'aktif' : 'pasif'} yapmak istediğinize emin misiniz?`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        filteredProducts.value.forEach(product => {
          product.active = status
        })
        $q.notify({
          type: 'positive',
          message: `${filteredProducts.value.length} ürün ${status ? 'aktif' : 'pasif'} yapıldı`,
          position: 'top'
        })
      })
    }

    const showProductDetails = (product) => {
      selectedProduct.value = product
      detailDialog.value = true
    }

    const editProduct = (product) => {
      // Ürünün kopyasını oluştur (orijinali değiştirmemek için)
      editingProduct.value = { ...product }
      editDialog.value = true
    }

    const saveProduct = () => {
      saving.value = true
      
      // Simüle edilmiş kaydetme işlemi
      setTimeout(() => {
        const index = products.value.findIndex(p => p.id === editingProduct.value.id)
        if (index !== -1) {
          // Orijinal ürünü güncelle
          products.value[index] = { ...editingProduct.value }
          
          $q.notify({
            type: 'positive',
            message: `${editingProduct.value.name} başarıyla güncellendi`,
            icon: 'check_circle',
            position: 'top',
            timeout: 2000
          })
          
          editDialog.value = false
          editingProduct.value = null
        }
        saving.value = false
      }, 1000)
    }

    const cancelEdit = () => {
      editDialog.value = false
      editingProduct.value = null
    }

    const deleteProduct = (product) => {
      $q.dialog({
        title: 'Ürünü Sil',
        message: `<strong>${product.name}</strong> ürününü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
        html: true,
        cancel: {
          label: 'İptal',
          color: 'grey-7',
          flat: true
        },
        ok: {
          label: 'Sil',
          color: 'negative',
          unelevated: true
        },
        persistent: true
      }).onOk(() => {
        const index = products.value.findIndex(p => p.id === product.id)
        if (index !== -1) {
          products.value.splice(index, 1)
          
          $q.notify({
            type: 'negative',
            message: `${product.name} silindi`,
            icon: 'delete',
            position: 'top',
            timeout: 2000
          })
        }
      })
    }

    return {
      products,
      filterStatus,
      searchQuery,
      columns,
      statusOptions,
      pagination,
      activeCount,
      passiveCount,
      filteredProducts,
      detailDialog,
      selectedProduct,
      editDialog,
      editingProduct,
      saving,
      formatPrice,
      toggleProductStatus,
      bulkToggle,
      showProductDetails,
      editProduct,
      saveProduct,
      cancelEdit,
      deleteProduct
    }
  }
}
</script>

<style scoped>
.admin-page {
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  min-height: 100vh;
}

.gradient-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

.stat-card-active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
  border-color: rgba(102, 126, 234, 0.5);
}

.stat-card-passive {
  background: rgba(100, 100, 100, 0.3);
  border-color: rgba(150, 150, 150, 0.3);
}

.filter-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

.table-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
}

.modern-table {
  background: transparent;
}

.modern-btn {
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.modern-dialog {
  background: rgba(15, 12, 41, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
}

.price-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Input placeholder ve text renkleri */
:deep(.q-field__native),
:deep(.q-field__input) {
  color: white !important;
}

:deep(::placeholder) {
  color: rgba(255, 255, 255, 0.4) !important;
  opacity: 1;
}

:deep(input::placeholder) {
  color: rgba(255, 255, 255, 0.4) !important;
}
</style>

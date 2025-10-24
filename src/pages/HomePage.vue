<template>
  <q-page padding>
    <div class="text-center q-pa-xl">
      <q-icon name="inventory_2" size="120px" color="primary" />
      <div class="text-h3 q-mt-md">Ürün Yönetim Sistemi</div>
      <div class="text-h6 text-grey-7 q-mt-sm q-mb-xl">
        Krkit Bilişim tarafından oluşturulmuştur
      </div>

      <!-- Müşteri Bölümü -->
      <div class="q-mb-xl">
        <div class="text-h5 q-mb-md text-primary">
          <q-icon name="shopping_cart" size="32px" class="q-mr-sm" />
          Müşteri Görünümü
        </div>
        <div class="row q-col-gutter-lg justify-center">
          <div class="col-12 col-sm-6 col-md-4">
            <q-card class="feature-card cursor-pointer bg-blue-1" @click="$router.push('/customer')">
              <q-card-section class="text-center">
                <q-icon name="shopping_cart" size="64px" color="primary" />
                <div class="text-h5 q-mt-md">Müşteri Görünümü</div>
                <div class="text-body2 text-grey-7 q-mt-sm">
                  Sadece aktif ürünleri görüntüleyin
                </div>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn
                  flat
                  color="primary"
                  label="Ürünleri Gör"
                  icon-right="arrow_forward"
                  to="/customer"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>

      <q-separator class="q-my-xl" />

      <!-- Admin Bölümü -->
      <div>
        <div class="text-h5 q-mb-md text-orange">
          <q-icon name="admin_panel_settings" size="32px" class="q-mr-sm" />
          Admin Bölümü
        </div>
        <div class="row q-col-gutter-lg justify-center">
          <!-- Admin Paneli Kartı -->
          <div class="col-12 col-sm-6 col-md-4">
            <q-card class="feature-card cursor-pointer bg-orange-1" @click="$router.push('/admin')">
              <q-card-section class="text-center">
                <q-icon name="admin_panel_settings" size="64px" color="orange" />
                <div class="text-h5 q-mt-md">Admin Paneli</div>
                <div class="text-body2 text-grey-7 q-mt-sm">
                  Ürün durumlarını yönetin
                </div>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn
                  flat
                  color="orange"
                  label="Admin Paneli"
                  icon-right="arrow_forward"
                  to="/admin"
                />
              </q-card-actions>
            </q-card>
          </div>

          <!-- Ürün Ekle Kartı -->
          <div class="col-12 col-sm-6 col-md-4">
            <q-card class="feature-card cursor-pointer bg-orange-1" @click="$router.push('/add-product')">
              <q-card-section class="text-center">
                <q-icon name="add_circle" size="64px" color="orange" />
                <div class="text-h5 q-mt-md">Ürün Ekle</div>
                <div class="text-body2 text-grey-7 q-mt-sm">
                  Yeni ürün eklemek için formu doldurun
                </div>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn
                  flat
                  color="orange"
                  label="Ürün Ekle"
                  icon-right="arrow_forward"
                  to="/add-product"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Özellikler -->
      <div class="q-mt-xl">
        <div class="text-h5 q-mb-md">Özellikler</div>
        <div class="row q-col-gutter-md justify-center">
          <div class="col-12 col-sm-6 col-md-3">
            <q-card flat bordered>
              <q-card-section class="text-center">
                <q-icon name="image" size="32px" color="primary" />
                <div class="text-subtitle1 q-mt-sm">Görsel Yönetimi</div>
                <div class="text-caption text-grey-7">Ürün görselleri ekleyin</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card flat bordered>
              <q-card-section class="text-center">
                <q-icon name="attach_money" size="32px" color="positive" />
                <div class="text-subtitle1 q-mt-sm">Fiyat Takibi</div>
                <div class="text-caption text-grey-7">Ürün fiyatlarını yönetin</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card flat bordered>
              <q-card-section class="text-center">
                <q-icon name="toggle_on" size="32px" color="orange" />
                <div class="text-subtitle1 q-mt-sm">Aktif/Pasif</div>
                <div class="text-caption text-grey-7">Ürün durumunu değiştirin</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card flat bordered>
              <q-card-section class="text-center">
                <q-icon name="filter_list" size="32px" color="info" />
                <div class="text-subtitle1 q-mt-sm">Filtreleme</div>
                <div class="text-caption text-grey-7">Ürünleri filtreleyin</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>
.feature-card {
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}
</style>

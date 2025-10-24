<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="modern-header">
      <q-toolbar>
        <q-toolbar-title class="text-weight-bold">
          <span class="gradient-text">kayra - KRKIT</span>
        </q-toolbar-title>

        <!-- Müşteri Görünümündeyken (Ana Sayfa) navigasyon yok -->
        <template v-if="isCustomerView">
          <!-- Boş - Sadece başlık -->
        </template>

        <!-- Admin sayfalarında navigasyon -->
        <template v-else>
          <q-btn
            flat
            icon="home"
            label="Ürünler"
            to="/"
            class="q-mr-sm"
          />
          
          <q-separator vertical inset class="q-mx-sm" />
          
          <!-- Admin Bölümü -->
          <q-btn
            flat
            icon="admin_panel_settings"
            label="Admin Paneli"
            to="/admin"
            class="q-mr-sm"
          />
          <q-btn
            flat
            icon="add_circle"
            label="Ürün Ekle"
            to="/add-product"
          />
        </template>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const route = useRoute()
    
    // Müşteri görünümünde mi kontrol et (ana sayfa)
    const isCustomerView = computed(() => {
      return route.path === '/'
    })

    return {
      isCustomerView
    }
  }
}
</script>

<style scoped>
.modern-header {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.5rem;
  letter-spacing: 2px;
}
</style>

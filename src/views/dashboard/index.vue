<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: null
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  created() {
    // Détermine le tableau de bord à afficher en fonction des rôles
    if (this.roles.includes('ROLE_ADMIN')) {
      this.currentRole = 'adminDashboard'
    } else if (this.roles.includes('ROLE_USER')) {
      this.currentRole = 'editorDashboard'
    } else {
      console.warn("Rôle non reconnu, aucun composant de tableau de bord associé")
    }
  }
}
</script>

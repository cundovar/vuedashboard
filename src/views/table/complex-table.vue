<template>
  <div class="app-container">
    <el-table :data="list" border v-loading="listLoading" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="titre" label="Titre" />
      <el-table-column prop="description" label="Description" />
      <el-table-column prop="tekno" label="tekno" />
      <el-table-column prop="lien" label="lien" />
      <el-table-column prop="alt" label="alt" />
      <el-table-column prop="imageSrc" label="imageSrc" />
      <el-table-column prop="text1" label="text1" />
      <el-table-column prop="text2" label="text2" />
      <el-table-column prop="text3" label="text3" />
      <el-table-column prop="text4" label="text4" />
      <el-table-column label="Actions" width="180">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">Modifier</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">Supprimer</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogStatus === 'create' ? 'Créer' : 'Modifier'" :visible.sync="dialogFormVisible">
      <el-form :model="temp" ref="dataForm">
        <el-form-item label="Titre">
          <el-input v-model="temp.titre" />
        </el-form-item>
        <el-form-item label="Description">
          <el-input v-model="temp.description" />
        </el-form-item>
        <el-form-item label="Tekno">
          <el-input v-model="temp.tekno" />
        </el-form-item>
        <el-form-item label="Lien">
          <el-input v-model="temp.lien" />
        </el-form-item>
        <el-form-item label="Image Src">
          <el-input v-model="temp.imageSrc" />
        </el-form-item>
        <el-form-item label="Text 1">
          <el-input v-model="temp.text1" />
        </el-form-item>
        <el-form-item label="Text 2">
          <el-input v-model="temp.text2" />
        </el-form-item>
        <el-form-item label="Text 3">
          <el-input v-model="temp.text3" />
        </el-form-item>
        <el-form-item label="Text 4">
          <el-input v-model="temp.text4" />
        </el-form-item>
        <el-form-item label="Alt">
          <el-input v-model="temp.alt" />
        </el-form-item>
        <el-form-item label="Video">
          <el-input v-model="temp.video" />
        </el-form-item>
      </el-form>

        <!-- Dropzone pour l'upload d'image -->
        <el-form-item label="Image">
          <dropzone
            id="editDropzone"
            :url="uploadUrl"
            @dropzone-success="onImageUploadSuccess"
            @dropzone-removedFile="onImageRemove"
          />
          <!-- Afficher l'image uploadée -->
          <div v-if="editRecord.image" class="uploaded-image-preview">
            <img :src="editRecord.image" alt="Image téléchargée" width="100" />
          </div>
        </el-form-item>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Annuler</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">Confirmer</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchModels, createModel, updateModel, deleteModel } from '@/api/model'
import { DropzoneDemo } from '@/view/components-demo/dropzone'
export default {
  components: { DropzoneDemo },
  data() {
    return {
      list: [],
      temp: { titre: '', description: '', tekno: '', lien: '', imageSrc: '', text1: '', text2: '', text3: '', text4: '', alt: '', video: '' },
      dialogFormVisible: false,
      dialogStatus: '',
      listLoading: true,
      records: [], // Liste des enregistrements
      isEditModalVisible: false, // Contrôle de la visibilité de la modale
      editRecord: {}, // Données de l'enregistrement en cours d'édition
      uploadUrl: 'http://localhost:8000/upload_image.php', // URL de l'API d'upload d'image
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchModels().then(response => {
        this.list = response.data['hydra:member'] || []
        this.listLoading = false
      })
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.temp = { titre: '', description: '', tekno: '', lien: '', imageSrc: '', text1: '', text2: '', text3: '', text4: '', alt: '', video: '' },
      this.dialogFormVisible = true
    },
    createData() {
      createModel(this.temp).then(() => {
        this.getList()
        this.dialogFormVisible = false
      })
    },
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.temp = { ...row }
      this.dialogFormVisible = true
    },
    updateData() {
      updateModel(this.temp.id, this.temp).then(() => {
        this.getList()
        this.dialogFormVisible = false
      })
    },
    handleDelete(row) {
      deleteModel(row.id).then(() => {
        this.getList()
      })
    },


    openEditModal(record) {
      // Ouvre la modale avec les données de l'enregistrement sélectionné
      this.editRecord = { ...record }; // Copie de l'enregistrement pour éviter la modification directe
      this.isEditModalVisible = true;
    },
    onImageUploadSuccess(file, response) {
      // Gère le succès de l'upload
      if (response && response.status === 'success') {
        this.editRecord.image = response.filePath; // Stocke le chemin de l'image dans l'enregistrement
        this.$message({ message: 'Image uploadée avec succès', type: 'success' });
      } else {
        this.$message({ message: 'Échec de l\'upload', type: 'error' });
      }
    },
    onImageRemove(file) {
      // Gère la suppression de l'image dans Dropzone
      this.editRecord.image = ''; // Supprime le chemin de l'image de l'enregistrement
      this.$message({ message: 'Image supprimée', type: 'success' });
    },
    submitEdit() {
      // Soumet les modifications de l'enregistrement
      // Envoyer `editRecord` au backend pour sauvegarder les changements, y compris le chemin de l'image
      this.$axios.put(`http://localhost:8000/api/models/${this.editRecord.id}`, this.editRecord)
        .then(response => {
          this.$message({ message: 'Enregistrement mis à jour avec succès', type: 'success' });
          this.isEditModalVisible = false;
          this.loadRecords(); // Recharge la liste des enregistrements après modification
        })
        .catch(error => {
          console.error(error);
          this.$message({ message: 'Erreur lors de la mise à jour', type: 'error' });
        });
    },
    loadRecords() {
      // Charge les enregistrements (remplacez avec un appel à l'API si nécessaire)
      this.$axios.get('http://localhost:8000/api/models')
        .then(response => {
          this.records = response.data;
        })
        .catch(error => {
          console.error(error);
          this.$message({ message: 'Erreur lors du chargement des enregistrements', type: 'error' });
        });
    }
  },
  created() {
    this.loadRecords();
  }
  }

</script>

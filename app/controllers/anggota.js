import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import fetchApi from '../utils/fetch-api';
import Swal from 'sweetalert2';

export default class AnggotaController extends Controller {
  @tracked anggotaTim = [];
  @tracked selectedTimName = '';
  @tracked selectedTimId = '';
  @tracked searchQuery = '';
  @tracked filteredAnggota = this.anggotaTim;

  @action
  searchAnggota(event) {
    const query = event.target.value.toLowerCase();
    this.searchQuery = query;
    this.filteredAnggota = this.anggotaTim.filter((anggota) =>
      anggota.nama.toLowerCase().includes(query)
    );
  }

  currentAnggota = { nama: '', peran: '', timId: '' };

  async loadAnggotaTim(timId, timName) {
    this.selectedTimId = timId;
    this.selectedTimName = timName;

    try {
      const response = await fetchApi(`/anggota/getByTim/${timId}`);
      this.anggotaTim = response.data;
    } catch (error) {
      console.error('Error fetching anggota tim:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal memuat anggota tim. Silakan coba lagi.',
      });
    }
  }

  @action
  goBack() {
    this.transitionToRoute('tim');
  }

  @action
  updateField(fieldName, event) {
    this.currentAnggota[fieldName] = event.target.value;
  }

  @action
  openAddAnggotaModal() {
    this.currentAnggota = {
      nama: '',
      peran: '',
      timId: this.selectedTimId,
    };

    const modal = new bootstrap.Modal(
      document.getElementById('addAnggotaModal')
    );
    modal.show();
  }

  @action
  async submitAddAnggota(event) {
    event.preventDefault();

    const { nama, peran, timId } = this.currentAnggota;

    if (!nama || !peran || !timId) {
      Swal.fire({
        icon: 'warning',
        title: 'Peringatan',
        text: 'Semua field harus diisi.',
      });
      return;
    }

    const newAnggota = {
      nama,
      peran,
      tim_id: timId,
    };

    try {
      const response = await fetchApi('/anggota/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnggota),
      });

      this.anggotaTim.pushObject(response.data);

      this.set('currentAnggota', {
        nama: '',
        peran: '',
        timId: this.selectedTimId,
      });

      const modalElement = document.getElementById('addAnggotaModal');
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Anggota berhasil ditambahkan!',
      });
    } catch (error) {
      console.error('Gagal menambahkan anggota:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal menambahkan anggota. Silakan coba lagi.',
      });
    }
  }

  @action
  openEditAnggotaModal(anggota) {
    this.currentAnggota = { ...anggota };

    const modal = new bootstrap.Modal(
      document.getElementById('editAnggotaModal')
    );
    modal.show();
  }

  @action
  async submitEditAnggota(event) {
    event.preventDefault();

    try {
      await fetchApi(`/anggota/update/${this.currentAnggota.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.currentAnggota),
      });

      await this.loadAnggotaTim(this.selectedTimId, this.selectedTimName);

      const modal = bootstrap.Modal.getInstance(
        document.getElementById('editAnggotaModal')
      );
      modal.hide();

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Anggota berhasil diperbarui.',
      });
    } catch (error) {
      console.error('Gagal mengupdate anggota:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal memperbarui anggota. Silakan coba lagi.',
      });
    }
  }

  @action
  async confirmDeleteAnggota(anggota) {
    this.currentAnggota = anggota;

    const modal = new bootstrap.Modal(
      document.getElementById('deleteAnggotaModal')
    );
    modal.show();
  }

  @action
  async deleteAnggota() {
    try {
      console.log('Menghapus anggota dengan ID:', this.currentAnggota.id);

      await fetchApi(`/anggota/delete/${this.currentAnggota.id}`, {
        method: 'DELETE',
      });

      await this.loadAnggotaTim(this.selectedTimId, this.selectedTimName);

      const modal = bootstrap.Modal.getInstance(
        document.getElementById('deleteAnggotaModal')
      );
      modal.hide();

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Anggota berhasil dihapus.',
      });
    } catch (error) {
      console.error('Gagal menghapus anggota:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal menghapus anggota. Silakan coba lagi.',
      });
    }
  }
}

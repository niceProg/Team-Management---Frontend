import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import fetchApi from '../utils/fetch-api';
import Swal from 'sweetalert2';
import { tracked } from '@glimmer/tracking';

export default class TimController extends Controller {
  @service router;
  @tracked model = [];
  @tracked selectedTimId = null;
  @tracked selectedTimName = '';
  @tracked currentTim = { nama: '', deskripsi: '' };
  @tracked searchQuery = '';
  @tracked filteredTim = this.model;

  @action
  searchTim(event) {
    const query = event.target.value.toLowerCase();
    this.searchQuery = query;
    this.filteredTim = this.model.filter((tim) =>
      tim.nama.toLowerCase().includes(query)
    );
  }

  async loadTim() {
    try {
      const response = await fetchApi('/tim/getAll');
      this.model = response.data;
    } catch (error) {
      console.error('Error loading tim:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Gagal memuat data tim.',
      });
    }
  }

  @action
  selectTimForAnggota(timId, timName) {
    this.selectedTimId = timId;
    this.selectedTimName = timName;
    this.transitionToRoute('anggota', timId);
  }

  @action
  openAddTimModal() {
    this.currentTim = { nama: '', deskripsi: '' };
    const modal = new bootstrap.Modal(document.getElementById('addTimModal'));
    modal.show();
  }

  @action
  async submitAddTim(event) {
    event.preventDefault();

    const newTim = this.currentTim;
    if (!newTim.nama) {
      Swal.fire({
        icon: 'warning',
        title: 'Peringatan!',
        text: 'Nama tim wajib diisi!',
      });
      return;
    }

    try {
      await fetchApi('/tim/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTim),
      });

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Tim berhasil ditambahkan!',
      });

      await this.loadTim();

      const modal = bootstrap.Modal.getInstance(
        document.getElementById('addTimModal')
      );
      if (modal) modal.hide();

      this.currentTim = { nama: '', deskripsi: '' };
    } catch (error) {
      console.error('Error creating tim:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Gagal menambahkan tim.',
      });
    }
  }

  @action
  openEditTimModal(tim) {
    this.currentTim = { ...tim };
    const modal = new bootstrap.Modal(document.getElementById('editTimModal'));
    modal.show();
  }

  @action
  async submitEditTim(event) {
    event.preventDefault();

    try {
      const updatedTim = this.currentTim;
      await fetchApi(`/tim/update/${updatedTim.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTim),
      });

      Swal.fire({
        icon: 'success',
        title: 'Sukses',
        text: 'Data tim berhasil diperbarui!',
      });

      await this.loadTim();

      const modal = bootstrap.Modal.getInstance(
        document.getElementById('editTimModal')
      );
      if (modal) modal.hide();
    } catch (error) {
      console.error('Error updating tim:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal memperbarui data tim!',
      });
    }
  }

  @action
  async deleteTim(timId) {
    if (!timId) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'ID tim tidak valid!',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Hapus Tim',
      text: 'Apakah Anda yakin ingin menghapus tim ini?',
      icon: 'warning',
      iconHtml: '🗑️',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        await fetchApi(`/tim/delete/${timId}`, { method: 'DELETE' });
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Tim berhasil dihapus.',
        });

        await this.loadTim();
      } catch (error) {
        console.error('Error deleting tim:', error);
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: 'Gagal menghapus tim.',
        });
      }
    }
  }

  constructor() {
    super(...arguments);
    this.loadTim();
  }
}

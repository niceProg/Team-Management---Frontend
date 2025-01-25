import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import fetchApi from '../utils/fetch-api';
import Swal from 'sweetalert2';
import { tracked } from '@glimmer/tracking';

export default class TimController extends Controller {
  @service router; // Gunakan router service untuk navigasi
  @tracked model = []; // Data tabel tim
  @tracked selectedTimId = null;
  @tracked selectedTimName = '';
  @tracked currentTim = { nama: '', deskripsi: '' }; // Data tim untuk form
  @tracked searchQuery = ''; // Pencarian
  @tracked filteredTim = this.model; // Data yang ditampilkan

  @action
  searchTim(event) {
    const query = event.target.value.toLowerCase();
    this.searchQuery = query;
    this.filteredTim = this.model.filter((tim) =>
      tim.nama.toLowerCase().includes(query)
    );
  }

  // Memuat data tim dari API
  async loadTim() {
    try {
      const response = await fetchApi('/tim/getAll'); // Endpoint untuk mendapatkan semua tim
      this.model = response.data; // Perbarui data tabel
    } catch (error) {
      console.error('Error loading tim:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Gagal memuat data tim.',
      });
    }
  }

  // Navigasi ke halaman anggota berdasarkan timId
  @action
  selectTimForAnggota(timId, timName) {
    this.selectedTimId = timId;
    this.selectedTimName = timName;
    this.transitionToRoute('anggota', timId);
  }

  // Buka modal tambah tim
  @action
  openAddTimModal() {
    this.currentTim = { nama: '', deskripsi: '' }; // Reset data form
    const modal = new bootstrap.Modal(document.getElementById('addTimModal')); // Bootstrap modal
    modal.show();
  }

  // Submit form tambah tim
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

      // Muat ulang tabel
      await this.loadTim();

      // Tutup modal
      const modal = bootstrap.Modal.getInstance(
        document.getElementById('addTimModal')
      );
      if (modal) modal.hide();

      // Reset form
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

  // Buka modal edit tim
  @action
  openEditTimModal(tim) {
    this.currentTim = { ...tim }; // Set data tim yang ingin diedit
    const modal = new bootstrap.Modal(document.getElementById('editTimModal'));
    modal.show();
  }

  // Submit form edit tim
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

      // Muat ulang tabel
      await this.loadTim();

      // Tutup modal
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

  // Hapus tim
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

        // Muat ulang tabel
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

  // Panggil metode loadTim saat controller diinisialisasi
  constructor() {
    super(...arguments);
    this.loadTim();
  }
}

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import fetchApi from '../utils/fetch-api';
import Swal from 'sweetalert2';

export default class AnggotaController extends Controller {
  @tracked anggotaTim = []; // Data anggota tim
  @tracked selectedTimName = ''; // Nama tim yang sedang dilihat
  @tracked selectedTimId = ''; // ID tim yang sedang dilihat
  @tracked searchQuery = ''; // Pencarian
  @tracked filteredAnggota = this.anggotaTim; // Data yang ditampilkan

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
    this.selectedTimId = timId; // Simpan timId dari route
    this.selectedTimName = timName; // Simpan timName dari route

    try {
      const response = await fetchApi(`/anggota/getByTim/${timId}`);
      this.anggotaTim = response.data; // Data anggota dari API
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
    this.transitionToRoute('tim'); // Kembali ke daftar tim
  }

  @action
  updateField(fieldName, event) {
    this.currentAnggota[fieldName] = event.target.value;
  }

  @action
  openAddAnggotaModal() {
    // Tim ID otomatis diambil dari selectedTimId
    this.currentAnggota = {
      nama: '',
      peran: '',
      timId: this.selectedTimId, // ID tim otomatis sesuai route
    };

    // Buka modal menggunakan Bootstrap
    const modal = new bootstrap.Modal(
      document.getElementById('addAnggotaModal')
    );
    modal.show();
  }

  @action
  async submitAddAnggota(event) {
    event.preventDefault();

    //     console.log('Data sebelum dikirim:', this.currentAnggota);

    const { nama, peran, timId } = this.currentAnggota;

    // Validasi input
    if (!nama || !peran || !timId) {
      Swal.fire({
        icon: 'warning',
        title: 'Peringatan',
        text: 'Semua field harus diisi.',
      });
      return;
    }

    // Pastikan format data yang dikirim sesuai dengan backend
    const newAnggota = {
      nama,
      peran,
      tim_id: timId, // Ubah dari timId (camelCase) ke tim_id (snake_case)
    };

    try {
      const response = await fetchApi('/anggota/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnggota),
      });

      // Tambahkan anggota baru ke daftar anggota jika berhasil
      this.anggotaTim.pushObject(response.data);

      // Reset form
      this.set('currentAnggota', {
        nama: '',
        peran: '',
        timId: this.selectedTimId,
      });

      // Tutup modal
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
    // Isi `currentAnggota` dengan data anggota yang akan diupdate
    this.currentAnggota = { ...anggota };

    // Buka modal menggunakan Bootstrap
    const modal = new bootstrap.Modal(
      document.getElementById('editAnggotaModal')
    );
    modal.show();
  }

  @action
  async submitEditAnggota(event) {
    event.preventDefault();

    //     console.log('Data sebelum diupdate:', this.currentAnggota);

    try {
      await fetchApi(`/anggota/update/${this.currentAnggota.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.currentAnggota),
      });

      // Refresh data tabel
      await this.loadAnggotaTim(this.selectedTimId, this.selectedTimName);

      // Tutup modal
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
    // Simpan anggota yang akan dihapus untuk konfirmasi
    this.currentAnggota = anggota;

    // Buka modal konfirmasi menggunakan Bootstrap
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

      // Reload tabel anggota setelah berhasil dihapus
      await this.loadAnggotaTim(this.selectedTimId, this.selectedTimName);

      // Tutup modal konfirmasi
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

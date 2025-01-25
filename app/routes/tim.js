import Route from '@ember/routing/route';
import fetchApi from '../utils/fetch-api';

export default class TimRoute extends Route {
  // Memuat data tim dari API
  async model() {
    try {
      const timData = await fetchApi('/tim/getAll');
      //  console.log('Data Tim:', timData); // Log data yang diterima
      return timData.data; // Sesuaikan dengan struktur respons API Anda
    } catch (error) {
      console.error('Error fetching tim data:', error);
      return [];
    }
  }

  // Fungsi untuk membuat tim baru
  //   async createTim(timData) {
  //     try {
  //       const response = await fetchApi('/tim/create', {
  //         method: 'POST',
  //         body: JSON.stringify(timData),
  //         headers: { 'Content-Type': 'application/json' },
  //       });
  //       alert('Tim berhasil dibuat!');
  //       this.refresh(); // Refresh model untuk memuat data terbaru
  //     } catch (error) {
  //       console.error('Error creating tim:', error);
  //       alert('Gagal membuat tim.');
  //     }
  //   }

  // Fungsi untuk memperbarui tim
  //   async updateTim(timData) {
  //     try {
  //       await fetchApi(`/tim/update/${timData.id}`, {
  //         method: 'PUT',
  //         body: JSON.stringify(timData),
  //         headers: { 'Content-Type': 'application/json' },
  //       });
  //       alert('Tim berhasil diperbarui!');
  //       this.refresh(); // Refresh model untuk memuat data terbaru
  //     } catch (error) {
  //       console.error('Error updating tim:', error);
  //       alert('Gagal memperbarui tim.');
  //     }
  //   }

  // Fungsi untuk menghapus tim
  //   async deleteTim(id) {
  //     try {
  //       await fetchApi(`/tim/delete/${id}`, { method: 'DELETE' });
  //       alert('Tim berhasil dihapus!');
  //       this.refresh(); // Refresh model untuk memuat data terbaru
  //     } catch (error) {
  //       console.error('Error deleting tim:', error);
  //       alert('Gagal menghapus tim.');
  //     }
  //   }
}

// AnggotaRoute.js
import Route from '@ember/routing/route';
import { action } from '@ember/object';
import fetchApi from '../utils/fetch-api';

export default class AnggotaRoute extends Route {
  async model(params) {
    const timId = params.tim_id; // ID Tim dari URL
    const timName = this.controllerFor('tim').selectedTimName;

    const controller = this.controllerFor('anggota');
    await controller.loadAnggotaTim(timId, timName); // Panggil method untuk load data

    return { timId, timName };
  }
}

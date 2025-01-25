import Route from '@ember/routing/route';

export default class AnggotaRoute extends Route {
  async model(params) {
    const timId = params.tim_id;
    const timName = this.controllerFor('tim').selectedTimName;

    const controller = this.controllerFor('anggota');
    await controller.loadAnggotaTim(timId, timName);

    return { timId, timName };
  }
}

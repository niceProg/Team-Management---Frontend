import Route from '@ember/routing/route';

export default class TimRoute extends Route {
  async model() {
    const controller = this.controllerFor('tim');
    await controller.loadTim();
    return controller.model;
  }
}

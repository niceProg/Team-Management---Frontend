import EmberRouter from '@ember/routing/router';
import config from 'frontend/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  // this.route('tim', function () {
  //   this.route('add', { path: '/tambah' }); // Route untuk form create
  //   this.route('edit', { path: '/edit/:tim_id' }); // Route untuk form update
  // });
  this.route('tim', { path: '/tim' });
  this.route('anggota', { path: '/anggota/:tim_id' });
});

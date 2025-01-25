import Route from '@ember/routing/route';
import fetchApi from '../utils/fetch-api';

export default class TimRoute extends Route {
  async model() {
    try {
      const timData = await fetchApi('/tim/getAll');
      return timData.data;
    } catch (error) {
      console.error('Error fetching tim data:', error);
      return [];
    }
  }
}

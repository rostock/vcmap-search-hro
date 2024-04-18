import { version, name, mapVersion } from '../package.json';
import Geocodr from './geocodr.js';
import SearchGeocodrEditor from './SearchGeocodrEditor.vue';

/**
 * @param {GeocodrSearchOptions} config - the configuration of this plugin instance, passed in from the app.
 * @returns {import("@vcmap/ui/src/vcsUiApp").VcsPlugin<T>}
 * @template {Object} T
 * @template {Object} S
 */
export default function searchGeocodr(config) {
  return {
    _instance: null,
    _app: null,
    get name() {
      return name;
    },
    get version() {
      return version;
    },
    get mapVersion() {
      return mapVersion;
    },
    /**
     * @param {import("@vcmap/ui").VcsUiApp} vcsUiApp
     */
    initialize(vcsUiApp) {
      this._instance = new Geocodr(config);
      this._app = vcsUiApp;
      vcsUiApp.search.add(this._instance, name);
    },
    /**
     * @returns {GeocodrSearchOptions}
     */
    toJSON() {
      return this._instance.toJSON();
    },
    getDefaultOptions() {
      return Geocodr.getDefaultOptions();
    },
    getConfigEditors() {
      return [{ component: SearchGeocodrEditor }];
    },
    i18n: {
      de: {
        searchGeocodr: {
          name: 'Name',
          url: 'URL zu Geocodr',
          state: 'Bundesland',
          city: 'Stadt',
          countrycode: 'Ländercode',
          limit: 'Maximale Anzahl Resultate',
          bbox: 'Bounding Box',
        },
      },
      en: {
        searchGeocodr: {
          name: 'Name',
          url: 'URL to Geocodr',
          state: 'State',
          city: 'City',
          countrycode: 'Country Code',
          limit: 'Maximum number of results',
          bbox: 'Bounding Box',
        },
      },
    },
  };
}

import { Extent, parseGeoJSON, wgs84Projection } from '@vcmap/core';
import {
  AddressBalloonFeatureInfoView,
  BalloonFeatureInfoView,
  featureInfoViewSymbol,
} from '@vcmap/ui';
import { name } from '../package.json';
import SearchHROBalloonComponent from './SearchHROBalloonComponent.vue';

/**
 *
 * @param {Object} item - response item from the search request
 * @returns {import("@vcmap/ui").ResultItem}
 */
function createResultItem(item) {

  const data = parseGeoJSON(item.geometry);
  const feature = data.features[0];
  
  feature.setProperties({'attributes': item.properties});
  
  const title = item.properties._title_;
  const balloonTitle = item.properties.suchklasse;
  const balloonSubtitle = item.properties.objektgruppe;
 
  feature[featureInfoViewSymbol] = new BalloonFeatureInfoView({
    name: 'GeocodrInfo',
    balloonTitle: balloonTitle,
    balloonSubtitle: balloonSubtitle,
    },
    SearchHROBalloonComponent,
  )
  
  return {
    title,
    feature,
  };
}

/**
 * @typedef {Object} GeocodrSearchOptions
 * @property {string} [url="https://geo.sv.rostock.de/geocodr/query"]
 * @property {string|undefined} city
 * @property {string|undefined} state
 * @property {string|undefined} [countrycode="de"]
 * @property {import("@vcmap/core").Extent.Options|undefined} extent
 * @property {number|undefined} [limit=20]
 * @api
 */

/**
 * @class
 * @implements {import("@vcmap/ui").SearchImpl}
 */
class Geocodr {
  /**
   * @returns {GeocodrSearchOptions}
   */
  static getDefaultOptions() {
    return {
      url: 'https://geo.sv.rostock.de/geocodr/query',
      city: undefined,
      state: undefined,
      countrycode: 'de',
      extent: undefined,
      key: '00000000000000000000000000000000',
      limit: 20,
      type: 'search',
      class: 'address',
      out_epsg: '4326',
    };
  }

  /**
   * @param {GeocodrSearchOptions} options
   */
  constructor(options) {
    /**
     * @type {GeocodrSearchOptions}
     */
    const defaultOptions = Geocodr.getDefaultOptions();

    /** @type {string} */
    this._name = name;

    /** @type {string|Object} */
    this.url = options.url ?? defaultOptions.url;

    /** @type {string|Object} */
    this.url = options.url ?? defaultOptions.url;

    /** @type {string|null} */
    this.city = options.city ?? null;

    /** @type {string|null} */
    this.state = options.state ?? null;

    /** @type {string} */
    this.countrycode = options.countrycode ?? defaultOptions.countrycode;

    /** @type {string} */
    this.key = options.key ?? defaultOptions.key;

    /** @type {import("@vcmap/core").Extent|null} */
    this.extent = options.extent ? new Extent(options.extent) : null;

    /** @type {number} */
    this.limit = options.limit ?? defaultOptions.limit;

    /** @type {string|Object} */
    this.type = options.type ?? defaultOptions.type;

    /** @type {string|Object} */
    this.class = options.class ?? defaultOptions.class;

    /** @type {string|Object} */
    this.out_epsg = options.out_epsg ?? defaultOptions.out_epsg;

    /**
     * @type {AbortController}
     * @private
     */
    this._controller = new AbortController();
  }

  /**
   * @type {string}
   * @readonly
   */
  get name() {
    return this._name;
  }

  /**
   * @param {string} query - search value
   * @returns {Array<ResultItem>}
   */
  async search(query) {
    const params = {
      query,
      countrycodes: this.countrycode,
      format: 'json',
      polygon_geojson: 1,
      addressdetails: 1,
      limit: this.limit,
      key: this.key,
      type: this.type,
      class: this.class,
      out_epsg: this.out_epsg,
    };

    if (this.city) {
      params.query += `,${this.city}`;
    }

    if (this.state) {
      params.query += `,${this.state}`;
    }

    if (this.extent) {
      params.viewbox = this.extent
        .getCoordinatesInProjection(wgs84Projection)
        .join(',');
      params.bounded = 1;
    }

    const url = new URL(this.url);
    url.search = new URLSearchParams(params).toString();
    const { signal } = this._controller.signal;
    const response = await fetch(url, { signal });
    const results = await response.json();
    return results.features.map(createResultItem);
  }

  /*Aufruf nach jeder EIngabe */
  abort() {
    this._controller.abort();
  }

  toJSON() {
    /**
     * @type {GeocodrSearchOptions}
     */
    const defaultOptions = Geocodr.getDefaultOptions();
    const config = {};

    if (this.url !== defaultOptions.url) {
      config.url = this.url;
    }
    if (this.city !== defaultOptions.city) {
      config.city = this.city;
    }
    if (this.state !== defaultOptions.state) {
      config.state = this.state;
    }
    if (this.countrycode !== defaultOptions.countrycode) {
      config.countrycode = this.countrycode;
    }
    if (this.extent && this.extent !== defaultOptions.extent) {
      config.extent = this.extent.toJSON();
    }
    if (this.limit !== defaultOptions.limit) {
      config.limit = this.limit;
    }

    return config;
  }
}

export default Geocodr;
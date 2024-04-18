# @vcmap/search-nominatim

> Part of the [VC Map Project](https://github.com/virtualcitySYSTEMS/map-ui)

This plugin adds a search implementation using [Nominatim](https://nominatim.openstreetmap.org/ui/about.html) to the VC Map.

## Configuration

| key         | type                           | default                                      | description                                                           |
| ----------- | ------------------------------ | -------------------------------------------- | --------------------------------------------------------------------- |
| url         | string                         | `https://nominatim.openstreetmap.org/search` | URL of the nominatim service.                                         |
| city        | string                         | `undefined`                                  | Name of a city to restrict the search to                              |
| state       | string                         | `undefined`                                  | Name of a state to restrict the search to                             |
| countrycode | string                         | `undefined`                                  | Country code of a country to restrict the search to                   |
| extent      | import("@vcmap/core").Extent\  | `undefined`                                  | Extent to restrict the search to                                      |
| limit       | number                         | `20`                                         | Limit the maximum number of returned results. Cannot be more than 40. |

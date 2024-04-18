<template>
    <BalloonComponent v-bind="{ ...$attrs }">
      <template #default="{ attrs }">
        <v-list-item two-line v-if="Object.values(attrs.attributes).length > 0">
          <v-list-item-avatar tile size="40">
            <v-icon size="20"> $vcsHomePoint </v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ $t('searchCoordinate.balloon.geographic') }} (WGS84)
            </v-list-item-title>
            <v-list-item-subtitle>
              <span class="vcs-position-display">
                <span class="pr-1">Lat: </span>
                <span class="pr-1">{{ attrs.attributes.pointWGS84[0] }} </span>
                <span class="pr-1">Lon: </span>
                <span class="pr-1">{{ attrs.attributes.pointWGS84[1] }} </span>
              </span>
            </v-list-item-subtitle>
            <v-list-item-title>
              {{ $t('searchCoordinate.balloon.projected') }}
              ({{ attrs.attributes.epsg }})
            </v-list-item-title>
            <v-list-item-subtitle>
              <span class="vcs-position-display">
                <VcsFormattedNumber
                  no-padding
                  prefix="x:"
                  :value="attrs.attributes.pointProjected[0]"
                />
                <VcsFormattedNumber
                  no-padding
                  prefix="y:"
                  :value="attrs.attributes.pointProjected[1]"
                />
              </span>
            </v-list-item-subtitle>
            <VcsFormButton @click="swapValue" class="py-1">{{
              $t('searchCoordinate.balloon.swapLonLat')
            }}</VcsFormButton>
          </v-list-item-content>
        </v-list-item>
      </template>
    </BalloonComponent>
  </template>
  <script lang="ts">
    import {
      VListItem,
      VListItemContent,
      VListItemTitle,
      VListItemSubtitle,
      VListItemAvatar,
      VIcon,
    } from 'vuetify/lib';
    import {
      BalloonComponent,
      VcsFormButton,
      VcsFormattedNumber,
      VcsUiApp,
    } from '@vcmap/ui';
    import { defineComponent, inject } from 'vue';
    import { mercatorProjection, Projection, wgs84Projection } from '@vcmap/core';
    import { Coordinate } from 'ol/coordinate';
  
    /**
     * @description A balloon viewing coordinate information
     */
    export default defineComponent({
      name: 'CoordinateBalloonComponent',
      components: {
        VcsFormButton,
        VcsFormattedNumber,
        BalloonComponent,
        VListItemAvatar,
        VIcon,
        VListItemTitle,
        VListItem,
        VListItemContent,
        VListItemSubtitle,
      },
      setup(props, { attrs }) {
        const app = inject('vcsApp') as VcsUiApp;
        const wgs84Position = Projection.transform(
          wgs84Projection,
          mercatorProjection,
          attrs.position as Coordinate,
        );
        return {
          swapValue(): void {
            app.search
              .search(wgs84Position.reverse().join(', '))
              .then((results) => {
                if (results.length > 0) {
                  results[0].clicked().catch(() => {});
                }
              })
              .catch(() => {});
          },
        };
      },
    });
  </script>
  <style lang="scss" scoped>
    .vcs-position-display {
      height: 22px;
  
      ::v-deep {
        .vcs-formatted-number,
        .vcs-formatted-number span {
          font-size: unset;
          line-height: unset;
        }
        .vcs-formatted-number-dense {
          line-height: unset;
        }
      }
    }
  </style>
  
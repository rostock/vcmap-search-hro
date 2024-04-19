<template>
    <BalloonComponent v-bind="{ ...$attrs }">
      <template #default="{ attrs }">
        <v-list-item two-line v-if="Object.values(attrs.attributes).length > 0">
          <v-list-item-content>
            <span class="pr-1">{{ attrs.attributes.attributes._title_ }} </span>
          </v-list-item-content>
        </v-list-item>
      </template>
    </BalloonComponent>
  </template>
  <script lang="js">
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
    } from '@vcmap/ui';
    import { defineComponent, inject } from 'vue';
 

  
    /**
     * @description A balloon viewing coordinate information
     */
    export default defineComponent({
      name: 'SearchHROBalloonComponent',
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
      setup(props, { attrs }) { },
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
  
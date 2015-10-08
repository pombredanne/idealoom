'use strict';

var Marionette = require('../../shims/marionette.js'),
    $ = require('../../shims/jquery.js'),
    Agents = require('../../models/agents.js'),
    i18n = require('../../utils/i18n.js'),
    UserNavigationMenu = require('./userNavigationMenu.js'),
    Ctx = require('../../common/context.js');

var profile = Marionette.LayoutView.extend({
  template: '#tmpl-userProfile',
  className: 'admin-profile',
  ui: {
    close: '.bx-alert-success .bx-close',
    profile: '.js_saveProfile',
    form: '.core-form .form-horizontal'
  },
  regions: {
    navigationMenuHolder: '.navigation-menu-holder'
  },

  initialize: function() {
    this.model = new Agents.Model({'@id': Ctx.getCurrentUserId()});
    this.model.fetch();
  },

  modelEvents: {
    'change sync': 'render'
  },

  events: {
    'click @ui.profile': 'saveProfile',
    'click @ui.close': 'close'
  },

  serializeData: function() {
    return {
      profile: this.model
    }
  },

  onRender: function() {
    // this is in onRender instead of onBeforeShow because of the modelEvents
    var menu = new UserNavigationMenu({selectedSection: "profile"});
    this.getRegion('navigationMenuHolder').show(menu);
  },

  saveProfile: function(e) {
    e.preventDefault();

    var real_name = this.$('input[name="real_name"]').val();

    this.model.set({ real_name: real_name});

    this.model.save(null, {
      success: function(model, resp) {
        $.bootstrapGrowl(i18n.gettext('Your settings were saved'), {
          ele: 'body',
          type: 'success',
          offset: {from: 'bottom', amount:20},
          align: 'left',
          delay: 4000,
          allow_dismiss: true,
          stackup_spacing: 10
        });
      },
      error: function(model, resp) {
        $.bootstrapGrowl(i18n.gettext('Your settings fail to update'), {
          ele: 'body',
          type: 'error',
          offset: {from: 'bottom', amount:20},
          align: 'left',
          delay: 4000,
          allow_dismiss: true,
          stackup_spacing: 10
        });
      }
    })
  },

  templateHelpers: function() {
    return {
      urlDiscussion: function() {
        return '/' + Ctx.getDiscussionSlug() + '/';
      }
    }
  }
});

module.exports = profile;

/**
 * Module
 */
Module = typeof Module === 'undefined' ? {} : Module;
Meteor.isClient && Template.registerHelper('Module', Module);

Module.School = {
  name: 'School System',
  version: '0.0.1',
  summary: 'School System is ...',
  roles: [
    'setting',
    'data-insert',
    'data-update',
    'data-remove',
    'report'
  ]
};

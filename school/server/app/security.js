/**
 * Setting
 */
Security.defineMethod("school_ifSetting", {
  fetch: [],
  transform: null,
  deny: function(type, arg, userId) {
    return !Roles.userIsInRole(userId, ['setting'], 'School');
  }
});

/**
 * Data-Insert
 */
Security.defineMethod("school_ifDataInsert", {
  fetch: [],
  transform: null,
  deny: function(type, arg, userId) {
    return !Roles.userIsInRole(userId, ['data-insert'], 'School');
  }
});

/**
 * Data-Update
 */
Security.defineMethod("school_ifDataUpdate", {
  fetch: [],
  transform: null,
  deny: function(type, arg, userId) {
    return !Roles.userIsInRole(userId, ['data-update'], 'School');
  }
});

/**
 * Data-Remove
 */
Security.defineMethod("school_ifDataRemove", {
  fetch: [],
  transform: null,
  deny: function(type, arg, userId) {
    return !Roles.userIsInRole(userId, ['data-remove'], 'School');
  }
});

/**
 * Reporter
 */
Security.defineMethod("school_ifReport", {
  fetch: [],
  transform: null,
  deny: function(type, arg, userId) {
    return !Roles.userIsInRole(userId, ['report'], 'School');
  }
});

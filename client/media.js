Template.media.events({
  'click button': function () {
    Meteor.call('removeMedia', this._id);
  }
})
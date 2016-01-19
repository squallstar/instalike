Template.job.helpers({
  likedPics: function () {
    return Meteor.user().liked || 0;
  }
});

Template.job.events({
  'click a': function (event) {
    event.preventDefault();
    Meteor.call('clearJob');
  }
})
Template.job.events({
  'click a': function (event) {
    event.preventDefault();
    Meteor.call('clearJob');
  }
})
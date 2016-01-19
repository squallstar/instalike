Template.login.events({
  'click [data-login]': function (event) {
    event.preventDefault();

    Meteor.loginWithInstagram({
      requestPermissions: ['public_content', 'likes', 'comments', 'basic']
    }, function (err, res) {

    });
  },
  'click [data-logout]': function (event) {
    event.preventDefault();

    Meteor.logout();
  }
})
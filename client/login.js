Template.login.events({
  'click [data-login]': function (event) {
    event.preventDefault();

    Meteor.loginWithInstagram({
      requestPermissions: ['public_content', 'likes', 'basic']
    }, function (err, res) {

    });
  },
  'click [data-logout]': function (event) {
    event.preventDefault();

    Meteor.logout();
  },
  'click [data-update-token]': function (event) {
    var token = prompt('Please type your new Access Token.\r\n\r\nYou can get a token here:\r\nhttps://elfsight.com/service/get-instagram-access-token/', '');

    if (!token) {
      return;
    }

    Meteor.call('updateUserAccessToken', token);
  }
})
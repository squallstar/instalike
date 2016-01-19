  ServiceConfiguration.configurations.remove({
    service: 'instagram'
  });

  ServiceConfiguration.configurations.insert({
    service: 'instagram',
    clientId: Meteor.settings.instagram.clientId,
    scope: 'public_content',
    secret: Meteor.settings.instagram.clientSecret
  });
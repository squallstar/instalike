var async = Meteor.npmRequire('async');
var instagramNode = Meteor.npmRequire('instagram-node');

var wrapperGetPics = Meteor.wrapAsync(getPics);
var wrapperLikeMedia = Meteor.wrapAsync(likeMedia);

Instagram = {};

/* --------------------------------------------------- */

Instagram.likeAllMedias = function (options) {
  var liked = 0;

  var pics = Media.find({
    user: options.userId
  }, {
    sort: { created_time: -1 }
  }).fetch();

  if (!pics.length) {
    return 0;
  }

  pics.forEach(function (pic) {
    if (wrapperLikeMedia(pic)) {
      liked++;
      Media.remove(pic.id);
    }
  });

  console.log('Liked', liked, 'pics of', pics.length);

  Meteor.users.update({ _id: options.userId }, {
    $inc: {
      liked: liked
    }
  });

  return liked;
};

/* --------------------------------------------------- */

Instagram.fetchPics = function (options) {
  var pics = [],
      loops = 0,
      inserted = 0,
      limit = parseInt(options.limit || 20),
      done = false;

  while (!done) {
    var newPics = wrapperGetPics(options);

    for (var i = 0; i < newPics.length; i++) {
      var pic = newPics[i];

      Media.upsert(pic.id, {
        $set: pic
      });

      inserted++;

      if (inserted >= limit) {
        done = true;
        break;
      }
    }

    loops++;

    if (loops > 20) {
      done = true;
    }
  }

  return inserted;
};

/* --------------------------------------------------- */

function likeMedia (pic, next) {
  var ig = instagramNode.instagram(),
      user = Meteor.users.findOne(pic.user);

  ig.use({
    access_token: user.instagramAccessToken || user.services.instagram.accessToken
  });

  ig.add_like(pic.instagram_id, function (err) {
    if (err) {
      console.log('Cannot like pic', err.error_type);
    }
    next(null, !err);
  });
}

/* --------------------------------------------------- */

function getPics (options, next) {
  var userId = options.userId,
      pics = [];

  check(userId, String);
  check(options.query, String);

  var ig = instagramNode.instagram(),
      user = Meteor.users.findOne(userId),
      attrs = {};

  ig.use({
    access_token: user.instagramAccessToken || user.services.instagram.accessToken
  });

  ig.tag_media_recent(options.query, options, function (err, medias, pagination, remaining, limit) {
    var count = 0;

    options.max_tag_id = pagination.next_max_id;

    _.each(medias, function (media) {
      var likes = media.likes.count;

      if (media.user_has_liked
          || (options.min_likes && likes < options.min_likes)
          || (options.max_likes && likes > options.max_likes)) {
        return;
      }

      pics.push({
        id: media.id + '-' + userId,
        user: userId,
        instagram_id: media.id,
        created_time: Date.now(),
        image: media.images.standard_resolution.url,
        liked: media.user_has_liked,
        likes: likes
      });

      count++;
    });

    next(null, pics);
  });
}

/* --------------------------------------------------- */

Meteor.methods({
  fetchPics: function (options) {
    check(options, Object);
    options.userId = Meteor.userId();

    Instagram.fetchPics(options);
  },
  likeAllMedias: function (options) {
    Instagram.likeAllMedias({
      userId: Meteor.userId()
    });
  },
  clearMedias: function () {
    return Media.remove({ user: Meteor.userId() });
  },
  removeMedia: function (id) {
    return Media.remove(id);
  },
  saveQueryAsJob: function (options) {
    Meteor.users.update(Meteor.userId(), {
      $set: {
        job: options
      }
    });
  },
  clearJob: function () {
    Meteor.users.update(Meteor.userId(), {
      $set: {
        job: null
      }
    });
  },
  updateUserAccessToken: function (token) {
    Meteor.users.update(Meteor.userId(), {
      $set: {
        'instagramAccessToken': token
      }
    });
  }
});
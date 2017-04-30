var express = require('express');
var expressGraphql = require('express-graphql');
var firebase = require('firebase');
var admin = require("firebase-admin");
var serviceAccount = require("./ajmore-games-firebase-adminsdk-2bd4t-a592195a67.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ajmore-games.firebaseio.com"
});

var Twitter = require('twitter');
var twitterCredentials = require('./twitter-credentials')
var client = new Twitter(twitterCredentials);

var schema = require('./schema');

const Query = {
    hello: () => {
        return admin.database().ref('/tweets/nodejs').once('value').then((snap) => {
            return JSON.stringify(snap.val());
        });
    },
    helloWorld: () => {
        return 'Hello World???';
    },
    getAllHandles: () => {
        return admin.database().ref('/tweet-list/').once('value').then((snap) => {
            var data = snap.val();
            var allHandles = Object.keys(snap.val());
            return allHandles.map((item) => {
                var characters = [111, 2222, 333].map((entry) => {
                    console.log(entry);
                    return new Character(entry);
                });
                var rVal = data[item];
                rVal.characters = characters;
                return rVal;
            });
        });
    }
}

const Mutation = {
    addTwitterHandle: (args, request) => {
        var params = { screen_name: args.input.name };
        console.log(params);
        return client.get('users/lookup', params).then(function (users) {
            var ref = '/tweet-list/' + args.input.name;
            return admin.database().ref(ref).set(users[0]).then((snap) => {
                var user = users[0];
                return {
                    followers_count: user.followers_count,
                    name: user.name,
                    profile_image_url: user.profile_image_url,
                    screen_name: user.screen_name,
                    statuses_count: user.statuses_count
                };
            });
        });
    }
}

// This class implements the RandomDie GraphQL type
class Character {
    constructor(entry) {
        this.entry = entry;
    }

    name() {
        return this.entry;
    }

    village() {
        return this.entry + '-village';
    }
}

var root = Object.assign({}, Query, Mutation);

var app = express();
app.use('/graphql', expressGraphql({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');



// params = { screen_name: 'nodejs', since_id: '857715990771245000' };
// client.get('statuses/user_timeline', params, function (error, tweets, response) {
//     if (!error) {
//         saveAllTweets(tweets);
//     }
// });

// function saveAllTweets(tweets) {
//     let requests = tweets.map((item) => {
//         return new Promise((resolve) => {
//             admin.database().ref('/tweets/nodejs').push(item).then(resolve);
//         });
//     });
//     Promise.all(requests).then(() => { process.exit(); });
// }
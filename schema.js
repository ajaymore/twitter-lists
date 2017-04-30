var { buildSchema } = require('graphql');
var schema = buildSchema(`
    type Tweet {
        jsonValue: String
    }

    type Query {
        hello: String    
        helloWorld: String
        getAllHandles: [Handle]
    }

    type Character {
        name: String,
        village: String
    }

    type Handle {
        followers_count(name: String): String
        name: String
        profile_image_url: String
        screen_name: String
        statuses_count: String
        characters: [Character]
    }

    input TwitterHandleInput {
        name: String!
    }

    type Mutation {
        addTwitterHandle(input: TwitterHandleInput): Handle
    }
`);

module.exports = schema;
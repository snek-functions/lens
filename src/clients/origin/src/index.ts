import { makeSnekQuery } from "snek-query";
import { Query, Mutation } from "./schema.generated.js";

export const sq = makeSnekQuery({ Query, Mutation }, {
    apiURL: "http://origin:3000/graphql"
});

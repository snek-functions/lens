import { makeSnekQuery } from "snek-query";
import { Query, Mutation } from "./schema.generated.js";

const apiURL =
  process.env.GATSBY_ORIGIN_API_URL ||
  process.env.ORIGIN_API_URL ||
  "https://services.snek.at/graphql";

console.log(`Initialized 'origin-sq' on '${apiURL}'`);

export const sq = makeSnekQuery(
  { Query, Mutation },
  {
    apiURL,
  }
);

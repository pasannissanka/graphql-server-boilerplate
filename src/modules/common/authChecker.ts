import { AuthChecker } from "type-graphql";
import { ContextType } from "./types/Context.type";

export const customAuthChecker: AuthChecker<ContextType> = (
    { root, args, context, info },
    roles,
  ) => {
    // here we can read the user from context
    // and check his permission in the db against the `roles` argument
    // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
    if (context.user) {
        return true; // or false if access is denied
    }
    return false;
  };
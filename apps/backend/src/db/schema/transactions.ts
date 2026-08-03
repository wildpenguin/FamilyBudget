import * as p from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import { typeEnum } from "./categories";

export const transactions = p.pgTable("transactions", {
    id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
    amount: p.numeric({ precision: 12, scale: 2 }).notNull(),
    category_id: p.integer(),
    type: typeEnum(),
    ...timestamps,
});

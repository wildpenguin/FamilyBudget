import * as p from "drizzle-orm/pg-core";

export const categories = p.pgTable("categories", {
    id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
    category_name: p.varchar().notNull(),
});

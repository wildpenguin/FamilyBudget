import cors from "cors";
import express from "express";

import { router } from "./routes";

const app = express();
const port = process.env.PORT ?? 3000;

// Express 5 defaults to the 'simple' query parser (Node's querystring),
// which doesn't understand bracket notation like `filter[type]=expense`.
// 'extended' restores qs-based nested parsing, which several endpoints
// (transactions, budgets overview) rely on for `filter[from]`/`filter[to]`/`filter[type]`.
app.set("query parser", "extended");

app.use(cors());
app.use(express.json());
app.use("/", router);

app.listen(port, () => {
	console.log(`API listening on http://localhost:${port}`);
});

export default app;

import express from "express";
const app = express();

import { createServer } from "http";
const http = createServer(app);

import helmet from "helmet";

import { staticRouter, router } from "./modules/routes.mjs";

import { serverSettings as config, __dirname } from "./config.mjs";

import path from "path";

app.set("views", path.join(__dirname, "public", "views"));
app.set("view engine", "ejs");

app.use(helmet({
	xssFilter: false,
}));

app.use(express.json({ limit: "1kb" }));

app.use(staticRouter);

app.use(router);

{
	const {
		PORT,
		REPL_SLUG,
		REPL_OWNER
	} = config;

	http.listen(
		PORT,
		() => {
			console.log(
				"\nlistening on 0.0.0.0:%O at %O.%O.repl.co starting at %O UTC time",
				PORT,
				REPL_SLUG,
				REPL_OWNER,
				new Date().toLocaleString()
			);
		}
	);
}
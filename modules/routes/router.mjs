import express from "express";
const router = express.Router();

import { randomBytes } from "crypto";

import path from "path";
import { errors, __dirname } from "../../config.mjs"

const PUBLIC_PATH = path.join(__dirname, "public");

import rateLimit from "express-rate-limit";

import db from "../replitdb-client.mjs";

function auth(req, res, next) {
	if(req.get("X-Replit-User-Name")) {
		next();
	} else {
		res.redirect("/login");
	}
}

const cspHeaders = `
	upgrade-insecure-requests;
	default-src 'self' https://repl.it;
	style-src 'self' https://fonts.googleapis.com/css2;
	style-src-elem 'self' https://fonts.googleapis.com/css2;
	style-src-attr 'none';
	font-src https://fonts.gstatic.com;
	child-src 'none';
	connect-src https://Obby.epicgamer007.repl.co/;
	frame-src 'none';
	manifest-src 'none';
	frame-ancestors sameorgin;
	img-src *;
	media-src *;
	object-src 'none';
	prefetch-src 'none';
	script-src 'none';
	script-src-elem https://Obby.epicgamer007.repl.co/scripts/ https://Obby.epicgamer007.repl.co/lib/ 'unsafe-inline';
	script-src-attr 'none';
	worker-src 'none';
	`.replace(/\s/g, ' ');

const httpHeaders = {
	"Content-Security-Policy": cspHeaders,
	"x-content-type-options": "nosniff"
};

router.use(rateLimit({
	windowMs: 60 * 1000,
	max: 60
}));

router.use((_req, res, next) => {
	res.set(httpHeaders); 

	res.removeHeader("X-Powered-By");
	res.removeHeader("X-Frame-Options");
	res.removeHeader("x-frame-options");

	next();
});

router.get("/", auth, (req, res) => {

	res.set("Content-type", "text/html; charset=UTF-8");

	res.render("index");
});

router.get("/login", (req, res) => {
	if (req.get("X-Replit-User-Id")) {
		res.redirect("/");
	} else {
		res.render("login");
	}
});

router.get("/leaderboard", async (req, res) => {
	const resp = await db.getAll();
	let leaders = [];
	for(const key in resp) {
		leaders.push({
			user: key,
			score: resp[key]
		});
	}
	leaders.sort((a, b) => {
		return a.score - b.score;
	});
	res.render("leaderboard", {
		leaders
	});
});

router.post("/score", auth, (req, res) => {

	db.get(req.get("X-Replit-User-Name")).then(resp => {
		if(parseInt(resp) < req.body.score || resp == undefined || resp == null || resp.length < 1) {
			db.set(req.get("X-Replit-User-Name"), `${req.body.score}`).then((resp) => {
				console.log(resp);
				res.json(resp);
			});
		}
	});
	
});

router.get("*", (req, res) => {
	res.set("Content-type", "text/html; charset=UTF-8");

	res.set(httpHeaders);

	res.render("error", errors[404]);
});

export default router;
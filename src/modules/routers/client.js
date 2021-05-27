import express from "express";
const router = express.Router();

import { errors } from "../../config.js"

import rateLimit from "express-rate-limit";

import db from "../replitdb-client.js";

function auth(req, res, next) {
	if(req.get("X-Replit-User-Name")) {
		next();
	} else {
		res.redirect("/login");
	}
}

const lets = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefighijklmnopqrstuvwxyz1234567890!@#$%^&*(){}[]|\\\"\'<><..daho~~``?".split('');

function generateToken(length = 20) {
	let finalStr = "";
	for(let i = 0; i < length; i++) {
		finalStr += lets[Math.round(Math.random() * length)]
	}
	return finalStr;
}

let tokens = [];

const cspHeaders = `
	upgrade-insecure-requests;
	default-src 'self' https://replit.com;
	style-src 'self' https://fonts.googleapis.com/css2;
	style-src-elem 'self' https://fonts.googleapis.com/css2;
	style-src-attr 'none';
	font-src https://fonts.gstatic.com;
	child-src 'none';
	connect-src 'self';
	frame-src 'none';
	manifest-src 'none';
	frame-ancestors sameorgin;
	img-src 'self';
	media-src 'none';
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
	max: 20
}));

router.use((_req, res, next) => {
	res.set(httpHeaders); 

	res.removeHeader("X-Powered-By");
	res.removeHeader("X-Frame-Options");
	res.removeHeader("x-frame-options");

	next();
});

router.get("/", auth, (req, res) => {

	let token = generateToken();
	tokens.push(token);

	res.set("Content-type", "text/html; charset=UTF-8");

	res.render("index", {
		token
	});
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

router.get("/loggedout", (req, res) => {
	if(req.get("X-Replit-User-Name")) res.redirect("/");
	else res.render("loggedout");
});

router.post("/score", auth, (req, res) => {

	if(!req.body.token) return res.json({message: "No token"});
	if(tokens.indexOf(req.body.token) < 0) return res.json({message: "Invalid token"});

	if(!req.body.score) return res.json({message: "No score provided"});
	if(parseInt(req.body.score) < 0 || parseInt(req.body.score) > 100000) return res.json({message: "Impossible score"});

	delete tokens[tokens.indexOf(req.body.token)];

	db.get(req.get("X-Replit-User-Name")).then(resp => {
		if(parseInt(resp) < req.body.score || resp == undefined || resp == null || resp.length < 1) {
			db.set(req.get("X-Replit-User-Name"), `${req.body.score}`).then((resp) => {
				console.log(resp);
				res.json(resp);
			});
		}
	});
	
});

router.post("/exit", (req, res) => {
	if(!req.body.token) return res.json({message: "No token"});

	if(delete tokens[tokens.indexOf(req.body.token)]) res.json({ message: "Deleted token"});
	else res.json({message: "Failed to delete token"});

});

router.get("*", (req, res) => {
	res.set("Content-type", "text/html; charset=UTF-8");

	res.set(httpHeaders);

	res.render("error", errors[404]);
});

export default router;
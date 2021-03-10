import express from "express";
const router = express.Router();
import path from "path";
import { __dirname } from "../../config.mjs";

const PUBLIC_PATH = path.join(__dirname, "public");

router.use(express.static(path.join(PUBLIC_PATH, "static"), {
	setHeaders: (res, path, stat) => {
		res.removeHeader("X-Powered-By");
		res.removeHeader("X-Frame-Options");
		res.removeHeader("x-frame-options");
		res.removeHeader("content-security-policy");
		res.removeHeader("Content-Security-Policy");
		res.set("x-content-type-options", "nosniff");
	}
}));

router.get("/favicon.ico", (req, res) => {
	res.removeHeader("X-Powered-By");
	res.removeHeader("X-Frame-Options");
	res.removeHeader("x-frame-options");
	res.removeHeader("content-security-policy");
	res.removeHeader("Content-Security-Policy");
	res.set("x-content-type-options", "nosniff");
	res.sendFile(path.join(PUBLIC_PATH, "static", "assets", "favicon.ico"));
});

export default router;
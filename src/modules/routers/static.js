import express from "express";
const router = express.Router();
import { join } from "path";
import { __dirname } from "../../config.js";

router.use(express.static(join(__dirname, "public"), {
	setHeaders: (res) => {
		res.removeHeader("X-Powered-By");
		res.removeHeader("X-Frame-Options");
		res.removeHeader("Content-Security-Policy");
		res.set("x-content-type-options", "nosniff");
	}
}));

router.get("/favicon.ico", (req, res) => {
	res.removeHeader("X-Powered-By");
	res.removeHeader("X-Frame-Options");
	res.removeHeader("Content-Security-Policy");
	res.set("x-content-type-options", "nosniff");
	res.sendFile(join(__dirname, "public", "assets", "favicon.ico"));
});

export default router;
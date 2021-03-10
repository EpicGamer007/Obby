const { env } = process;

const { REPL_SLUG, REPL_OWNER } = env;

export const serverSettings = {
	PORT: 5050,
	REPL_SLUG, 
	REPL_OWNER
};

export const errors = {
	403: {
		errorType: "403 Forbidden",
		errorMessage: "Access to the requested resource is prohibited."
	},
	404: {
		errorType: "404 Not found",
		errorMessage: "The requested resource was not found by the server. You may have stumbled across a dead or unused hyperlink."
	}
};

export const __dirname = new URL("./", import.meta.url).pathname;
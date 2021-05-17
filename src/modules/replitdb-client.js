import fetch from "node-fetch";

class Client {

	constructor(key) {
		if (key) {
			this.key = key;
		} else {
			this.key = process.env.REPLIT_DB_URL;
		}
	}

	get(key) {
		return new Promise((resolve, reject) => {
			fetch(`${this.key}/${encodeURIComponent(key)}`).then(val => resolve(val.text())).catch(err => reject(err));
		});
	}

	set(keyT, value) {

		return new Promise((resolve, reject) => {
			const key = encodeURIComponent(keyT);
			const strValue = encodeURIComponent(value);

			fetch(this.key, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				body: key + "=" + strValue,
			}).then(res => resolve({message: "Done"})).catch(err => reject(err));
		});

	}

	delete(key) {
		fetch(this.key + "/" + encodeURIComponent(key), { method: "DELETE" }).then(res => resolve({message: "Done"})).catch(err => reject(err));
	}

	list(prefix = "") {
		return new Promise((resolve, reject) => {
			fetch(
			`${this.key}?encode=true&prefix=${encodeURIComponent(prefix)}`
			).then((r) => r.text()).then((t) => {
				if (t.length === 0) {
					return [];
				}
				resolve(t.split("\n").map(decodeURIComponent));
			}).catch(err => reject(err));
		});
	}

	async empty() {
		const promises = [];
		for (const key of await this.list()) {
			promises.push(this.delete(key));
		}

		await Promise.all(promises);
	}

	async getAll() {
		let output = {};
		for (const key of await this.list()) {
			let value = await this.get(key);
			output[key] = value;
		}
		return output;
	}

	async setAll(obj) {
		for (const key in obj) {
			await this.set(key, obj[key]);
		}
	}

	async deleteMultiple(...args) {
		const promises = [];

		for (const arg of args) {
			promises.push(this.delete(arg));
		}

		await Promise.all(promises);

		return this;
	}
}

export default new Client();
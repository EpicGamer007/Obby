function logout(button) {
	button.addEventListener(
		"click",
		async () => {
			await fetch("/logout", {
				method: "POST",
			});

			location.reload();
		}, {
			passive: true,
		}
	);
}

function login(button) {
	button.addEventListener(
		"click",
		() => {
			const width = 400;
			const height = 500;
			const left = (screen.width - width) / 2;
			const top = (screen.height - height) / 2;

			const authWindow = window.open(
				`https://replit.com/auth_with_repl_site?domain=${location.host}`,
				`_blank`,
				`modal=yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
			);

			window.addEventListener("message", (e) => {
				if (e.data === "auth_complete") {
					authWindow.close();
					location.reload(true);
				}
			});
		},
		{
			passive: true,
		}
	);
}

Array.from(document.querySelectorAll(".logout")).forEach(logout);
Array.from(document.querySelectorAll(".login")).forEach(login);

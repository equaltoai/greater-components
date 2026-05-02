
				{
					__sveltekit_1jxudn4 = {
						base: new URL(".", location).pathname.slice(0, -1),
						assets: "/greater-components"
					};

					const element = document.currentScript.parentElement;

					Promise.all([
						import("./_app/immutable/entry/start.Bw32IVmw.js"),
						import("./_app/immutable/entry/app.CbVyizUb.js")
					]).then(([kit, app]) => {
						kit.start(app, element);
					});
				}
			
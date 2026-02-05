
				{
					__sveltekit_1vx37ud = {
						base: "/greater-components/docs",
						assets: "/greater-components/docs"
					};

					const element = document.currentScript.parentElement;

					Promise.all([
						import("/greater-components/docs/_app/immutable/entry/start.D3DX0Ew1.js"),
						import("/greater-components/docs/_app/immutable/entry/app.Ca4MBvN3.js")
					]).then(([kit, app]) => {
						kit.start(app, element);
					});
				}
			
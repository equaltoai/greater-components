
				{
					__sveltekit_7n9l19 = {
						base: new URL("..", location).pathname.slice(0, -1),
						assets: "/greater-components"
					};

					const element = document.currentScript.parentElement;

					Promise.all([
						import("../_app/immutable/entry/start.CUu6mrh3.js"),
						import("../_app/immutable/entry/app.CzVLxZSG.js")
					]).then(([kit, app]) => {
						kit.start(app, element, {
							node_ids: [0, 32],
							data: [{type:"data",data:{testTheme:null,testDensity:null},uses:{}},null],
							form: null,
							error: null
						});
					});
				}
			

				{
					__sveltekit_1szhlx1 = {
						base: new URL(".", location).pathname.slice(0, -1),
						assets: "/greater-components"
					};

					const element = document.currentScript.parentElement;

					Promise.all([
						import("./_app/immutable/entry/start.T7eZ8EV4.js"),
						import("./_app/immutable/entry/app.BfbcVm8L.js")
					]).then(([kit, app]) => {
						kit.start(app, element, {
							node_ids: [0, 42],
							data: [{type:"data",data:{testTheme:null,testDensity:null},uses:{}},null],
							form: null,
							error: null
						});
					});
				}
			
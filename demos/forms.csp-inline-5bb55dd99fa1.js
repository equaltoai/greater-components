
				{
					__sveltekit_hhapga = {
						base: new URL("..", location).pathname.slice(0, -1),
						assets: "/greater-components"
					};

					const element = document.currentScript.parentElement;

					Promise.all([
						import("../_app/immutable/entry/start.DKg_JKBD.js"),
						import("../_app/immutable/entry/app.Dxnz0mvc.js")
					]).then(([kit, app]) => {
						kit.start(app, element, {
							node_ids: [0, 21],
							data: [{type:"data",data:{testTheme:null,testDensity:null},uses:{}},null],
							form: null,
							error: null
						});
					});
				}
			
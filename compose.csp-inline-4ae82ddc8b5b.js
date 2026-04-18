
				{
					__sveltekit_8ks2yc = {
						base: new URL(".", location).pathname.slice(0, -1),
						assets: "/greater-components"
					};

					const element = document.currentScript.parentElement;

					Promise.all([
						import("./_app/immutable/entry/start.zOtpLiiz.js"),
						import("./_app/immutable/entry/app.CCo47gdE.js")
					]).then(([kit, app]) => {
						kit.start(app, element, {
							node_ids: [0, 17],
							data: [{type:"data",data:{testTheme:null,testDensity:null},uses:{}},null],
							form: null,
							error: null
						});
					});
				}
			
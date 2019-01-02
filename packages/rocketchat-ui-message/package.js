Package.describe({
	name: 'rocketchat:ui-message',
	version: '0.1.0',
	// Brief, one-line summary of the package.
	summary: '',
	// URL to the Git repository containing the source code for this package.
	git: '',
	// By default, Meteor will default to using README.md for documentation.
	// To avoid submitting documentation, set this field to null.
	documentation: 'README.md',
});

Package.onUse(function(api) {
	api.use([
		'mongo',
		'ecmascript',
		'templating',
		'tracker',
		'rocketchat:utils',
		'rocketchat:emoji',
		'rocketchat:lib',
		'rocketchat:ui-account',
		'rocketchat:ui-vrecord',
	]);
	api.addAssets('../../node_modules/pdfjs-dist/build/pdf.worker.js', 'client');
	api.mainModule('client/index.js', 'client');
});

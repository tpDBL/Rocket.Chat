Package.describe({
	name: 'rocketchat:push-notifications',
	version: '0.0.1',
	summary: 'Push Notifications Settings',
	git: '',
});

Package.onUse(function(api) {
	api.use([
		'ecmascript',
		'rocketchat:utils',
		'rocketchat:lib',
		'templating',
	]);
	api.addFiles('client/stylesheets/pushNotifications.css', 'client');
	api.mainModule('client/index.js', 'client');
	api.mainModule('server/index.js', 'server');
});

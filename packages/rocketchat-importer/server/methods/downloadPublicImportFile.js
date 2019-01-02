import { Meteor } from 'meteor/meteor';
import { Importers } from 'meteor/rocketchat:importer';
import { RocketChatImportFileInstance } from '../startup/store';
import { ProgressStep } from '../../lib/ImporterProgressStep';
import http from 'http';

Meteor.methods({
	downloadPublicImportFile(fileUrl, importerKey) {
		const userId = Meteor.userId();

		if (!userId) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'downloadPublicImportFile' });
		}

		if (!RocketChat.authz.hasRole(userId, 'admin')) {
			throw new Meteor.Error('not_authorized', 'User not authorized', { method: 'downloadPublicImportFile' });
		}

		const importer = Importers.get(importerKey);
		if (!importer) {
			throw new Meteor.Error('error-importer-not-defined', `The importer (${ importerKey }) has no import class defined.`, { method: 'downloadPublicImportFile' });
		}

		const oldFileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
		const date = new Date();
		const dateStr = `${ date.getUTCFullYear() }${ date.getUTCMonth() }${ date.getUTCDate() }${ date.getUTCHours() }${ date.getUTCMinutes() }${ date.getUTCSeconds() }`;
		const newFileName = `${ dateStr }_${ userId }_${ oldFileName }`;

		importer.instance.startFileUpload(newFileName);
		importer.instance.updateProgress(ProgressStep.DOWNLOADING_FILE_URL);

		const writeStream = RocketChatImportFileInstance.createWriteStream(newFileName);
		http.get(fileUrl, function(response) {
			response.pipe(writeStream);
		});

		writeStream.on('error', Meteor.bindEnvironment(() => {
			importer.instance.updateProgress(ProgressStep.ERROR);
		}));

		writeStream.on('end', Meteor.bindEnvironment(() => {
			importer.instance.updateProgress(ProgressStep.DOWNLOAD_COMPLETE);
		}));
	},
});

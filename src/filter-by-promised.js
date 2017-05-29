import { WorkerService } from './worker-service'
import file from '!raw-loader!./worker.js'

require("babel-core/register")
if (! window._babelPolyfill) {
  require("babel-polyfill");
}

// URL.createObjectURL
window.URL = window.URL || window.webkitURL;

var blob;
try {
    blob = new Blob([file], {type: 'application/javascript'});
} catch (e) { // Backwards-compatibility
    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
    blob = new BlobBuilder();
    blob.append(file);
    blob = blob.getBlob();
}
const worker = new Worker(URL.createObjectURL(blob))

export default async (array, filter) => {
	let resolver, rejecter
	return await new Promise((resolve, reject) => {
			resolver = resolve
			rejecter = reject
			worker.addEventListener('message', resolver);
			worker.addEventListener('error', rejecter);
			worker.postMessage({ array, filter });
	}).then((event) => {
		console.log('RETUN TO ME', event.data)
		worker.removeEventListener('message', resolver);
		worker.removeEventListener('error', rejecter);
		return event.data
	}, (err) => {
		console.error(err)
		worker.removeEventListener('message', resolver);
		worker.removeEventListener('error', rejecter);
	})
}

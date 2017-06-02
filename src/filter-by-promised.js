import file from '!raw-loader!./worker.js'

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

export default (array, filter) => {
	let resolver, rejecter
	return new Promise((resolve, reject) => {
		resolver = resolve
		rejecter = reject
		worker.addEventListener('message', resolver);
		worker.addEventListener('error', rejecter);
		worker.postMessage({ array, filter });
	}).then((event) => {
		worker.removeEventListener('message', resolver);
		worker.removeEventListener('error', rejecter);
		return event.data
	}, (err) => {
		console.error(err)
		worker.removeEventListener('message', resolver);
		worker.removeEventListener('error', rejecter);
	})
}

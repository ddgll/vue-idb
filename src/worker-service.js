
require("babel-core/register")

if (! window._babelPolyfill) {
  require("babel-polyfill");
}

export class WorkerService {

    constructor(path_) {
        this._worker = new Worker(path_)
    }

    async run(){
        console.log('WS START', arguments);
				let resolver, rejecter
        let result = await new Promise((resolve, reject) => {
					resolver = (event) => resolve(event.data)
					rejecter = reject
					this._worker.addEventListener('message', resolver);
					this._worker.addEventListener('error', reject);
					this._worker.postMessage({ ...arguments });
        });
        console.log('WS RESULT', result);
        this._worker.removeEventListener('message', resolver);
        this._worker.removeEventListener('error', rejecter);
        return result;
    }
    
}

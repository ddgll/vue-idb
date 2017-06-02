export class InfiniteList {
	_el
	_store
	_children
	_limitTop
	_limitBottom
	_top
	_height
	_scrollTop
	_loading
	_start
	_limit
	_watcherList
	_watcherFilter
	_paddingTop
	_setInfinite
	_fakeTop

	constructor(el, name, store, limit = 100) {
		this._el = el
		this._setInfinite = `${name}SetInfinite`
		this._store = store
		this._limit = limit
		this._init()
		this._reset()
		this._watcherList = this._store.watch(state => state[name].infinite, list => this._init())
		this._watcherFilter = this._store.watch(state => state[name].thinking, thinking => {
			if(!thinking) this._reset()
		})
	}

	_reset(){
		this._el.scrollTop = 0
		this._scrollTop = 0
		this._paddingTop = 0
		this._start = 0
		this._setFaker()
		this._store.dispatch(this._setInfinite, { offset: this._start, limit: this._limit })
	}

	unset (){
		this._watcherList()
		this._watcherFilter()
	}

	_init (){
		const rect = this._getElemInfo(this._el)
		this._top = rect.top
		this._height = rect.height
		this._children = [].map.call(this._el.childNodes, (element)  => element)
		this._children = this._children.filter(child => !child.classList.contains('infinite-faker'))
		if(this._children.length === this._limit){
			this._limitTop = this._children[10]
			this._limitBottom = this._children[90]
		}else{
			this._limitTop = this._children[10]
			this._limitBottom = null
		}
		this._loading = false
	}
	

	scroll (ev) {
		if(this._loading){			
			this._el.scrollTop = this._scrollTop
			return
		}
		const scrollTop = ev.target.scrollTop
		const diff = this._scrollTop - scrollTop
		const abs = Math.abs(diff)
		if(abs < 20) return
		if(diff < 0){
			this._loadNext(scrollTop)
		}else{
			this._loadPrevious(scrollTop)
		}
		this._scrollTop = scrollTop
	}

	_loadNext () {
		if(this._limitBottom && this._isElementInView(this._limitBottom, false)){
			this._loading = true
			const toRemove = this._children.slice(0, 50)
			let diff = 0, rect
			for(let child of toRemove){
				rect = child.getBoundingClientRect()
				diff += rect.height
			}
			this._paddingTop += diff
			this._setFaker()
			this._start += 50
			this._store.dispatch(this._setInfinite, { offset: this._start, limit: this._limit })
		}
	}

	_loadPrevious () {
		if(this._limitTop && this._isElementInView(this._limitTop, true) && this._start > 0){
			this._loading = true
			const toRemove = this._children.slice(this._children.length - 50)
			let diff = 0, rect
			for(let child of toRemove){
				rect = child.getBoundingClientRect()
				diff += rect.height
			}
			this._paddingTop -= diff
			this._setFaker()
			this._start -= 50
			this._store.dispatch(this._setInfinite, { offset: this._start, limit: this._limit })
		}
	}

	_setFaker () {
		if(this._paddingTop < 0) this._paddingTop = 0
		if(!this._fakeTop) {
			const fakeTop = document.createElement('div')
			fakeTop.setAttribute('class', 'infinite-faker faker-top')
			fakeTop.setAttribute('style', `height: ${this._paddingTop}px`)
			this._el.insertBefore(fakeTop, this._el.firstChild)
			this._fakeTop = fakeTop
		}else{
			this._fakeTop.setAttribute('style', `height: ${this._paddingTop}px`)
		}
	}

	_isElementInView(element, before) {
		let result
		let pageTop = this._el.scrollTop + this._top
		let pageBottom = pageTop + this._height
		let rect = this._getElemInfo(element)
		let elementTop = rect.top;
		let elementBottom = elementTop + rect.height
		result = ((pageTop < elementTop) && (pageBottom > elementBottom))
		if(result) return result
		if(before){
			if(elementTop > pageBottom) return true
		}else{
			if(elementBottom < pageTop) return true
		}
		return false
	}

	_getElemInfo(elem) {
		var offsetTop = 0;
		var offsetLeft = 0;
		var offsetHeight = elem.offsetHeight
		var offsetWidth = elem.offsetWidth

		do {
			if (!isNaN(elem.offsetTop)) {
				offsetTop += elem.offsetTop
			}
			if (!isNaN(elem.offsetLeft)) {
				offsetLeft += elem.offsetLeft
			}
		} while ((elem = elem.offsetParent) !== null)

		return {
				top: offsetTop,
				left: offsetLeft,
				height: offsetHeight,
				width: offsetWidth
		}
	}
}

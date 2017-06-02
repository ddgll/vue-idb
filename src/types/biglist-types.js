import getListTypes from './list-types.js'

export default (name) => {
	const listTypes = getListTypes(name)
	const NAME = name.toUpperCase()

	const blTypes = {
		[NAME + '_SET_PAGE']: NAME + '_SET_PAGE',
		[NAME + '_SET_COUNT']: NAME + '_SET_COUNT',
		[NAME + '_SET_LIMIT']: NAME + '_SET_LIMIT',
		[NAME + '_SET_NB_PAGES']: NAME + '_SET_NB_PAGES',
		[NAME + '_THINKING']: NAME + '_THINKING',
		[NAME + '_SET_FILTERED']: NAME + '_SET_FILTERED',
		[NAME + '_SET_INFINITE']: NAME + '_SET_INFINITE',
	}

	return  {
		...listTypes,
		...blTypes
		/*[NAME + '_SELECT']: NAME + '_SELECT',
		[NAME + '_ADD']: NAME + '_ADD',
		[NAME + '_ADD_SUCCESS']: NAME + '_ADD_SUCCESS',
		[NAME + '_ADD_FAIL']: NAME + '_ADD_FAIL',
		[NAME + '_REMOVE']: NAME + '_REMOVE',
		[NAME + '_REMOVE_SUCCESS']: NAME + '_REMOVE_SUCCESS',
		[NAME + '_REMOVE_FAIL']: NAME + '_REMOVE_FAIL',
		[NAME + '_UPDATE']: NAME + '_UPDATE',
		[NAME + '_UPDATE_SUCCESS']: NAME + '_UPDATE_SUCCESS',
		[NAME + '_UPDATE_FAIL']: NAME + '_UPDATE_FAIL',
		[NAME + '_LOAD']: NAME + '_LOAD',
		[NAME + '_LOAD_SUCCESS']: NAME + '_LOAD_SUCCESS',
		[NAME + '_LOAD_FAIL']: NAME + '_LOAD_FAIL',
		[NAME + '_SET_LAST']: NAME + '_SET_LAST',
		[NAME + '_SET_SORT']: NAME + '_SET_SORT',
		[NAME + '_SET_FILTER']: NAME + '_SET_FILTER'*/
	}
}

(function () {
	'use strict';

	var taxonomyId = 'taxonomy-product_cat';
	var filterId = 'ea-product-cat-filter';
	var hiddenClass = 'ea-filter-category-hidden';

	function normalize(value) {
		return String(value || '')
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.trim();
	}

	function getTermLabel(item) {
		var label = item.querySelector(':scope > label');

		return label ? label.textContent : item.textContent;
	}

	function filterList(list, term) {
		var items = Array.prototype.slice.call(list.children).filter(function (child) {
			return child.matches('li');
		});
		var visibleCount = 0;

		items.forEach(function (item) {
			var childLists = Array.prototype.slice.call(item.children).filter(function (child) {
				return child.matches('ul');
			});
			var childVisibleCount = 0;
			var selfMatches = !term || normalize(getTermLabel(item)).indexOf(term) !== -1;

			childLists.forEach(function (childList) {
				childVisibleCount += filterList(childList, term);
			});

			if (selfMatches || childVisibleCount > 0) {
				item.classList.remove(hiddenClass);
				visibleCount += 1;
			} else {
				item.classList.add(hiddenClass);
			}
		});

		return visibleCount;
	}

	function updateStatus(status, totalVisible) {
		if (!status) {
			return;
		}

		status.textContent = totalVisible ? '' : 'No matching categories';
	}

	function applyFilter(input, status, box) {
		var term = normalize(input.value);
		var lists = box.querySelectorAll('#product_catchecklist, #product_catchecklist-pop');
		var totalVisible = 0;

		lists.forEach(function (list) {
			totalVisible += filterList(list, term);
		});

		updateStatus(status, totalVisible);
	}

	function createFilter(box) {
		var wrapper = document.createElement('div');
		var input = document.createElement('input');
		var status = document.createElement('p');
		var tabs = box.querySelector('#product_cat-tabs');

		wrapper.className = 'ea-filter-category-control';
		input.id = filterId;
		input.type = 'search';
		input.className = 'widefat';
		input.placeholder = 'Filter product categories';
		input.setAttribute('aria-label', 'Filter product categories');

		status.className = 'ea-filter-category-status';
		status.setAttribute('aria-live', 'polite');

		wrapper.appendChild(input);
		wrapper.appendChild(status);
		box.insertBefore(wrapper, tabs || box.firstChild);

		input.addEventListener('input', function () {
			applyFilter(input, status, box);
		});

		return { input: input, status: status };
	}

	function init() {
		var box = document.getElementById(taxonomyId);
		var control;
		var observer;

		if (!box || document.getElementById(filterId)) {
			return;
		}

		control = createFilter(box);

		observer = new MutationObserver(function () {
			applyFilter(control.input, control.status, box);
		});

		observer.observe(box, {
			childList: true,
			subtree: true
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();

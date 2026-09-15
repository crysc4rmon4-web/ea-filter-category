(() => {
    'use strict';

    const taxonomies = [
        {
            taxonomy: 'product_cat',
            boxSelector: '#taxonomy-product_cat',
            filterId: 'ea-product-cat-filter'
        },
        {
            taxonomy: 'pwb-brand',
            boxSelector: '#taxonomy-pwb-brand',
            filterId: 'ea-product-brand-filter'
        },
        {
            taxonomy: 'product_brand',
            boxSelector: '#product_branddiv, #taxonomy-product_brand',
            filterId: 'ea-product-brand-custom-filter'
        }
    ];
    const placeholder = 'Filtrar items';
    const noMatchText = 'No existe resultado que coincida';
    const hiddenClass = 'ea-filter-category-hidden';
    const minLength = 3;
    const checkboxSelector = 'input[type="checkbox"]';

    const normalize = (value) => value.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

    const getLabel = (item) => item.querySelector(':scope > label')?.textContent.trim() ?? '';

    function filterList(list, term) {
        let visibleCount = 0;
        for (const item of list.children) {
            if (!item.matches('li')) continue;
            let childVisible = 0;
            for (const child of item.children) {
                if (child.matches('ul')) childVisible += filterList(child, term);
            }
            const visible = !term || normalize(getLabel(item)).includes(term) || childVisible > 0;
            item.classList.toggle(hiddenClass, !visible);
            if (visible) visibleCount++;
        }
        return visibleCount;
    }

    function updateBadges(checkboxes, container) {
        const selected = new Map();
        for (const checkbox of checkboxes) {
            if (!checkbox.checked || selected.has(checkbox.value)) continue;
            const label = checkbox.labels?.[0]?.textContent.trim();
            if (label) selected.set(checkbox.value, label);
        }
        container.replaceChildren(...Array.from(selected.values(), (text) => {
            const badge = document.createElement('span');
            badge.className = 'ea-filter-badge';
            badge.textContent = text;
            return badge;
        }));
    }

    function createFilter(box, { taxonomy, filterId }) {
        const targetBox = box.querySelector(`#taxonomy-${taxonomy}`) ?? box;
        const tabs = targetBox.querySelector(`#${taxonomy}-tabs`);
        const wrapper = document.createElement('div');
        const input = document.createElement('input');
        const status = document.createElement('p');
        const badges = document.createElement('div');

        wrapper.className = 'ea-filter-category-control';
        Object.assign(input, {
            id: filterId, type: 'search', className: 'widefat',
            placeholder, title: placeholder, autocomplete: 'off'
        });
        status.className = 'ea-filter-category-status';
        badges.className = 'ea-filter-badges-container';
        wrapper.append(input, status, badges);
        if (tabs) tabs.after(wrapper);
        else (targetBox.querySelector('.inside') ?? targetBox).prepend(wrapper);

        const getLists = () => [...targetBox.querySelectorAll(
            `#${taxonomy}checklist, #${taxonomy}checklist-pop`
        )];
        // Query each list separately: a comma selector cannot share a suffix.
        const getCheckboxes = () => getLists().flatMap((list) => [...list.querySelectorAll(checkboxSelector)]);

        function applyFilter() {
            const query = normalize(input.value);
            const term = query.length >= minLength ? query : '';
            const lists = getLists();
            const hasItems = lists.some((list) => list.querySelector(checkboxSelector));
            const visibleLists = new Set(lists.filter((list) => {
                const panel = list.closest('.tabs-panel');
                return !panel || getComputedStyle(panel).display !== 'none';
            }));
            let total = 0;
            for (const list of lists) {
                const count = filterList(list, term);
                if (visibleLists.has(list)) total += count;
            }
            input.style.display = hasItems ? '' : 'none';
            status.style.display = hasItems ? '' : 'none';
            status.textContent = hasItems && term && !total ? noMatchText : '';
        }

        const refresh = () => {
            applyFilter();
            updateBadges(getCheckboxes(), badges);
        };
        input.addEventListener('input', applyFilter);
        // Delegation includes nested checkboxes and terms added later by WordPress.
        box.addEventListener('change', ({ target }) => {
            if (target.matches(checkboxSelector) && getLists().some((list) => list.contains(target))) {
                updateBadges(getCheckboxes(), badges);
            }
        });
        for (const event of ['click', 'keyup', 'keydown']) {
            tabs?.addEventListener(event, applyFilter);
        }
        refresh();
        return { wrapper, refresh };
    }

    function init() {
        const controls = new WeakMap();
        const sync = (records = []) => {
            for (const config of taxonomies) {
                const box = document.querySelector(config.boxSelector);
                if (!box) continue;
                const control = controls.get(box);
                if (!control) {
                    if (!document.getElementById(config.filterId)) {
                        controls.set(box, createFilter(box, config));
                    }
                } else if (records.some(({ target }) => box.contains(target) && !control.wrapper.contains(target))) {
                    control.refresh();
                }
            }
        };
        sync();
        // React to inserted/replaced lists and late metaboxes; ignore our own UI updates.
        new MutationObserver(sync).observe(document.getElementById('poststuff') ?? document.body, {
            childList: true, subtree: true, characterData: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
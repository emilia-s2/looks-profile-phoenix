'use strict';
window.SourcePicker = (() => {
    const input = document.getElementById('target');
    const button = document.getElementById('source-toggle');
    const list = document.getElementById('sources');
    const anchor = document.getElementById('source-picker');
    let names = [], matches = [], active = -1, expanded = false;
    const t = text => UIText.t(text);
    function close() {
        expanded = false;
        list.hidden = true;
        input.setAttribute('aria-expanded', 'false');
        input.removeAttribute('aria-activedescendant');
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-label', t('Mostrar lista de personagens'));
    }
    function position() {
        if (!expanded) return;
        const box = anchor.getBoundingClientRect(), gap = 6, margin = 8;
        if (box.bottom <= 0 || box.top >= window.innerHeight || !anchor.getClientRects().length) { close(); return; }
        const below = window.innerHeight - box.bottom - gap - margin;
        const above = box.top - gap - margin;
        const up = below < 150 && above > below;
        list.dataset.side = up ? 'above' : 'below';
        list.style.maxHeight = Math.max(0, Math.min(200, Math.floor(up ? above : below))) + 'px';
    }
    function highlight(index, reveal = false) {
        const previous = list.children[active];
        if (previous) previous.setAttribute('aria-selected', 'false');
        active = index;
        const option = list.children[active];
        if (!option || !matches.length) { input.removeAttribute('aria-activedescendant'); return; }
        option.setAttribute('aria-selected', 'true');
        input.setAttribute('aria-activedescendant', option.id);
        if (reveal) {
            const top = option.offsetTop, bottom = top + option.offsetHeight;
            if (top < list.scrollTop) list.scrollTop = top;
            else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
        }
    }
    function render() {
        const needle = input.value.trim().toLocaleLowerCase();
        matches = names.filter(name => name.toLocaleLowerCase().includes(needle));
        active = -1;
        list.textContent = '';
        const fragment = document.createDocumentFragment();
        matches.forEach((name, index) => {
            const option = document.createElement('div');
            option.id = 'source-option-' + index;
            option.className = 'source-option';
            option.setAttribute('role', 'option');
            option.setAttribute('aria-selected', 'false');
            option.dataset.index = String(index);
            option.textContent = name;
            fragment.appendChild(option);
        });
        if (!matches.length) {
            const empty = document.createElement('p');
            empty.className = 'source-empty';
            empty.setAttribute('role', 'presentation');
            empty.textContent = t('Nenhum nome na lista. Você ainda pode digitar o nome completo.');
            fragment.appendChild(empty);
        }
        list.appendChild(fragment);
        list.scrollTop = 0;
        highlight(matches.findIndex(name => name === input.value));
    }
    function open() {
        if (document.getElementById('source-mode').value !== 'other') return;
        expanded = true;
        list.hidden = false;
        input.setAttribute('aria-expanded', 'true');
        button.setAttribute('aria-expanded', 'true');
        button.setAttribute('aria-label', t('Fechar lista de personagens'));
        render(); position();
    }
    function choose(index) {
        if (index < 0 || index >= matches.length) return;
        input.value = matches[index];
        input.dispatchEvent(new Event('input', {bubbles:true}));
        close(); input.focus();
    }
    button.addEventListener('click', () => {
        if (expanded) close();
        else { input.focus(); open(); }
    });
    input.addEventListener('input', () => { if (document.activeElement === input) open(); });
    input.addEventListener('click', () => { if (!expanded) open(); });
    input.addEventListener('keydown', event => {
        if (event.isComposing) return;
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            if (!expanded) open();
            if (matches.length) highlight(active < 0 ? (event.key === 'ArrowDown' ? 0 : matches.length - 1) : Math.max(0, Math.min(matches.length - 1, active + (event.key === 'ArrowDown' ? 1 : -1))), true);
        } else if (expanded && (event.key === 'Home' || event.key === 'End')) {
            event.preventDefault(); highlight(event.key === 'Home' ? 0 : matches.length - 1, true);
        } else if (expanded && event.key === 'Enter' && active >= 0) {
            event.preventDefault(); choose(active);
        } else if (expanded && event.key === 'Escape') { event.preventDefault(); close(); }
        else if (event.key === 'Tab') close();
    });
    list.addEventListener('mousedown', event => { if (event.target.closest('.source-option')) event.preventDefault(); });
    list.addEventListener('click', event => {
        const option = event.target.closest('.source-option');
        if (option) choose(Number(option.dataset.index));
    });
    document.addEventListener('mousedown', event => { if (!anchor.contains(event.target)) close(); });
    anchor.addEventListener('focusout', event => { if (!anchor.contains(event.relatedTarget)) close(); });
    window.addEventListener('resize', position);
    document.addEventListener('scroll', event => { if (event.target !== list) position(); }, true);
    return {
        close,
        setNames(value) {
            names = Array.from(new Set(value.filter(name => typeof name === 'string' && name.length)));
            if (expanded) { render(); position(); }
            else close();
        }
    };
})();

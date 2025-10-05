// Simple Campus Market Place front-end with localStorage persistence
// Data model v1

(function () {
  const storageKey = 'cmp_listings_v1';

  /** @typedef {Object} Listing */
  /** @property {string} id */
  /** @property {string} title */
  /** @property {string} category */
  /** @property {number} price */
  /** @property {string} condition */
  /** @property {string} description */
  /** @property {string} seller */
  /** @property {string} email */
  /** @property {string=} phone */
  /** @property {string=} image */
  /** @property {number} createdAt */

  const state = {
    listings: [],
    filters: { query: '', category: 'all', sort: 'newest' }
  };

  // DOM
  const grid = document.getElementById('grid');
  const emptyState = document.getElementById('emptyState');
  const seedBtn = document.getElementById('seedBtn');
  const addItemBtn = document.getElementById('addItemBtn');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const filterChips = Array.from(document.querySelectorAll('.filters .chip'));
  const cardTemplate = document.getElementById('cardTemplate');

  // Modals
  const listingDialog = document.getElementById('listingDialog');
  const listingForm = document.getElementById('listingForm');
  const dialogTitle = document.getElementById('dialogTitle');
  const closeDialogBtn = document.getElementById('closeDialogBtn');
  const listingId = document.getElementById('listingId');
  const titleInput = document.getElementById('titleInput');
  const categorySelect = document.getElementById('categorySelect');
  const priceInput = document.getElementById('priceInput');
  const conditionSelect = document.getElementById('conditionSelect');
  const descInput = document.getElementById('descInput');
  const sellerInput = document.getElementById('sellerInput');
  const emailInput = document.getElementById('emailInput');
  const phoneInput = document.getElementById('phoneInput');
  const imageInput = document.getElementById('imageInput');

  const detailsDialog = document.getElementById('detailsDialog');
  const detailsTitle = document.getElementById('detailsTitle');
  const detailsBody = document.getElementById('detailsBody');
  const detailsDeleteBtn = document.getElementById('detailsDeleteBtn');
  const detailsEditBtn = document.getElementById('detailsEditBtn');
  const contactSellerBtn = document.getElementById('contactSellerBtn');
  const closeDetailsBtn = document.getElementById('closeDetailsBtn');

  const contactDialog = document.getElementById('contactDialog');
  const contactBody = document.getElementById('contactBody');
  const closeContactBtn = document.getElementById('closeContactBtn');
  const copyContactBtn = document.getElementById('copyContactBtn');

  function loadListings() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch { return []; }
  }

  function saveListings(listings) {
    localStorage.setItem(storageKey, JSON.stringify(listings));
  }

  function uid() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  function formatPrice(n) {
    if (Number(n) === 0) return 'Free';
    return `₹${Number(n).toLocaleString('en-IN')}`;
  }

  function seedSample() {
    const now = Date.now();
    const samples = [
      {
        id: uid(), title: 'Data Structures Notes - CS 201', category: 'notes', price: 0,
        condition: 'Like New', description: 'Concise notes covering arrays, linked lists, stacks, queues, trees, and graphs. Includes solved examples.',
        seller: 'Ananya', email: 'ananya@college.edu', phone: '', image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1200&auto=format&fit=crop', createdAt: now - 1000*60*60*2
      },
      {
        id: uid(), title: 'Calculus Textbook (Thomas, 14th Ed.)', category: 'books', price: 1200,
        condition: 'Good', description: 'Slightly highlighted. Great for first-year engineering math.',
        seller: 'Rohit', email: 'rohit@college.edu', phone: '9876543210', image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0ea?q=80&w=1200&auto=format&fit=crop', createdAt: now - 1000*60*60*24
      },
      {
        id: uid(), title: 'Physics Tutoring (Mechanics)', category: 'services', price: 300,
        condition: 'Like New', description: '1-hour sessions, evenings and weekends. Focus on problem-solving and past papers.',
        seller: 'Sneha', email: 'sneha@college.edu', phone: '', image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1200&auto=format&fit=crop', createdAt: now - 1000*60*30
      }
    ];
    state.listings = samples;
    saveListings(state.listings);
    render();
  }

  function getFilteredSorted(list) {
    const q = state.filters.query.trim().toLowerCase();
    const cat = state.filters.category;
    let filtered = list.filter(it => {
      const matchesCat = cat === 'all' ? true : it.category === cat;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        it.title.toLowerCase().includes(q) ||
        (it.description || '').toLowerCase().includes(q) ||
        (it.seller || '').toLowerCase().includes(q)
      );
    });

    switch (state.filters.sort) {
      case 'price-asc': filtered.sort((a,b)=>a.price-b.price); break;
      case 'price-desc': filtered.sort((a,b)=>b.price-a.price); break;
      case 'title': filtered.sort((a,b)=>a.title.localeCompare(b.title)); break;
      default: filtered.sort((a,b)=>b.createdAt-a.createdAt);
    }
    return filtered;
  }

  function render() {
    const items = getFilteredSorted(state.listings);
    grid.setAttribute('aria-busy', 'true');
    grid.innerHTML = '';
    if (items.length === 0) {
      emptyState.classList.remove('hidden');
      grid.classList.add('hidden');
      grid.setAttribute('aria-busy', 'false');
      return;
    }
    emptyState.classList.add('hidden');
    grid.classList.remove('hidden');

    const frag = document.createDocumentFragment();
    for (const it of items) {
      const node = cardTemplate.content.firstElementChild.cloneNode(true);
      const thumb = node.querySelector('.thumb');
      thumb.style.backgroundImage = `url(${CSS.escape(it.image || 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop')})`;
      node.querySelector('.card-title').textContent = it.title;
      node.querySelector('.price').textContent = formatPrice(it.price);
      node.querySelector('.category').textContent = it.category;
      node.querySelector('.condition').textContent = it.condition || 'Good';
      node.querySelector('.desc').textContent = it.description || '';
      node.addEventListener('click', () => openDetails(it.id));
      node.addEventListener('keypress', (ev) => { if (ev.key === 'Enter') openDetails(it.id); });
      frag.appendChild(node);
    }
    grid.appendChild(frag);
    grid.setAttribute('aria-busy', 'false');
  }

  function resetForm() {
    listingId.value = '';
    listingForm.reset();
    dialogTitle.textContent = 'New Listing';
  }

  function openNew() {
    resetForm();
    if (typeof listingDialog.showModal === 'function') listingDialog.showModal();
  }

  function openEdit(id) {
    const it = state.listings.find(x => x.id === id);
    if (!it) return;
    listingId.value = it.id;
    titleInput.value = it.title;
    categorySelect.value = it.category;
    priceInput.value = it.price;
    conditionSelect.value = it.condition || 'Good';
    descInput.value = it.description || '';
    sellerInput.value = it.seller || '';
    emailInput.value = it.email || '';
    phoneInput.value = it.phone || '';
    imageInput.value = it.image || '';
    dialogTitle.textContent = 'Edit Listing';
    if (typeof listingDialog.showModal === 'function') listingDialog.showModal();
  }

  function upsertFromForm(ev) {
    ev && ev.preventDefault();
    // basic validation
    if (!titleInput.value.trim() || !emailInput.value.trim() || !sellerInput.value.trim()) {
      listingForm.reportValidity();
      return;
    }
    const payload = {
      id: listingId.value || uid(),
      title: titleInput.value.trim(),
      category: categorySelect.value,
      price: Math.max(0, Math.round(Number(priceInput.value || 0))),
      condition: conditionSelect.value,
      description: (descInput.value || '').trim(),
      seller: sellerInput.value.trim(),
      email: emailInput.value.trim(),
      phone: (phoneInput.value || '').trim(),
      image: (imageInput.value || '').trim(),
      createdAt: Date.now()
    };

    const existingIdx = state.listings.findIndex(x => x.id === payload.id);
    if (existingIdx >= 0) {
      // preserve original createdAt when editing
      payload.createdAt = state.listings[existingIdx].createdAt;
      state.listings[existingIdx] = payload;
    } else {
      state.listings.unshift(payload);
    }
    saveListings(state.listings);
    listingDialog.close();
    render();
  }

  function openDetails(id) {
    const it = state.listings.find(x => x.id === id);
    if (!it) return;
    detailsTitle.textContent = it.title;
    detailsBody.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'details-top';
    const img = document.createElement('div');
    img.className = 'details-img';
    img.style.backgroundImage = `url(${CSS.escape(it.image || 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop')})`;
    const info = document.createElement('div');
    info.className = 'details-info';
    const price = document.createElement('div');
    price.innerHTML = `<h4>${formatPrice(it.price)}</h4>`;
    const meta = document.createElement('div');
    meta.className = 'details-meta';
    meta.textContent = `${it.category} • ${it.condition}`;
    const desc = document.createElement('div');
    desc.className = 'details-desc';
    desc.textContent = it.description || 'No description';
    info.append(price, meta, desc);
    wrap.append(img, info);
    detailsBody.appendChild(wrap);

    detailsDeleteBtn.onclick = () => delListing(it.id);
    detailsEditBtn.onclick = () => { detailsDialog.close(); openEdit(it.id); };
    contactSellerBtn.onclick = () => openContact(it);
    if (typeof detailsDialog.showModal === 'function') detailsDialog.showModal();
  }

  function delListing(id) {
    const idx = state.listings.findIndex(x => x.id === id);
    if (idx < 0) return;
    state.listings.splice(idx, 1);
    saveListings(state.listings);
    detailsDialog.close();
    render();
  }

  function openContact(it) {
    contactBody.innerHTML = '';
    const email = document.createElement('div');
    email.textContent = `Email: ${it.email}`;
    const phone = document.createElement('div');
    phone.textContent = `Phone: ${it.phone || 'N/A'}`;
    const seller = document.createElement('div');
    seller.textContent = `Seller: ${it.seller}`;
    contactBody.append(seller, email, phone);
    copyContactBtn.onclick = async () => {
      try {
        await navigator.clipboard.writeText(`${it.seller} | ${it.email} | ${it.phone || ''}`.trim());
        copyContactBtn.textContent = 'Copied!';
        setTimeout(()=>copyContactBtn.textContent='Copy Details', 1200);
      } catch {}
    };
    if (typeof contactDialog.showModal === 'function') contactDialog.showModal();
  }

  // Events
  addItemBtn.addEventListener('click', openNew);
  closeDialogBtn.addEventListener('click', () => listingDialog.close());
  listingForm.addEventListener('submit', upsertFromForm);
  listingForm.addEventListener('keydown', (e)=>{ if (e.key==='Enter' && e.target.tagName !== 'TEXTAREA') e.preventDefault(); });
  document.getElementById('saveListingBtn').addEventListener('click', upsertFromForm);

  closeDetailsBtn.addEventListener('click', () => detailsDialog.close());
  closeContactBtn.addEventListener('click', () => contactDialog.close());

  seedBtn.addEventListener('click', seedSample);

  searchInput.addEventListener('input', () => { state.filters.query = searchInput.value; render(); });
  sortSelect.addEventListener('change', () => { state.filters.sort = sortSelect.value; render(); });
  filterChips.forEach(chip => chip.addEventListener('click', () => {
    filterChips.forEach(c => { c.classList.remove('active'); c.setAttribute('aria-selected', 'false'); });
    chip.classList.add('active');
    chip.setAttribute('aria-selected', 'true');
    state.filters.category = chip.dataset.category;
    render();
  }));

  // Init
  state.listings = loadListings();
  if (!state.listings.length) {
    emptyState.classList.remove('hidden');
    grid.classList.add('hidden');
  } else {
    render();
  }
})();




/**
 * BURN-1 Systems — Universal Payment & Product Engine
 * Architecture: Only 2 Entry Triggers for Payments:
 *  1. Floating Bot / Login Intake Module
 *  2. Cinematic Intake / Fast Lane Login Gate (Step 8 Clean Prescription)
 * 
 * Powered by data/master_product_catalog.json
 */

class UniversalPaymentController {
  constructor() {
    this.catalog = [];
    this.activeCart = {
      core: null,
      addons: [],
      clientDomain: '',
      contactEmail: '',
      entityName: ''
    };
    this.isLoaded = false;
    this.init();
  }

  async init() {
    await this.fetchProductCatalog();
    this.injectPaymentBotTrigger();
  }

  async fetchProductCatalog() {
    try {
      const res = await fetch('./data/master_product_catalog.json');
      if (res.ok) {
        this.catalog = await res.json();
        this.isLoaded = true;
      }
    } catch (e) {
      console.warn('[B1-PAY] Using fallback catalog.');
    }
  }

  getProductBySku(sku) {
    return this.catalog.find(p => p.sku === sku) || null;
  }

  getProductsByCategory(category) {
    return this.catalog.filter(p => p.category === category);
  }

  /**
   * Calculates total cart price including core tier and stacked add-ons
   */
  calculateTotal() {
    let total = 0;
    if (this.activeCart.core) {
      total += this.activeCart.core.price;
    }
    this.activeCart.addons.forEach(add => {
      total += add.price;
    });
    return total;
  }

  /**
   * Sets Core Product into UltraBar Cart
   */
  setCoreProduct(sku) {
    const prod = this.getProductBySku(sku);
    if (prod) {
      this.activeCart.core = prod;
      this.syncUltraBarCart();
    }
  }

  /**
   * Toggles an Add-On into UltraBar Cart
   */
  toggleAddon(sku) {
    const idx = this.activeCart.addons.findIndex(a => a.sku === sku);
    if (idx >= 0) {
      this.activeCart.addons.splice(idx, 1);
    } else {
      const prod = this.getProductBySku(sku);
      if (prod) this.activeCart.addons.push(prod);
    }
    this.syncUltraBarCart();
  }

  syncUltraBarCart() {
    // Stores in localStorage and fires event
    localStorage.setItem('burn1_active_cart', JSON.stringify(this.activeCart));
    window.dispatchEvent(new CustomEvent('burn1:cartUpdated', { detail: this.activeCart }));
  }

  /**
   * TRIGGER 1 & 2: Pulls up the Universal Pay & Login Gate Module
   */
  openUniversalPayModal(options = {}) {
    if (options.coreSku) this.setCoreProduct(options.coreSku);
    if (options.domain) this.activeCart.clientDomain = options.domain;

    const modal = document.getElementById('b1UniversalPayModal');
    if (!modal) {
      this.injectUniversalPayModal();
    }
    this.renderPayModalView();
    document.getElementById('b1UniversalPayModal').classList.remove('hidden');
  }

  closeUniversalPayModal() {
    const modal = document.getElementById('b1UniversalPayModal');
    if (modal) modal.classList.add('hidden');
  }

  renderPayModalView() {
    const coreTitle = document.getElementById('b1PayCoreTitle');
    const corePrice = document.getElementById('b1PayCorePrice');
    const addonList = document.getElementById('b1PayAddonList');
    const totalEl = document.getElementById('b1PayTotalAmount');
    const domainInput = document.getElementById('b1PayClientDomain');

    const total = this.calculateTotal();

    if (coreTitle && this.activeCart.core) {
      coreTitle.textContent = this.activeCart.core.name;
      corePrice.textContent = `$${this.activeCart.core.price.toFixed(2)}`;
    }

    if (addonList) {
      addonList.innerHTML = this.activeCart.addons.map(a => `
        <div class="flex justify-between items-center text-xs text-purple-300 py-1 border-b border-purple-500/20">
          <span>+ ${a.name}</span>
          <span class="font-bold">+$${a.price.toFixed(2)}</span>
        </div>
      `).join('') || '<div class="text-xs text-slate-500 italic">No add-ons selected.</div>';
    }

    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    if (domainInput && this.activeCart.clientDomain) domainInput.value = this.activeCart.clientDomain;
  }

  /**
   * Step 8: Clean Prescription & Execute PayPal Settlement
   */
  executeSettlement() {
    const domain = (document.getElementById('b1PayClientDomain')?.value || this.activeCart.clientDomain || 'client-vault').trim();
    const email = (document.getElementById('b1PayClientEmail')?.value || '').trim();
    const total = this.calculateTotal();

    if (!domain) {
      alert('Please enter your client primary domain to pin the vault.');
      return;
    }

    // Persist verified customer session
    const verifiedOrder = {
      timestamp: new Date().toISOString(),
      orderId: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      domain: domain,
      email: email,
      coreSku: this.activeCart.core ? this.activeCart.core.sku : 'B1-CORE-01',
      totalAmount: total,
      status: 'Awaiting_Payment'
    };
    localStorage.setItem('burn1_last_order', JSON.stringify(verifiedOrder));

    // Route to verified merchant gate
    if (total === 500.00) {
      window.open('https://www.paypal.com/ncp/payment/5R9U23V7S2J8S', '_blank');
    } else if (total === 50.00 || total === 150.00) {
      window.open('https://www.paypal.com/ncp/payment/J36CK6MGB5U8N', '_blank');
    } else {
      window.open(`https://paypal.me/LeonRDarden/${total.toFixed(2)}USD`, '_blank');
    }

    this.closeUniversalPayModal();
  }

  injectPaymentBotTrigger() {
    if (document.getElementById('b1FloatingBotBtn')) return;
    const btn = document.createElement('div');
    btn.id = 'b1FloatingBotBtn';
    btn.className = 'fixed bottom-6 right-6 z-40 flex items-center gap-3 cursor-pointer group';
    btn.innerHTML = `
      <div class="px-3.5 py-1.5 rounded-full bg-slate-950/90 border-2 border-purple-400 text-purple-300 font-mono text-xs font-bold shadow-xl hidden group-hover:block transition-all">
        Universal Pay &amp; Bot Gate
      </div>
      <div class="w-14 h-14 rounded-2xl bg-purple-950 border-2 border-purple-400 flex items-center justify-center text-purple-200 text-2xl shadow-2xl group-hover:scale-110 group-hover:border-purple-300 transition-all glow-pulse-violet">
        <i class="fa-solid fa-credit-card"></i>
      </div>
    `;
    btn.onclick = () => this.openUniversalPayModal();
    document.body.appendChild(btn);
  }

  injectUniversalPayModal() {
    const modalHtml = `
      <div id="b1UniversalPayModal" class="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 hidden">
        <div class="max-w-lg w-full bg-[#120324] border-2 border-purple-400 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
          <button onclick="window.universalPayEngine.closeUniversalPayModal()" class="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="text-center space-y-1">
            <div class="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-400 flex items-center justify-center text-purple-300 text-2xl mx-auto mb-2">
              <i class="fa-solid fa-receipt"></i>
            </div>
            <span class="font-mono text-xs text-purple-400 font-bold uppercase tracking-widest">STEP 8 // CLEAN PRESCRIPTION GATE</span>
            <h3 class="font-orbitron font-black text-2xl text-white">UNIVERSAL PAY &amp; LOGIN</h3>
          </div>

          <!-- Client Credentials Input (Retains Client Data for Process) -->
          <div class="space-y-3 font-mono text-xs">
            <div>
              <label class="block text-purple-300 font-bold mb-1 uppercase">Client Perimeter Domain (Required):</label>
              <input type="text" id="b1PayClientDomain" placeholder="e.g. acme-corp.com or checkout.partner.com" class="w-full bg-slate-950 border border-purple-500/50 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-purple-400" />
            </div>
            <div>
              <label class="block text-purple-300 font-bold mb-1 uppercase">Direct Report Delivery Email:</label>
              <input type="email" id="b1PayClientEmail" placeholder="officer@clientcorp.com" class="w-full bg-slate-950 border border-purple-500/50 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-purple-400" />
            </div>
          </div>

          <!-- Product Cart Prescription Matrix -->
          <div class="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-3 font-mono text-xs">
            <div class="flex justify-between items-center text-white">
              <span class="font-bold" id="b1PayCoreTitle">Core One-Time Evidence Report</span>
              <span class="text-purple-300 font-black" id="b1PayCorePrice">$500.00</span>
            </div>

            <!-- Stacked Add-ons -->
            <div id="b1PayAddonList" class="space-y-1 pt-1 border-t border-purple-500/20"></div>

            <!-- Grand Total -->
            <div class="border-t border-slate-800 pt-2 flex justify-between items-center text-sm">
              <span class="font-orbitron font-bold text-white uppercase">Prescription Total:</span>
              <span id="b1PayTotalAmount" class="font-orbitron font-black text-2xl text-emerald-400">$500.00</span>
            </div>
          </div>

          <!-- Single Settlement Action -->
          <button onclick="window.universalPayEngine.executeSettlement()" class="w-full py-4 rounded-xl bg-[#0070ba] hover:bg-[#003087] text-white font-orbitron font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/50 cursor-pointer">
            <i class="fa-brands fa-paypal text-xl"></i>
            <span>SETTLE &amp; EXECUTE VAULT PIN</span>
          </button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }
}

// Global initialization
window.universalPayEngine = new UniversalPaymentController();

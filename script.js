  // ========== AMAZON CLONE - SMOOTH SCRIPT ==========


const AppState = {
  slideIndex: 0,
  cartCount: 0,
  sliderInterval: null,
  isAnimating: false,

  products: {
    row1: [
      { name: "Car Vacuum Cleaner", price: "₹1,299", old: "₹2,499", img: "box1.jpg" },
      { name: "Microfibre Duster", price: "₹349", old: "₹599", img: "box2.jpg" },
      { name: "Air Purifier", price: "₹8,999", old: "₹12,999", img: "box3.jpg" },
      { name: "Essential Oil Diffuser", price: "₹899", old: "₹1,499", img: "box4.jpg" }
    ],
    row2: [
      { name: "Non-Stick Pan Set", price: "₹1,299", old: "₹2,999", img: "box5.jpg" },
      { name: "Premium Bed Sheets", price: "₹899", old: "₹1,999", img: "box6.jpg" },
      { name: "Water Bottle 1L", price: "₹399", old: "₹799", img: "box7.jpg" },
      { name: "Cookware Set", price: "₹2,499", old: "₹4,999", img: "box8.jpg" }
    ],
    row3: [
      { name: "Men's Slim Jeans", price: "₹1,299", old: "₹2,499", img: "box9.jpg" },
      { name: "Women's Kurti", price: "₹599", old: "₹1,299", img: "box10.jpg" },
      { name: "Running Shoes", price: "₹1,999", old: "₹3,999", img: "box11.jpg" },
      { name: "Leather Wallet", price: "₹499", old: "₹999", img: "box12.jpg" }
    ],
    row4: [
      { name: "Wireless Mouse", price: "₹399", old: "₹799", img: "box13.jpg" },
      { name: "Gaming Keyboard", price: "₹1,899", old: "₹3,499", img: "box14.jpg" },
      { name: "Laptop Stand", price: "₹1,099", old: "₹1,999", img: "box15.jpg" },
      { name: "USB-C Hub", price: "₹1,499", old: "₹2,999", img: "box16.jpg" }
    ]
  }
};

// ========== TOAST NOTIFICATIONS ==========
class Toast {
  static show(message, type = 'success', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.role = 'status';
    toast.setAttribute('aria-live', 'polite');
    
    document.body.appendChild(toast);
    
    // Trigger reflow for animation
    toast.offsetHeight;
    toast.style.animation = 'slideInUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    setTimeout(() => {
      toast.style.animation = 'slideOutDown 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
  
  static success(msg) { this.show(msg, 'success'); }
  static error(msg) { this.show(msg, 'error'); }
}

// ========== SLIDER CONTROLLER ==========
class Slider {
  constructor() {
    this.slider = document.getElementById('slider');
    this.slides = document.querySelectorAll('.slide');
    this.dotsContainer = document.getElementById('dots-container');
    this.prevBtn = document.querySelector('.prev');
    this.nextBtn = document.querySelector('.next');
    this.sliderInterval = null;
    
    if (!this.slider || !this.slides.length) return;
    
    this.init();
  }
  
  init() {
    this.createDots();
    this.attachEventListeners();
    this.startAutoSlide();
  }
  
  createDots() {
    if (!this.dotsContainer) return;
    
    this.dotsContainer.innerHTML = '';
    this.slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = i === AppState.slideIndex ? 'dot active' : 'dot';
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.setAttribute('data-slide', i);
      
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        this.goToSlide(i);
      });
      
      this.dotsContainer.appendChild(dot);
    });
  }
  
  updateDots() {
    document.querySelectorAll('.dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === AppState.slideIndex);
      dot.setAttribute('aria-selected', idx === AppState.slideIndex);
    });
  }
  
  goToSlide(index) {
    if (AppState.isAnimating || index === AppState.slideIndex) return;
    
    AppState.slideIndex = (index + this.slides.length) % this.slides.length;
    AppState.isAnimating = true;
    
    this.slider.style.transform = `translateX(-${AppState.slideIndex * 100}%)`;
    this.updateDots();
    
    setTimeout(() => {
      AppState.isAnimating = false;
    }, 700);
    
    this.resetAutoSlide();
  }
  
  nextSlide() {
    this.goToSlide(AppState.slideIndex + 1);
  }
  
  prevSlide() {
    this.goToSlide(AppState.slideIndex - 1);
  }
  startAutoSlide() {
  if (this.sliderInterval) clearInterval(this.sliderInterval);
  this.sliderInterval = setInterval(() => this.nextSlide(), 3000);
}

  resetAutoSlide() {
  this.startAutoSlide();
}
 
  attachEventListeners() {
    // Button controls
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.prevSlide();
      });
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.nextSlide();
      });
    }
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });
    
    // Pause on hover
    if (this.slider) {
      this.slider.addEventListener('mouseenter', () => {
        if (this.sliderInterval) clearInterval(this.sliderInterval);
      });
      
      this.slider.addEventListener('mouseleave', () => {
        this.startAutoSlide();
      });
    }
  }
  
  destroy() {
    if (this.sliderInterval) clearInterval(this.sliderInterval);
  }
}

// ========== PRODUCT RENDERER ==========
class ProductRenderer {
  static renderCards(categoryKey, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !AppState.products[categoryKey]) return;
    
    const products = AppState.products[categoryKey];
    container.innerHTML = '';
    
    products.forEach((product, idx) => {
      const card = this.createCard(product, idx);
      container.appendChild(card);
    });
  }
  
  static createCard(product, delay = 0) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.animationDelay = `${delay * 0.08}s`;
    card.setAttribute('role', 'region');
    card.setAttribute('aria-label', product.name);
    
    const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23f0f0f0' width='300' height='300'/%3E%3Ctext x='50%' y='50%' font-size='18' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3ELoading...%3C/text%3E%3C/svg%3E`;
    
    card.innerHTML = `
      <div class="card-image-wrapper">
        <img 
          src="${product.img}" 
          alt="${product.name}"
          loading="lazy"
          decoding="async"
          onerror="this.src='${placeholderSvg}'"
          style="object-fit: cover;"
        >
      </div>
      <div class="card-content">
        <h3 class="card-title">${this.escapeHtml(product.name)}</h3>
        <div class="card-price">${product.price}</div>
        <div class="card-old-price">${product.old}</div>
        <span class="card-badge">Limited Deal</span>
      </div>
    `;
    
    card.addEventListener('click', () => this.handleCardClick(product, card));
    
    return card;
  }
  
  static handleCardClick(product, cardElement) {
    AppState.cartCount++;
    this.updateCartCount();
    
    // Animate cart icon
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
      cartIcon.style.animation = 'pulse 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      setTimeout(() => {
        cartIcon.style.animation = '';
      }, 500);
    }
    
    Toast.success(`✓ ${product.name} added to cart`);
  }
  
  static updateCartCount() {
    const countEl = document.getElementById('cart-count');
    if (countEl) {
      countEl.textContent = AppState.cartCount;
    }
  }
  
  static escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// ========== DYNAMIC SECTIONS ==========
class DynamicSections {
  static addPhones() {
    const container = document.querySelector('.container');
    if (!container) return;
    
    const section = document.createElement('h2');
    section.className = 'section-title';
    section.textContent = 'Featured phones | Up to ₹10,000 off';
    
    const row = document.createElement('div');
    row.className = 'row';
    
    const phones = [
      { name: "Apple iPhone 17 Pro", price: "₹1,79,900", old: "₹1,99,900", img: "box21.jpg" },
      { name: "Samsung Galaxy S26", price: "₹79,999", old: "₹99,999", img: "box22.jpg" },
      { name: "OnePlus Nord 5", price: "₹33,999", old: "₹49,999", img: "box23.jpg" },
      { name: "iQOO 15", price: "₹72,999", old: "₹89,999", img: "box24.jpg" }
    ];
    
    phones.forEach((phone, idx) => {
      const card = this.createPhoneCard(phone, idx);
      row.appendChild(card);
    });
    
    container.appendChild(section);
    container.appendChild(row);
  }
  
  static createPhoneCard(phone, idx) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.animationDelay = `${idx * 0.08}s`;
    
    const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23f0f0f0' width='300' height='300'/%3E%3Ctext x='50%' y='50%' font-size='18' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3ELoading...%3C/text%3E%3C/svg%3E`;
    
    card.innerHTML = `
      <div class="card-image-wrapper">
        <img 
          src="${phone.img}" 
          alt="${phone.name}"
          loading="lazy"
          decoding="async"
          onerror="this.src='${placeholderSvg}'"
          style="object-fit: cover;"
        >
      </div>
      <div class="card-content">
        <h3 class="card-title">${ProductRenderer.escapeHtml(phone.name)}</h3>
        <div class="card-price">${phone.price}</div>
        <div class="card-old-price">Was ${phone.old}</div>
        <span class="card-badge">Save 25%</span>
      </div>
    `;
    
    card.addEventListener('click', () => ProductRenderer.handleCardClick(phone, card));
    
    return card;
  }
  
  static addLiveCard() {
    const container = document.querySelector('.container');
    if (!container) return;
    
    const banner = document.createElement('div');
    banner.className = 'promo-banner';
    banner.setAttribute('role', 'complementary');
    banner.innerHTML = `
      <div class="promo-content">
        <div class="promo-icon">
          <i class="fas fa-play-circle"></i>
        </div>
        <div class="promo-text">
          <h3>Amazon LIVE</h3>
          <p>Watch, Chat & Shop Live</p>
        </div>
      </div>
      <button class="promo-button" id="live-btn" aria-label="Watch Amazon Live">
        Watch Now →
      </button>
    `;
    
    // Insert after row2
    const row2 = container.querySelector('#row2')?.parentElement;
    if (row2 && row2.nextElementSibling) {
      container.insertBefore(banner, row2.nextElementSibling.nextElementSibling);
    } else {
      container.appendChild(banner);
    }
    
    document.getElementById('live-btn')?.addEventListener('click', () => {
      Toast.success('🎬 Amazon Live coming soon!');
    });
  }
  
  static addMostLoved() {
    const container = document.querySelector('.container');
    if (!container) return;
    
    const section = document.createElement('h2');
    section.className = 'section-title';
    section.textContent = 'Customers\' Most-Loved products | top rated';
    
    const row = document.createElement('div');
    row.className = 'row';
    
    const products = [
      { name: "boAt Airdopes 141", price: "₹1,299", old: "M.R.P: ₹4,990", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop" },
      { name: "Redmi 43'' TV", price: "₹22,999", old: "M.R.P: ₹34,999", img: "https://images.unsplash.com/photo-1522869635100-ce306ca884ca?w=300&h=300&fit=crop" },
      { name: "Fastrack Reflex", price: "₹2,499", old: "M.R.P: ₹4,990", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop" },
      { name: "Bajaj Mixer Grinder", price: "₹3,999", old: "M.R.P: ₹5,999", img: "https://images.unsplash.com/photo-1587618621290-1af0a67e4b13?w=300&h=300&fit=crop" }
    ];
    
    products.forEach((prod, idx) => {
      const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23f0f0f0' width='300' height='300'/%3E%3Ctext x='50%' y='50%' font-size='18' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3ELoading...%3C/text%3E%3C/svg%3E`;
      
      const card = document.createElement('div');
      card.className = 'card';
      card.style.animationDelay = `${idx * 0.08}s`;
      
      card.innerHTML = `
        <div class="card-image-wrapper">
          <img 
            src="${prod.img}" 
            alt="${prod.name}"
            loading="lazy"
            decoding="async"
            onerror="this.src='${placeholderSvg}'"
            style="object-fit: cover;"
          >
        </div>
        <div class="card-content">
          <h3 class="card-title">${ProductRenderer.escapeHtml(prod.name)}</h3>
          <div class="card-price">${prod.price}</div>
          <div class="card-old-price">${prod.old}</div>
          <span class="card-badge">⭐ 4.4 ★</span>
        </div>
      `;
      
      card.addEventListener('click', () => ProductRenderer.handleCardClick(prod, card));
      row.appendChild(card);
    });
    
    container.appendChild(section);
    container.appendChild(row);
  }
}

// ========== SEARCH HANDLER ==========
class SearchHandler {
  static init() {
    const searchInput = document.querySelector('input[type="text"]');
    const searchBtn = document.querySelector('.nav-search button');
    
    if (!searchInput || !searchBtn) return;
    
    const handleSearch = () => {
      const query = searchInput.value.trim();
      
      if (query.length < 2) {
        Toast.error('⚠️ Enter at least 2 characters');
        return;
      }
      
      if (query.length > 100) {
        searchInput.value = query.slice(0, 100);
        return;
      }
      
      Toast.success(`🔍 Searching: "${query}"`);
      searchInput.value = '';
    };
    
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
    
    // Input validation
    searchInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.slice(0, 100);
    });
  }
}

// ========== NAVIGATION HANDLER ==========
class NavigationHandler {
  static init() {
    // Cart
    const cartBtn = document.querySelector('.nav-cart');
    if (cartBtn) {
      cartBtn.addEventListener('click', () => {
        Toast.success(`🛒 Cart: ${AppState.cartCount} items`);
      });
    }
    
    // Nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const text = item.querySelector('span:last-child')?.textContent || 'item';
        Toast.success(`Opening ${text}...`);
      });
    });
  }
}

// ========== MAIN INITIALIZATION ==========
class App {
  static init() {
    // Init slider
    window.sliderInstance = new Slider();
    
    // Render products
    Object.entries(AppState.products).forEach(([rowId, products]) => {
      ProductRenderer.renderCards(rowId, rowId);
    });
    
    // Add dynamic sections
    DynamicSections.addPhones();
    DynamicSections.addLiveCard();
    DynamicSections.addMostLoved();
    
    // Init handlers
    SearchHandler.init();
    NavigationHandler.init();
  }
  
  static cleanup() {
    if (window.sliderInstance) {
      window.sliderInstance.destroy();
    }
  }
}

// ========== ENTRY POINT ==========
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    App.init();
  });
} else {
  App.init();
}

// Cleanup on unload
window.addEventListener('beforeunload', () => {
  App.cleanup();
});

// Global API (for backward compatibility)
window.changeSlide = (direction) => {
  if (window.sliderInstance) {
    if (direction > 0) window.sliderInstance.nextSlide();
    else window.sliderInstance.prevSlide();
  }
};
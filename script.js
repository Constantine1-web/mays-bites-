// =========================
// CONFIGURATION & MINI-DATABASE ARRAYS
// =========================
const WHATSAPP_NUMBER = "2347044732970"; // Target business phone context

const MENU = [
  {
    id: "m1",
    title: "Stir-Fried Spaghetti Premium",
    category: "main",
    price: 3500,
    desc: "Wrapped in Cream. Packed with Flavor, the sharwama profile.",
    tag: "Top Choice",
    img: "https://i.ibb.co/k2m5L6K/image.png"
  },
  {
    id: "m2",
    title: "Creamy Chicken Shawarma (Double Sausage)",
    category: "wrap",
    price: 3500,
    desc: "Juicy grilled chicken wrapped inside toasted pita canvas with cabbage layers, sweet-spicy cream mix sauce, and twin sausages.",
    tag: "Best Seller",
    img: "https://i.ibb.co/60qY60c/image.png"
  },
  {
    id: "m3",
    title: "Fiery Peppered Kpomo Box",
    category: "local",
    price: 2000,
    desc: "Chewy, perfectly boiled soft cow skin drenched in native habanero-onion mash. Elite side companion for cold drinks.",
    tag: "Native Spice",
    img: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&q=75"
  },
  {
    id: "m4",
    title: "May's Special Small Chops Tray",
    category: "local",
    price: 2500,
    desc: "A crispy collection featuring golden puff-puff balls, savory samosas, crispy spring rolls, and peppered protein bits.",
    tag: "Party Pack",
    img: "https://i.ibb.co/C060tQY/image.png"
  },
  {
    id: "m5",
    title: "Jellof Rice with Fried Plantain and Beef",
    category: "main",
    price: 3500,
    desc: "A classic, deeply rich plate of smoky Nigerian Jollof rice, packed perfectly and layered with golden-brown, sweet fried dodo and tender pieces of intense, spicy peppered fried beef.",
    tag: "Quick Fuel",
    img: "https://ibb.co/MxhJKLJg"
  }
];

const SPECIALS = [
  {
    title: "The Weekend Platter Mega",
    desc: "Get 1 Large Creamy Shawarma, a half portion of Stir-fried pasta, and 3 peppered beef chunks for an absolute discount combo rate.",
    price: "₦6,500 Only",
    img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=75"
  },
  {
    title: "Night-Owl Noodle Dynamic",
    desc: "Double portion noodles combined with extra sausage links and shredded chicken bits. Available strictly from 6 PM downwards.",
    price: "₦2,800 Only",
    img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=75"
  }
];

// Shopping Cart State Variables Container
let cart = {};

// =========================
// DARK MODE INTERACTION LOGIC
// =========================
const themeBtn = document.getElementById("themeBtn");
// Read existing local setting or default to dark scheme context
const currentTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", currentTheme);

themeBtn.addEventListener("click", () => {
  let theme = document.documentElement.getAttribute("data-theme");
  let nextTheme = (theme === "dark") ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", nextTheme);
  localStorage.setItem("theme", nextTheme);
});

// =========================
// MOBILE RESPONSIVE HAMBURGER NAVIGATION
// =========================
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
});

// Auto-close overlay when links inside are selected
mobileMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => mobileMenu.classList.remove("open"));
});

// =========================
// RENDER DYNAMIC MENU SYSTEM CARDS
// =========================
const menuGrid = document.getElementById("menuGrid");
const filterContainer = document.getElementById("filterContainer");

function renderMenu(categoryFilter = "all") {
  menuGrid.innerHTML = "";
  
  const filtered = MENU.filter(item => categoryFilter === "all" || item.category === categoryFilter);
  
  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "food-card";
    
    // Check local tracking state to restore internal values
    const currentQty = cart[item.id] ? cart[item.id].qty : 1;
    
    card.innerHTML = `
      <div class="food-img" style="background-image: url('${item.img}')">
        <span class="food-tag">${item.tag}</span>
      </div>
      <div class="food-body">
        <div class="food-title">
          <h4>${item.title}</h4>
          <span class="price">₦${item.price.toLocaleString()}</span>
        </div>
        <p>${item.desc}</p>
        <div class="food-actions">
          <div class="qty">
            <button onclick="adjustLocalQty('${item.id}', -1)">-</button>
            <input type="number" id="input-${item.id}" value="${currentQty}" min="1" readonly />
            <button onclick="adjustLocalQty('${item.id}', 1)">+</button>
          </div>
          <button class="add-btn" onclick="pushToBasket('${item.id}')">Add Basket 🛒</button>
        </div>
      </div>
    `;
    menuGrid.appendChild(card);
  });
}

// Filter Tab Switch Event Handler
filterContainer.addEventListener("click", (e) => {
  if (!e.target.classList.contains("filter-btn")) return;
  
  filterContainer.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  e.target.classList.add("active");
  
  renderMenu(e.target.dataset.category);
});

// Handle local inputs incrementation before actual insertion
window.adjustLocalQty = function(id, delta) {
  const input = document.getElementById(`input-${id}`);
  if (!input) return;
  let val = parseInt(input.value) + delta;
  if (val < 1) val = 1;
  input.value = val;
  
  // If item resides inside real active cart, adjust synchronization
  if (cart[id]) {
    cart[id].qty = val;
    renderCart();
  }
};

// =========================
// SHOPPING BASKET SYSTEM MANAGEMENTS
// =========================
window.pushToBasket = function(id) {
  const input = document.getElementById(`input-${id}`);
  const qty = input ? parseInt(input.value) : 1;
  
  const originalItem = MENU.find(m => m.id === id);
  if (!originalItem) return;
  
  cart[id] = {
    title: originalItem.title,
    price: originalItem.price,
    qty: qty
  };
  
  renderCart();
  
  // Quick temporary interactive animation cue
  const btn = event.target;
  const originalText = btn.textContent;
  btn.textContent = "Added! ✨";
  btn.style.background = "linear-gradient(135deg, #25D366, #1fa855)";
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = "";
  }, 1100);
};

window.removeFromCart = function(id) {
  delete cart[id];
  renderCart();
  // Restore layout parameters back on main store array grid input elements
  const input = document.getElementById(`input-${id}`);
  if (input) input.value = 1;
};

const cartItemsContainer = document.getElementById("cartItemsContainer");
const emptyCartText = document.getElementById("emptyCartText");
const cartGrandTotal = document.getElementById("cartGrandTotal");

function renderCart() {
  const keys = Object.keys(cart);
  
  if (keys.length === 0) {
    cartItemsContainer.innerHTML = "";
    cartItemsContainer.appendChild(emptyCartText);
    cartGrandTotal.textContent = "₦0";
    return;
  }
  
  if (emptyCartText.parentNode === cartItemsContainer) {
    cartItemsContainer.removeChild(emptyCartText);
  }
  
  // Clear operational rows but keep cached instances safe
  const elements = cartItemsContainer.querySelectorAll(".cart-item");
  elements.forEach(el => el.remove());
  
  let grandTotal = 0;
  
  keys.forEach(id => {
    const current = cart[id];
    const rowTotal = current.price * current.qty;
    grandTotal += rowTotal;
    
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div>
        <b>${current.title}</b>
        <small>₦${current.price.toLocaleString()} × ${current.qty}</small>
      </div>
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="font-weight:700;">₦${rowTotal.toLocaleString()}</span>
        <button class="remove" onclick="removeFromCart('${id}')">×</button>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });
  
  cartGrandTotal.textContent = `₦${grandTotal.toLocaleString()}`;
}

// =========================
// WHATSAPP URL COMPILED GENERATOR LOGIC
// =========================
function whatsappUrl(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

document.getElementById("orderForm").addEventListener("submit", (e) => {
  e.preventDefault();
  
  const cartKeys = Object.keys(cart);
  if (cartKeys.length === 0) {
    alert("Your shopping cart is completely empty! Please choose items first.");
    return;
  }
  
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const method = document.getElementById("deliveryMethod").value;
  const address = document.getElementById("custAddress").value.trim();
  
  // Compile Receipt Text Template Layout
  let text = `=========================\n`;
  text += `   MAY’S TASTY TREATS ORDER\n`;
  text += `=========================\n\n`;
  text += `👤 Customer: ${name}\n`;
  text += `📞 Phone: ${phone}\n`;
  text += `📦 Method: ${method}\n`;
  
  if (method === "Delivery" && address) {
    text += `📍 Address: ${address}\n`;
  }
  text += `\n🛒 ITEMS ORDERED:\n`;
  
  let grandTotal = 0;
  cartKeys.forEach(id => {
    const item = cart[id];
    const itemCost = item.price * item.qty;
    grandTotal += itemCost;
    text += `- ${item.title} (×${item.qty}) -> ₦${itemCost.toLocaleString()}\n`;
  });
  
  text += `\n💰 TOTAL ESTIMATE: ₦${grandTotal.toLocaleString()}\n`;
  text += `=========================\n`;
  text += `Thank you for choosing May’s treats! ✨`;
  
  window.open(whatsappUrl(text), "_blank", "noopener");
});

// =========================
// FEATURED WEEKLY SPECIALS CAROUSEL INTERACTIVE LOGIC
// =========================
const carouselTrack = document.getElementById("carouselTrack");
const carouselDots = document.getElementById("carouselDots");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
let currentSlideIndex = 0;

function setupCarousel() {
  carouselTrack.innerHTML = "";
  carouselDots.innerHTML = "";
  
  SPECIALS.forEach((spec, index) => {
    // Generate Slide Elements
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.innerHTML = `
      <div class="slide-img" style="background-image: url('${spec.img}')"></div>
      <div class="slide-text">
        <h3>${spec.title}</h3>
        <p>${spec.desc}</p>
        <span class="price" style="align-self: flex-start; background:rgba(255,106,42,0.14); color: var(--orange);">${spec.price}</span>
      </div>
    `;
    carouselTrack.appendChild(slide);
    
    // Generate Indicator Dots Elements
    const dot = document.createElement("button");
    dot.className = `dotbtn ${index === 0 ? "active" : ""}`;
    dot.addEventListener("click", () => jumpToSlide(index));
    carouselDots.appendChild(dot);
  });
}

function jumpToSlide(index) {
  currentSlideIndex = index;
  if (currentSlideIndex >= SPECIALS.length) currentSlideIndex = 0;
  if (currentSlideIndex < 0) currentSlideIndex = SPECIALS.length - 1;
  
  carouselTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
  
  // Refresh Dot state settings flags
  const dots = carouselDots.querySelectorAll(".dotbtn");
  dots.forEach((d, i) => {
    if (i === currentSlideIndex) d.classList.add("active");
    else d.classList.remove("active");
  });
}

nextBtn.addEventListener("click", () => jumpToSlide(currentSlideIndex + 1));
prevBtn.addEventListener("click", () => jumpToSlide(currentSlideIndex - 1));

// Auto Carousel Loop Context 
setInterval(() => {
  jumpToSlide(currentSlideIndex + 1);
}, 7000);

// =========================
// FLOATING WHATSAPP INTERACTION SETUP
// =========================
const waFloat = document.getElementById("waFloat");
const waLinkFooter = document.getElementById("waLinkFooter");

function openWhatsAppChat() {
  const text = "Hello May’s Tasty Treats! I’d like to inquire or place an order 🥙✨";
  window.open(whatsappUrl(text), "_blank", "noopener");
}

waFloat.addEventListener("click", openWhatsAppChat);
waLinkFooter.addEventListener("click", (e) => { e.preventDefault(); openWhatsAppChat(); });

// =========================
// REVEAL ON SCROLL INTERSECTION OBSERVATIONS
// =========================
let revealObserver = null;

function observeReveals() {
  const nodes = document.querySelectorAll(".reveal:not(.in)");
  if (!("IntersectionObserver" in window)) {
    nodes.forEach(n => n.classList.add("in"));
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          ent.target.classList.add("in");
          revealObserver.unobserve(ent.target);
        }
      });
    }, { threshold: 0.14 });
  }
  nodes.forEach(n => revealObserver.observe(n));
}

// Initialize Elements Layout Rendering Pipelines
setupCarousel();
renderMenu("all");
observeReveals();

document.getElementById("year").textContent = new Date().getFullYear();

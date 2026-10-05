import os

os.makedirs('public/images/catalog', exist_ok=True)

# SVG Hexagon Kemizone Logo definition
LOGO_SVG = """
<g transform="translate({x}, {y}) scale({scale})">
  <polygon points="45,16 95,16 120,60 95,104 45,104 20,60" fill="#1e293b" stroke="#334155" stroke-width="4" stroke-linejoin="round" />
  <path d="M 80 34 L 46 60 L 80 86" fill="none" stroke="#70C041" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
  <circle cx="80" cy="34" r="10.5" fill="#70C041" />
  <circle cx="46" cy="60" r="10.5" fill="#70C041" />
  <circle cx="80" cy="86" r="10.5" fill="#70C041" />
</g>
"""

def generate_bag_svg(filename, code, full_name, ar_name, weight="25 Kg"):
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="bagGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f1f5f9" />
      <stop offset="30%" stop-color="#ffffff" />
      <stop offset="70%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>
    <linearGradient id="foldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#cbd5e1" />
      <stop offset="100%" stop-color="#94a3b8" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="15" stdDeviation="15" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <rect width="400" height="400" fill="url(#bgGrad)" />
  <circle cx="200" cy="200" r="170" fill="#047857" opacity="0.08" />

  <!-- Packaging Bag -->
  <g filter="url(#shadow)">
    <!-- Main Bag Body -->
    <path d="M 115 75 L 285 75 L 305 340 L 95 340 Z" fill="url(#bagGrad)" stroke="#cbd5e1" stroke-width="2" />
    <!-- Top Fold -->
    <polygon points="110,65 290,65 285,75 115,75" fill="url(#foldGrad)" />
    <line x1="110" y1="65" x2="290" y2="65" stroke="#64748b" stroke-width="3" stroke-dasharray="6,4" />
    <!-- Bottom Gusset -->
    <polygon points="95,340 305,340 295,350 105,350" fill="#94a3b8" />
  </g>

  <!-- Kemizone Chemical Branding -->
  <g transform="translate(130, 95) scale(0.65)">
    <polygon points="45,16 95,16 120,60 95,104 45,104 20,60" fill="#0f172a" stroke="#334155" stroke-width="5" stroke-linejoin="round" />
    <path d="M 80 34 L 46 60 L 80 86" fill="none" stroke="#70C041" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="80" cy="34" r="10.5" fill="#70C041" />
    <circle cx="46" cy="60" r="10.5" fill="#70C041" />
    <circle cx="80" cy="86" r="10.5" fill="#70C041" />
  </g>

  <text x="200" y="180" font-family="Arial, sans-serif" font-weight="900" font-size="11" fill="#065f46" text-anchor="middle" letter-spacing="1">KEMIZONE CHEMICAL</text>
  <text x="200" y="194" font-family="Arial, sans-serif" font-weight="600" font-size="8" fill="#64748b" text-anchor="middle">COMMERCIAL .CO</text>

  <!-- Big Chemical Code / Acronym -->
  <rect x="120" y="210" width="160" height="42" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
  <text x="200" y="240" font-family="Arial, sans-serif" font-weight="900" font-size="22" fill="#0f172a" text-anchor="middle">{code}</text>

  <!-- Full Chemical Name -->
  <text x="200" y="272" font-family="Arial, sans-serif" font-weight="700" font-size="10" fill="#334155" text-anchor="middle">{full_name}</text>
  <text x="200" y="288" font-family="Arial, sans-serif" font-weight="600" font-size="9" fill="#059669" text-anchor="middle">{ar_name}</text>

  <!-- Weight Badge -->
  <rect x="165" y="305" width="70" height="22" rx="11" fill="#047857" />
  <text x="200" y="320" font-family="Arial, sans-serif" font-weight="800" font-size="11" fill="#ffffff" text-anchor="middle">{weight}</text>
</svg>"""
    with open(f"public/images/catalog/{filename}", "w", encoding="utf-8") as f:
        f.write(svg)

def generate_drum_svg(filename, code, full_name, ar_name, color="#1e3a8a", weight="200 Kg"):
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="drumGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="{color}" />
      <stop offset="25%" stop-color="#3b82f6" />
      <stop offset="50%" stop-color="{color}" />
      <stop offset="85%" stop-color="#172554" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="15" stdDeviation="15" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <rect width="400" height="400" fill="url(#bgGrad)" />
  <circle cx="200" cy="200" r="170" fill="#0284c7" opacity="0.08" />

  <!-- Industrial Drum -->
  <g filter="url(#shadow)">
    <!-- Drum Body -->
    <rect x="110" y="80" width="180" height="260" rx="10" fill="url(#drumGrad)" />
    <!-- Chimes (Rings) -->
    <rect x="106" y="75" width="188" height="12" rx="6" fill="#64748b" />
    <rect x="108" y="150" width="184" height="10" rx="4" fill="#1e293b" opacity="0.6" />
    <rect x="108" y="235" width="184" height="10" rx="4" fill="#1e293b" opacity="0.6" />
    <rect x="106" y="335" width="188" height="12" rx="6" fill="#64748b" />
  </g>

  <!-- Label on Drum -->
  <rect x="135" y="125" width="130" height="150" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />

  <!-- Logo -->
  <g transform="translate(162, 130) scale(0.4)">
    <polygon points="45,16 95,16 120,60 95,104 45,104 20,60" fill="#0f172a" stroke="#334155" stroke-width="5" stroke-linejoin="round" />
    <path d="M 80 34 L 46 60 L 80 86" fill="none" stroke="#70C041" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="80" cy="34" r="10.5" fill="#70C041" />
    <circle cx="46" cy="60" r="10.5" fill="#70C041" />
    <circle cx="80" cy="86" r="10.5" fill="#70C041" />
  </g>

  <text x="200" y="185" font-family="Arial, sans-serif" font-weight="900" font-size="8" fill="#065f46" text-anchor="middle" letter-spacing="0.5">KEMIZONE CHEMICAL</text>

  <!-- Product Code & Name -->
  <text x="200" y="208" font-family="Arial, sans-serif" font-weight="900" font-size="14" fill="#0f172a" text-anchor="middle">{code}</text>
  <text x="200" y="224" font-family="Arial, sans-serif" font-weight="700" font-size="8" fill="#334155" text-anchor="middle">{full_name}</text>
  <text x="200" y="238" font-family="Arial, sans-serif" font-weight="600" font-size="7" fill="#059669" text-anchor="middle">{ar_name}</text>

  <!-- Weight Badge -->
  <rect x="165" y="248" width="70" height="18" rx="9" fill="#0f172a" />
  <text x="200" y="261" font-family="Arial, sans-serif" font-weight="800" font-size="10" fill="#38bdf8" text-anchor="middle">{weight}</text>
</svg>"""
    with open(f"public/images/catalog/{filename}", "w", encoding="utf-8") as f:
        f.write(svg)

def generate_canister_svg(filename, code, full_name, ar_name, color="#047857", weight="25 L"):
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="canisterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="{color}" />
      <stop offset="35%" stop-color="#10b981" />
      <stop offset="70%" stop-color="{color}" />
      <stop offset="100%" stop-color="#064e3b" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="15" stdDeviation="15" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <rect width="400" height="400" fill="url(#bgGrad)" />
  <circle cx="200" cy="200" r="170" fill="#10b981" opacity="0.08" />

  <!-- Jerrycan / Canister -->
  <g filter="url(#shadow)">
    <!-- Handle -->
    <path d="M 160 85 L 240 85 A 15 15 0 0 1 255 100 L 255 120 L 145 120 L 145 100 A 15 15 0 0 1 160 85 Z" fill="#064e3b" />
    <rect x="175" y="98" width="50" height="15" rx="7" fill="#0f172a" />
    <!-- Cap -->
    <rect x="235" y="70" width="30" height="18" rx="4" fill="#f8fafc" stroke="#cbd5e1" />
    <!-- Canister Body -->
    <rect x="125" y="115" width="150" height="225" rx="16" fill="url(#canisterGrad)" />
  </g>

  <!-- Label -->
  <rect x="145" y="160" width="110" height="135" rx="8" fill="#ffffff" stroke="#cbd5e1" />

  <g transform="translate(162, 168) scale(0.35)">
    <polygon points="45,16 95,16 120,60 95,104 45,104 20,60" fill="#0f172a" stroke="#334155" stroke-width="5" stroke-linejoin="round" />
    <path d="M 80 34 L 46 60 L 80 86" fill="none" stroke="#70C041" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="80" cy="34" r="10.5" fill="#70C041" />
    <circle cx="46" cy="60" r="10.5" fill="#70C041" />
    <circle cx="80" cy="86" r="10.5" fill="#70C041" />
  </g>

  <text x="200" y="215" font-family="Arial, sans-serif" font-weight="900" font-size="7" fill="#065f46" text-anchor="middle">KEMIZONE CHEMICAL</text>
  <text x="200" y="235" font-family="Arial, sans-serif" font-weight="900" font-size="13" fill="#0f172a" text-anchor="middle">{code}</text>
  <text x="200" y="250" font-family="Arial, sans-serif" font-weight="700" font-size="7.5" fill="#334155" text-anchor="middle">{full_name}</text>
  <text x="200" y="262" font-family="Arial, sans-serif" font-weight="600" font-size="7" fill="#059669" text-anchor="middle">{ar_name}</text>

  <rect x="165" y="270" width="70" height="16" rx="8" fill="#064e3b" />
  <text x="200" y="282" font-family="Arial, sans-serif" font-weight="800" font-size="9" fill="#ffffff" text-anchor="middle">{weight}</text>
</svg>"""
    with open(f"public/images/catalog/{filename}", "w", encoding="utf-8") as f:
        f.write(svg)

# 1. BAG PRODUCTS
bags = [
    ("hpmc.svg", "HPMC", "Hydroxypropyl Methyl Cellulose", "هيدروكسي بروبيل ميثيل السليلوز", "25 Kg"),
    ("hec.svg", "HEC", "Hydroxyethyl Cellulose", "هيدروكسي إيثيل السليلوز", "25 Kg"),
    ("mhec.svg", "MHEC", "Methyl Hydroxyethyl Cellulose", "ميثيل هيدروكسي إيثيل السليلوز", "25 Kg"),
    ("hemc.svg", "HEMC", "Hydroxyethyl Methyl Cellulose", "هيدروكسي إيثيل ميثيل السليلوز", "25 Kg"),
    ("rdp.svg", "RDP", "Redispersible Polymer Powder", "بودرة البوليمر القابلة لإعادة التشتت", "25 Kg"),
    ("organo-bentonite.svg", "ORGANO BENTONITE", "Organo Bentonite Clay", "أورجانو بنتونايت", "25 Kg"),
    ("shmp.svg", "SHMP", "Sodium Hexametaphosphate", "سداسي ميتا فوسفات الصوديوم", "25 Kg"),
    ("smbs.svg", "SMBS", "Sodium Metabisulfite", "ميتابيسلفيت الصوديوم", "25 Kg"),
    ("zinc-dust.svg", "ZINC DUST", "High Purity Zinc Dust", "بودرة غبار الزنك", "25 Kg"),
    ("zinc-phosphate.svg", "ZINC PHOSPHATE", "Anti-Corrosive Pigment", "فوسفات الزنك", "25 Kg"),
    ("zinc-stearate.svg", "ZINC STEARATE", "Industrial Zinc Stearate", "ستيرات الزنك", "20 Kg"),
    ("fumed-silica.svg", "FUMED SILICA", "Thixotropic Rheology Agent", "فيومد سيليكا", "10 Kg"),
    ("carbon-black.svg", "CARBON BLACK", "High Jetness Black Pigment", "أسود الكربون", "25 Kg"),
    ("maleic-resin.svg", "MALEIC RESIN", "Refined Maleic Rosin Resin", "راتنج المالييك", "25 Kg"),
    ("natural-barium-sulphate.svg", "BARIUM SULPHATE", "Natural Barite Extender", "كبريتات الباريوم الطبيعية", "25 Kg"),
    ("lithopone.svg", "LITHOPONE", "Zinc Sulfide + Barium Sulfate", "الليثوبون", "25 Kg"),
    ("mica.svg", "MICA", "Lamellar Barrier Mineral", "بودرة المايكا", "25 Kg"),
    ("talc.svg", "TALC", "Industrial Coating Grade Talc", "بودرة التلك الصناعية", "25 Kg"),
    ("pcc.svg", "PCC", "Precipitated Calcium Carbonate", "كربونات الكالسيوم المرسبة", "25 Kg"),
    ("citric-acid.svg", "CITRIC ACID", "Citric Acid Anhydrous", "حمض الستريك", "25 Kg"),
    ("dcmx.svg", "DCMX", "Dichlorometaxylenol Antiseptic", "ثنائي كلورو ميتا زيلينول", "25 Kg"),
    ("paraffin-wax.svg", "PARAFFIN WAX", "Fully Refined Paraffin Wax", "شمع البارافين", "25 Kg"),
]

for item in bags:
    generate_bag_svg(*item)

# 2. DRUM PRODUCTS
drums = [
    ("cobalt-octoate-10.svg", "COBALT OCTOATE 10%", "Primary Surface Drier", "أوكتوات الكوبالت 10%", "#1e3a8a", "200 Kg"),
    ("calcium-octoate-10.svg", "CALCIUM OCTOATE 10%", "Auxiliary Through Drier", "أوكتوات الكالسيوم 10%", "#0369a1", "200 Kg"),
    ("zirconium-octoate-18.svg", "ZIRCONIUM OCTOATE 18%", "Through Drier Catalyst", "أوكتوات الزركونيوم 18%", "#0284c7", "200 Kg"),
    ("zinc-octoate.svg", "ZINC OCTOATE", "Auxiliary Drier & Hardener", "أوكتوات الزنك", "#0f766e", "200 Kg"),
    ("lead-octoate-36.svg", "LEAD OCTOATE 36%", "High Solid Through Drier", "أوكتوات الرصاص 36%", "#b45309", "200 Kg"),
    ("iron-octoate.svg", "IRON OCTOATE", "Stoving Baking Finish Drier", "أوكتوات الحديد", "#451a03", "200 Kg"),
    ("copper-octoate.svg", "COPPER OCTOATE", "Antifouling Wood Preservative", "أوكتوات النحاس", "#064e3b", "200 Kg"),
    ("barium-octoate.svg", "BARIUM OCTOATE", "Auxiliary Gloss Drier", "أوكتوات الباريوم", "#334155", "200 Kg"),
    ("anti-skin-meko.svg", "MEKO", "Anti-Skinning Agent", "مضاد القشرة ميكو", "#b91c1c", "200 Kg"),
    ("biocide-isothiazolinone.svg", "BIOCIDE", "Isothiazolinonas In-Can", "مبيد بكتيري آيزوثيازولينون", "#0284c7", "200 Kg"),
    ("anti-foams.svg", "ANTI-FOAMS", "Silicone-Free Antifoam", "مضاد رغوة عالي الفعالية", "#1d4ed8", "200 Kg"),
    ("dispersing-agent.svg", "DISPERSING AGENT", "Polyacrylate Dispersant", "مشتت أصباغ مائي", "#2563eb", "200 Kg"),
    ("styrene-acrylic-polymer.svg", "STYRENE ACRYLIC", "Architectural Polymer Emulsion", "مستحلب ستيرين أكريليك", "#0284c7", "200 Kg"),
    ("ipa-isopropanol.svg", "IPA", "Isopropyl Alcohol 99.8%", "كحول الآيزوبروبيل", "#1e3a8a", "160 Kg"),
    ("xylene.svg", "XYLENE", "Mixed Industrial Xylenes", "الزايلين الصناعي", "#172554", "180 Kg"),
    ("butyl-acetate.svg", "BUTYL ACETATE", "Industrial Grade Solvent", "بيوتيل أسيتات", "#0369a1", "180 Kg"),
    ("ethanol.svg", "ETHANOL", "Industrial Ethyl Alcohol 96%", "الإيثانول الصناعي", "#0284c7", "160 Kg"),
    ("methanol.svg", "METHANOL", "High Purity Methyl Alcohol", "الميثانول الصناعي", "#075985", "165 Kg"),
    ("ethyl-acetate.svg", "ETHYL ACETATE", "Fast Evaporating Ester", "إيثيل أسيتات", "#0284c7", "180 Kg"),
    ("white-spirit.svg", "WHITE SPIRIT", "Mineral Turpentine Solvent", "الوايت سبيريت", "#1e293b", "150 Kg"),
    ("sles-texapon.svg", "SLES 70%", "Sodium Lauryl Ether Sulphate", "تكسابون 70%", "#0369a1", "170 Kg"),
    ("labsa-sulfonic.svg", "LABSA 96%", "Linear Alkylbenzene Sulphonic", "حمض السلفونيك الخطي", "#7c2d12", "215 Kg"),
    ("cdea-comperlan.svg", "CDEA", "Cocodiethanolamide Booster", "كوكو داي إيثانول أميد", "#047857", "200 Kg"),
    ("capb-betaine.svg", "CAPB / BETAINE", "Cocamidopropyl Betaine 99%", "بيتاين كوكاميدو بروبيل", "#0284c7", "200 Kg"),
    ("polysorbate.svg", "POLYSORBATE", "Tween Series Solubilizer", "بولي سوربات", "#b45309", "200 Kg"),
    ("dblo-linseed-oil.svg", "DBLO", "Double Boiled Linseed Oil", "زيت بذر الكتان المغلي", "#78350f", "200 Kg"),
    ("pine-oil.svg", "PINE OIL 85%", "Natural Disinfectant Solvent", "زيت الصنوبر المطهر", "#14532d", "190 Kg"),
    ("castor-oil.svg", "CASTOR OIL", "First Special Grade Castor Oil", "زيت الخروع الصناعي", "#ca8a04", "200 Kg"),
    ("glycerin.svg", "GLYCERIN 99.5%", "Refined Pure Glycerin USP", "الجلسرين النقي", "#0284c7", "250 Kg"),
    ("white-petroleum-jelly.svg", "PETROLEUM JELLY", "Pure White Vaseline", "الفازلين الأبيض النقي", "#475569", "175 Kg"),
    ("liquid-paraffin.svg", "LIQUID PARAFFIN", "White Mineral Oil", "البارافين السائل", "#0284c7", "170 Kg"),
    ("detergent-perfume-colors.svg", "PERFUMES & COLORS", "Detergent Industrial Concentrates", "معطرات وألوان المنظفات", "#7c3aed", "25 Kg"),
]

for item in drums:
    generate_drum_svg(*item)

print(f"Generated {len(bags) + len(drums)} custom branded product SVG images in public/images/catalog/!")

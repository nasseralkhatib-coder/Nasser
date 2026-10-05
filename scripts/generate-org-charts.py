import os

os.makedirs('public/images', exist_ok=True)
os.makedirs('public/downloads', exist_ok=True)

def generate_arabic_svg():
    svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1100" width="100%" height="100%" direction="rtl">
  <defs>
    <style>
      .title { font-family: 'Cairo', system-ui, sans-serif; font-weight: 800; fill: #0f172a; text-anchor: middle; }
      .badge-text { font-family: 'Cairo', system-ui, sans-serif; font-weight: 700; fill: #047857; text-anchor: middle; font-size: 14px; }
      .pill-text { font-family: 'Cairo', system-ui, sans-serif; font-weight: 700; fill: #ffffff; text-anchor: middle; font-size: 13px; }
      .card-name { font-family: 'Cairo', system-ui, sans-serif; font-weight: 800; fill: #0f172a; text-anchor: middle; font-size: 14px; }
      .card-role { font-family: 'Cairo', system-ui, sans-serif; font-weight: 600; fill: #475569; text-anchor: middle; font-size: 12px; }
      .stat-num { font-family: 'Cairo', system-ui, sans-serif; font-weight: 900; fill: #0f172a; text-anchor: middle; font-size: 20px; }
      .stat-lbl { font-family: 'Cairo', system-ui, sans-serif; font-weight: 600; fill: #64748b; text-anchor: middle; font-size: 11px; }
      .conn-line { stroke: #059669; stroke-width: 2; fill: none; }
    </style>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.06"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1600" height="1100" fill="#f8fafc" rx="16" />
  <rect x="20" y="20" width="1560" height="1060" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" rx="12" />

  <!-- HEADER -->
  <!-- Stats Box Left -->
  <g transform="translate(60, 50)">
    <rect width="90" height="50" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
    <text x="45" y="20" class="stat-lbl">الأقسام</text>
    <text x="45" y="42" class="stat-num">8</text>
  </g>
  <g transform="translate(160, 50)">
    <rect width="100" height="50" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
    <text x="50" y="20" class="stat-lbl">إجمالي الكادر</text>
    <text x="50" y="42" class="stat-num">38</text>
  </g>

  <!-- Center Title -->
  <text x="800" y="70" class="title" font-size="24">الهيكل التنظيمي لشركة كميزون كميكال التجارية</text>
  <rect x="765" y="85" width="70" height="24" rx="12" fill="#ecfdf5" stroke="#a7f3d0" />
  <text x="800" y="102" class="badge-text" font-size="12">2026</text>

  <!-- Logo Right -->
  <g transform="translate(1360, 45)">
    <polygon points="25,6 55,6 70,30 55,54 25,54 10,30" fill="#ffffff" stroke="#475569" stroke-width="3" stroke-linejoin="round" />
    <path d="M 45 16 L 25 30 L 45 44" fill="none" stroke="#70C041" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="45" cy="16" r="5" fill="#70C041" />
    <circle cx="25" cy="30" r="5" fill="#70C041" />
    <circle cx="45" cy="44" r="5" fill="#70C041" />
    <text x="85" y="38" font-family="'Cairo', sans-serif" font-weight="900" font-size="20" fill="#047857" letter-spacing="1">KEMIZONE</text>
  </g>

  <!-- CONNECTING LINES TREE -->
  <!-- GM down -->
  <path d="M 800, 205 L 800, 235" class="conn-line" />
  <!-- DGM & CEO horizontal bus -->
  <path d="M 610, 235 L 990, 235" class="conn-line" />
  <path d="M 610, 235 L 610, 250" class="conn-line" />
  <path d="M 990, 235 L 990, 250" class="conn-line" />

  <!-- From CEO down to Mid-management bus -->
  <path d="M 800, 235 L 800, 340" class="conn-line" />
  <path d="M 490, 340 L 1110, 340" class="conn-line" />
  <path d="M 490, 340 L 490, 355" class="conn-line" />
  <path d="M 1110, 340 L 1110, 355" class="conn-line" />

  <!-- BizDev Manager to Officer -->
  <path d="M 1110, 420 L 1110, 445" class="conn-line" />

  <!-- Finance CFO to Accountants -->
  <path d="M 490, 420 L 490, 445" class="conn-line" />

  <!-- Main Departments Bus (Horizontal cross entire width) -->
  <path d="M 800, 340 L 800, 520" class="conn-line" />
  <path d="M 155, 520 L 1445, 520" class="conn-line" />
  <!-- Drops to each department -->
  <path d="M 155, 520 L 155, 545" class="conn-line" />
  <path d="M 410, 520 L 410, 545" class="conn-line" />
  <path d="M 670, 520 L 670, 545" class="conn-line" />
  <path d="M 930, 520 L 930, 545" class="conn-line" />
  <path d="M 1190, 520 L 1190, 545" class="conn-line" />
  <path d="M 1445, 520 L 1445, 545" class="conn-line" />

  <!-- 1. LEVEL 1: GENERAL MANAGER (GM) -->
  <rect x="735" y="130" width="130" height="24" rx="12" fill="#047857" />
  <text x="800" y="146" class="pill-text">الإدارة العليا</text>
  <g transform="translate(690, 150)" filter="url(#shadow)">
    <rect width="220" height="55" rx="8" fill="#ffffff" stroke="#047857" stroke-width="2" />
    <text x="110" y="25" class="card-name" font-size="16">وليد الرميح</text>
    <text x="110" y="44" class="card-role">المدير العام</text>
  </g>

  <!-- 2. LEVEL 2: DGM & CEO -->
  <!-- DGM (Left/Right depending on chart) -->
  <g transform="translate(880, 250)" filter="url(#shadow)">
    <rect width="220" height="55" rx="8" fill="#ffffff" stroke="#047857" stroke-width="2" />
    <text x="110" y="25" class="card-name" font-size="15">عبدالله السيف</text>
    <text x="110" y="44" class="card-role">نائب المدير العام</text>
  </g>
  <!-- CEO -->
  <g transform="translate(500, 250)" filter="url(#shadow)">
    <rect width="220" height="55" rx="8" fill="#ffffff" stroke="#047857" stroke-width="2" />
    <text x="110" y="25" class="card-name" font-size="15">نديم الخطيب</text>
    <text x="110" y="44" class="card-role">المدير التنفيذي</text>
  </g>

  <!-- 3. LEVEL 3: BIZ DEV & FINANCE -->
  <!-- Business Development -->
  <g transform="translate(1000, 355)">
    <rect x="35" y="-12" width="150" height="22" rx="11" fill="#047857" />
    <text x="110" y="3" class="pill-text" font-size="11">إدارة تطوير الأعمال والشركات</text>
    <g filter="url(#shadow)">
      <rect width="220" height="55" rx="8" fill="#ffffff" stroke="#047857" stroke-width="2" />
      <text x="110" y="24" class="card-name" font-size="14">ناصر الخطيب</text>
      <text x="110" y="42" class="card-role">مدير تطوير الأعمال والشركات</text>
    </g>
    <!-- Officer -->
    <g transform="translate(30, 90)" filter="url(#shadow)">
      <rect width="160" height="48" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
      <text x="80" y="21" class="card-name" font-size="13">عمر يحيى</text>
      <text x="80" y="38" class="card-role" font-size="11">موظف تطوير أعمال</text>
    </g>
  </g>

  <!-- Finance & Accounts -->
  <g transform="translate(380, 355)">
    <rect x="45" y="-12" width="130" height="22" rx="11" fill="#047857" />
    <text x="110" y="3" class="pill-text" font-size="11">قسم الإدارة المالية</text>
    <g filter="url(#shadow)">
      <rect width="220" height="55" rx="8" fill="#ffffff" stroke="#047857" stroke-width="2" />
      <text x="110" y="24" class="card-name" font-size="14">توفيق السيد</text>
      <text x="110" y="42" class="card-role">المدير المالي</text>
    </g>
    <!-- 3 Accountants Bus -->
    <path d="M 110, 55 L 110, 80" class="conn-line" />
    <path d="M -90, 80 L 310, 80" class="conn-line" />
    <path d="M -90, 80 L -90, 90" class="conn-line" />
    <path d="M 110, 80 L 110, 90" class="conn-line" />
    <path d="M 310, 80 L 310, 90" class="conn-line" />

    <!-- Reda Tolba -->
    <g transform="translate(245, 90)" filter="url(#shadow)">
      <rect width="130" height="48" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
      <text x="65" y="21" class="card-name" font-size="13">رضا طلبة</text>
      <text x="65" y="38" class="card-role" font-size="11">محاسب</text>
    </g>
    <!-- Ahmad Hasan -->
    <g transform="translate(45, 90)" filter="url(#shadow)">
      <rect width="130" height="48" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
      <text x="65" y="21" class="card-name" font-size="13">أحمد حسن</text>
      <text x="65" y="38" class="card-role" font-size="11">محاسب</text>
    </g>
    <!-- Basher Alnafee -->
    <g transform="translate(-155, 90)" filter="url(#shadow)">
      <rect width="130" height="48" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
      <text x="65" y="21" class="card-name" font-size="13">بشير النافع</text>
      <text x="65" y="38" class="card-role" font-size="11">محاسب</text>
    </g>
  </g>

  <!-- 4. LEVEL 4: THE 6 DEPARTMENTS -->
  <!-- DEP 1: SALES (Rightmost) -->
  <g transform="translate(1335, 545)">
    <rect x="50" y="-12" width="120" height="22" rx="11" fill="#047857" />
    <text x="110" y="3" class="pill-text" font-size="12">قسم المبيعات</text>
    <g filter="url(#shadow)">
      <rect width="220" height="52" rx="8" fill="#ffffff" stroke="#047857" stroke-width="1.8" />
      <text x="110" y="23" class="card-name">غسان زيد</text>
      <text x="110" y="41" class="card-role">مدير المبيعات</text>
    </g>
    <!-- Drop to 6 members -->
    <path d="M 110, 52 L 110, 75" class="conn-line" />
    <!-- 6 Members List -->
    <g transform="translate(25, 75)">
      <!-- 1. Saleh Altaher -->
      <g transform="translate(0, 0)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">صالح الطاهر</text>
        <text x="85" y="35" class="card-role" font-size="10.5">مندوب مبيعات</text>
      </g>
      <!-- 2. Amro Mansur -->
      <g transform="translate(0, 54)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">عمرو منصور</text>
        <text x="85" y="35" class="card-role" font-size="10.5">مندوب مبيعات</text>
      </g>
      <!-- 3. Jehad Qtifan -->
      <g transform="translate(0, 108)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">جهاد قطيفان</text>
        <text x="85" y="35" class="card-role" font-size="10.5">مندوب مبيعات</text>
      </g>
      <!-- 4. Qusai Humaidi -->
      <g transform="translate(0, 162)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">قصي حميدي</text>
        <text x="85" y="35" class="card-role" font-size="10.5">مندوب مبيعات</text>
      </g>
      <!-- 5. Mahmud Gyati -->
      <g transform="translate(0, 216)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">محمود غيتي</text>
        <text x="85" y="35" class="card-role" font-size="10.5">مندوب مبيعات</text>
      </g>
      <!-- 6. Muhan Azem -->
      <g transform="translate(0, 270)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">مهان عظيم</text>
        <text x="85" y="35" class="card-role" font-size="10.5">مندوب مبيعات</text>
      </g>
    </g>
  </g>

  <!-- DEP 2: MARKETING -->
  <g transform="translate(1080, 545)">
    <rect x="50" y="-12" width="120" height="22" rx="11" fill="#047857" />
    <text x="110" y="3" class="pill-text" font-size="12">قسم التسويق</text>
    <g filter="url(#shadow)">
      <rect width="220" height="52" rx="8" fill="#ffffff" stroke="#047857" stroke-width="1.8" />
      <text x="110" y="23" class="card-name">حسام المحمدي</text>
      <text x="110" y="41" class="card-role">مدير التسويق</text>
    </g>
    <path d="M 110, 52 L 110, 75" class="conn-line" />
    <g transform="translate(25, 75)">
      <!-- Nader Hattab -->
      <g transform="translate(0, 0)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">نادر حطاب</text>
        <text x="85" y="35" class="card-role" font-size="10.5">موظف تسويق</text>
      </g>
      <!-- Qusai Humaidi -->
      <g transform="translate(0, 54)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">قصي حميدي</text>
        <text x="85" y="35" class="card-role" font-size="10.5">موظف تسويق</text>
      </g>
    </g>
  </g>

  <!-- DEP 3: PUBLIC RELATIONS -->
  <g transform="translate(820, 545)">
    <rect x="45" y="-12" width="130" height="22" rx="11" fill="#047857" />
    <text x="110" y="3" class="pill-text" font-size="12">قسم العلاقات العامة</text>
    <g filter="url(#shadow)">
      <rect width="220" height="52" rx="8" fill="#ffffff" stroke="#047857" stroke-width="1.8" />
      <text x="110" y="23" class="card-name">أحمد العتيبي</text>
      <text x="110" y="41" class="card-role">مدير العلاقات العامة</text>
    </g>
    <path d="M 110, 52 L 110, 75" class="conn-line" />
    <g transform="translate(25, 75)">
      <!-- Suliman Alanizi -->
      <g transform="translate(0, 0)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">سليمان العنزي</text>
        <text x="85" y="35" class="card-role" font-size="10.5">موظف علاقات عامة</text>
      </g>
    </g>
  </g>

  <!-- DEP 4: HUMAN RESOURCES -->
  <g transform="translate(560, 545)">
    <rect x="45" y="-12" width="130" height="22" rx="11" fill="#047857" />
    <text x="110" y="3" class="pill-text" font-size="12">قسم الموارد البشرية</text>
    <g filter="url(#shadow)">
      <rect width="220" height="52" rx="8" fill="#ffffff" stroke="#047857" stroke-width="1.8" />
      <text x="110" y="23" class="card-name">نورا اليامي</text>
      <text x="110" y="41" class="card-role">مدير الموارد البشرية</text>
    </g>
    <path d="M 110, 52 L 110, 75" class="conn-line" />
    <g transform="translate(25, 75)">
      <!-- Khadija Aljezani -->
      <g transform="translate(0, 0)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">خديجة الجيزاني</text>
        <text x="85" y="35" class="card-role" font-size="10.5">موظف موارد بشرية</text>
      </g>
      <!-- Hosa Aldosari -->
      <g transform="translate(0, 54)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">حصة الدوسري</text>
        <text x="85" y="35" class="card-role" font-size="10.5">موظف موارد بشرية</text>
      </g>
    </g>
  </g>

  <!-- DEP 5: INFORMATION TECHNOLOGY -->
  <g transform="translate(300, 545)">
    <rect x="35" y="-12" width="150" height="22" rx="11" fill="#047857" />
    <text x="110" y="3" class="pill-text" font-size="11.5">قسم تكنولوجيا المعلومات</text>
    <g filter="url(#shadow)">
      <rect width="220" height="52" rx="8" fill="#ffffff" stroke="#047857" stroke-width="1.8" />
      <text x="110" y="23" class="card-name">مروان المانع</text>
      <text x="110" y="41" class="card-role">مدير تكنولوجيا المعلومات</text>
    </g>
    <path d="M 110, 52 L 110, 75" class="conn-line" />
    <g transform="translate(25, 75)">
      <!-- Wahed Aldosoqi -->
      <g transform="translate(0, 0)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">وحيد الدسوقي</text>
        <text x="85" y="35" class="card-role" font-size="10">أخصائي تكنولوجيا المعلومات</text>
      </g>
    </g>
  </g>

  <!-- DEP 6: STORAGE & SUPPLY -->
  <g transform="translate(45, 545)">
    <rect x="45" y="-12" width="130" height="22" rx="11" fill="#047857" />
    <text x="110" y="3" class="pill-text" font-size="12">قسم التخزين والتوريد</text>
    <g filter="url(#shadow)">
      <rect width="220" height="52" rx="8" fill="#ffffff" stroke="#047857" stroke-width="1.8" />
      <text x="110" y="23" class="card-name">حمد الراجح</text>
      <text x="110" y="41" class="card-role">مدير التخزين والتوريد</text>
    </g>
    <path d="M 110, 52 L 110, 75" class="conn-line" />
    <g transform="translate(25, 75)">
      <!-- Shafiq Islam -->
      <g transform="translate(0, 0)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">شفيق إسلام</text>
        <text x="85" y="35" class="card-role" font-size="10.5">موظف توريد</text>
      </g>
      <!-- Wajeh Kokar -->
      <g transform="translate(0, 54)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">وجيه خوخار</text>
        <text x="85" y="35" class="card-role" font-size="10.5">موظف توريد</text>
      </g>
      <!-- Ali Shodri -->
      <g transform="translate(0, 108)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">علي شودري</text>
        <text x="85" y="35" class="card-role" font-size="10.5">موظف توريد</text>
      </g>
      <!-- Drivers -->
      <g transform="translate(0, 162)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12" fill="#047857">سائقين</text>
        <text x="85" y="35" class="card-role" font-size="11" font-weight="700">عدد 8</text>
      </g>
    </g>
  </g>
</svg>"""
    with open('public/images/kemizone_org_chart_ar.svg', 'w', encoding='utf-8') as f:
        f.write(svg)
    with open('public/downloads/kemizone_org_chart_ar.svg', 'w', encoding='utf-8') as f:
        f.write(svg)

def generate_english_svg():
    svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1100" width="100%" height="100%" direction="ltr">
  <defs>
    <style>
      .title { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-weight: 800; fill: #0f172a; text-anchor: middle; }
      .badge-text { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-weight: 700; fill: #047857; text-anchor: middle; font-size: 14px; }
      .pill-text { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-weight: 700; fill: #ffffff; text-anchor: middle; font-size: 12px; }
      .card-name { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-weight: 800; fill: #0f172a; text-anchor: middle; font-size: 14px; }
      .card-role { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-weight: 600; fill: #475569; text-anchor: middle; font-size: 11.5px; }
      .stat-num { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-weight: 900; fill: #0f172a; text-anchor: middle; font-size: 20px; }
      .stat-lbl { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-weight: 600; fill: #64748b; text-anchor: middle; font-size: 11px; }
      .conn-line { stroke: #059669; stroke-width: 2; fill: none; }
    </style>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.06"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1600" height="1100" fill="#f8fafc" rx="16" />
  <rect x="20" y="20" width="1560" height="1060" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" rx="12" />

  <!-- HEADER -->
  <!-- Logo Left -->
  <g transform="translate(60, 45)">
    <polygon points="25,6 55,6 70,30 55,54 25,54 10,30" fill="#ffffff" stroke="#475569" stroke-width="3" stroke-linejoin="round" />
    <path d="M 45 16 L 25 30 L 45 44" fill="none" stroke="#70C041" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="45" cy="16" r="5" fill="#70C041" />
    <circle cx="25" cy="30" r="5" fill="#70C041" />
    <circle cx="45" cy="44" r="5" fill="#70C041" />
    <text x="85" y="38" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="20" fill="#047857" letter-spacing="1">KEMIZONE</text>
  </g>

  <!-- Center Title -->
  <text x="800" y="70" class="title" font-size="24">Organizational Structure - Kemizone Chemical Commercial .Co</text>
  <rect x="765" y="85" width="70" height="24" rx="12" fill="#ecfdf5" stroke="#a7f3d0" />
  <text x="800" y="102" class="badge-text" font-size="12">2026</text>

  <!-- Stats Box Right -->
  <g transform="translate(1340, 50)">
    <rect width="90" height="50" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
    <text x="45" y="20" class="stat-lbl">Total Team</text>
    <text x="45" y="42" class="stat-num">38</text>
  </g>
  <g transform="translate(1440, 50)">
    <rect width="100" height="50" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
    <text x="50" y="20" class="stat-lbl">Departments</text>
    <text x="50" y="42" class="stat-num">8</text>
  </g>

  <!-- CONNECTING LINES TREE -->
  <!-- GM down -->
  <path d="M 800, 205 L 800, 235" class="conn-line" />
  <!-- DGM & CEO horizontal bus -->
  <path d="M 610, 235 L 990, 235" class="conn-line" />
  <path d="M 610, 235 L 610, 250" class="conn-line" />
  <path d="M 990, 235 L 990, 250" class="conn-line" />

  <!-- From CEO down to Mid-management bus -->
  <path d="M 800, 235 L 800, 340" class="conn-line" />
  <path d="M 490, 340 L 1110, 340" class="conn-line" />
  <path d="M 490, 340 L 490, 355" class="conn-line" />
  <path d="M 1110, 340 L 1110, 355" class="conn-line" />

  <!-- BizDev Manager to Officer -->
  <path d="M 490, 420 L 490, 445" class="conn-line" />

  <!-- Finance CFO to Accountants -->
  <path d="M 1110, 420 L 1110, 445" class="conn-line" />

  <!-- Main Departments Bus (Horizontal cross entire width) -->
  <path d="M 800, 340 L 800, 520" class="conn-line" />
  <path d="M 155, 520 L 1445, 520" class="conn-line" />
  <!-- Drops to each department -->
  <path d="M 155, 520 L 155, 545" class="conn-line" />
  <path d="M 410, 520 L 410, 545" class="conn-line" />
  <path d="M 670, 520 L 670, 545" class="conn-line" />
  <path d="M 930, 520 L 930, 545" class="conn-line" />
  <path d="M 1190, 520 L 1190, 545" class="conn-line" />
  <path d="M 1445, 520 L 1445, 545" class="conn-line" />

  <!-- 1. LEVEL 1: GENERAL MANAGER (GM) -->
  <rect x="720" y="130" width="160" height="24" rx="12" fill="#047857" />
  <text x="800" y="146" class="pill-text">Executive Management</text>
  <g transform="translate(690, 150)" filter="url(#shadow)">
    <rect width="220" height="55" rx="8" fill="#ffffff" stroke="#047857" stroke-width="2" />
    <text x="110" y="25" class="card-name" font-size="16">Waleed Al-Rumaih</text>
    <text x="110" y="44" class="card-role">General Manager (GM)</text>
  </g>

  <!-- 2. LEVEL 2: DGM & CEO -->
  <!-- DGM (Left) -->
  <g transform="translate(500, 250)" filter="url(#shadow)">
    <rect width="220" height="55" rx="8" fill="#ffffff" stroke="#047857" stroke-width="2" />
    <text x="110" y="25" class="card-name" font-size="15">Abdulla Alsaif</text>
    <text x="110" y="44" class="card-role">Deputy General Manager (DGM)</text>
  </g>
  <!-- CEO (Right) -->
  <g transform="translate(880, 250)" filter="url(#shadow)">
    <rect width="220" height="55" rx="8" fill="#ffffff" stroke="#047857" stroke-width="2" />
    <text x="110" y="25" class="card-name" font-size="15">Nadeem Al khatib</text>
    <text x="110" y="44" class="card-role">Chief Executive Officer (CEO)</text>
  </g>

  <!-- 3. LEVEL 3: BIZ DEV & FINANCE -->
  <!-- Business Development -->
  <g transform="translate(380, 355)">
    <rect x="15" y="-12" width="190" height="22" rx="11" fill="#047857" />
    <text x="110" y="3" class="pill-text" font-size="11">Business Development &amp; Partnerships</text>
    <g filter="url(#shadow)">
      <rect width="220" height="55" rx="8" fill="#ffffff" stroke="#047857" stroke-width="2" />
      <text x="110" y="24" class="card-name" font-size="14">Nasser Al khatib</text>
      <text x="110" y="42" class="card-role">Business Development Manager</text>
    </g>
    <!-- Officer -->
    <g transform="translate(30, 90)" filter="url(#shadow)">
      <rect width="160" height="48" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
      <text x="80" y="21" class="card-name" font-size="13">Omar Yahya</text>
      <text x="80" y="38" class="card-role" font-size="11">Business Development Officer</text>
    </g>
  </g>

  <!-- Finance & Accounts -->
  <g transform="translate(1000, 355)">
    <rect x="45" y="-12" width="130" height="22" rx="11" fill="#047857" />
    <text x="110" y="3" class="pill-text" font-size="11">Finance &amp; Accounts</text>
    <g filter="url(#shadow)">
      <rect width="220" height="55" rx="8" fill="#ffffff" stroke="#047857" stroke-width="2" />
      <text x="110" y="24" class="card-name" font-size="14">Tawfiq Alsaid</text>
      <text x="110" y="42" class="card-role">Chief Financial Officer (CFO)</text>
    </g>
    <!-- 3 Accountants Bus -->
    <path d="M 110, 55 L 110, 80" class="conn-line" />
    <path d="M -90, 80 L 310, 80" class="conn-line" />
    <path d="M -90, 80 L -90, 90" class="conn-line" />
    <path d="M 110, 80 L 110, 90" class="conn-line" />
    <path d="M 310, 80 L 310, 90" class="conn-line" />

    <!-- Reda Tolba -->
    <g transform="translate(-155, 90)" filter="url(#shadow)">
      <rect width="130" height="48" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
      <text x="65" y="21" class="card-name" font-size="13">Reda Tolba</text>
      <text x="65" y="38" class="card-role" font-size="11">Accountant</text>
    </g>
    <!-- Ahmad Hasan -->
    <g transform="translate(45, 90)" filter="url(#shadow)">
      <rect width="130" height="48" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
      <text x="65" y="21" class="card-name" font-size="13">Ahmad Hasan</text>
      <text x="65" y="38" class="card-role" font-size="11">Accountant</text>
    </g>
    <!-- Basher Alnafee -->
    <g transform="translate(245, 90)" filter="url(#shadow)">
      <rect width="130" height="48" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
      <text x="65" y="21" class="card-name" font-size="13">Basher Alnafee</text>
      <text x="65" y="38" class="card-role" font-size="11">Accountant</text>
    </g>
  </g>

  <!-- 4. LEVEL 4: THE 6 DEPARTMENTS -->
  <!-- DEP 1: SALES -->
  <g transform="translate(45, 545)">
    <rect x="50" y="-12" width="120" height="22" rx="11" fill="#047857" />
    <text x="110" y="3" class="pill-text" font-size="12">Sales Department</text>
    <g filter="url(#shadow)">
      <rect width="220" height="52" rx="8" fill="#ffffff" stroke="#047857" stroke-width="1.8" />
      <text x="110" y="23" class="card-name">Ghsan Zaid</text>
      <text x="110" y="41" class="card-role">Sales Manager</text>
    </g>
    <path d="M 110, 52 L 110, 75" class="conn-line" />
    <!-- 6 Members List -->
    <g transform="translate(25, 75)">
      <!-- 1. Saleh Altaher -->
      <g transform="translate(0, 0)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">Saleh Altaher</text>
        <text x="85" y="35" class="card-role" font-size="10.5">Sales Representative</text>
      </g>
      <!-- 2. Amro Mansur -->
      <g transform="translate(0, 54)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">Amro Mansur</text>
        <text x="85" y="35" class="card-role" font-size="10.5">Sales Representative</text>
      </g>
      <!-- 3. Jehad Qtifan -->
      <g transform="translate(0, 108)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">Jehad Qtifan</text>
        <text x="85" y="35" class="card-role" font-size="10.5">Sales Representative</text>
      </g>
      <!-- 4. Qusai Humaidi -->
      <g transform="translate(0, 162)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">Qusai Humaidi</text>
        <text x="85" y="35" class="card-role" font-size="10.5">Sales Representative</text>
      </g>
      <!-- 5. Mahmud Gyati -->
      <g transform="translate(0, 216)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">Mahmud Gyati</text>
        <text x="85" y="35" class="card-role" font-size="10.5">Sales Representative</text>
      </g>
      <!-- 6. Muhan Azem -->
      <g transform="translate(0, 270)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">Muhan Azem</text>
        <text x="85" y="35" class="card-role" font-size="10.5">Sales Representative</text>
      </g>
    </g>
  </g>

  <!-- DEP 2: MARKETING -->
  <g transform="translate(300, 545)">
    <rect x="40" y="-12" width="140" height="22" rx="11" fill="#047857" />
    <text x="110" y="3" class="pill-text" font-size="12">Marketing Department</text>
    <g filter="url(#shadow)">
      <rect width="220" height="52" rx="8" fill="#ffffff" stroke="#047857" stroke-width="1.8" />
      <text x="110" y="23" class="card-name">Husam Almuhamadi</text>
      <text x="110" y="41" class="card-role">Sales Manager</text>
    </g>
    <path d="M 110, 52 L 110, 75" class="conn-line" />
    <g transform="translate(25, 75)">
      <!-- Nader Hattab -->
      <g transform="translate(0, 0)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">Nader Hattab</text>
        <text x="85" y="35" class="card-role" font-size="10.5">Marketing Officer</text>
      </g>
      <!-- Qusai Humaidi -->
      <g transform="translate(0, 54)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">Qusai Humaidi</text>
        <text x="85" y="35" class="card-role" font-size="10.5">Marketing Officer</text>
      </g>
    </g>
  </g>

  <!-- DEP 3: PUBLIC RELATIONS -->
  <g transform="translate(560, 545)">
    <rect x="25" y="-12" width="170" height="22" rx="11" fill="#047857" />
    <text x="110" y="3" class="pill-text" font-size="11.5">Public Relations Department</text>
    <g filter="url(#shadow)">
      <rect width="220" height="52" rx="8" fill="#ffffff" stroke="#047857" stroke-width="1.8" />
      <text x="110" y="23" class="card-name">Ahmed Al-Otaibi</text>
      <text x="110" y="41" class="card-role">Public Relations Manager</text>
    </g>
    <path d="M 110, 52 L 110, 75" class="conn-line" />
    <g transform="translate(25, 75)">
      <!-- Suliman Alanizi -->
      <g transform="translate(0, 0)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">Suliman Alanizi</text>
        <text x="85" y="35" class="card-role" font-size="10.5">Public Relations Officer</text>
      </g>
    </g>
  </g>

  <!-- DEP 4: HUMAN RESOURCES -->
  <g transform="translate(820, 545)">
    <rect x="45" y="-12" width="130" height="22" rx="11" fill="#047857" />
    <text x="110" y="3" class="pill-text" font-size="12">Human Resources</text>
    <g filter="url(#shadow)">
      <rect width="220" height="52" rx="8" fill="#ffffff" stroke="#047857" stroke-width="1.8" />
      <text x="110" y="23" class="card-name">Nora alyami</text>
      <text x="110" y="41" class="card-role">HR Manager</text>
    </g>
    <path d="M 110, 52 L 110, 75" class="conn-line" />
    <g transform="translate(25, 75)">
      <!-- Khadija Aljezani -->
      <g transform="translate(0, 0)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">Khadija Aljezani</text>
        <text x="85" y="35" class="card-role" font-size="10.5">HR Officer</text>
      </g>
      <!-- Hosa Aldosari -->
      <g transform="translate(0, 54)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">Hosa Aldosari</text>
        <text x="85" y="35" class="card-role" font-size="10.5">HR Officer</text>
      </g>
    </g>
  </g>

  <!-- DEP 5: INFORMATION TECHNOLOGY -->
  <g transform="translate(1080, 545)">
    <rect x="35" y="-12" width="150" height="22" rx="11" fill="#047857" />
    <text x="110" y="3" class="pill-text" font-size="11.5">Information Technology</text>
    <g filter="url(#shadow)">
      <rect width="220" height="52" rx="8" fill="#ffffff" stroke="#047857" stroke-width="1.8" />
      <text x="110" y="23" class="card-name">Marwan Almanee</text>
      <text x="110" y="41" class="card-role">IT Manager</text>
    </g>
    <path d="M 110, 52 L 110, 75" class="conn-line" />
    <g transform="translate(25, 75)">
      <!-- Wahed Aldosoqi -->
      <g transform="translate(0, 0)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">Wahed Aldosoqi</text>
        <text x="85" y="35" class="card-role" font-size="10">IT Systems Specialist</text>
      </g>
    </g>
  </g>

  <!-- DEP 6: STORAGE & SUPPLY -->
  <g transform="translate(1335, 545)">
    <rect x="25" y="-12" width="170" height="22" rx="11" fill="#047857" />
    <text x="110" y="3" class="pill-text" font-size="11.5">Storage &amp; Supply Department</text>
    <g filter="url(#shadow)">
      <rect width="220" height="52" rx="8" fill="#ffffff" stroke="#047857" stroke-width="1.8" />
      <text x="110" y="23" class="card-name">Hamad Al rajeh</text>
      <text x="110" y="41" class="card-role">Storage &amp; Supply Manager</text>
    </g>
    <path d="M 110, 52 L 110, 75" class="conn-line" />
    <g transform="translate(25, 75)">
      <!-- Shafiq Islam -->
      <g transform="translate(0, 0)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">Shafiq Islam</text>
        <text x="85" y="35" class="card-role" font-size="10.5">Supply Officer</text>
      </g>
      <!-- Wajeh Kokar -->
      <g transform="translate(0, 54)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">Wajeh Kokar</text>
        <text x="85" y="35" class="card-role" font-size="10.5">Supply Officer</text>
      </g>
      <!-- Ali Shodri -->
      <g transform="translate(0, 108)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12">Ali Shodri</text>
        <text x="85" y="35" class="card-role" font-size="10.5">Supply Officer</text>
      </g>
      <!-- Drivers -->
      <g transform="translate(0, 162)" filter="url(#shadow)">
        <rect width="170" height="44" rx="6" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5" />
        <text x="85" y="19" class="card-name" font-size="12" fill="#047857">Drivers</text>
        <text x="85" y="35" class="card-role" font-size="11" font-weight="700">Count 8</text>
      </g>
    </g>
  </g>
</svg>"""
    with open('public/images/kemizone_org_chart_en.svg', 'w', encoding='utf-8') as f:
        f.write(svg)
    with open('public/downloads/kemizone_org_chart_en.svg', 'w', encoding='utf-8') as f:
        f.write(svg)

generate_arabic_svg()
generate_english_svg()
print("Generated high-res org chart SVGs successfully!")

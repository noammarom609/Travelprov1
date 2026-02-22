# תיעוד ממשק TravelPro — יום כיף
## מדריך מלא מההתחלה ועד הסוף (0–100)

---

## תוכן עניינים

1. [סקירה כללית](#1-סקירה-כללית)
2. [מערכת הניווט והמבנה](#2-מערכת-הניווט-והמבנה)
3. [עיצוב ו־Design System](#3-עיצוב-ו-design-system)
4. [זרימת אימות והתחברות](#4-זרימת-אימות-והתחברות)
5. [דשבורד](#5-דשבורד)
6. [פרויקטים](#6-פרויקטים)
7. [בנק ספקים](#7-בנק-ספקים)
8. [עורך הצעות מחיר](#8-עורך-הצעות-מחיר)
9. [תצוגת הצעה ללקוח (ציבורי)](#9-תצוגת-הצעה-ללקוח-ציבורי)
10. [ייבוא ספקים](#10-ייבוא-ספקים)
11. [ממשקים נוספים](#11-ממשקים-נוספים)
12. [API ו־Backend](#12-api-ו-backend)
13. [רכיבי UI משותפים](#13-רכיבי-ui-משותפים)

---

## 1. סקירה כללית

### מהי האפליקציה
**TravelPro (יום כיף)** — מערכת לניהול הפקות אירועים: פרויקטים, הצעות מחיר, ספקים, תמחור ורווחיות. מותאמת לעברית (RTL) ולעבודה עם לקוחות וספקים בתעשיית האירועים.

### סטק טכנולוגי
| רכיב | טכנולוגיה |
|------|-----------|
| פריימוורק | React 18.3, Vite 6.3 |
| ניתוב | React Router 7.1 |
| עיצוב | Tailwind CSS 4.1 |
| טפסים | react-hook-form |
| UI Primitives | Radix UI, סגנון shadcn |
| גרפים | Recharts |
| מפות | Leaflet, react-leaflet |
| אנימציות | Motion (Framer Motion) |
| Backend | Supabase (Auth + Edge Functions) |
| התראות | Sonner |
| אייקונים | Lucide React |

### מבנה התיקיות
```
Travelprov1/
├── src/
│   ├── app/
│   │   ├── App.tsx              # שורש האפליקציה, Auth, Router
│   │   ├── routes.ts            # הגדרות הניתוב
│   │   └── components/          # רכיבי האפליקציה
│   ├── styles/                  # CSS, Tailwind, fonts, theme
│   └── main.tsx
├── utils/supabase/info.tsx      # Supabase project ID & anon key
└── package.json
```

---

## 2. מערכת הניווט והמבנה

### Layout ראשי
- **Sidebar** (256px) — תפריט ראשי, קבוע במסך
- **Header** — חיפוש גלובלי, התראות, קישור לעזרה
- **Breadcrumbs** — פירורי ניווט לפי מסלול
- **תוכן ראשי** — אזור דינמי לפי העמוד

### פריטי ניווט ראשיים (Sidebar)
| מסלול | תווית | אייקון |
|-------|-------|--------|
| `/` | דשבורד | LayoutDashboard |
| `/projects` | פרויקטים | FolderOpen |
| `/suppliers` | בנק ספקים | Users |
| `/clients` | לקוחות | UserCircle |
| `/documents` | מסמכים | FileText |
| `/calendar` | יומן | Calendar |

### פריטי ניווט תחתונים
| מסלול | תווית | אייקון |
|-------|-------|--------|
| `/settings` | הגדרות | Settings |

### כפתורים מיוחדים
- **פרויקט חדש** — פותח מודל יצירת פרויקט חדש
- **חסימת משתמש** — תצוגת שם/אימייל וכפתור יציאה

### Header
- **תפריט נייד** — בעיקר למובייל (hamburger)
- **חיפוש גלובלי** — Ctrl/Cmd+K, חיפוש פרויקטים וספקים
- **קישור לעזרה (PRD)** — ניווט למסמך PRD
- **פאנל התראות** — כפתור עם אייקון פעמון

### דפים ללא Layout
- `/quote/:id` — תצוגת הצעה ללקוח (ציבורי)
- `/prd` — מסמך PRD (להדפסה)

---

## 3. עיצוב ו־Design System

### צבעים (Light Mode)
| טוקן | Hex | שימוש |
|------|-----|-------|
| Primary | `#ff8c00` | מיתוג, CTA, קישורים, מצב פעיל |
| Primary Hover | `#e67e00` | Hover על כפתורים ראשיים |
| Background | `#f8f7f5` | רקע העמוד |
| Card | `#ffffff` | כרטיסים, מודלים |
| Text Primary | `#181510` | כותרות, טקסט ראשי |
| Text Secondary | `#8d785e` | תוויות, מטא |
| Text Muted | `#b8a990`, `#c4b89a` | רמזים |
| Border | `#e7e1da`, `#d4cdc3` | גבולות |
| Subtle | `#f5f3f0`, `#ece8e3`, `#fcfbf9` | רקעים עדינים |

### טיפוגרפיה
- **גופן:** Assistant (Google Fonts), משקלים 200–800
- **גודל בסיס:** 16px
- **RTL:** `dir="rtl"` בלייאאוט וברכיבים
- **כותרות:** h1–h4 עם font-weight בינוני

### Dark Mode
- מוגדר ב־`theme.css` (`.dark`)
- לא משומש כרגע באופן רחב באפליקציה

### Toast
- **סוגים:** success, error, warning, info, neutral
- מותאם ל־RTL ועברית

---

## 4. זרימת אימות והתחברות

### לוגיקה
- `App` עוטף את האפליקציה ב־`AuthProvider`
- מסלול ציבורי: `/quote/:id` — ללא אימות
- כל שאר המסלולים: בדיקת `useAuth()`
- ללא משתמש מחובר → הפניה ל־`LoginPage`

### דף התחברות (`LoginPage`)
- **טאבים:** התחברות / הרשמה
- **התחברות:**
  - שדות: אימייל, סיסמה
  - הצגת/הסתרת סיסמה
  - Supabase: `signInWithPassword`
  - הודעות שגיאה בעברית (למשל "אימייל או סיסמה שגויים")
- **הרשמה:**
  - שדות: שם, אימייל, סיסמה, אימות סיסמה
  - קריאה ל־Edge Function `/signup`
  - בדיקת התאמת סיסמאות
  - הודעת שגיאה: "כתובת האימייל כבר רשומה במערכת"

### יציאה
- כפתור יציאה ב־Sidebar
- `supabase.auth.signOut()`

---

## 5. דשבורד

**מסלול:** `/` | **רכיב:** `Dashboard` | **Auth:** כן

### רכיבים עיקריים
- **ברכת פתיחה** — טקסט דינמי לפי המשתמש
- **Ticker** — הודעות רצות בסגנון live
- **4 כרטיסי סטטיסטיקה:**
  - לידים
  - הצעות שנשלחו
  - אושרו
  - סה״כ (עם Sparklines)
- **Pipeline Funnel** — משפך:
  - לידים → בניית הצעה → נשלחו → אושרו → בביצוע
- **Revenue Ring** — יעד הכנסות מול נוכחי
- **משימות דחופות** — למשל תמחור, לידים חדשים
- **טיימליין שבועי** — placeholder
- **פעילות אחרונה** — פיד עדכונים

---

## 6. פרויקטים

### רשימת פרויקטים (`ProjectsList`)
**מסלול:** `/projects` | **Auth:** כן

- **חיפוש** — לפי שם/לקוח
- **מסננים** — לפי סטטוס
- **רשת כרטיסים** — כל פרויקט מוצג בכרטיס
- **פעולות לכל פרויקט:**
  - עריכה
  - שינוי סטטוס
  - שכפול
  - מחיקה
- **מודלים:** עריכת פרויקט, שינוי סטטוס, אישור מחיקה

### כרטיס פרויקט
- סטטוס
- חברה/לקוח
- משתתפים
- אזור
- מחיר
- פס רווח

---

## 7. בנק ספקים

### רכזת ספקים (`SupplierBank`)
**מסלול:** `/suppliers` | **Auth:** כן

- **חיפוש** — לפי שם
- **מסננים** — קטגוריה, אזור, סטטוס
- **תצוגת מפה** (`SupplierMap`) — מיקומי ספקים
- **כרטיסי ספק** — עם pagination
- **הוספת ספק** — טופס (שם, קטגוריה, אזור, טלפון)
- **קישור לארכיון** — `/suppliers/archive`

### פרופיל ספק (`SupplierDetail`)
**מסלול:** `/suppliers/:id` | **Auth:** כן

- **טאבים:**
  - מידע כללי
  - מוצרים ושירותים
  - מסמכים
  - אנשי קשר
- **מידע כללי** — עריכת פרטי ספק, מפת מיקום (`SupplierLocationMap`)
- **אנשי קשר** — הוספה, עריכה, מחיקה
- **מוצרים** — CRUD עם `ProductEditor` (כולל העלאת תמונות)
- **מסמכים** — תאריך תפוגה, סטטוס (valid/warning/expired)
- **ארכיון** — פעולת העברה לארכיון

### ארכיון ספקים (`SupplierArchive`)
**מסלול:** `/suppliers/archive` | **Auth:** כן

- רשימת ספקים בארכיון

### מוצרים סרוקים (`ScannedProducts`)
**מסלול:** `/suppliers/scan` | **Auth:** כן

- מוצרים ממקורות "סרוקים"
- פעולות: אישור / הסרה
- כרגע משתמש בנתוני mock

---

## 8. עורך הצעות מחיר

**מסלול:** `/projects/:id` | **רכיב:** `QuoteEditor` | **Auth:** כן

### טאבים
1. **רכיבים וספקים** — פריטי הצעה
2. **תמחור ורווח יעד** — חישובי מחיר ורווח
3. **לו״ז הפעילות** — אירועי טיימליין

### פריטי הצעה (`QuoteItem`)
- **סוגים:** תחבורה, לינה, פעילות, ארוחה, בידור, אחר
- **שדות לכל פריט:**
  - שם
  - ספק (חיפוש עם `SupplierSearch`)
  - תיאור
  - מחיר עלות
  - מחיר ישיר
  - מחיר מכירה
  - רווח
- **תמחור** — צבע לפי שולי רווח (ירוק/צהוב/אדום)
- **תצוגת מקדימה** — ניווט ל־`ClientQuote`

### אירועי טיימליין
- הוספה, עריכה, מחיקה של אירועים
- תצוגה כרונולוגית

---

## 9. תצוגת הצעה ללקוח (ציבורי)

**מסלול:** `/quote/:id` | **רכיב:** `ClientQuote` | **Auth:** לא

### תכונות
- תצוגת הצעה מלאה ללקוח
- פרטי פרויקט, משתתפים, סה״כ מחיר
- פעילויות עם bullets מתרחבים
- טיימליין
- קטע טיפים
- כפתור **"אשר הצעה"**
- פעולות הדפסה ושיתוף

### הערה
- דף ציבורי — ללא התחברות
- ללא Layout (Sidebar/Header)

---

## 10. ייבוא ספקים

### אשף ייבוא (`ImportWizard`)
**מסלול:** `/suppliers/import` | **Auth:** כן

**4 שלבים:**
1. **העלאת קובץ** — CSV
2. **מיפוי שדות** — התאמת עמודות (מיפוי אוטומטי)
3. **תצוגה מקדימה** — בדיקת כפילויות
4. **סיום ייבוא** — ייבוא מרובה

- שימוש ב־Papa Parse לעיבוד CSV
- Confetti בסיום מוצלח

### אשף סיווג (`ClassificationWizard`)
**מסלול:** `/suppliers/classify` | **Auth:** כן

- תור ספקים שטרם סווגו
- הצעות קטגוריות לפי מילות מפתח
- בחירת קטגוריה ותת־קטגוריה
- התקדמות וקיצורי דרך

---

## 11. ממשקים נוספים

### דפי Placeholder
- **לקוחות** — `/clients` (`ClientsPage`)
- **מסמכים** — `/documents` (`DocumentsPage`)
- **הגדרות** — `/settings` (`SettingsPage`)
- **יומן** — `/calendar` (`CalendarPage`)

### מסמך PRD (`PRDDocument`)
**מסלול:** `/prd` | **Auth:** כן

- מסמך PRD להדפסה
- סקיצות מסכים
- סקשנים מתקפלים
- `KanbanBoard` משובץ
- מותאם RTL ולהדפסה

### 404
**מסלול:** `*` | **רכיב:** `NotFoundPage`

---

## 12. API ו־Backend

### Supabase
- **Auth:** `supabase.auth` (session, login, logout)
- **Config:** `utils/supabase/info.tsx`

### Edge Function API
**Base:** `https://{projectId}.supabase.co/functions/v1/make-server-0045c7fc`

### ספקים
| Endpoint | Methods | תיאור |
|----------|---------|-------|
| `/suppliers` | GET, POST | רשימה, יצירה |
| `/suppliers/:id` | GET, PUT, DELETE | CRUD ספק |
| `/suppliers/bulk-import` | POST | ייבוא מרובה |
| `/suppliers/bulk-rollback` | POST | ביטול ייבוא |
| `/suppliers/:id/archive` | PUT | העברה לארכיון |
| `/suppliers/:id/contacts` | GET, POST | אנשי קשר |
| `/suppliers/:id/contacts/:cid` | DELETE | מחיקת קשר |
| `/suppliers/:id/products` | GET, POST | מוצרים |
| `/suppliers/:id/products/:pid` | PUT, DELETE | עדכון/מחיקת מוצר |
| `/suppliers/:id/products/:pid/images` | POST, DELETE | תמונות מוצר |
| `/suppliers/:id/documents` | GET, POST | מסמכים |
| `/suppliers/:id/documents/:did` | PUT, DELETE | עדכון/מחיקת מסמך |

### פרויקטים
| Endpoint | Methods | תיאור |
|----------|---------|-------|
| `/projects` | GET, POST | רשימה, יצירה |
| `/projects/:id` | GET, PUT, DELETE | CRUD פרויקט |
| `/projects/:id/items` | GET, POST | פריטי הצעה |
| `/projects/:id/items/:iid` | PUT, DELETE | עדכון/מחיקת פריט |
| `/projects/:id/items/:iid/images` | POST, DELETE | תמונות פריט |
| `/projects/:id/timeline` | GET, POST | אירועי טיימליין |
| `/projects/:id/timeline/:eid` | DELETE | מחיקת אירוע |

### ציבורי
| Endpoint | Methods | תיאור |
|----------|---------|-------|
| `/public/quote/:id` | GET | הצעה ציבורית |
| `/public/quote/:id/approve` | POST | אישור הצעה |

### דשבורד ו־Kanban
| Endpoint | Methods | תיאור |
|----------|---------|-------|
| `/dashboard/stats` | GET | סטטיסטיקות דשבורד |
| `/kanban/tasks` | GET, POST, PUT, DELETE | משימות Kanban |
| `/kanban/seed` | POST | מילוי Kanban |
| `/seed` | POST | מילוי אפליקציה |

---

## 13. רכיבי UI משותפים

### טפסים
- **FormField** — Input + label, שגיאה, אייקון הצלחה
- **FormSelect, FormTextarea** — אותו דפוס ל־Select ו־Textarea
- **Validation rules:** `required`, `requiredMin`, `positiveInt`, `email`, `israeliPhone`, `positivePrice`

### חיפוש
- **GlobalSearch** — Ctrl/Cmd+K, חיפוש פרויקטים וספקים, ניווט בבחירה
- **SupplierSearch** — Autocomplete לבחירת ספק (בעורך הצעות)

### רכיבי Radix בשימוש
`accordion`, `alert`, `alert-dialog`, `avatar`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `checkbox`, `collapsible`, `command`, `dialog`, `dropdown-menu`, `form`, `input`, `label`, `popover`, `progress`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `switch`, `table`, `tabs`, `textarea`, `tooltip` ועוד.

### Breadcrumbs
- מבוסס מסלול
- אייקונים וצבעים
- ניווט אחורה

### Toast (`appToast`)
- `success`, `error`, `warning`, `info`, `neutral`
- מותאם RTL

---

## סיכום זרימות משתמש עיקריות

1. **יצירת פרויקט** — Layout → "פרויקט חדש" → מודל (שם, לקוח, משתתפים, אזור) → ניווט ל־`/projects/:id`
2. **עריכת הצעה** — ProjectsList → QuoteEditor → הוספת/עריכת פריטים → תמחור → טיימליין
3. **הוספת ספק** — SupplierBank → "הוספת ספק חדש" → טופס
4. **ייבוא ספקים** — בנק ספקים → ייבוא → ImportWizard (4 שלבים) → יצירה מרובה
5. **הצעת מחיר ללקוח** — שיתוף `/quote/:id` → ClientQuote → "אשר הצעה"
6. **חיפוש** — Ctrl/Cmd+K → GlobalSearch → ניווט לפרויקט או ספק

---

*תיעוד מעודכן לפי מבנה הפרויקט TravelPro (יום כיף).*

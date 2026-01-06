# 🖼️ Image URL Placeholder Locations

## 📍 Homepage Logo Location

**File:** [src/components/Layout.jsx](src/components/Layout.jsx#L35)
**Lines:** 35-37

```jsx
<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-500 shadow-lg shadow-brand-500/20 transition-transform group-hover:scale-105">
  <span className="text-lg font-bold text-white">A</span> ← CHANGE THIS
</div>
```

**To Change Logo:**

1. Replace the `<span>A</span>` with an `<img>` tag:

```jsx
<img
  src="YOUR_LOGO_URL_HERE"
  alt="Anweshon Logo"
  className="h-full w-full object-contain"
/>
```

**Example:**

```jsx
<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-lg shadow-brand-500/20 transition-transform group-hover:scale-105">
  <img
    src="https://example.com/logo.png"
    alt="Anweshon Logo"
    className="h-full w-full object-contain p-1"
  />
</div>
```

**Logo Requirements:**

- Size: 36x36px (displayed size)
- Format: PNG with transparent background recommended
- Square aspect ratio (1:1)

---

## Club Images in ClubPage

### 1. Club Banner Image

**File:** [src/pages/ClubPage.jsx](src/pages/ClubPage.jsx#L129)
**Lines:** 129-135

```jsx
{club.bannerUrl && (
  <div className="mb-8 rounded-xl overflow-hidden">
    <img
      src={club.bannerUrl}     ← PUT YOUR BANNER URL HERE
      alt={`${club.name} banner`}
      className="w-full h-64 object-cover"
    />
  </div>
)}
```

**Where to add URL:**

- When creating a new club: Set `bannerUrl` field
- When editing club: Update `bannerUrl` in edit form
- Properties stored in database: `Club.BannerUrl`

**Image Requirements:**

- Format: JPG, PNG, WebP
- Recommended size: 1200x400px or larger
- Will be displayed at full width with 256px height
- Aspect ratio: 3:1 recommended

---

### 2. Club Logo Image

**File:** [src/pages/ClubPage.jsx](src/pages/ClubPage.jsx#L150)
**Lines:** 150-156

```jsx
{club.logoUrl && (
  <div className="flex-shrink-0">
    <img
      src={club.logoUrl}       ← PUT YOUR LOGO URL HERE
      alt={`${club.name} logo`}
      className="w-24 h-24 object-cover rounded-xl border-2 border-slate-700"
    />
  </div>
)}
```

**Where to add URL:**

- When creating a new club: Set `logoUrl` field
- When editing club: Update `logoUrl` in edit form
- Properties stored in database: `Club.LogoUrl`

**Image Requirements:**

- Format: JPG, PNG, WebP
- Size: 96x96px (displayed size) or larger
- Will be displayed as square with rounded corners
- Aspect ratio: 1:1 (square)

---

## Homepage - Club Listings

**File:** [src/pages/HomePage.jsx](src/pages/HomePage.jsx#L338)

Clubs are displayed using properties fetched from the API:

- Uses `club.name` for title
- Uses `club.tagline` for subtitle
- Uses `club.description` for description
- Images: Set in club creation/edit forms via `bannerUrl` and `logoUrl`

---

## How to Add Images

### Step 1: Upload Image

1. Use a CDN service:
   - **Free:** Imgur, Imgbb, Tinypng
   - **Paid:** Cloudinary, AWS S3, Azure Blob Storage
2. Upload your image
3. Copy the direct URL (e.g., `https://example.com/image.jpg`)

### Step 2: Add to Club (Admin Only)

**Create Club:**

1. Go to create club page
2. Upload/Enter banner and logo URLs
3. Save club

**Edit Club:**

1. Go to club edit page (admin only)
2. Update banner and logo URLs
3. Save changes

### Step 3: URL Format

Use full HTTP/HTTPS URLs:

```
✅ https://example.com/banner.jpg
✅ http://imgur.com/abc123.png
❌ /images/banner.jpg (relative paths won't work)
❌ C:\images\banner.jpg (local paths won't work)
```

---

## Database Field Reference

### Club Model

```csharp
public class Club
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string? BannerUrl { get; set; }    ← Banner image URL
    public string? LogoUrl { get; set; }      ← Logo image URL
    public string? Tagline { get; set; }
    public string? Description { get; set; }
    public int? FoundedYear { get; set; }
    public string? PrimaryColor { get; set; }
    // ... other fields
}
```

---

## Example Image URLs (For Testing)

You can use these placeholder images for testing:

**Banner Images (1200x400):**

- `https://via.placeholder.com/1200x400/3b82f6/ffffff?text=Club+Banner`
- `https://picsum.photos/1200/400?random=1`

**Logo Images (96x96):**

- `https://via.placeholder.com/96x96/3b82f6/ffffff?text=Logo`
- `https://picsum.photos/96/96?random=1`

---

## Common Issues

### Image Not Showing?

1. ✅ Check URL is accessible (paste in browser)
2. ✅ Verify URL starts with `http://` or `https://`
3. ✅ Check image format is supported (JPG, PNG, WebP)
4. ✅ Reload page after updating

### URL Not Saving?

1. ✅ Check admin permissions
2. ✅ Verify URL is valid format
3. ✅ Check browser console for errors
4. ✅ Verify API endpoint working

### Image Too Large/Small?

1. **Too small:** Upload/use larger image (width ≥ 600px)
2. **Too large:** Image will be resized (uses CSS `object-cover`)
3. **Wrong aspect ratio:** Image will be cropped to fit

---

## API Endpoints for Images

When creating/updating a club via API:

```bash
POST /api/Clubs
{
  "name": "Club Name",
  "tagline": "Club tagline",
  "bannerUrl": "https://example.com/banner.jpg",  ← Add banner URL
  "logoUrl": "https://example.com/logo.jpg",      ← Add logo URL
  "description": "Club description",
  ...
}

PUT /api/Clubs/{id}
{
  "bannerUrl": "https://example.com/new-banner.jpg",  ← Update banner URL
  "logoUrl": "https://example.com/new-logo.jpg",      ← Update logo URL
  ...
}
```

---

## Frontend Form Fields

When editing a club in the UI, look for these input fields:

- **Banner Image URL** - Text input for banner image
- **Logo Image URL** - Text input for logo image

These correspond to:

- `club.bannerUrl` (database)
- `club.logoUrl` (database)

---

## Tips for Best Results

1. **Use Square Logos:** 1:1 aspect ratio works best for logos
2. **Use Wide Banners:** 3:1 aspect ratio (1200x400) recommended
3. **Optimize Images:** Compress images before uploading
4. **Use CDN:** Faster loading than local storage
5. **Test URLs:** Always test the URL in browser first
6. **Backup URLs:** Keep URLs in case of changes

---

**Last Updated:** Auto-generated during implementation
**Related Files:**

- [ClubPage.jsx](src/pages/ClubPage.jsx)
- [HomePage.jsx](src/pages/HomePage.jsx)
- [Club Model](backend/Anweshon.Api/Models/Club.cs)

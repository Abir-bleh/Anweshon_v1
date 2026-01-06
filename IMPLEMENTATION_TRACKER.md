# Anweshon Platform Enhancement - Implementation Tracker

## 📋 Requirements Summary

### RUET Branding & Theme

- ✅ Light theme (blue & white shades)
- ✅ RUET logo in navbar & footer
- ✅ Homepage: Hero banner + 4 category cards (Academic, Cultural, Sports, Technical)
- ✅ Club colors have more visual impact

### New Features

1. **Club Photo Gallery** - Integrated posts with multiple images
2. **Enhanced Achievements** - Member submissions with approval workflow
3. **Past Events Showcase** - Reuse events table with banner images
4. **Event Banners** - Upload image when creating events
5. **Event Deletion** - Soft delete (Status = "Deleted")

---

## 🗄️ Database Changes

### ✅ New Models Created

#### ClubPost

```csharp
- Id
- ClubId
- Title (optional)
- Description
- PostType (Photo, Announcement, Achievement)
- CreatedByUserId
- CreatedAt
- Images (collection)
```

#### ClubPostImage

```csharp
- Id
- ClubPostId
- ImageUrl
- Caption
- DisplayOrder
```

### ✅ Enhanced Models

#### Achievement

**New fields:**

- `AchievementType` (Club/Member/Competition)
- `MemberName` (nullable)
- `ImageUrl` (nullable)
- `SubmittedByUserId` (nullable)
- `Status` (Pending/Approved/Rejected)
- `CreatedAt`

#### Event

**New fields:**

- `BannerUrl` (nullable)
- `IsArchived` (bool, default false)
- `ShowInPastEvents` (bool, default true)

#### ClubExecutive

**Modified:**

- `UserId` → nullable (allows non-user executives)
- `User` → nullable

---

## 🔧 Backend Implementation Checklist

### Controllers to Create/Update

#### ✅ ClubPostsController (NEW)

- [ ] POST `/api/ClubPosts` - Create post with images
- [ ] GET `/api/ClubPosts/club/{clubId}` - Get club posts
- [ ] PUT `/api/ClubPosts/{id}` - Update post
- [ ] DELETE `/api/ClubPosts/{id}` - Delete post

#### AchievementsController (UPDATE)

- [ ] POST `/api/Achievements` - Submit achievement (any member)
- [ ] GET `/api/Achievements/club/{clubId}` - Get club achievements (approved only)
- [ ] GET `/api/Achievements/pending/{clubId}` - Get pending (ClubAdmin only)
- [ ] PUT `/api/Achievements/{id}/approve` - Approve achievement
- [ ] PUT `/api/Achievements/{id}/reject` - Reject achievement

#### EventsController (UPDATE)

- [ ] Add `bannerUrl` to CreateEventDto
- [ ] DELETE `/api/Events/{id}` - Soft delete (set IsArchived=true, Status="Deleted")
- [ ] GET `/api/Events/club/{clubId}/past` - Get past events for showcase

---

## 🎨 Frontend Implementation Checklist

### Theme Changes

#### Global CSS (index.css)

- [ ] Change background: `slate-950` → `slate-50`
- [ ] Change card backgrounds: `slate-900` → `white`
- [ ] Change text: `slate-100` → `slate-900`
- [ ] Update borders: `slate-800` → `gray-200`
- [ ] Update input styles for light theme
- [ ] Keep brand emerald for primary actions
- [ ] Add RUET blue shades as secondary colors

#### Tailwind Config

- [ ] Add RUET color palette (blue shades)
- [ ] Update default theme colors

### RUET Branding

#### Layout Component

- [ ] Replace "A" logo with RUET logo placeholder
- [ ] Add RUET blue gradient to navbar
- [ ] Create Footer component with RUET logo + info
- [ ] Update navigation colors

#### HomePage (COMPLETE REDESIGN)

- [ ] Hero section with RUET campus background image placeholder
- [ ] Tagline: "RUET Student Life Hub"
- [ ] 4 Category Cards:
  - Academic Clubs (image placeholder)
  - Cultural Clubs (image placeholder)
  - Sports Clubs (image placeholder)
  - Technical Clubs (image placeholder)
- [ ] Each card links to /explore/clubs with category filter
- [ ] Featured upcoming events section
- [ ] Quick stats (Total Clubs, Active Members, Upcoming Events)

### Club Page Enhancements

#### Club Colors Integration

- [ ] Use club.primaryColor for:
  - Section headers
  - Button backgrounds
  - Border accents
  - Icon colors
- [ ] Use club.secondaryColor for:
  - Backgrounds (10% opacity)
  - Hover states
  - Secondary buttons

#### Photo Gallery Tab

- [ ] Add "Gallery" tab to club page
- [ ] Grid/Masonry layout for posts
- [ ] Lightbox for image viewing
- [ ] "Add Post" button (ClubAdmin only)
- [ ] Modal for creating posts with multiple image uploads

#### Achievements Tab

- [ ] Timeline/card layout
- [ ] Display: Title, Description, Date, Type, Image
- [ ] If member achievement, show member name
- [ ] "Submit Achievement" button (any member)
- [ ] Pending achievements indicator (ClubAdmin)
- [ ] Approve/Reject buttons (ClubAdmin)

#### Past Events Section

- [ ] Filter events where:
  - `StartDateTime < now`
  - `Status = "Published"`
  - `ShowInPastEvents = true`
  - `IsArchived = false`
- [ ] Grid layout with event banners
- [ ] Show: Title, Date, Location, Banner
- [ ] Click to see full event details

### Event Management

#### CreateEventPage

- [ ] Add banner upload field
- [ ] Preview uploaded banner
- [ ] Same file upload handling as club logo/banner

#### EditEventPage

- [ ] Add banner upload field
- [ ] Show current banner with option to change
- [ ] Add "Delete Event" button (confirmation modal)
- [ ] Soft delete: Set `Status = "Deleted"`, `IsArchived = true`

#### EventDetailsPage

- [ ] Display banner at top (full width)
- [ ] Registration button styled with club colors

---

## 📸 Image Placeholders Needed

You will need to provide URLs for:

### RUET Branding

1. `RUET_LOGO` - Main logo (for navbar, ~40x40px)
2. `RUET_LOGO_LARGE` - Large logo (for footer, ~120x120px)
3. `RUET_CAMPUS_HERO` - Hero background image
4. `RUET_INFO` - University info (address, phone, email)

### Homepage Categories

5. `ACADEMIC_CLUBS_IMAGE` - Science/engineering theme
6. `CULTURAL_CLUBS_IMAGE` - Arts/music theme
7. `SPORTS_CLUBS_IMAGE` - Athletics theme
8. `TECHNICAL_CLUBS_IMAGE` - Tech/coding theme

### Configuration File Location

Create: `frontend/src/config/ruetConfig.js`

---

## 🎯 Implementation Order

### Phase 1: Database & Migrations (CURRENT)

1. ✅ Create ClubPost, ClubPostImage models
2. ✅ Update Achievement model
3. ✅ Update Event model
4. ✅ Fix ClubExecutive UserId (nullable)
5. ⏳ Stop backend server
6. ⏳ Create migration: `dotnet ef migrations add EnhancedFeatures`
7. ⏳ Apply migration: `dotnet ef database update`

### Phase 2: Backend APIs

8. Create ClubPostsController
9. Create/update DTOs for new features
10. Update EventsController (banner, soft delete, past events)
11. Update AchievementsController (submit, approve, list)

### Phase 3: Light Theme

12. Update index.css
13. Update tailwind.config.js
14. Update all component styles
15. Test all pages for light theme consistency

### Phase 4: RUET Branding

16. Create ruetConfig.js
17. Update Layout (navbar + footer)
18. Redesign HomePage
19. Add RUET blue color palette

### Phase 5: New Features

20. ClubPage - Gallery tab
21. ClubPage - Enhanced achievements
22. ClubPage - Past events section
23. Event banner upload
24. Event delete functionality
25. Achievement submission & approval

### Phase 6: Testing & Polish

26. Test all CRUD operations
27. Test responsive design
28. Test club color theming
29. Add loading states
30. Add error handling

---

## 🚨 Next Steps

**YOU NEED TO:**

1. Stop the running backend server
2. Tell me when it's stopped so I can apply migrations
3. Provide RUET image URLs for placeholders
4. Provide RUET official colors (if different from standard blue shades)

**I WILL:**

1. Apply database migrations
2. Create all backend APIs
3. Transform frontend to light theme with RUET branding
4. Implement all new features
5. Ensure club colors are prominently used

---

## 📊 Progress Tracker

- Database Models: ✅ 100%
- Migrations: ⏳ 0% (waiting for server stop)
- Backend APIs: ⏳ 0%
- Light Theme: ⏳ 0%
- RUET Branding: ⏳ 0%
- New Features: ⏳ 0%

**Overall Progress: 10%**

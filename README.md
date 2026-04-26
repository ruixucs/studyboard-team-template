# StudyBoard — Team Template

A fill-in-the-blank version of the **StudyBoard** course-collaboration platform, split into a working framework + three independent feature modules. Each teammate owns one module.

> **What's already built:** routing, layout, login/register, JWT auth, theme toggle, MongoDB connection, navbar, landing page, all data models, error handling, request validation.
>
> **What you build:** the three numbered features below.

---

## Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + React Router
- **Backend:** Node.js 22 + Express 4 + Mongoose 8
- **Database:** MongoDB Atlas (free tier) — see *Setup* below
- **Auth:** JWT + bcryptjs

---

## Team

| Person      | Module | Files (server)                                          | Files (client)                                                                                                                                |
| ----------- | ------ | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Danny**   | A — Courses & Enrollment | `routes/courses.js` | `pages/CourseList.jsx`, `components/CourseCard.jsx` |
| **Ray**     | B — Posts & Replies      | `routes/posts.js`, `routes/replies.js` | `pages/CourseBoard.jsx`, `pages/PostDetail.jsx`, `components/PostCard.jsx`, `components/PostEditor.jsx`, `components/ReplyList.jsx`, `components/MarkdownView.jsx` |
| **Donovan** | C — Likes & Profile      | `routes/likes.js`, `routes/me.js` | `components/LikeButton.jsx`, `pages/Dashboard.jsx`, `pages/Profile.jsx` |

Every file you own already exists in the repo, with:
- All imports kept intact.
- Every function signature kept intact.
- Detailed docstrings + step-by-step pseudocode in comments.
- `// TODO(YourName)` markers showing exactly what to fill in.

**Do not touch files outside your list.** If you think you need to, message the team first.

---

## Setup (every teammate, once)

```bash
# 1. Clone
git clone <this-repo-url>
cd studyboard-team-template

# 2. Install all deps (npm workspaces install client + server in one go)
npm install

# 3. MongoDB Atlas
#    a. Create a free M0 cluster at https://cloud.mongodb.com
#    b. Database Access -> add user + password
#    c. Network Access -> "Allow Access From Anywhere" (0.0.0.0/0)
#    d. Cluster -> Connect -> Drivers -> Node.js -> copy the SRV connection string

# 4. Configure environment
cp server/.env.example server/.env
# Open server/.env and replace MONGO_URI with your real connection string
# (paste in the password and add the database name, e.g. /studyboard)
#
# Generate a JWT_SECRET:
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"

# 5. Seed the courses list (idempotent — re-run any time)
npm run seed

# 6. Seed dev test data: a test user + posts + replies + likes (recommended for everyone)
npm run seed:dev
#   prints:  email: devuser@mail.mcgill.ca   password: devpass123
#   you can log in as this user immediately.

# 7. Start dev (server on :5050, client on :5173, both with HMR)
npm run dev
```

Open <http://localhost:5173>.

---

## Day 1 quickstart — what every teammate can do *immediately*, with zero dependencies

After running `npm run seed:dev`, your DB has:
- A test user (`devuser@mail.mcgill.ca` / `devpass123`)
- That user enrolled in `COMP 307` and `COMP 251`
- 3 sample posts in COMP 307, each with 1 reply and 1 like

So you can log in and see real data flowing through your routes / components from minute one.

### Danny — Day 1 plan
1. Open `server/src/routes/courses.js`. Implement the 4 endpoints by following the pseudocode.
2. Test each endpoint via `server/requests.http` (REST Client extension, click "Send Request").
3. Open `client/src/components/CourseCard.jsx`, then `client/src/pages/CourseList.jsx`. Build them out.
4. Visit `/courses` in the browser — your card grid + search + add-course form should work.
5. **You don't depend on Ray or Donovan for any of this.**

### Ray — Day 1 plan
1. Open `server/src/routes/posts.js` (start with the `hydrate()` helper, then the `GET` list).
2. Hit `GET /api/courses/:courseId/posts` in `requests.http` — should return the 3 seeded posts.
3. Then `routes/replies.js`, then the React components in this order:
   `MarkdownView` → `PostCard` → `PostEditor` → `ReplyList` → `CourseBoard` → `PostDetail`.
4. **You don't depend on Donovan**: `PostDetail` imports `<LikeButton />` which has a stub already (renders an empty button) — your page renders fine while you wait.
5. **You don't depend on Danny**: you only need the course `_id` from the URL; the seeded courses give you that.

### Donovan — Day 1 plan
1. Open `server/src/routes/likes.js` and `server/src/routes/me.js`. Implement both — they're small.
2. Test both via `server/requests.http`. The seeded data already has likes and posts to query against.
3. Open `client/src/components/LikeButton.jsx` and build it. Test it in isolation by visiting any post's URL once you have a post id (any of the seeded posts works).
4. Then `client/src/pages/Dashboard.jsx` and `client/src/pages/Profile.jsx`. Your seeded user has 2 enrollments and 3 posts, so both pages will display real data.
5. **You don't depend on Ray**: your `LikeButton` is a self-contained component; you can render it anywhere. To test it inside Ray's `PostDetail`, his page already has a stub that imports `LikeButton`, so it shows up the moment Ray writes the surrounding markup.
6. **You don't depend on Danny**: `Dashboard` imports `<CourseCard />` which has a stub (renders an empty card div). Your grid + greeting + empty-state logic still work; cards just show placeholders until Danny finishes.

---

## Workflow

> **All three of you start coding on Day 1, in parallel.** No one waits for anyone else.
> Every file you own already has its imports, function signatures, and pseudocode in place.

```bash
# Each teammate works on their own branch
git checkout -b feature/courses    # Danny
git checkout -b feature/posts      # Ray
git checkout -b feature/social     # Donovan

# Commit early, commit often
git add <only your files>
git commit -m "feat(courses): list endpoint"

# When ready, push and open a Pull Request to main
git push -u origin feature/courses
```

### How can you work in parallel without waiting?

1. **All schemas are already defined** in `server/src/models/*.js`. The data shapes are locked, so you can write your routes against them today.
2. **All routes are already mounted** in `server/src/index.js`. Your endpoints are already in the URL space — you just have to fill in the bodies.
3. **All API contracts are documented** in this README and in `server/requests.http`. You don't need to ask "what does endpoint X return?" — it's already specified.
4. **Component stubs render**. The files you don't own contain stub components that render an empty card / empty page — your code that imports them won't crash.
5. **Use `npm run seed:dev`** to populate the DB with a test user + sample posts/replies/likes (see *Day 1 quickstart* below). Means you can manually test your feature without waiting for teammates.

### Suggested **merge** order (only matters for the final integration, NOT for when you start)

When all three PRs are ready and tests pass, merge them in this order to keep `main` clean:

1. **Danny's PR** — no one depends on its implementation, easiest baseline.
2. **Ray's PR** — needs Course IDs from URL params, but that's it.
3. **Donovan's PR** — reads Post and Enrollment data, so easiest to test against the others' merged code.

Each PR should be reviewed by at least one other teammate.

---

## Inter-feature contracts

These are the things you **must** agree on so the three modules compose. They are already locked in by the existing `models/` files — do not change them.

### Schemas (already defined in `server/src/models/*.js`)

| Model        | Owned by | Fields                                                                      |
| ------------ | -------- | --------------------------------------------------------------------------- |
| `User`       | Base     | `email, displayName, passwordHash`                                         |
| `Course`     | A        | `code (unique, upper), name, faculty, createdBy?`                          |
| `Enrollment` | A        | `userId, courseId` (unique compound index)                                 |
| `Post`       | B        | `courseId, authorId, title, body, likeCount, replyCount`                   |
| `Reply`      | B        | `postId, authorId, body`                                                   |
| `Like`       | C        | `userId, postId` (unique compound index)                                   |

### API endpoints (already mounted in `server/src/index.js`)

| Method   | Path                                  | Owned by | Auth     |
| -------- | ------------------------------------- | -------- | -------- |
| `GET`    | `/api/courses?search=`                | A        | optional |
| `POST`   | `/api/courses`                        | A        | required |
| `POST`   | `/api/courses/:id/enroll`             | A        | required |
| `DELETE` | `/api/courses/:id/enroll`             | A        | required |
| `GET`    | `/api/courses/:courseId/posts`        | B        | required |
| `GET`    | `/api/posts/:id`                      | B        | required |
| `POST`   | `/api/courses/:courseId/posts`        | B        | required |
| `PATCH`  | `/api/posts/:id`                      | B        | required |
| `DELETE` | `/api/posts/:id`                      | B        | required |
| `POST`   | `/api/posts/:postId/replies`          | B        | required |
| `DELETE` | `/api/replies/:id`                    | B        | required |
| `POST`   | `/api/posts/:id/like`                 | C        | required |
| `DELETE` | `/api/posts/:id/like`                 | C        | required |
| `GET`    | `/api/me/courses`                     | C        | required |
| `GET`    | `/api/me/activity`                    | C        | required |

### Cross-feature touchpoints

- **B → C**: `PostDetail.jsx` renders `<LikeButton />`. Ray imports the component, Donovan implements it. Ray must pass `postId`, `initialLiked`, `initialCount`.
- **B ↔ C**: `Post.likeCount` is incremented/decremented by **C's `routes/likes.js`** and read by **B's `routes/posts.js`** for `?sort=hot`. Both sides use `$inc` — never recompute.
- **B ↔ B**: `Post.replyCount` is incremented/decremented by **B's `routes/replies.js`**.
- **C reads A & B**: `routes/me.js` queries `Enrollment` (A) and `Post` (B). Make sure those endpoints exist before testing yours.

---

## Project layout

```
studyboard-team-template/
├── client/                                # React + Vite frontend
│   └── src/
│       ├── pages/
│       │   ├── Landing.jsx                # base
│       │   ├── Register.jsx               # base
│       │   ├── Login.jsx                  # base
│       │   ├── Dashboard.jsx              # ← Donovan
│       │   ├── CourseList.jsx             # ← Danny
│       │   ├── CourseBoard.jsx            # ← Ray
│       │   ├── PostDetail.jsx             # ← Ray
│       │   └── Profile.jsx                # ← Donovan
│       ├── components/
│       │   ├── Navbar.jsx                 # base
│       │   ├── ThemeToggle.jsx            # base
│       │   ├── RequireAuth.jsx            # base
│       │   ├── CourseCard.jsx             # ← Danny
│       │   ├── PostCard.jsx               # ← Ray
│       │   ├── PostEditor.jsx             # ← Ray
│       │   ├── ReplyList.jsx              # ← Ray
│       │   ├── MarkdownView.jsx           # ← Ray
│       │   └── LikeButton.jsx             # ← Donovan
│       └── lib/
│           ├── api.js                     # base — axios instance + interceptors
│           └── AuthContext.jsx            # base — global login state
├── server/                                # Express + Mongoose backend
│   ├── src/
│   │   ├── index.js                       # base — app entry
│   │   ├── lib/                           # base — db, jwt, validate
│   │   ├── middleware/                    # base — requireAuth, errorHandler
│   │   ├── models/                        # base — all Schemas locked
│   │   └── routes/
│   │       ├── auth.js                    # base — register/login/me
│   │       ├── courses.js                 # ← Danny
│   │       ├── posts.js                   # ← Ray
│   │       ├── replies.js                 # ← Ray
│   │       ├── likes.js                   # ← Donovan
│   │       └── me.js                      # ← Donovan
│   ├── scripts/
│   │   └── seed.js                        # base — seeds courses
│   ├── tests/                             # base — vitest unit tests
│   └── requests.http                      # REST Client recipes (every endpoint)
└── package.json                           # npm workspaces root
```

---

## How to test your own work

### Server side
The repo ships with `server/requests.http`. With the [REST Client VS Code extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) installed, click "Send Request" on any endpoint to call your backend.

### Frontend side
Run `npm run dev` and click through the UI. The end-to-end flow:

1. Register at <http://localhost:5173/register> with an `@mcgill.ca` or `@mail.mcgill.ca` email.
2. Log in.
3. Browse `/courses` (Danny) → enroll in one (Danny).
4. Open the course → see board (Ray) → write a post (Ray) → reply (Ray).
5. Like the post (Donovan) → check `/me` → see stats (Donovan) → check `/dashboard` (Donovan).

If any step is broken, open browser DevTools → Network tab to see the failing request.

---

## Tips

- **Read the docstring in your file before coding.** Each TODO has step-by-step pseudocode.
- **`server/requests.http`** has working examples of every API call — copy them when you need to test.
- **Use `console.log` liberally** during dev. Remove before committing.
- **Stuck?** Drop a message in the team chat with the file + TODO line you're on.
- **Don't change shared files** (anything in `models/`, `lib/`, `middleware/`, `App.jsx`, `index.js`). If you think you need to, ask the team first.

Good luck!

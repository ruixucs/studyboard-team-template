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

# 6. Start dev (server on :5050, client on :5173, both with HMR)
npm run dev
```

Open <http://localhost:5173>.

---

## Workflow

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

Merge order is recommended:
1. **Danny's PR** first — no one depends on his implementation details.
2. **Ray's PR** next — needs Course IDs from URL params, but that's it.
3. **Donovan's PR** last — uses Post IDs from B and Enrollments from A.

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

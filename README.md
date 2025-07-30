🚀 React Advanced Data Grid
A fully featured React Data Grid built with TypeScript, Next.js, and Express. This grid includes powerful capabilities like:

🔎 Global and column-based filtering

↕️ Sorting (single-column)

📄 Pagination

🧠 Server-side caching

🖱️ Column resizing, dragging, and pinning

✅ Row selection with bulk delete

📝 Inline editing (with backend sync)

📤 CSV export

🌗 Dark mode support

📁 Project Structure
vbnet
Copy
Edit
.
├── client/ # Next.js frontend (React Grid UI)

⚙️ Tech Stack
Frontend: Next.js 14 (App Router), React, Tailwind CSS, TypeScript

Backend: Node.js + Express

Utilities: lodash, date-fns

Data Persistence: JSON file-based mock DB

🧰 Setup Instructions
1️⃣ Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/react-data-grid.git
cd react-data-grid
2️⃣ Install Dependencies
bash
Copy
Edit

# Frontend

cd ../client
npm install
3️⃣ Start the Backend Server
bash
Copy
Edit
cd server
node index.js
The backend will run at: http://localhost:3002/api/users

4️⃣ Start the Frontend
bash
Copy
Edit
cd ../client
npm run dev
The frontend will run at: http://localhost:3000

✅ Available Features
🔍 Filtering
Global Search: Search across all fields.

Column Filters: Input fields and dynamic filter modal (supports text, number, and date).

Filters are debounced for performance.

↕️ Sorting
Click column headers to toggle asc/desc.

Sorting handled server-side for accuracy.

📄 Pagination
Pagination with customizable page size.

Backend delivers paginated results based on query.

🧠 Caching (Client-side)
Fetched data is cached by page, search, sort, and pageSize.

Avoids redundant API calls using a memoized cache key.

🖱️ Drag, Resize, and Pin Columns
Columns can be:

Dragged and reordered

Resized

Pinned left/right

✅ Row Selection & Bulk Delete
Checkbox per row with "Select All" option.

Delete selected rows (calls API and updates UI).

📝 Inline Editing
Double-click a cell to edit.

onBlur, Enter, or Escape handles commit or cancel.

Sends updated value to backend via PATCH.

📤 CSV Export
Export current filtered data to CSV.

📡 API Details
GET /api/users
Supports query params:

bash
Copy
Edit
/api/users?page=1&pageSize=10&search=don&sort=name*asc&filter_role=Manager
Param Description
page Page number
pageSize Number of rows per page
search Global search
sort Format: column_direction
filter*\* Column-specific filters (filter_name, filter_email, etc.)

PATCH /api/users/:id
Update a single user:

json
Copy
Edit
PATCH /api/users/7
{
"key": "name",
"value": "New Name"
}
DELETE /api/users
Delete multiple users:

json
Copy
Edit
DELETE /api/users
{
"ids": [1, 5, 7]
}
🧪 Dev Notes
The grid system is fully decoupled from the data source.

You can swap the Express backend with your own API.

All types and interfaces are strictly defined for type safety.

💡 Future Enhancements
✅ Multi-column sort

🔃 Undo/redo support

🧾 Editable column configurations

⏳ Virtualized rendering for large datasets

🛠️ Role-based column visibility

🧑‍💻 Author
Built with ❤️ by Aayush Goel

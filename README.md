# TourISt – Tourist Objects Management Web Application

**Status:** Work in Progress  

TourISt is a web application designed for centralized management and public promotion of tourist objects within a local community. The project provides a tool for municipal authorities to categorize accommodation facilities, as well as a platform to promote local tourism to visitors. 

---

## Key Features

- **Multi-user roles:**
  - **Administrator:** Full access to all system functionalities, including user and object management.
  - **Official/Officer:** Can add, edit, and view data for objects within their assigned municipality.
  - **Visitor:** Public access to browse and explore tourist objects.

- **Centralized Object Management:**
  Track and manage data for accommodation services, such as hotels, hostels, apartments, guesthouses, and vacation homes. Key information includes:
  - Object name and type
  - Status (active/inactive)
  - Municipality and address
  - Geographical coordinates
  - Contact and owner details
  - Categorization information (category, issue date, expiration date)
  - Capacity (number of units, beds)
  - Additional services and amenities

- **Dynamic Reports:**
  Generate reports on categorized objects and tourism capacities by municipality, object type, status, and category. Reports can be filtered, sorted, printed, or exported in CSV, XLSX, or PDF formats.

- **Media and Promotional Content:**
  Each object can have photos (gallery), textual descriptions, and links to websites or social media profiles.

- **Public Access & Interactive Map:**
  Visitors can view all registered and active objects. Features include:
  - Featured or newly added objects on the homepage
  - Interactive map with object markers
  - Info windows showing object name, type, municipality, and a link to the detailed page
  - Detailed object pages with descriptions, photos, and public information
  - Search and filter functionality by name, municipality, object type, and category

---

## Tech Stack

- **Frontend:** React, TypeScript, TailwindCSS
- **Backend:** .NET 9 (ASP.NET Core Web API)
- **Database:** SQL Server Express 
- **Other:** Redux, RESTful API, responsive design


> **Note:** Currently, the backend uses **SQL Server Express** for local development. Multi-user functionality and full user registration are still in progress.

---

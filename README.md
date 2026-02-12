# TourISt – Tourist Objects Management Web Application

**Status:** Work in Progress  

TourISt is a web application designed for centralized management and public promotion of tourist objects within a local community. The platform serves both municipal authorities for object management and visitors for exploring local tourism options.

---

## Key Features

### 1. Authentication
- **Login and Register** functionalities using **JWT** authentication.
- User roles: **Administrator**, **Official/Officer**, **Visitor**.
  <img width="1920" height="923" alt="login" src="https://github.com/user-attachments/assets/6bd8bb3a-97b5-45a4-a6c3-1ef9718bf9b3" />
  <img width="1920" height="922" alt="signup" src="https://github.com/user-attachments/assets/a77bf52d-cc07-4391-8325-0aa227988129" />

---

### 2. Homepage
- Displays featured or newly added tourist objects.
- Quick access to popular objects and categories.
<img width="1903" height="874" alt="pocetna" src="https://github.com/user-attachments/assets/91a154b1-7275-4553-a205-10d9822115b1" />
<img width="1903" height="874" alt="izdvojeni" src="https://github.com/user-attachments/assets/9c30d824-c681-4e28-9127-5b72710d238a" />

---

### 3. Object List Page
- Displays all objects with **search**, **filters**, and **pagination**.
- Filters include: Object Type, Municipality, Category, Additional Services.
<img width="1903" height="914" alt="listaobjekata" src="https://github.com/user-attachments/assets/1f542549-26c9-4122-8771-843e784f4123" />
<img width="1903" height="914" alt="objekti2" src="https://github.com/user-attachments/assets/03ce2acc-3f71-4099-8846-9a28bfabb12e" />

---

### 4. Object Details Page
- Shows all relevant information about a selected object:
  - Name, Type, Status, Address, Municipality
  - Number of units and beds
  - Additional services and amenities
  - Photo gallery and textual descriptions
  - Reviews left by logged-in users
<img width="1903" height="915" alt="objekatdetalji" src="https://github.com/user-attachments/assets/00e76b8e-889d-4517-9159-106846f15f2b" />
<img width="1903" height="917" alt="objekatdetalji2" src="https://github.com/user-attachments/assets/7cb2c90f-f247-4523-aea0-b932fbda6e61" />
<img width="1903" height="917" alt="recenzije" src="https://github.com/user-attachments/assets/5305f3e2-f060-47c5-a6aa-71ac9f2f9099" />

---

### 5. Add/Edit Object Form
- Allows adding or editing objects with **Zod validation** for form inputs.
- Fields include all object attributes, additional services selection, and photo uploads.
<img width="1901" height="918" alt="dodaj" src="https://github.com/user-attachments/assets/b818d279-8ee5-4afa-ab93-141ba41483fd" />
<img width="1901" height="918" alt="dodaj2" src="https://github.com/user-attachments/assets/92a44f17-c55e-41a3-b255-77d7fc760aae" />

---

### 6. Interactive Map Page
- Shows all objects on a map with markers.
- Supports **filtering** and **searching** directly on the map.
- Clicking a marker shows object info and links to details page.
<img width="1895" height="914" alt="mapa" src="https://github.com/user-attachments/assets/e073b961-05d9-41b3-8258-8f185e125e1a" />

---

## Upcoming / Planned Features

### Role-Based Features

**Administrator**
- Full access to all system functionalities.
- Manage users and assign roles.
- Generate **reports** for tourism capacities, objects per municipality, type, status, category.
- Categorization functionality for officers and objects.

**Official/Officer**
- Can add, edit, and view objects within their assigned municipality.
- Manage categorization status of objects.
- Generate filtered **reports** for their municipality.

**Visitor**
- Browse and search objects.
- Leave reviews for objects (must be logged in).

### Future Enhancements 
- Full multi-user registration and role assignment.
- Export reports in CSV, XLSX, PDF formats.
- Notifications for new objects or status changes.
- Analytics dashboards for administrators.

---

## Tech Stack

- **Frontend:** React, TypeScript, TailwindCSS  
- **Backend:** .NET 9 (ASP.NET Core Web API)  
- **Database:** SQL Server Express  
- **State Management:** Redux, RTK Query  
- **Authentication:** JWT  
- **Form Validation:** Zod  
- **Other Features:** RESTful API, MVC, responsive design  





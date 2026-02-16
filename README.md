# NexusKart | Premium Full-Stack E-commerce Ecosystem

NexusKart is a sophisticated, end-to-end e-commerce platform engineered for scalability and a premium user experience. Built with a **Spring Boot** backend and a **React.js** frontend, the system prioritizes clean code, secure data handling, and a high-end minimalist design.

---

## 🚀 Key Features

*   **Premium Monochrome UI:** A bespoke "Elite" aesthetic focused on high brand clarity and modern UX standards.
*   **Administrative Management Suite:** A dedicated dashboard for merchants to manage inventory, track orders, and analyze sales performance.
*   **Stateless Security:** Robust JWT-based authentication system with role-based access control (RBAC).
*   **Dynamic Product Discovery:** Real-time search, category filtering, and high-performance product data management.
*   **Seamless Shopping Flow:** Optimized Cart, Checkout, and Payment simulation journeys.

---

## 🛠️ Technology Stack

### **Frontend**
*   **React (Vite):** Core library for building a responsive, reactive UI.
*   **Context API:** Centralized state management for user authentication and cart persistence.
*   **Bootstrap 5:** Utility-first styling refined for a professional look.
*   **Axios:** Asynchronous API communication with a global interceptor.

### **Backend**
*   **Spring Boot:** High-performance RESTful API framework.
*   **Spring Security (JWT):** Secure, token-based authentication.
*   **Spring Data JPA:** Efficient database abstraction and management.
*   **MySQL:** Reliable relational data storage.

---

## � Project Structure

```text
NexusKart/
├── Ecommerce-Frontend/   # React.js SPA (Vite)
└── Ecommerce-Backend/    # Spring Boot REST API
```

---

## ⚙️ Setup & Installation

### **Prerequisites**
*   **JDK 17+**
*   **Node.js 18+**
*   **MySQL Server**

### **1. Backend Setup**
1. Navigate to `Ecommerce-Backend/`.
2. Configure your MySQL credentials in `src/main/resources/application.properties`.
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

### **2. Frontend Setup**
1. Navigate to `Ecommerce-Frontend/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

---

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.

---

**Developed with precision for modern e-commerce standards.**

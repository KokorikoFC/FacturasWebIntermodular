# Facturador Web

Facturador Web is the complementary web platform to the Facturador mobile application, designed to offer comprehensive invoice and project management for freelancers. It allows users to view, organize, and manage invoices created in the mobile application, in addition to offering project management functionalities, an interactive dashboard, and a section for itineraries with a graph to compare them with your own. It also uses a login system where you log in with the same user as in the mobile app to view the invoices registered for that user.

## About

Facturador Web is a web application developed with Angular (version 19.0.7) to extend the functionalities of the Facturador mobile application. Its main objective is to provide a more complete interface for invoice management, project organization, and the visualization of professional progress. It allows users to interact with data synchronized from the mobile application through Firebase, offering a more robust invoice and project management experience.

## Key Features

* **User Authentication:** Secure access to the platform through login and registration using Firebase Authentication.
* **Project and Invoice Management:** Assign invoices created in the mobile application to specific projects through an intuitive drag and drop interface.
* **Invoice Visualization:** Renders individual invoices and project boards with assigned invoices.
* **Project Creation:** Allows users to create new projects, assigning them a name and selecting the technologies used.
* **Interactive Dashboard:** Offers an overview of the user's invoices with interactive graphs and detailed data queries.
* **Professional Itineraries:** Provides a visual representation of the technologies required by professional itineraries and the user's skills.
* **Real-time Synchronization:** Keeps data synchronized with the mobile application and the interactive dashboard through Firebase.

## Technologies

Facturador Web is built using the following technologies:

- **Frontend:** `Angular`
- **Styling:** `Bootstrap`
- **DOM Manipulation:** `jQuery`
- **Graphics:** `D3.js`
- **Backend & Database:** `Firebase` (Authentication and Firestore)
- **Drag & Drop:** `Angular CDK`
- **Alerts:** `SweetAlert2`

## Main Components

1.  **`LoginComponent`:** Allows users to log in with their email and password using Firebase Authentication.
2.  **`RegisterComponent`:** Allows new users to create an account with their email and password.
3.  **`ProjectManagementComponent`:** Main component for project and invoice management.
    * Displays unassigned invoices.
    * Integrates drag and drop functionality to assign invoices to projects.
    * Coordinates the `BillCardComponent`, `ProjectBoardComponent`, and `AddProjectFormComponent` components.
4.  **`BillCardComponent`:** Visually renders an individual invoice and allows it to be deleted or dragged.
5.  **`ProjectBoardComponent`:** Represents a project, displaying its name, technologies, and assigned invoices. Allows invoices to be dragged to the project and the project to be deleted.
6.  **`AddProjectFormComponent`:** Pop-up form to create new projects, allowing users to assign a name and select technologies.
7.  **`DashboardComponent`:** Provides an overview of invoices with interactive graphs (bar and segmented) and query options by period and year.
8.  **`ProfessionalItinerariesComponent`:** Visually displays the technologies required by a professional itinerary and the user's skills, allowing them to be modified and saved.

## Database Structure (Web-Related)

* **Users:** User information is managed through Firebase Authentication.
* **User Documents (Firestore):** For each registered user, a document is created in Firestore.
* **`userTechnologies` Subcollection:** Within each user document, this subcollection stores the user's technologies and skill levels.
* **Invoices:** Invoices created in the mobile application are stored in Firestore. Initially, the `idProject` field is empty.
* **Projects:** Projects created through the web interface are stored in Firestore, including their name and associated technologies (as an array). The `idProject` is used to link invoices to projects.
* **Professional Itineraries:** The `professional_itineraries` collection in Firestore contains information about professional itineraries and the required technologies.

## Connection with the Mobile Application

The Facturador Web application connects to and synchronizes with the mobile application through **Firebase**. Invoice data created in the mobile application is stored in Firebase Firestore, where the web application can access it in real time for management and visualization. User authentication is also shared through Firebase Authentication, allowing users to access the web platform with the same credentials as the mobile application.

## Local Development

To start a local development server, run the following command in the terminal:

```bash
ng serve

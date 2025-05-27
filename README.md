
# BlockArmor: Comprehensive Web3 Security Suite

BlockArmor is a Next.js-based application designed to provide a suite of tools for enhancing the security of Web3 projects, particularly focusing on smart contracts and blockchain transactions. It leverages AI for advanced analysis and provides a user-friendly interface for developers and security auditors.

## ✨ Features

*   **Dashboard Overview**: A central hub displaying key security metrics, active alerts, and recent activity.
*   **Vulnerability Scanner**: AI-powered analysis of smart contract code (e.g., Solidity) to identify common vulnerabilities like reentrancy, integer overflows, gas limit issues, and more. Provides a security score and suggested fixes.
*   **Transaction Simulator**: Simulate transactions to understand potential outcomes and risks before executing them on a live network.
*   **Gas Estimator**: Estimate gas costs for transactions to optimize fees and prevent out-of-gas errors.
*   **Address Reputation Scoring**: Check the reputation of Ethereum addresses based on transaction history and known security flags.
*   **Security Alerts**: Real-time alerts for security events related to your monitored assets.
*   **Data Visualizations**: Graphical representations of vulnerability distributions, transaction risk profiles, and potentially transaction flows.
*   **Settings Management**: Configure application preferences (currently UI placeholders).
*   **Support Center**: FAQs and a contact form for assistance.

## 🛠️ Tech Stack

*   **Frontend**:
    *   [Next.js](https://nextjs.org/) (App Router)
    *   [React](https://reactjs.org/)
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [ShadCN UI](https://ui.shadcn.com/) (Component Library)
    *   [Lucide React](https://lucide.dev/) (Icons)
    *   [Recharts](https://recharts.org/) (Charting Library)
*   **AI / Backend**:
    *   [Genkit (Firebase Genkit)](https://firebase.google.com/docs/genkit) for AI flow orchestration.
    *   Google AI Models (e.g., Gemini) via Genkit.
*   **Development Environment**:
    *   Firebase Studio

## 🚀 Getting Started

### Prerequisites

*   Node.js (version 20 or later recommended)
*   npm or yarn

### Installation

1.  **Clone the repository (if applicable)**:
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Set up environment variables**:
    Create a `.env` file in the root of the project. You'll need to add your Google AI API key for Genkit to function:
    ```env
    GOOGLE_API_KEY=YOUR_GOOGLE_AI_API_KEY
    ```
    You can obtain a Google AI API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Running the Development Server

To run the application in development mode, you'll need to start both the Next.js frontend and the Genkit development server.

1.  **Start the Next.js development server**:
    ```bash
    npm run dev
    ```
    This will typically start the Next.js app on `http://localhost:9002`.

2.  **Start the Genkit development server**:
    Open a new terminal window/tab and run:
    ```bash
    npm run genkit:dev
    ```
    This starts the Genkit server, which allows your Next.js app to call the AI flows. You can monitor Genkit flows and traces at `http://localhost:4000/devui` (or as indicated in the Genkit CLI output).

    For automatic reloading of Genkit flows on change, you can use:
    ```bash
    npm run genkit:watch
    ```

Now, you can access the application at `http://localhost:9002` (or the port Next.js is running on).

### Building for Production

To build the application for production:

```bash
npm run build
```

This will create an optimized production build in the `.next` folder.

To start the production server:

```bash
npm run start
```

## 📄 Key Pages & Functionality

*   `/dashboard`: Overview of security status.
*   `/scanner`: Input smart contract code for AI vulnerability analysis.
*   `/simulator`: Simulate blockchain transactions.
*   `/gas-estimator`: Estimate transaction gas fees.
*   `/address-reputation`: Check the reputation of an Ethereum address.
*   `/alerts`: View security alerts.
*   `/visualizations`: See charts and graphs related to security data.
*   `/settings`: Application settings.
*   `/support`: FAQs and support contact.

## 🤖 AI Integration with Genkit

BlockArmor uses Genkit to power its AI-driven features. The primary AI flow currently implemented is:

*   **Vulnerability Scanner (`src/ai/flows/vulnerability-scan.ts`)**:
    *   Takes smart contract code as input.
    *   Uses a Genkit prompt to instruct an AI model (e.g., Gemini) to analyze the code for vulnerabilities.
    *   Returns a list of found vulnerabilities, suggested fixes, and a security score.

The Genkit configuration can be found in `src/ai/genkit.ts`, and the development entry point for Genkit is `src/ai/dev.ts`.

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please follow these general steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code adheres to the project's coding standards and includes tests where applicable.

## 📜 License

This project is licensed under the MIT License - see the LICENSE.md file for details (if one exists, otherwise specify).
(Note: A LICENSE.md file is not currently present in the project. You may want to add one.)

---

This README provides a more structured and professional overview of the BlockArmor application.
Feel free to suggest any additions or modifications!

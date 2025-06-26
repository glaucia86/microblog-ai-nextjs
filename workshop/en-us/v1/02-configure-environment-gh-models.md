# Setting Up the Development Environment & GitHub Models

Before we begin developing the application, it’s essential to ensure all necessary tools are properly installed on your machine. This module will guide you step by step, from version checks to optional deployment setup, laying a solid foundation for the entire project.

## 1. Installing Node.js

Open your terminal and run the following commands to check if Node.js is installed:

```bash
node -v

npm -v
```

> **Note:** If it’s not installed, you can download it at [nodejs.org](https://nodejs.org/).

## 2. Getting Access to GitHub Models

During the application development, we’ll use GitHub Models—but only during development, not in production. So, what exactly is GitHub Models?

### What is GitHub Models?

![alt text](../../resources/images/gh-models.png)

GitHub Models is a suite of AI development tools integrated into GitHub, designed to make working with AI more accessible, collaborative, and productive. Instead of managing multiple platforms and complex configurations, GitHub Models provides a unified space inside GitHub itself, where you can experiment with, compare, manage, and evaluate AI models at production scale—all within the familiar and secure GitHub workflow.

In the context of this workshop, we’ll use GitHub Models as our AI provider to generate intelligent content for our microblog, connecting our application directly to the free API (such as GPT-4o). This removes the need for credit cards, API costs, or extra infrastructure.

In the GitHub Marketplace, you can explore the list of available models, their features, and how to integrate them into your projects. It’s a great way to discover what AI can do for your applications.

## Key Features of GitHub Models

* **Model Catalog:** Browse and select from various AI models (OpenAI, open-source models, etc.), all ready to use directly on the platform.

* **Prompt Management:** Create, edit, and store prompts in an organized, versioned, and collaborative way using `.prompt.yml` files within your repository.

* **Model Comparison:** Test different models or prompt tweaks side by side with the same input data and compare outputs to choose the best approach.

* **Quantitative Evaluation:** Use metrics such as similarity, relevance, and groundedness to analyze and compare model responses—helping refine and evolve your ideal prompts.

* **Interactive Playground:** Test prompt ideas in real time, visualize outputs, and tweak parameters—all visually and code-free.

* **Production Integration:** Save configurations and use the same experience for both prototyping and real-world application integration via SDK or REST API.

## Why Use GitHub Models in This Workshop?

Our choice of GitHub Models for this project is based on three pillars:

1. **Accessibility**: Anyone with a GitHub account can access advanced models (like GPT-4o) at no cost—no credit card or infrastructure setup needed.
2. **Easy Integration**: The platform provides a developer-friendly API that integrates seamlessly into our Next.js backend.
3. **Professional-Grade Experience**: Using GitHub Models mirrors the practices of real-world AI teams—managing, evaluating, and iterating on models and prompts like in production settings.

## How to Enable and Use GitHub Models in Your Project

* **1. On GitHub (Personal Use):**
  Access any repository (new or existing), go to the repo settings, find the **Models** option in the sidebar, and enable the feature.

  See how to do this in the gif below:

  ![Enabling GitHub Models](../../resources/images/gh-models-enable.gif)

* **2. In Organizations/Companies:**
  An organization owner must enable GitHub Models for all authorized repositories.

> **Note:** As we progress in the workshop, we’ll need to generate a token for authenticating requests to the GitHub Models API. We’ll walk you through how to do this at the right moment.

And that’s it! You’re now ready to start building our application. Let’s create the skeleton of our app next.

**[⬅️ Back: Introduction](./01-introduction.md) | [Next: Session 03 ➡️](./03-session.md)**

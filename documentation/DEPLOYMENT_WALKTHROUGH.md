# Deploying Medi-Sum to Render.com

This guide will walk you through deploying your Flask application to Render's free tier and keeping it alive 24/7.

## Prerequisites

1.  **GitHub Account**: Your code must be pushed to a GitHub repository.
2.  **Render Account**: Sign up at [render.com](https://render.com/).
3.  **Neon PostgreSQL Database**: You already have this set up. Keep your connection string handy.
4.  **Gemini API Key**: Keep your API key handy.

## Step 1: Push Your Code to GitHub

Ensure all your latest changes (including the new `render.yaml` and `/health` route) are committed and pushed to your GitHub repository.

## Step 2: Create a New Web Service on Render

1.  Log in to your [Render Dashboard](https://dashboard.render.com/).
2.  Click the **"New +"** button and select **"Web Service"**.
3.  Connect your GitHub account if you haven't already.
4.  Search for your repository (`Medi-Sum` or similar) and click **"Connect"**.

## Step 3: Configure the Web Service

Render might automatically detect the `render.yaml` file. If it does, approve the configuration.

If you need to configure manually:

-   **Name**: `medisum` (or any name you like)
-   **Region**: Pick the one closest to you (e.g., `Singapore` or `Frankfurt`).
-   **Branch**: `main` (or `master`)
-   **Root Directory**: Leave blank (defaults to root).
-   **Runtime**: **Python 3**
-   **Build Command**: `pip install -r requirements.txt`
-   **Start Command**: `gunicorn app:app`
-   **Instance Type**: **Free**

## Step 4: Set Environment Variables

You have two options here:

### **Option A: The Easy Way (Secret File)**
1.  Click the **"Environment"** tab on your Render dashboard.
2.  Click **"Secret Files"**.
3.  Click **"Add Secret File"**.
4.  **Filename**: `.env` (Must be exactly `.env`).
5.  **Contents**: Copy-paste the entire content of your local `.env` file here.
6.  Click **"Save Changes"**.

### **Option B: The Manual Way (One by One)**
Scroll down to the **"Environment Variables"** section and add the following keys manually.

**Important**: Do NOT wrap values in quotes unless the value itself contains spaces.

| Key | Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgres://...` | Your **Neon PostgreSQL** connection string. <br>**Note**: If your Neon string starts with `postgres://`, Render accepts it. If it starts with `postgresql://`, that's also fine. Our code handles both. |
| `SECRET_KEY` | *(Generate a random string)* | Used for session security. You can mash your keyboard for this. |
| `GEMINI_API_KEY` | `AIza...` | Your Google Gemini API Key. |
| `PYTHON_VERSION` | `3.10.12` | (Optional) Ensures consistent Python version. |

Click **"Create Web Service"**.

## Step 5: Wait for Deployment

Render will now start building your app. You can watch the **Logs** tab.
-   It will install dependencies from `requirements.txt`.
-   It will start Gunicorn.
-   If successful, you will see `Your service is live.`

## Step 6: Verify Deployment

1.  Click the URL provided by Render (e.g., `https://medisum.onrender.com`).
2.  **Check Health Endpoint**: Go to `https://medisum.onrender.com/health`. You should see `OK`.
3.  **Check Database**: Try logging in. If it works, your database connection is good.

## Step 7: Prevent Sleeping (Cron-job.org)

Render's free tier spins down after 15 minutes of inactivity. To keep it alive:

1.  Go to [cron-job.org](https://cron-job.org/) and sign up for free.
2.  Click **"Create Cronjob"**.
3.  **Title**: `Medi-Sum Pinger`
4.  **URL**: `https://<YOUR-APP-NAME>.onrender.com/health` (The URL you tested in Step 6).
5.  **Execution Schedule**: Select **"Every 10 minutes"**.
6.  **Create Cronjob**.

Now, Cron-job.org will ping your `/health` route every 10 minutes, keeping your Render service active.

## Troubleshooting

-   **"Internal Server Error"**: Check the **Logs** tab in Render. It usually means a missing environment variable or a bug in `app.py`.
-   **Database Error**: Ensure your `DATABASE_URL` is correct. Verify that your local IP (or Render's IP) allows connection to Neon (Neon is usually open, but check your settings).
-   **Build Failed**: Check the logs. It might be a dependency issue in `requirements.txt`.

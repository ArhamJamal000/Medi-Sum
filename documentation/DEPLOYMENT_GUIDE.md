# 🚀 How to Deploy Medi-Sum on Hugging Face Spaces

This guide will help you deploy your Medi-Sum application to **Hugging Face Spaces** using Docker.

## Prerequisites
- A [Hugging Face Account](https://huggingface.co/join)
- `git` installed on your machine
- Your **Gemini API Key**

---

## Step 1: Create a New Space
1.  Go to [huggingface.co/spaces](https://huggingface.co/spaces).
2.  Click **Create new Space**.
3.  **Space name**: `medi-sum-copilot` (or your choice).
4.  **License**: `MIT`.
5.  **Select the Space SDK**: Choose **Docker**.
6.  **Public/Private**: Choose **Public** (recommended for visibility) or Private.
7.  Click **Create Space**.

## Step 2: Configure Secrets (Environment Variables)
*This is critical for your app to work!*

1.  On your Space page, click the **Settings** tab.
2.  Scroll down to the **Variables and secrets** section.
3.  Click **New secret** and add the following:

| Name | Value | Purpose |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | `Your_Actual_Gemini_Key_Here` | Required for OCR and Chatbot |
| `SECRET_KEY` | `generate-a-random-secure-string` | Secures user sessions |
| `FLASK_ENV` | `production` | Enables security checks |
| `PORT` | `7860` | Required port for HF Spaces |

### ⚠️ Database Choice (Important)
You have two options for the database:

**Option A: Simple Demo (SQLite)**
- **No extra setup.** Just skip adding `DATABASE_URL`.
- **Warning:** All user data (logins, prescriptions) will be **deleted** if the Space restarts or you deploy an update. Good for testing, bad for real use.

**Option B: Production (PostgreSQL) - RECOMMENDED**
1.  Create a free PostgreSQL database on [Neon.tech](https://neon.tech/), [Render](https://render.com/), or [Railway](https://railway.app/).
2.  Copy the connection string (e.g., `postgresql://user:pass@host/dbname`).
3.  Add a new secret in Hugging Face: `DATABASE_URL` -> paste your connection string.

---

## Step 3: Deploy the Code

1.  **Clone your Space** locally (replace `your-username` with your HF username):
    ```bash
    git clone https://huggingface.co/spaces/your-username/medi-sum-copilot
    ```

2.  **Copy Files**: Copy all files from your current project folder into this new `medi-sum-copilot` folder **EXCEPT** `.env`, `venv`, `__pycache__`, and `.git`.
    *Tip: You can just copy the `.git` folder FROM the cloned space INTO your current project folder if you prefer.*

3.  **Push to Deploy**:
    ```bash
    cd medi-sum-copilot
    git add .
    git commit -m "Initial deploy"
    git push
    ```
    *(You may be asked for your Hugging Face username and a **User Access Token** as the password. You can generate a token in your [HF Profile Settings](https://huggingface.co/settings/tokens)).*

---

## Step 4: Watch it Build
1.  Go back to your Space page in the browser.
2.  Click the **App** tab.
3.  You will see "Building..." with a log viewer.
4.  **Wait ~3-5 minutes.** Docker will download necessary layers and the TrOCR model.
5.  Once it says **Running**, your app is live! 🎉

## Troubleshooting
- **Build Failed:** Check the logs. Did you include `requirements.txt`?
- **App Crashes on OCR:** Check `GEMINI_API_KEY` secret.
- **"500 Internal Server Error":** Check the Logs tab for Python tracebacks.

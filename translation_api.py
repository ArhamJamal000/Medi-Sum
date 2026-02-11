# ============== TRANSLATION API ==============

from flask import request, jsonify
from flask_login import login_required
from app import app, get_next_api_key, mark_key_exhausted, logger

@app.route('/api/translate', methods=['POST'])
@login_required
def translate_api():
    """API endpoint for translating prescription summaries."""
    import google.generativeai as genai

    key_index = -1  # Initialize to avoid unbound variable

    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        target_lang = data.get('target_lang', 'en')

        if not text:
            return jsonify({'error': 'No text provided'}), 400

        # Get API key using rotation system
        gemini_api_key, key_index = get_next_api_key()
        if not gemini_api_key:
            return jsonify({'error': 'Translation service temporarily unavailable'}), 503

        # Language mapping
        lang_map = {
            'en': 'English',
            'hi': 'Hindi',
            'te': 'Telugu',
            'roman': 'Roman English (simple English transliteration)'
        }

        target_lang_name = lang_map.get(target_lang, 'English')

        prompt = f"""Translate the following medical prescription summary to {target_lang_name}.
Keep the medical terms accurate and maintain the bullet point format.
Only return the translated text, no additional explanations.

Original text:
{text}

Translated text:"""

        genai.configure(api_key=gemini_api_key)
        model = genai.GenerativeModel('gemini-2.5-flash')

        response = model.generate_content(prompt)

        if response and response.text:
            logger.info(f"Translation successful (key #{key_index + 1})")
            return jsonify({'translated_text': response.text.strip()})
        else:
            return jsonify({'error': 'Translation failed'}), 500

    except Exception as e:
        error_msg = str(e)
        logger.error(f"Translation error: {error_msg}")

        # Check for quota errors
        if "quota" in error_msg.lower() or "429" in error_msg:
            mark_key_exhausted(key_index)
            return jsonify({'error': 'Translation service is busy. Please try again in a moment.'}), 503

        return jsonify({'error': 'Translation failed. Please try again.'}), 500

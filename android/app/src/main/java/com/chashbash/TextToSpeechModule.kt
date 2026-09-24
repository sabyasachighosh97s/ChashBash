package com.chashbash

import android.speech.tts.TextToSpeech
import com.facebook.react.bridge.*
import java.util.*

class TextToSpeechModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    private var tts: TextToSpeech? = null

    init {
        tts = TextToSpeech(reactContext) { status ->
          if (status == TextToSpeech.SUCCESS) {

    val result = tts?.setLanguage(Locale("bn", "BD"))

    if (
        result == TextToSpeech.LANG_MISSING_DATA ||
        result == TextToSpeech.LANG_NOT_SUPPORTED
    ) {
        tts?.setLanguage(Locale("bn"))
    }

    tts?.setSpeechRate(0.85f)
    tts?.setPitch(1.0f)
}
        }
    }

    override fun getName(): String {
        return "TextToSpeech"
    }

    @ReactMethod
    fun speak(text: String) {
       tts?.setSpeechRate(0.85f)
tts?.setPitch(1.0f)

tts?.speak(
    text,
    TextToSpeech.QUEUE_FLUSH,
    null,
    "ttsMessage"
)
    }

    @ReactMethod
    fun stop() {
        tts?.stop()
    }
}
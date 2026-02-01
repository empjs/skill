package com.playload

import android.app.Application
import com.facebook.react.ReactApplication
import com.facebook.soloader.SoLoader

class PlayloadApplication : Application(), ReactApplication {
    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this, false)
    }
}

package com.playload

import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.widget.ProgressBar
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.widget.doAfterTextChanged
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import com.facebook.react.ReactInstanceManager
import com.facebook.react.ReactRootView
import com.facebook.react.common.annotations.UnstableReactNativeAPI
import com.facebook.react.shell.MainReactPackage
import com.google.android.material.button.MaterialButton
import com.google.android.material.button.MaterialButtonToggleGroup
import com.playload.bundle.BundleDownloader
import com.playload.bundle.LoadMode
import kotlinx.coroutines.launch

@OptIn(UnstableReactNativeAPI::class)
class PlayloadActivity : AppCompatActivity() {
    private lateinit var viewModel: PlayloadViewModel
    private lateinit var reactInstanceManager: ReactInstanceManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_playload)

        val downloader = BundleDownloader(applicationContext)
        viewModel = PlayloadViewModel(downloader, applicationContext)

        setupReactNative()
        setupViews()
        observeState()
    }

    private fun setupReactNative() {
        reactInstanceManager = ReactInstanceManager.builder()
            .setApplication(application)
            .setCurrentActivity(this)
            .addPackage(MainReactPackage())
            .setUseDeveloperSupport(true)
            .setJSBundleFile(getBundleFilePath())
            .setJSMainModulePath("index")
            .build()
    }

    private fun getBundleFilePath(): String {
        return BundleDownloader(applicationContext).getBundlePath()
    }

    private fun setupViews() {
        findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.etAppName).doAfterTextChanged { text ->
            viewModel.setAppName(text.toString())
        }

        val toggleMode = findViewById<MaterialButtonToggleGroup>(R.id.toggleMode)
        toggleMode.check(R.id.btnDevMode)

        toggleMode.addOnButtonCheckedListener { _, checkedId, isChecked ->
            if (isChecked) {
                viewModel.setLoadMode(
                    when (checkedId) {
                        R.id.btnDevMode -> LoadMode.DEV
                        R.id.btnReleaseMode -> LoadMode.RELEASE
                        else -> LoadMode.DEV
                    }
                )
            }
        }

        findViewById<MaterialButton>(R.id.btnLoad).setOnClickListener {
            val appName = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.etAppName).text.toString()
            val url = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.etBundleUrl).text.toString()
            viewModel.validateAndLoad(url, appName)
        }

        findViewById<MaterialButton>(R.id.btnReload).setOnClickListener {
            val appName = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.etAppName).text.toString()
            val url = findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.etBundleUrl).text.toString()
            viewModel.validateAndLoad(url, appName)
        }
    }

    private fun observeState() {
        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.uiState.collect { state ->
                    when (state) {
                        is UiState.Idle -> updateUi(false, null, false)
                        is UiState.Loading -> updateUi(true, null, false)
                        is UiState.Loaded -> {
                            reloadReactRoot()
                            updateUi(false, null, true)
                        }
                        is UiState.Error -> updateUi(false, state.message, true)
                    }
                }
            }
        }
    }

    private fun updateUi(loading: Boolean, error: String?, showReload: Boolean) {
        findViewById<ProgressBar>(R.id.progressBar).visibility = if (loading) View.VISIBLE else View.GONE
        findViewById<MaterialButton>(R.id.btnLoad).visibility = if (loading) View.GONE else View.VISIBLE
        findViewById<MaterialButton>(R.id.btnReload).visibility = if (showReload) View.VISIBLE else View.GONE

        val tvError = findViewById<TextView>(R.id.tvError)
        tvError.visibility = if (error != null) View.VISIBLE else View.GONE
        tvError.text = error

        findViewById<TextView>(R.id.tvStatus).text = when {
            loading -> "加载中..."
            error != null -> "加载失败"
            showReload -> "已加载"
            else -> "未加载"
        }
    }

    private fun reloadReactRoot() {
        val rootView = findViewById<ViewGroup>(R.id.reactContainer)
        rootView.removeAllViews()

        reactInstanceManager.createReactContextInBackground()

        val appName = viewModel.appName.value
        val reactRootView = ReactRootView(this)
        reactRootView.startReactApplication(reactInstanceManager, appName, null)
        rootView.addView(reactRootView)
    }

    override fun onResume() {
        super.onResume()
        reactInstanceManager.onHostResume(this)
    }

    override fun onPause() {
        super.onPause()
        reactInstanceManager.onHostPause(this)
    }
}

package com.playload

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.playload.bundle.BundleDownloader
import com.playload.bundle.LoadMode
import com.playload.bundle.LoadResult
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class PlayloadViewModel(
    private val downloader: BundleDownloader,
    private val context: Context
) : ViewModel() {

    private val prefs = context.getSharedPreferences("playload", Context.MODE_PRIVATE)

    private val _loadMode = MutableStateFlow(LoadMode.DEV)
    val loadMode: StateFlow<LoadMode> = _loadMode.asStateFlow()

    private val _uiState = MutableStateFlow<UiState>(UiState.Idle)
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    private val _appName = MutableStateFlow("")
    val appName: StateFlow<String> = _appName.asStateFlow()

    init {
        _appName.value = prefs.getString("appName", "") ?: ""
    }

    fun setAppName(name: String) {
        _appName.value = name
        prefs.edit().putString("appName", name).apply()
    }

    fun setLoadMode(mode: LoadMode) {
        _loadMode.value = mode
    }

    fun loadBundle(url: String) {
        viewModelScope.launch {
            _uiState.value = UiState.Loading

            if (_loadMode.value == LoadMode.DEV) {
                _uiState.value = UiState.Loaded(url, false)
            } else {
                when (val result = downloader.download(url)) {
                    is LoadResult.Success -> _uiState.value = UiState.Loaded(result.localPath, result.isBytecode)
                    is LoadResult.Error -> _uiState.value = UiState.Error(result.message)
                }
            }
        }
    }

    fun validateAndLoad(url: String, appName: String): Boolean {
        if (appName.isEmpty()) {
            _uiState.value = UiState.Error("请输入 App Name")
            return false
        }
        if (url.isEmpty()) {
            _uiState.value = UiState.Error("请输入 Bundle URL")
            return false
        }
        setAppName(appName)
        loadBundle(url)
        return true
    }
}

sealed class UiState {
    data object Idle : UiState()
    data object Loading : UiState()
    data class Loaded(val localPath: String, val isBytecode: Boolean) : UiState()
    data class Error(val message: String) : UiState()
}

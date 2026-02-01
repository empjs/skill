package com.playload.bundle

import android.content.Context
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.File
import java.io.IOException

class BundleDownloader(private val context: Context) {
    private val client = OkHttpClient()
    private val cacheDir = File(context.cacheDir, "bundles").apply { mkdirs() }

    suspend fun download(url: String): LoadResult {
        return try {
            val bytes = downloadBytes(url)
            val isBytecode = url.endsWith(".hbc")
            val ext = if (isBytecode) ".hbc" else ".js"
            val filename = "bundle_${System.currentTimeMillis()}$ext"
            val file = File(cacheDir, filename).apply { writeBytes(bytes) }

            LoadResult.Success(file.absolutePath, isBytecode)
        } catch (e: Exception) {
            LoadResult.Error("Download failed: ${e.message}")
        }
    }

    private suspend fun downloadBytes(url: String): ByteArray {
        val request = Request.Builder().url(url).get().build()
        return withContext(Dispatchers.IO) {
            client.newCall(request).execute().use { response ->
                if (!response.isSuccessful) {
                    throw IOException("HTTP ${response.code}")
                }
                response.body?.bytes() ?: throw IOException("Empty response")
            }
        }
    }

    fun getBundlePath(): String {
        return File(cacheDir, "current.bundle.js").absolutePath
    }

    fun clearCache() {
        cacheDir.listFiles()?.forEach { it.delete() }
    }
}

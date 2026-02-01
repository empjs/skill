package com.playload.bundle

sealed class LoadResult {
    data class Success(val localPath: String, val isBytecode: Boolean) : LoadResult()
    data class Error(val message: String) : LoadResult()
}

#!/usr/bin/env node
import {readFileSync} from 'fs'
import {fileURLToPath} from 'url'
import {dirname, join} from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packageJsonPath = join(__dirname, '..', 'package.json')
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

console.log('Package version:', packageJson.version)
console.log('✅ Version reading works correctly')

# Step 1: Delete old .cjs file
$target = "dist\convertXLSX.cjs"
if (Test-Path $target) {
  Remove-Item $target -Force
  Write-Host "🗑️ Deleted old $target"
}

# Step 2: Compile TypeScript
Write-Host "🔧 Compiling TypeScript..."
npx tsc

# Step 3: Rename .js to .cjs
$jsFile = "dist\convertXLSX.js"
if (Test-Path $jsFile) {
  Rename-Item $jsFile "dist\convertXLSX.cjs" -Force
  Write-Host "📦 Renamed $jsFile to .cjs"
} else {
  Write-Host "❌ Could not find compiled JS file at $jsFile"
  exit 1
}

# Step 4: Run the script
Write-Host "🚀 Running script..."
node dist\convertXLSX.cjs
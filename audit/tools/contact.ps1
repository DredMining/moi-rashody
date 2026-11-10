# Контактные листы: все ramka_*.png папки по 5 в ряд, с именем файла над каждым.
# Вызов: & contact.ps1 -Dir <папка со снимками> -Out <папка для листов> [-H 860] [-Per 5]
param([Parameter(Mandatory = $true)][string]$Dir, [Parameter(Mandatory = $true)][string]$Out, [int]$H = 860, [int]$Per = 5)
Add-Type -AssemblyName System.Drawing
New-Item -ItemType Directory -Force $Out | Out-Null
$files = @(Get-ChildItem $Dir -Filter 'ramka_*.png' | Where-Object { $_.Name -ne 'ramka_nizhnyaya-panel-krupno.png' } | Sort-Object Name)
$pad = 16; $cap = 40; $n = 0
for ($i = 0; $i -lt $files.Count; $i += $Per) {
  $part = $files[$i..([Math]::Min($i + $Per, $files.Count) - 1)]
  $bm = @(); foreach ($f in $part) { $b = New-Object System.Drawing.Bitmap $f.FullName; $bm += , @($f.BaseName.Substring(6), $b, [int][Math]::Round($b.Width * $H / $b.Height)) }
  $W = $pad; foreach ($x in $bm) { $W += $x[2] + $pad }
  $sheet = New-Object System.Drawing.Bitmap $W, ($H + $cap + $pad)
  $g = [System.Drawing.Graphics]::FromImage($sheet); $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias; $g.Clear([System.Drawing.Color]::FromArgb(40, 44, 54))
  $font = New-Object System.Drawing.Font 'Segoe UI', 13, ([System.Drawing.FontStyle]::Bold); $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(235, 235, 240))
  $fmt = New-Object System.Drawing.StringFormat; $fmt.Alignment = [System.Drawing.StringAlignment]::Center; $fmt.LineAlignment = [System.Drawing.StringAlignment]::Center
  $xx = $pad; foreach ($x in $bm) { $g.DrawString($x[0], $font, $brush, (New-Object System.Drawing.RectangleF $xx, 0, $x[2], $cap), $fmt); $g.DrawImage($x[1], $xx, $cap, $x[2], $H); $xx += $x[2] + $pad; $x[1].Dispose() }
  $g.Dispose(); $n++; $sheet.Save((Join-Path $Out ("list_{0:d2}.png" -f $n)), [System.Drawing.Imaging.ImageFormat]::Png); $sheet.Dispose()
}
"$n листов в $Out"

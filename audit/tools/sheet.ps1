# Лист «до / после»: несколько снимков в ряд, над каждым подпись.
# Вызов: powershell -File sheet.ps1 -Out <файл.png> -Items "подпись|путь","подпись|путь",… [-H 1000]
param([Parameter(Mandatory = $true)][string]$Out, [Parameter(Mandatory = $true)][string[]]$Items, [int]$H = 1000)
Add-Type -AssemblyName System.Drawing
$pad = 24; $cap = 56
$imgs = @(); foreach ($it in $Items) { $p = $it.Split('|', 2); $b = New-Object System.Drawing.Bitmap $p[1]; $imgs += , @($p[0], $b, [int][Math]::Round($b.Width * $H / $b.Height)) }
$W = $pad; foreach ($i in $imgs) { $W += $i[2] + $pad }
$sheet = New-Object System.Drawing.Bitmap $W, ($H + $cap + $pad)
$g = [System.Drawing.Graphics]::FromImage($sheet)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
$g.Clear([System.Drawing.Color]::FromArgb(20, 22, 28))
$font = New-Object System.Drawing.Font 'Segoe UI', 17, ([System.Drawing.FontStyle]::Bold)
$brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(235, 235, 240))
$fmt = New-Object System.Drawing.StringFormat; $fmt.Alignment = [System.Drawing.StringAlignment]::Center; $fmt.LineAlignment = [System.Drawing.StringAlignment]::Center
$x = $pad
foreach ($i in $imgs) {
  $g.DrawString($i[0], $font, $brush, (New-Object System.Drawing.RectangleF $x, 0, $i[2], $cap), $fmt)
  $g.DrawImage($i[1], $x, $cap, $i[2], $H); $x += $i[2] + $pad; $i[1].Dispose()
}
$g.Dispose(); $sheet.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png); $sheet.Dispose()
"$Out  ${W}x$($H + $cap + $pad)"

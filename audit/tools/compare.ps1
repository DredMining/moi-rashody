# Попиксельное сравнение двух папок со снимками (одинаковые имена файлов).
# Вызов:  powershell -File audit\tools\compare.ps1 <папка «до»> <папка «после»>
param([Parameter(Mandatory = $true)][string]$Before, [Parameter(Mandatory = $true)][string]$After)
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System; using System.Drawing; using System.Drawing.Imaging; using System.Runtime.InteropServices;
public static class PixDiff {
  public static string Run(string a, string b) {
    using (var x = new Bitmap(a)) using (var y = new Bitmap(b)) {
      if (x.Width != y.Width || x.Height != y.Height) return "размер " + x.Width + "x" + x.Height + " / " + y.Width + "x" + y.Height;
      var r = new Rectangle(0, 0, x.Width, x.Height);
      var dx = x.LockBits(r, ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb); var dy = y.LockBits(r, ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
      int n = dx.Stride * x.Height; var p = new byte[n]; var q = new byte[n];
      Marshal.Copy(dx.Scan0, p, 0, n); Marshal.Copy(dy.Scan0, q, 0, n); x.UnlockBits(dx); y.UnlockBits(dy);
      long diff = 0; int maxd = 0; int x0 = int.MaxValue, y0 = int.MaxValue, x1 = -1, y1 = -1;
      for (int i = 0; i < n; i += 4) {
        int d = Math.Max(Math.Abs(p[i] - q[i]), Math.Max(Math.Abs(p[i + 1] - q[i + 1]), Math.Abs(p[i + 2] - q[i + 2]))); if (d > 2) { if (d > maxd) maxd = d;
          diff++; int px = (i % dx.Stride) / 4, py = i / dx.Stride;
          if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py;
        }
      }
      return diff == 0 ? "" : (maxd <= 16 && diff <= 3000 ? "шум: " : "") + diff + " px отличается (до " + maxd + " из 255), область " + x0 + "," + y0 + " – " + x1 + "," + y1;
    }
  }
}
'@
$same = 0; $noise = 0; $bad = @()
Get-ChildItem (Join-Path $Before '*.png') | ForEach-Object {
  $other = Join-Path $After $_.Name
  if (-not (Test-Path $other)) { $bad += "$($_.Name): нет файла «после»"; return }
  $d = [PixDiff]::Run($_.FullName, (Resolve-Path $other).Path)
  if (-not $d) { $same++ } elseif ($d.StartsWith("шум")) { $noise++ } else { $bad += "$($_.Name): $d" }
}
# «шум» — едва заметная разница оттенка (до 16 из 255) на краях рамки: один и тот же код даёт её от прогона к прогону
"одинаковых: $same, с шумом съёмки: $noise, с настоящими отличиями: $($bad.Count)"
$bad

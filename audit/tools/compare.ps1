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
      long diff = 0; int x0 = int.MaxValue, y0 = int.MaxValue, x1 = -1, y1 = -1;
      for (int i = 0; i < n; i += 4) {
        if (Math.Abs(p[i] - q[i]) > 2 || Math.Abs(p[i + 1] - q[i + 1]) > 2 || Math.Abs(p[i + 2] - q[i + 2]) > 2) {
          diff++; int px = (i % dx.Stride) / 4, py = i / dx.Stride;
          if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py;
        }
      }
      return diff == 0 ? "" : diff + " px отличается, область " + x0 + "," + y0 + " – " + x1 + "," + y1;
    }
  }
}
'@
$same = 0; $bad = @()
Get-ChildItem (Join-Path $Before '*.png') | ForEach-Object {
  $other = Join-Path $After $_.Name
  if (-not (Test-Path $other)) { $bad += "$($_.Name): нет файла «после»"; return }
  $d = [PixDiff]::Run($_.FullName, (Resolve-Path $other).Path)
  if ($d) { $bad += "$($_.Name): $d" } else { $same++ }
}
"одинаковых: $same, с отличиями: $($bad.Count)"
$bad

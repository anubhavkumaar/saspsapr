// Cougar intro (kept from the live site): once per session, skippable. window.saprIntro() replays.
(function () {
  var KEY = 'sapr-kit-intro-seen';
  function play() {
    var o = document.createElement('div');
    o.setAttribute('style', 'position:fixed;inset:0;z-index:9999;background:#000;display:flex;align-items:center;justify-content:center;transition:opacity .8s ease');
    o.innerHTML = '<video src="../../assets/video/cougar-intro.mp4" muted autoplay playsinline style="width:100%;height:100%;object-fit:cover"></video><button type="button" style="position:absolute;right:24px;bottom:24px;font:600 12px/1 \'IBM Plex Mono\',monospace;letter-spacing:.1em;text-transform:uppercase;padding:12px 16px;background:#F2EDE1;color:#1D221E;border:2px solid #1D221E;box-shadow:4px 4px 0 #000;cursor:pointer">Skip intro</button>';
    var gone = false;
    function done() { if (gone) return; gone = true; o.style.opacity = '0'; setTimeout(function () { o.remove(); }, 800); try { sessionStorage.setItem(KEY, '1'); } catch (e) {} }
    o.querySelector('button').onclick = done; o.querySelector('video').onended = done; setTimeout(done, 3500);
    document.body.appendChild(o);
  }
  window.saprIntro = play;
  var seen = false; try { seen = !!sessionStorage.getItem(KEY); } catch (e) {}
  if (!seen) document.addEventListener('DOMContentLoaded', play);
})();

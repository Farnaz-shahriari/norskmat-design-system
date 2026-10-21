/* ---------------------------------------------------------------------------
   Norsk Mat design system, live drift check.

   Paste one line into the console of any app that uses this design system and
   this reports every token the app gets wrong. It is the check that would have
   caught the KSL app's missing --outline and its wrong Vesentlig container on
   the day each broke, rather than months later during an audit.

   It does not carry the expected values. It fetches them from tokens.json
   sitting next to this file on the deployed site, so it is always checking
   against the current design system rather than a snapshot of it.

   Three states per token:
     missing   the app never defines it, so every component reaching for it
               falls back to nothing. This is the serious one.
     drifted   defined, but a different value from the design system.
     ok

   The panel renders inside a shadow root, so the host app's CSS cannot reach
   in and restyle it, and nothing this script adds can leak out and restyle the
   host app.
   --------------------------------------------------------------------------- */
(function () {
  "use strict";

  // Where this script was served from, so tokens.json is found beside it
  // whether that is GitHub Pages, a local file, or a copy inside node_modules.
  var self = document.currentScript && document.currentScript.src;
  var BASE = self ? self.replace(/[^/]*$/, "") : "./";

  var NS = "__norskmatAudit";
  if (window[NS] && window[NS].panel) window[NS].panel.remove();

  /* ------------------------------------------------------------- comparison */

  // Compare as colours where possible, so #FFFFFF and #ffffff and rgb(255 255
  // 255) all count as the same value. Anything the browser cannot parse falls
  // back to a trimmed string compare.
  var probe = document.createElement("span");
  probe.style.display = "none";
  document.body.appendChild(probe);

  function normalise(value) {
    var v = String(value == null ? "" : value).trim();
    if (!v) return "";
    if (/^-?[\d.]+(px|rem|em|%)?$/.test(v)) {
      // Lengths, compare in px where the unit is known.
      var n = parseFloat(v);
      if (/rem$/.test(v)) return n * 16 + "px";
      if (/^-?[\d.]+$/.test(v)) return v;
      return v;
    }
    probe.style.color = "";
    probe.style.color = v;
    var parsed = getComputedStyle(probe).color;
    return probe.style.color ? parsed : v.replace(/\s+/g, " ").toLowerCase();
  }

  /* ---------------------------------------------------------------- report */

  function audit(model) {
    var root = document.documentElement;
    var body = document.body;
    var cs = getComputedStyle(root);

    // Which platform is this app? The theme class wins. Failing that, match
    // the app's computed --primary against each platform's, which catches an
    // app that set the variables directly without using a theme class.
    var platform = null;
    var reason = "";
    for (var i = 0; i < model.platforms.length; i++) {
      var p = model.platforms[i];
      if (root.classList.contains(p.cls) || (body && body.classList.contains(p.cls))) {
        platform = p;
        reason = "." + p.cls + " is on the " + (root.classList.contains(p.cls) ? "html" : "body") + " element";
        break;
      }
    }
    if (!platform) {
      var appPrimary = normalise(cs.getPropertyValue("--primary"));
      for (var j = 0; j < model.platforms.length; j++) {
        var flat = flatten(model.platforms[j]);
        if (appPrimary && normalise(flat["primary"]) === appPrimary) {
          platform = model.platforms[j];
          reason = "no theme class found, matched by --primary " + flat["primary"];
          break;
        }
      }
    }
    if (!platform) {
      platform = model.platforms[0];
      reason = "could not tell, assuming " + platform.name + ", pass a platform id to check another";
    }

    var expected = [];
    var flatColours = flatten(platform);
    Object.keys(flatColours).forEach(function (k) {
      expected.push({ name: "--" + k, want: flatColours[k], group: "colour" });
    });
    model.severity.forEach(function (s) {
      expected.push({ name: s.mainVar, want: s.main, group: "severity" });
      expected.push({ name: s.containerVar, want: s.container, group: "severity" });
    });
    ["typeScale", "spacing", "heights", "radius"].forEach(function (key) {
      (model[key] || []).forEach(function (t) {
        expected.push({ name: "--" + t.name, want: t.resolved || t.value, group: key });
      });
    });

    var missing = [], drifted = [], ok = [];
    expected.forEach(function (t) {
      var got = cs.getPropertyValue(t.name);
      if (!String(got).trim()) {
        missing.push({ name: t.name, want: t.want, group: t.group });
      } else if (normalise(got) !== normalise(t.want)) {
        drifted.push({ name: t.name, want: t.want, got: String(got).trim(), group: t.group });
      } else {
        ok.push(t.name);
      }
    });

    return { platform: platform, reason: reason, missing: missing, drifted: drifted, ok: ok, total: expected.length };
  }

  function flatten(p) {
    var all = {};
    (p.groups || []).forEach(function (g) {
      (g.tokens || []).forEach(function (t) {
        all[t.name] = t.value;
      });
    });
    if (p.fontFamily) all["font-family"] = p.fontFamily;
    return all;
  }

  /* ----------------------------------------------------------------- panel */

  function render(r) {
    var host = document.createElement("div");
    host.setAttribute("data-norskmat-audit", "");
    host.style.cssText =
      "position:fixed;top:16px;right:16px;z-index:2147483647;width:420px;max-width:calc(100vw - 32px)";
    var sr = host.attachShadow({ mode: "open" });

    var bad = r.missing.length + r.drifted.length;
    var head = bad === 0 ? "No drift" : bad + (bad === 1 ? " problem" : " problems");

    var rows = "";
    function section(title, items, kind) {
      if (!items.length) return "";
      var out =
        '<div class="sec"><h4>' + title + " <em>" + items.length + "</em></h4>";
      items.forEach(function (t) {
        out +=
          '<div class="row ' + kind + '">' +
          '<code>' + t.name + "</code>" +
          '<div class="vals">' +
          (kind === "missing"
            ? '<span class="want"><i style="background:' + safe(t.want) + '"></i>' + esc(t.want) + " expected</span>"
            : '<span class="got"><i style="background:' + safe(t.got) + '"></i>' + esc(t.got) + "</span>" +
              '<span class="arrow">should be</span>' +
              '<span class="want"><i style="background:' + safe(t.want) + '"></i>' + esc(t.want) + "</span>") +
          "</div></div>";
      });
      return out + "</div>";
    }
    rows += section("Missing entirely", r.missing, "missing");
    rows += section("Drifted", r.drifted, "drifted");

    sr.innerHTML =
      "<style>" +
      ":host{all:initial}" +
      "*{box-sizing:border-box;margin:0;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif}" +
      ".p{background:#14170E;color:#F0EFE4;border:1px solid #2C3022;border-radius:10px;overflow:hidden;box-shadow:0 12px 32px rgb(0 0 0 / .3);font-size:12.5px;line-height:1.5}" +
      "header{display:flex;align-items:center;gap:10px;padding:11px 13px;border-bottom:1px solid #2C3022;background:#191C12}" +
      "header b{font-size:13px;font-weight:650;flex:1}" +
      ".pill{font-size:10px;letter-spacing:.08em;text-transform:uppercase;padding:2px 7px;border-radius:999px;font-weight:600}" +
      ".pill.bad{background:#BA1A1A;color:#fff}.pill.good{background:#4A671E;color:#fff}" +
      "button{all:unset;cursor:pointer;color:#A9AE9B;font-size:16px;line-height:1;padding:2px 4px}" +
      "button:hover{color:#F0EFE4}" +
      ".meta{padding:9px 13px;color:#A9AE9B;font-size:11.5px;border-bottom:1px solid #2C3022}" +
      ".meta b{color:#F0EFE4;font-weight:600}" +
      ".body{max-height:min(56vh,520px);overflow:auto}" +
      ".sec{padding:4px 0 8px}" +
      "h4{padding:10px 13px 5px;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#7B8071;font-weight:600;display:flex;gap:7px;align-items:center}" +
      "h4 em{font-style:normal;color:#F0EFE4}" +
      ".row{padding:6px 13px;display:grid;gap:3px;border-left:2px solid transparent}" +
      ".row.missing{border-left-color:#BA1A1A}.row.drifted{border-left-color:#A84300}" +
      "code{font-family:ui-monospace,Menlo,monospace;font-size:11.5px;color:#F0EFE4}" +
      ".vals{display:flex;align-items:center;gap:7px;flex-wrap:wrap;font-family:ui-monospace,Menlo,monospace;font-size:11px;color:#A9AE9B}" +
      "i{display:inline-block;width:10px;height:10px;border-radius:2px;border:1px solid rgb(255 255 255 / .25);margin-right:5px;vertical-align:-1px}" +
      ".arrow{color:#7B8071}" +
      ".want{color:#F0EFE4}" +
      ".clean{padding:18px 13px;color:#A9AE9B;text-align:center}" +
      "footer{padding:9px 13px;border-top:1px solid #2C3022;color:#7B8071;font-size:11px;display:flex;gap:8px;justify-content:space-between}" +
      "</style>" +
      '<div class="p"><header><b>Design system check</b>' +
      '<span class="pill ' + (bad ? "bad" : "good") + '">' + head + "</span>" +
      "<button title='Close'>&times;</button></header>" +
      '<div class="meta">Checked as <b>' + esc(r.platform.name) + "</b>, " + esc(r.reason) +
      ". <b>" + r.ok.length + "</b> of <b>" + r.total + "</b> tokens correct.</div>" +
      '<div class="body">' + (rows || '<div class="clean">Every token matches the design system.</div>') + "</div>" +
      "<footer><span>norsk-mat-design-system</span><span>full report in console</span></footer></div>";

    sr.querySelector("button").addEventListener("click", function () {
      host.remove();
    });
    document.body.appendChild(host);
    return host;
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  // Only let something that parses as a colour into a style attribute.
  function safe(v) {
    probe.style.background = "";
    probe.style.background = String(v);
    return probe.style.background ? String(v) : "transparent";
  }

  /* ------------------------------------------------------------------- run */

  fetch(BASE + "tokens.json", { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("tokens.json responded " + res.status);
      return res.json();
    })
    .then(function (model) {
      var r = audit(model);
      var panel = render(r);
      window[NS] = { result: r, panel: panel, model: model, rerun: function () { return audit(model); } };

      var bad = r.missing.length + r.drifted.length;
      console.log(
        "%cNorsk Mat design system check%c  " + r.platform.name + ", " + r.ok.length + "/" + r.total + " tokens correct",
        "background:#4A671E;color:#fff;padding:2px 6px;border-radius:3px;font-weight:600",
        "color:inherit",
      );
      console.log(r.reason);
      if (r.missing.length) {
        console.group("%cMissing entirely (" + r.missing.length + ")", "color:#BA1A1A;font-weight:600");
        console.table(r.missing, ["name", "want", "group"]);
        console.groupEnd();
      }
      if (r.drifted.length) {
        console.group("%cDrifted (" + r.drifted.length + ")", "color:#A84300;font-weight:600");
        console.table(r.drifted, ["name", "got", "want", "group"]);
        console.groupEnd();
      }
      if (!bad) console.log("No drift. Every token matches the design system.");
      console.log("Full result on window." + NS + ".result");
    })
    .catch(function (e) {
      console.error(
        "Norsk Mat design system check could not load its expected values from " +
          BASE +
          "tokens.json\n" +
          e.message,
      );
    });
})();

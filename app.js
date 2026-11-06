(function () {
  "use strict";

  var PROGRESS_KEY = "fieldguide-progress-v2";

  var docs = LIBRARY.docs;
  var docById = {};
  docs.forEach(function (d) { docById[d.id] = d; });
  var trackName = {};
  LIBRARY.tracks.forEach(function (t) { trackName[t.id] = t.name; });

  var catalogById = {};
  (window.FIELD_GUIDE_CATALOG || []).forEach(function (c) { catalogById[c.id] = c; });

  var paths = window.FIELD_GUIDE_PATHS || [];
  var pathById = {};
  paths.forEach(function (p) { pathById[p.id] = p; });

  var tutorials = window.FIELD_GUIDE_TUTORIALS || [];
  var tutorialById = {};
  tutorials.forEach(function (t) { tutorialById[t.id] = t; });

  var glossary = window.FIELD_GUIDE_GLOSSARY || [];
  var guide = window.FIELD_GUIDE_GUIDE || {};

  // ---------- glossary term index (for inline term tooltips) ----------
  function reEscape(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  var termByLower = {};
  glossary.forEach(function (g) { termByLower[g.term.toLowerCase()] = g; });
  var termPattern = glossary.length
    ? new RegExp("\\b(" + glossary.slice()
        .sort(function (a, b) { return b.term.length - a.term.length; })
        .map(function (g) { return reEscape(g.term); }).join("|") + ")\\b", "gi")
    : null;

  // Wrap the first few glossary terms in each text node with a tooltip trigger.
  function linkTerms(root) {
    if (!termPattern || !root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var p = node.parentNode;
        if (!p || /^(CODE|PRE|BUTTON|A|H1|H2|H3|SUMMARY)$/.test(p.tagName)) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue || node.nodeValue.length < 4) return NodeFilter.FILTER_REJECT;
        termPattern.lastIndex = 0;
        return termPattern.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var texts = [];
    while (walker.nextNode()) texts.push(walker.currentNode);
    texts.forEach(function (node) {
      var text = node.nodeValue;
      termPattern.lastIndex = 0;
      var frag = document.createDocumentFragment();
      var last = 0, m, linked = 0;
      while ((m = termPattern.exec(text)) !== null && linked < 4) {
        var term = termByLower[m[1].toLowerCase()];
        if (!term) continue;
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        var btn = el("button", "gterm", m[1]);
        btn.type = "button";
        btn.setAttribute("data-term", term.term);
        frag.appendChild(btn);
        last = m.index + m[0].length;
        linked++;
      }
      if (!linked) return;
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
  }

  var view = document.getElementById("view");
  var overall = document.getElementById("overall");
  var routeToken = 0;
  var homeState = { query: "", track: "all", hideDone: false };
  var moduleSearch = "";

  // ---------- progress ----------
  var progress = loadProgress();

  function loadProgress() {
    try {
      var p = JSON.parse(localStorage.getItem(PROGRESS_KEY));
      if (p && p.lessons && p.quiz) {
        p.tutorials = p.tutorials || {};
        p.tquiz = p.tquiz || {};
        return p;
      }
    } catch (e) { /* ignore corrupt storage */ }
    return { lessons: {}, quiz: {}, tutorials: {}, tquiz: {} };
  }

  function saveProgress() {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); } catch (e) { /* storage unavailable */ }
  }

  function lessonDone(id, idx) {
    return !!(progress.lessons[id] && progress.lessons[id][String(idx)]);
  }

  function doneCount(id, total) {
    var m = progress.lessons[id] || {};
    return Object.keys(m).filter(function (k) { return m[k] && Number(k) < total; }).length;
  }

  function lessonTotal(id) {
    return catalogById[id] ? catalogById[id].lessons : 0;
  }

  function moduleDone(id) {
    var total = lessonTotal(id);
    return total > 0 && doneCount(id, total) >= total;
  }

  function tutorialDone(id) { return !!progress.tutorials[id]; }

  function stepDone(step) {
    return step.kind === "tutorial" ? tutorialDone(step.id) : moduleDone(step.id);
  }

  function pathProgress(path) {
    var done = path.steps.filter(stepDone).length;
    return { done: done, total: path.steps.length };
  }

  function updateOverall() {
    var lessons = 0, done = 0, modules = 0;
    docs.forEach(function (d) {
      var total = lessonTotal(d.id);
      var k = doneCount(d.id, total);
      lessons += total;
      done += k;
      if (total && k >= total) modules++;
    });
    var tuts = tutorials.filter(function (t) { return tutorialDone(t.id); }).length;
    if (overall) {
      overall.textContent = modules + "/" + docs.length + " modules · " + done + "/" + lessons +
        " lessons · " + tuts + "/" + tutorials.length + " tutorials";
    }
  }

  // ---------- helpers ----------
  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  // Minimal inline formatting: **bold**, `code`, [text](#/route)
  function inline(s) {
    return esc(s)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\[([^\]]+)\]\((#\/[^)\s]+)\)/g, '<a href="$2">$1</a>');
  }

  function para(text, cls) {
    var p = el("p", cls);
    p.innerHTML = inline(text);
    return p;
  }

  function badge(track) { return el("span", "badge", trackName[track] || track); }

  function link(href, cls, text) {
    var a = el("a", cls, text);
    a.href = href;
    return a;
  }

  function meter(done, total) {
    var wrap = el("div", "meter");
    var bar = el("div", "meter-bar");
    var fill = el("span");
    fill.style.width = total ? Math.round((done / total) * 100) + "%" : "0%";
    bar.appendChild(fill);
    wrap.appendChild(bar);
    return wrap;
  }

  function moduleTitle(id) { return docById[id] ? docById[id].title : id; }

  function moduleMeta(id) {
    var g = guide[id] || {};
    var bits = [];
    if (g.level) bits.push(g.level);
    if (g.minutes) bits.push(g.minutes + " min");
    var c = catalogById[id];
    if (c) bits.push(c.lessons + " lessons");
    return bits.join(" · ");
  }

  function moduleObjectives(id) {
    var g = guide[id] || {};
    if (g.objectives && g.objectives.length) return g.objectives;
    return docById[id] ? docById[id].points : [];
  }

  function relatedTutorials(moduleId) {
    return tutorials.filter(function (t) {
      return (t.modules || []).indexOf(moduleId) !== -1;
    });
  }

  // ---------- module loading ----------
  var loading = {};
  function loadModule(id) {
    if (window.FIELD_GUIDE_MODULES && window.FIELD_GUIDE_MODULES[id]) {
      return Promise.resolve(window.FIELD_GUIDE_MODULES[id]);
    }
    if (loading[id]) return loading[id];
    loading[id] = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = "modules/" + id + ".js";
      s.onload = function () {
        var m = window.FIELD_GUIDE_MODULES && window.FIELD_GUIDE_MODULES[id];
        if (m) resolve(m);
        else reject(new Error("modules/" + id + ".js loaded but did not register the module."));
      };
      s.onerror = function () { reject(new Error("Could not load modules/" + id + ".js")); };
      document.head.appendChild(s);
    });
    return loading[id];
  }

  // ---------- block renderer ----------
  function renderBlocks(host, blocks) {
    (blocks || []).forEach(function (b) {
      if (b.type === "table") {
        if (b.caption) host.appendChild(el("p", "table-caption", b.caption));
        var wrap = el("div", "table-wrap");
        var table = el("table", "content-table");
        var thead = el("thead");
        var hrow = el("tr");
        (b.head || []).forEach(function (h) { hrow.appendChild(el("th", null, h)); });
        thead.appendChild(hrow);
        table.appendChild(thead);
        var tbody = el("tbody");
        (b.rows || []).forEach(function (row) {
          var tr = el("tr");
          row.forEach(function (cell) {
            var td = el("td");
            td.innerHTML = inline(cell);
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        wrap.appendChild(table);
        host.appendChild(wrap);
      } else if (b.type === "callout") {
        var box = el("aside", "callout " + (b.tone || "note"));
        if (b.title) box.appendChild(el("p", "callout-title", b.title));
        box.appendChild(para(b.t));
        host.appendChild(box);
      } else if (b.type === "steps") {
        var ol = el("ol", "steps");
        (b.items || []).forEach(function (item) {
          var li = el("li");
          li.innerHTML = inline(item);
          ol.appendChild(li);
        });
        host.appendChild(ol);
      } else if (b.type === "compare") {
        var grid = el("div", "compare");
        [b.left, b.right].forEach(function (side, i) {
          var col = el("div", "compare-col " + (i === 0 ? "do" : "avoid"));
          col.appendChild(el("h4", null, side.title));
          var ul = el("ul");
          (side.items || []).forEach(function (it) {
            var li = el("li");
            li.innerHTML = inline(it);
            ul.appendChild(li);
          });
          col.appendChild(ul);
          grid.appendChild(col);
        });
        host.appendChild(grid);
      } else if (b.type === "flow") {
        if (b.caption) host.appendChild(el("p", "table-caption", b.caption));
        var flow = el("div", "flow");
        (b.nodes || []).forEach(function (n, i) {
          var node = el("div", "flow-node");
          node.appendChild(el("span", "flow-label", n.label));
          if (n.sub) node.appendChild(el("span", "flow-sub", n.sub));
          if (i < b.nodes.length - 1) node.appendChild(el("span", "flow-arrow", "→"));
          flow.appendChild(node);
        });
        host.appendChild(flow);
      } else if (b.type === "exercise") {
        var ex = el("details", "exercise");
        ex.appendChild(el("summary", null, "Exercise: " + b.title));
        ex.appendChild(para(b.prompt));
        if (b.hint) {
          var hd = el("details", "hint");
          hd.appendChild(el("summary", null, "Hint"));
          hd.appendChild(para(b.hint));
          ex.appendChild(hd);
        }
        if (b.solution) {
          var sd = el("details", "solution");
          sd.appendChild(el("summary", null, "Worked answer"));
          sd.appendChild(para(b.solution));
          ex.appendChild(sd);
        }
        host.appendChild(ex);
      } else if (b.type === "checklist") {
        var cl = el("ul", "checklist");
        (b.items || []).forEach(function (it) {
          var li = el("li");
          li.innerHTML = inline(it);
          cl.appendChild(li);
        });
        host.appendChild(cl);
      } else if (b.h) {
        host.appendChild(el("h3", null, b.t));
      } else if (b.c) {
        var pre = el("pre", "code");
        var code = el("code", null, b.t);
        pre.appendChild(code);
        host.appendChild(pre);
      } else {
        host.appendChild(para(b.t));
      }
    });
  }

  // ---------- quiz (shared by modules and tutorials) ----------
  function renderQuiz(host, quiz, saved, onAnswer) {
    host.textContent = "";
    if (!quiz || !quiz.length) return;
    var answered = Object.keys(saved).length;
    var correct = Object.keys(saved).filter(function (k) { return saved[k].ok; }).length;

    var box = el("section", "quiz");
    box.appendChild(el("h3", null, "Check your understanding"));
    var scoreLine = el("p", "muted", answered
      ? "Score: " + correct + " of " + quiz.length + " correct"
      : "Pick the answer that fits. Every question explains the reasoning.");
    box.appendChild(scoreLine);
    if (answered) {
      var retake = el("button", "btn ghost small quiz-retake", "Retake quiz");
      retake.type = "button";
      retake.addEventListener("click", function () {
        Object.keys(saved).forEach(function (k) { delete saved[k]; });
        onAnswer();
        renderQuiz(host, quiz, saved, onAnswer);
      });
      box.appendChild(retake);
    }

    quiz.forEach(function (q, qi) {
      var item = el("div", "qitem");
      var prompt = el("p", "qprompt");
      prompt.innerHTML = inline(q.q);
      item.appendChild(prompt);

      var state = saved[String(qi)];
      var options = el("div", "options");
      q.o.forEach(function (opt) {
        var b = el("button", "option", opt);
        b.type = "button";
        if (state) {
          b.disabled = true;
          if (opt === q.a) b.classList.add("correct");
          if (opt === state.pick && !state.ok) b.classList.add("chosen-wrong");
        }
        b.addEventListener("click", function () {
          if (saved[String(qi)]) return;
          saved[String(qi)] = { pick: opt, ok: opt === q.a };
          onAnswer();
          renderQuiz(host, quiz, saved, onAnswer);
        });
        options.appendChild(b);
      });
      item.appendChild(options);

      if (state) {
        item.appendChild(el("p", state.ok ? "feedback good" : "feedback bad",
          state.ok ? "Correct." : "Not quite. The answer is “" + q.a + "”."));
        if (q.why) item.appendChild(para(q.why, "feedback-why"));
      }
      box.appendChild(item);
    });
    host.appendChild(box);
  }

  // ---------- home ----------
  function matchesHome(d) {
    if (homeState.track !== "all" && d.track !== homeState.track) return false;
    var total = lessonTotal(d.id);
    if (homeState.hideDone && total && doneCount(d.id, total) >= total) return false;
    if (!homeState.query) return true;
    var hay = [d.title, d.summary, trackName[d.track], d.tags.join(" "), d.points.join(" ")].join(" ").toLowerCase();
    return homeState.query.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
  }

  function moduleCard(d) {
    var total = lessonTotal(d.id);
    var done = doneCount(d.id, total);
    var card = el("article", "card" + (total && done >= total ? " is-done" : ""));
    var h2 = el("h2");
    h2.appendChild(link("#/module/" + d.id, null, d.title));
    card.appendChild(h2);
    card.appendChild(el("p", "summary", d.summary));
    card.appendChild(el("p", "stats", moduleMeta(d.id) + " · " + done + " of " + total + " done"));
    card.appendChild(meter(done, total));
    var tags = el("div", "tags");
    d.tags.slice(0, 4).forEach(function (t) { tags.appendChild(el("span", "tag", t)); });
    card.appendChild(tags);
    var foot = el("div", "card-foot");
    foot.appendChild(badge(d.track));
    foot.appendChild(link("#/module/" + d.id, "btn small", done ? "Continue" : "Start"));
    card.appendChild(foot);
    return card;
  }

  function pathCard(p) {
    var pr = pathProgress(p);
    var card = el("article", "card path-card" + (pr.done === pr.total ? " is-done" : ""));
    card.appendChild(el("p", "kicker", p.level + " · " + p.hours + " hours · " + pr.total + " steps"));
    var h2 = el("h2");
    h2.appendChild(link("#/path/" + p.id, null, p.name));
    card.appendChild(h2);
    card.appendChild(el("p", "summary", p.tagline));
    card.appendChild(meter(pr.done, pr.total));
    card.appendChild(el("p", "stats", pr.done + " of " + pr.total + " steps complete"));
    var foot = el("div", "card-foot");
    foot.appendChild(el("span", "tag", p.hours + " hours"));
    foot.appendChild(link("#/path/" + p.id, "btn small", pr.done ? (pr.done === pr.total ? "Review" : "Continue") : "Start path"));
    card.appendChild(foot);
    return card;
  }

  function tutorialCard(t) {
    var card = el("article", "card tutorial-card" + (tutorialDone(t.id) ? " is-done" : ""));
    card.appendChild(el("p", "kicker", t.level + " · " + t.minutes + " min · " + (t.modules || []).length + " sources"));
    var h2 = el("h2");
    h2.appendChild(link("#/tutorial/" + t.id, null, t.title));
    card.appendChild(h2);
    card.appendChild(el("p", "summary", t.subtitle));
    var foot = el("div", "card-foot");
    foot.appendChild(badge(t.track));
    foot.appendChild(link("#/tutorial/" + t.id, "btn small", tutorialDone(t.id) ? "Review" : "Open"));
    card.appendChild(foot);
    return card;
  }

  function firstIncompleteStep(path) {
    for (var i = 0; i < path.steps.length; i++) {
      if (!stepDone(path.steps[i])) return path.steps[i];
    }
    return path.steps[0];
  }

  function stepHref(step) {
    return step.kind === "tutorial" ? "#/tutorial/" + step.id : "#/module/" + step.id;
  }

  function continueTarget() {
    var last = progress.last;
    if (last && last.kind === "module" && docById[last.id] && !moduleDone(last.id)) {
      return { href: "#/module/" + last.id + "/" + (last.idx || 0), label: "Module · " + moduleTitle(last.id) };
    }
    if (last && last.kind === "tutorial" && tutorialById[last.id]) {
      return { href: "#/tutorial/" + last.id, label: "Tutorial · " + tutorialById[last.id].title };
    }
    var p = pathById["foundations"] || paths[0];
    if (p) {
      var s = firstIncompleteStep(p);
      return { href: stepHref(s), label: p.name + " · " + (s.kind === "tutorial" ? tutorialById[s.id].title : moduleTitle(s.id)) };
    }
    return { href: "#/module/ch11", label: "System Design Primer" };
  }

  function statTile(n, label) {
    var tile = el("div", "stat");
    tile.appendChild(el("span", "stat-num", String(n)));
    tile.appendChild(el("span", "stat-label", label));
    return tile;
  }

  function showHome() {
    routeToken++;
    view.textContent = "";
    updateOverall();

    var completedLessons = 0, totalLessons = 0;
    docs.forEach(function (d) {
      totalLessons += lessonTotal(d.id);
      completedLessons += doneCount(d.id, lessonTotal(d.id));
    });

    // hero
    var start = continueTarget();
    var pct = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

    var hero = el("section", "hero");
    var heroGrid = el("div", "hero-grid");

    var copy = el("div", "hero-copy");
    copy.appendChild(el("p", "kicker", "Self-paced field guide"));
    copy.appendChild(el("h1", null, "Learn software architecture by reasoning about trade-offs"));
    copy.appendChild(el("p", "hero-sub", "Six guided paths, ten hands-on tutorials with worked examples, and a reference library of " + docs.length + " source modules. Progress is saved in this browser."));
    var heroActions = el("div", "hero-actions");
    heroActions.appendChild(link(start.href, "btn", "Continue learning"));
    heroActions.appendChild(link("#/paths", "btn ghost", "Browse paths"));
    copy.appendChild(heroActions);
    copy.appendChild(el("p", "hero-note", "Next up: " + start.label));
    heroGrid.appendChild(copy);

    var panel = el("aside", "hero-panel");
    panel.appendChild(el("p", "hero-panel-label", "Overall progress"));
    var prow = el("div", "hero-progress");
    var ring = el("div", "ring");
    ring.style.setProperty("--pct", String(pct));
    ring.appendChild(el("span", null, pct + "%"));
    prow.appendChild(ring);
    var ptext = el("div");
    ptext.appendChild(el("strong", null, completedLessons + " of " + totalLessons));
    ptext.appendChild(el("p", null, "lessons complete"));
    prow.appendChild(ptext);
    panel.appendChild(prow);
    panel.appendChild(el("div", "hero-divider"));
    panel.appendChild(el("p", "hero-panel-label", "Next up"));
    panel.appendChild(el("p", "hero-next", start.label));
    panel.appendChild(link(start.href, "btn small", "Resume"));
    heroGrid.appendChild(panel);

    hero.appendChild(heroGrid);
    view.appendChild(hero);

    // stats
    var stats = el("section", "stat-grid");
    stats.appendChild(statTile(paths.length, "learning paths"));
    stats.appendChild(statTile(tutorials.length, "tutorials"));
    stats.appendChild(statTile(totalLessons, "reference lessons"));
    stats.appendChild(statTile(glossary.length, "glossary terms"));
    stats.appendChild(statTile(completedLessons, "lessons completed"));
    view.appendChild(stats);

    // paths
    view.appendChild(sectionHead("Learning paths", "An ordered route with a reason for every step. Start with Foundations if you are new.", "#/paths", "All paths"));
    var pathGrid = el("section", "grid paths-grid");
    paths.slice(0, 3).forEach(function (p) { pathGrid.appendChild(pathCard(p)); });
    view.appendChild(pathGrid);

    // tutorials
    view.appendChild(sectionHead("Hands-on tutorials", "Original explainers with worked numbers, code, exercises and explained answers.", "#/tutorials", "All tutorials"));
    var tutGrid = el("section", "grid tut-grid");
    tutorials.slice(0, 3).forEach(function (t) { tutGrid.appendChild(tutorialCard(t)); });
    view.appendChild(tutGrid);

    // library
    view.appendChild(sectionHead("Reference library", "Extracted text from the source PDFs, one module per document. Use these as the long-form reference behind each tutorial.", null, null));

    var tools = el("section", "toolbar");
    var search = el("input");
    search.type = "search";
    search.placeholder = "Search modules, tags or key points…";
    search.value = homeState.query;
    search.setAttribute("aria-label", "Search modules");
    search.addEventListener("input", function () {
      homeState.query = search.value.trim().toLowerCase();
      paint();
    });
    tools.appendChild(search);

    var chips = el("div", "chips");
    var all = [{ id: "all", name: "All" }].concat(LIBRARY.tracks);
    all.forEach(function (t) {
      var count = t.id === "all" ? docs.length : docs.filter(function (d) { return d.track === t.id; }).length;
      var b = el("button", "chip", t.name + " ");
      b.type = "button";
      b.setAttribute("aria-pressed", String(homeState.track === t.id));
      b.appendChild(el("span", "count", String(count)));
      b.addEventListener("click", function () {
        homeState.track = t.id;
        Array.prototype.forEach.call(chips.children, function (c) {
          c.setAttribute("aria-pressed", String(c === b));
        });
        paint();
      });
      chips.appendChild(b);
    });
    tools.appendChild(chips);

    var row = el("div", "toolbar-row");
    var label = el("label", "toggle");
    var cb = el("input");
    cb.type = "checkbox";
    cb.checked = homeState.hideDone;
    cb.addEventListener("change", function () { homeState.hideDone = cb.checked; paint(); });
    label.appendChild(cb);
    label.appendChild(document.createTextNode(" Hide completed modules"));
    row.appendChild(label);
    tools.appendChild(row);
    view.appendChild(tools);

    var count = el("p", "result-count");
    var grid = el("section", "grid");
    var empty = el("p", "empty", "No modules match. Try another search or track.");
    empty.hidden = true;
    view.appendChild(count);
    view.appendChild(grid);
    view.appendChild(empty);

    function paint() {
      grid.textContent = "";
      var list = docs.filter(matchesHome);
      list.forEach(function (d) { grid.appendChild(moduleCard(d)); });
      empty.hidden = list.length > 0;
      count.textContent = list.length + (list.length === 1 ? " module" : " modules");
    }
    paint();
  }

  function sectionHead(title, sub, href, linkText) {
    var head = el("div", "section-head");
    var text = el("div");
    text.appendChild(el("h2", null, title));
    if (sub) text.appendChild(el("p", "muted", sub));
    head.appendChild(text);
    if (href) head.appendChild(link(href, "link-more", linkText + " →"));
    return head;
  }

  // ---------- paths ----------
  function showPaths() {
    routeToken++;
    view.textContent = "";
    updateOverall();
    view.appendChild(el("h1", null, "Learning paths"));
    view.appendChild(el("p", "muted", "Each path orders modules and tutorials so that every idea is introduced before it is used. You can start anywhere, but the order is deliberate."));
    var grid = el("section", "grid paths-grid");
    paths.forEach(function (p) { grid.appendChild(pathCard(p)); });
    view.appendChild(grid);
  }

  function showPath(id) {
    routeToken++;
    var p = pathById[id];
    view.textContent = "";
    updateOverall();
    if (!p) { view.appendChild(el("p", "error", "Unknown path.")); return; }

    view.appendChild(link("#/paths", "crumb", "← All paths"));
    var head = el("header", "module-head path-head");
    head.appendChild(el("p", "kicker", p.level + " · about " + p.hours + " hours · " + p.steps.length + " steps"));
    head.appendChild(el("h1", null, p.name));
    head.appendChild(el("p", "summary", p.description));

    var pr = pathProgress(p);
    head.appendChild(el("p", "muted", pr.done + " of " + p.steps.length + " steps complete"));
    head.appendChild(meter(pr.done, p.steps.length));

    var outs = el("div", "outcomes");
    outs.appendChild(el("h3", null, "By the end you can"));
    var ul = el("ul");
    p.outcomes.forEach(function (o) { ul.appendChild(el("li", null, o)); });
    outs.appendChild(ul);
    head.appendChild(outs);

    var actions = el("div", "hero-actions");
    var next = firstIncompleteStep(p);
    actions.appendChild(link(stepHref(next), "btn", pr.done ? "Continue path" : "Start path"));
    head.appendChild(actions);
    view.appendChild(head);

    var list = el("ol", "step-list");
    p.steps.forEach(function (step, i) {
      var done = stepDone(step);
      var li = el("li", "step" + (done ? " is-done" : ""));
      var num = el("span", "step-num", done ? "✓" : String(i + 1));
      li.appendChild(num);
      var body = el("div", "step-body");
      var titleRow = el("div", "step-title");
      titleRow.appendChild(link(stepHref(step), null,
        step.kind === "tutorial" ? tutorialById[step.id].title : moduleTitle(step.id)));
      titleRow.appendChild(el("span", "tag", step.kind === "tutorial" ? "Tutorial" : "Reference"));
      body.appendChild(titleRow);
      body.appendChild(el("p", "step-why", step.why));
      if (step.kind === "tutorial") {
        var t = tutorialById[step.id];
        if (t) body.appendChild(el("p", "muted small", t.level + " · " + t.minutes + " min"));
      } else {
        body.appendChild(el("p", "muted small", moduleMeta(step.id)));
      }
      li.appendChild(body);
      list.appendChild(li);
    });
    view.appendChild(list);
  }

  // ---------- module ----------
  function showModule(id, requestedIdx) {
    var token = ++routeToken;
    view.textContent = "";
    view.appendChild(el("p", "loading", "Loading module…"));
    loadModule(id).then(function (mod) {
      if (token !== routeToken) return;
      renderModule(id, mod, requestedIdx);
    }).catch(function (err) {
      if (token !== routeToken) return;
      view.textContent = "";
      view.appendChild(el("p", "error", err.message));
    });
  }

  function renderModule(id, mod, requestedIdx) {
    var doc = docById[id];
    var lessons = mod.lessons;
    var idx = Math.min(Math.max(0, requestedIdx || 0), lessons.length - 1);
    view.textContent = "";
    updateOverall();

    progress.last = { kind: "module", id: id, idx: idx, at: Date.now() };
    saveProgress();

    view.appendChild(link("#/", "crumb", "← All modules"));

    var head = el("header", "module-head");
    var top = el("div", "module-top");
    top.appendChild(badge(doc.track));
    top.appendChild(el("span", "muted", moduleMeta(id)));
    head.appendChild(top);
    head.appendChild(el("h1", null, doc.title));
    head.appendChild(el("p", "summary", doc.summary));

    var progressLine = el("div", "module-progress");
    var progressText = el("p", "muted");
    progressLine.appendChild(progressText);
    var progressMeter = meter(0, lessons.length);
    progressLine.appendChild(progressMeter);
    head.appendChild(progressLine);

    var g = guide[id] || {};
    var outs = el("details", "takeaways");
    outs.appendChild(el("summary", null, "What you should be able to do"));
    var pts = el("ul");
    moduleObjectives(id).forEach(function (p) { pts.appendChild(el("li", null, p)); });
    outs.appendChild(pts);
    head.appendChild(outs);

    if (g.prereqs && g.prereqs.length) {
      var pre = el("p", "prereqs");
      pre.appendChild(el("span", "muted", "Read first: "));
      g.prereqs.forEach(function (pid, i) {
        if (i) pre.appendChild(document.createTextNode(", "));
        pre.appendChild(link("#/module/" + pid, null, moduleTitle(pid)));
      });
      head.appendChild(pre);
    }

    var tuts = relatedTutorials(id);
    if (tuts.length) {
      var tl = el("div", "related");
      tl.appendChild(el("span", "muted", "Practise with: "));
      tuts.forEach(function (t, i) {
        if (i) tl.appendChild(document.createTextNode(" · "));
        tl.appendChild(link("#/tutorial/" + t.id, null, t.title));
      });
      head.appendChild(tl);
    }

    var meta = el("div", "module-meta");
    var pdf = link(encodeURI(doc.source), "btn ghost small", "Open original PDF");
    pdf.target = "_blank";
    pdf.rel = "noopener";
    meta.appendChild(pdf);
    doc.tags.forEach(function (t) { meta.appendChild(el("span", "tag", t)); });
    head.appendChild(meta);
    head.appendChild(el("p", "provenance", "Reference text extracted from the source PDF. For an authored explanation, use the related tutorial."));

    var figs = (window.FIELD_GUIDE_FIGURES && window.FIELD_GUIDE_FIGURES[id]) || [];
    if (figs.length) {
      var figsBox = el("details", "figures");
      figsBox.appendChild(el("summary", null, "Figures from the source document (" + figs.length + ")"));
      var figGrid = el("div", "fig-grid");
      figs.forEach(function (f, i) {
        var thumb = el("button", "fig-thumb");
        thumb.type = "button";
        thumb.setAttribute("aria-label", "Enlarge figure " + figLabel(f));
        var img = el("img");
        img.src = "modules/media/" + id + "/" + encodeURIComponent(f);
        img.alt = figLabel(f);
        img.loading = "lazy";
        thumb.appendChild(img);
        thumb.appendChild(el("span", "fig-cap", figLabel(f)));
        thumb.addEventListener("click", function () { openLightbox(id, doc.title, figs, i); });
        figGrid.appendChild(thumb);
      });
      figsBox.appendChild(figGrid);
      head.appendChild(figsBox);
    }

    view.appendChild(head);

    var layout = el("div", "module-layout");
    var aside = el("aside", "lesson-nav");
    var findLabel = el("label", "visually-hidden", "Find in this module");
    var find = el("input", "find");
    find.type = "search";
    find.placeholder = "Find in this module…";
    find.value = moduleSearch;
    findLabel.appendChild(find);
    aside.appendChild(findLabel);
    var navList = el("ol", "nav-list");
    aside.appendChild(navList);
    layout.appendChild(aside);

    var article = el("article", "lesson");
    var lessonHost = el("div");
    article.appendChild(lessonHost);
    layout.appendChild(article);
    view.appendChild(layout);

    function paintProgress() {
      var done = doneCount(id, lessons.length);
      progressText.textContent = done + " of " + lessons.length + " lessons complete";
      var fresh = meter(done, lessons.length);
      progressMeter.replaceWith(fresh);
      progressMeter = fresh;
      updateOverall();
    }

    function paintNav() {
      navList.textContent = "";
      var q = moduleSearch.trim().toLowerCase();
      var shown = 0;
      lessons.forEach(function (lesson, i) {
        var text = lesson.blocks.map(function (b) { return b.t; }).join(" ");
        var hit = "";
        if (q) {
          var at = (lesson.title + " " + text).toLowerCase().indexOf(q);
          if (at === -1) return;
          var haystack = lesson.title + " " + text;
          hit = haystack.substr(Math.max(0, at - 50), 120);
        }
        shown++;
        var li = el("li");
        var a = el("a", i === idx ? "current" : null);
        a.href = "#/module/" + id + "/" + i;
        if (i === idx) a.setAttribute("aria-current", "true");
        a.appendChild(el("span", "nav-num", String(i + 1)));
        a.appendChild(el("span", "nav-title", lesson.title));
        if (lessonDone(id, i)) a.appendChild(el("span", "nav-done", "✓"));
        if (hit) a.appendChild(el("span", "nav-hit", "…" + hit + "…"));
        li.appendChild(a);
        navList.appendChild(li);
      });
      if (q && shown === 0) navList.appendChild(el("li", "muted", "No lessons contain “" + moduleSearch + "”."));
    }

    find.addEventListener("input", function () {
      moduleSearch = find.value;
      paintNav();
    });

    function paintLesson() {
      lessonHost.textContent = "";
      var lesson = lessons[idx];
      var done = lessonDone(id, idx);

      lessonHost.appendChild(el("p", "muted", "Lesson " + (idx + 1) + " of " + lessons.length));
      lessonHost.appendChild(el("h2", null, lesson.title));

      lesson.blocks.forEach(function (b) {
        if (b.h) lessonHost.appendChild(el("h3", null, b.t));
        else if (b.c) {
          var pre = el("pre", "code");
          pre.appendChild(el("code", null, b.t));
          lessonHost.appendChild(pre);
        } else lessonHost.appendChild(el("p", null, b.t));
      });

      linkTerms(lessonHost);

      var quizHost = el("div");
      lessonHost.appendChild(quizHost);
      if (lesson.quiz && lesson.quiz.length) {
        progress.quiz[id] = progress.quiz[id] || {};
        progress.quiz[id][String(idx)] = progress.quiz[id][String(idx)] || {};
        var saved = progress.quiz[id][String(idx)];
        renderQuiz(quizHost, lesson.quiz, saved, saveProgress);
      }

      var controls = el("footer", "lesson-controls");
      var prev = link(idx > 0 ? "#/module/" + id + "/" + (idx - 1) : "#", "btn ghost", "← Previous");
      var next = link(idx < lessons.length - 1 ? "#/module/" + id + "/" + (idx + 1) : "#", "btn ghost", "Next →");
      if (idx === 0) prev.setAttribute("aria-disabled", "true");
      if (idx === lessons.length - 1) next.setAttribute("aria-disabled", "true");

      var toggle = el("button", "btn" + (done ? " done" : ""), done ? "✓ Completed" : "Mark lesson complete");
      toggle.type = "button";
      toggle.setAttribute("aria-pressed", String(done));
      toggle.addEventListener("click", function () {
        progress.lessons[id] = progress.lessons[id] || {};
        if (lessonDone(id, idx)) delete progress.lessons[id][String(idx)];
        else progress.lessons[id][String(idx)] = true;
        saveProgress();
        paintLesson();
        paintNav();
        paintProgress();
      });

      controls.appendChild(prev);
      controls.appendChild(toggle);
      controls.appendChild(next);
      lessonHost.appendChild(controls);

      // module navigation
      var pos = -1;
      docs.forEach(function (d, i) { if (d.id === id) pos = i; });
      var modNav = el("nav", "module-nav");
      if (pos > 0) {
        var pv = docById[docs[pos - 1].id];
        modNav.appendChild(link("#/module/" + pv.id, "module-nav-link prev", "← " + pv.title));
      }
      if (pos > -1 && pos < docs.length - 1) {
        var nx = docById[docs[pos + 1].id];
        modNav.appendChild(link("#/module/" + nx.id, "module-nav-link next", nx.title + " →"));
      }
      lessonHost.appendChild(modNav);
    }

    paintLesson();
    paintNav();
    paintProgress();
    window.scrollTo(0, 0);
  }

  // ---------- tutorials ----------
  function showTutorials() {
    routeToken++;
    view.textContent = "";
    updateOverall();
    view.appendChild(el("h1", null, "Hands-on tutorials"));
    view.appendChild(el("p", "muted", "Original tutorials written for this guide. Each one states its outcomes, works through real numbers, and ends with exercises and explained questions. The reference modules are listed so you can go deeper."));
    var grid = el("section", "grid tut-grid");
    tutorials.forEach(function (t) { grid.appendChild(tutorialCard(t)); });
    view.appendChild(grid);
  }

  function showTutorial(id) {
    routeToken++;
    var t = tutorialById[id];
    view.textContent = "";
    updateOverall();
    if (!t) { view.appendChild(el("p", "error", "Unknown tutorial.")); return; }

    progress.last = { kind: "tutorial", id: id, at: Date.now() };
    saveProgress();

    view.appendChild(link("#/tutorials", "crumb", "← All tutorials"));

    var head = el("header", "module-head tut-head");
    var top = el("div", "module-top");
    top.appendChild(badge(t.track));
    top.appendChild(el("span", "muted", t.level + " · " + t.minutes + " min"));
    if (tutorialDone(id)) top.appendChild(el("span", "done-pill", "✓ Completed"));
    head.appendChild(top);
    head.appendChild(el("h1", null, t.title));
    head.appendChild(el("p", "summary", t.subtitle));

    var outs = el("div", "outcomes");
    outs.appendChild(el("h3", null, "You will learn to"));
    var ul = el("ul");
    t.outcomes.forEach(function (o) { ul.appendChild(el("li", null, o)); });
    outs.appendChild(ul);
    head.appendChild(outs);

    if (t.modules && t.modules.length) {
      var src = el("p", "prereqs");
      src.appendChild(el("span", "muted", "Companion references: "));
      t.modules.forEach(function (mid, i) {
        if (i) src.appendChild(document.createTextNode(", "));
        src.appendChild(link("#/module/" + mid, null, moduleTitle(mid)));
      });
      head.appendChild(src);
    }
    view.appendChild(head);

    var article = el("article", "lesson tutorial-body");
    renderBlocks(article, t.blocks);
    linkTerms(article);

    if (t.quiz && t.quiz.length) {
      progress.tquiz[id] = progress.tquiz[id] || {};
      var qhost = el("div");
      article.appendChild(qhost);
      renderQuiz(qhost, t.quiz, progress.tquiz[id], saveProgress);
    }

    var controls = el("footer", "lesson-controls");
    var done = tutorialDone(id);
    var toggle = el("button", "btn" + (done ? " done" : ""), done ? "✓ Tutorial complete" : "Mark tutorial complete");
    toggle.type = "button";
    toggle.addEventListener("click", function () {
      if (tutorialDone(id)) delete progress.tutorials[id];
      else progress.tutorials[id] = true;
      saveProgress();
      showTutorial(id);
    });
    controls.appendChild(toggle);
    article.appendChild(controls);

    var index = -1;
    tutorials.forEach(function (x, i) { if (x.id === id) index = i; });
    var tnav = el("nav", "module-nav");
    if (index > 0) {
      tnav.appendChild(link("#/tutorial/" + tutorials[index - 1].id, "module-nav-link prev", "← " + tutorials[index - 1].title));
    }
    if (index > -1 && index < tutorials.length - 1) {
      tnav.appendChild(link("#/tutorial/" + tutorials[index + 1].id, "module-nav-link next", tutorials[index + 1].title + " →"));
    }
    article.appendChild(tnav);
    view.appendChild(article);
    window.scrollTo(0, 0);
  }

  // ---------- glossary ----------
  var glossaryState = { query: "", cat: "all" };

  function showGlossary() {
    routeToken++;
    view.textContent = "";
    updateOverall();
    view.appendChild(el("h1", null, "Glossary"));
    view.appendChild(el("p", "muted", "Every term the library relies on, defined in a sentence or two, with links to where it is taught."));

    var tools = el("section", "toolbar");
    var search = el("input");
    search.type = "search";
    search.placeholder = "Search terms and definitions…";
    search.value = glossaryState.query;
    search.setAttribute("aria-label", "Search glossary");
    tools.appendChild(search);

    var cats = ["all"];
    glossary.forEach(function (g) { if (cats.indexOf(g.cat) === -1) cats.push(g.cat); });
    cats.sort(function (a, b) { return a === "all" ? -1 : b === "all" ? 1 : a.localeCompare(b); });
    var chips = el("div", "chips");
    cats.forEach(function (cat) {
      var b = el("button", "chip", cat === "all" ? "All" : cat);
      b.type = "button";
      b.setAttribute("aria-pressed", String(glossaryState.cat === cat));
      b.addEventListener("click", function () {
        glossaryState.cat = cat;
        Array.prototype.forEach.call(chips.children, function (c) { c.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        paint();
      });
      chips.appendChild(b);
    });
    tools.appendChild(chips);
    view.appendChild(tools);

    var count = el("p", "result-count");
    var host = el("div", "glossary");
    view.appendChild(count);
    view.appendChild(host);

    function matches(g) {
      if (glossaryState.cat !== "all" && g.cat !== glossaryState.cat) return false;
      if (!glossaryState.query) return true;
      var hay = (g.term + " " + g.def + " " + (g.see || []).map(moduleTitle).join(" ")).toLowerCase();
      return glossaryState.query.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
    }

    function paint() {
      host.textContent = "";
      var list = glossary.filter(matches).slice().sort(function (a, b) { return a.term.localeCompare(b.term); });
      count.textContent = list.length + (list.length === 1 ? " term" : " terms");
      var letter = "";
      list.forEach(function (g) {
        var l = g.term[0].toUpperCase();
        if (l !== letter) {
          letter = l;
          host.appendChild(el("p", "glossary-letter", l));
        }
        var row = el("div", "gloss-row");
        var headRow = el("div", "gloss-head");
        headRow.appendChild(el("h3", null, g.term));
        headRow.appendChild(el("span", "tag", g.cat));
        row.appendChild(headRow);
        row.appendChild(el("p", "gloss-def", g.def));
        var see = el("p", "gloss-see");
        (g.see || []).forEach(function (mid, i) {
          if (i) see.appendChild(document.createTextNode(" · "));
          see.appendChild(link("#/module/" + mid, null, moduleTitle(mid)));
        });
        if (g.tut && g.tut.length) {
          see.appendChild(document.createTextNode("  ·  Tutorial: "));
          g.tut.forEach(function (tid, i) {
            if (i) see.appendChild(document.createTextNode(", "));
            var t = tutorialById[tid];
            see.appendChild(link("#/tutorial/" + tid, null, t ? t.title : tid));
          });
        }
        if (see.childNodes.length) row.appendChild(see);
        host.appendChild(row);
      });
    }

    search.addEventListener("input", function () {
      glossaryState.query = search.value.trim().toLowerCase();
      paint();
    });
    paint();
  }

  // ---------- search ----------
  function showSearch(q) {
    routeToken++;
    view.textContent = "";
    updateOverall();
    view.appendChild(el("h1", null, "Search"));
    view.appendChild(el("p", "muted", q ? "Results for “" + q + "”" : "Type in the quick find box above."));
    if (!q) return;
    var needle = q.toLowerCase();

    function hit(text) { return String(text).toLowerCase().indexOf(needle) !== -1; }

    var mods = docs.filter(function (d) {
      return [d.title, d.summary, d.tags.join(" "), d.points.join(" ")].join(" ").toLowerCase().indexOf(needle) !== -1;
    });
    var tuts = tutorials.filter(function (t) {
      var text = [t.title, t.subtitle, t.outcomes.join(" ")].concat(t.blocks.map(function (b) {
        return [b.t || "", b.title || ""].join(" ");
      })).join(" ");
      return hit(text);
    });
    var terms = glossary.filter(function (g) { return hit(g.term + " " + g.def); });

    if (!mods.length && !tuts.length && !terms.length) {
      view.appendChild(el("p", "empty", "Nothing matched. Try a shorter term."));
      return;
    }

    if (tuts.length) {
      view.appendChild(el("h2", "search-group", "Tutorials (" + tuts.length + ")"));
      var g1 = el("section", "grid tut-grid");
      tuts.forEach(function (t) { g1.appendChild(tutorialCard(t)); });
      view.appendChild(g1);
    }
    if (terms.length) {
      view.appendChild(el("h2", "search-group", "Glossary (" + terms.length + ")"));
      var list = el("div", "glossary compact");
      terms.forEach(function (g) {
        var row = el("div", "gloss-row");
        row.appendChild(el("h3", null, g.term));
        row.appendChild(el("p", "gloss-def", g.def));
        list.appendChild(row);
      });
      view.appendChild(list);
    }
    if (mods.length) {
      view.appendChild(el("h2", "search-group", "Modules (" + mods.length + ")"));
      var g2 = el("section", "grid");
      mods.forEach(function (d) { g2.appendChild(moduleCard(d)); });
      view.appendChild(g2);
    }
  }

  // ---------- term popover ----------
  var termPop = el("div", "term-pop");
  termPop.hidden = true;
  termPop.setAttribute("role", "tooltip");
  var popHideTimer = null;

  function showTermPop(btn) {
    var g = termByLower[(btn.getAttribute("data-term") || "").toLowerCase()];
    if (!g) return;
    termPop.textContent = "";
    termPop.appendChild(el("p", "term-pop-term", g.term));
    termPop.appendChild(el("p", "term-pop-def", g.def));
    var foot = el("p", "term-pop-foot");
    foot.appendChild(el("span", "tag", g.cat || ""));
    foot.appendChild(link("#/glossary", "term-pop-link", "Glossary →"));
    termPop.appendChild(foot);
    termPop.hidden = false;
    var r = btn.getBoundingClientRect();
    var w = termPop.offsetWidth, h = termPop.offsetHeight;
    var left = Math.min(Math.max(10, r.left + r.width / 2 - w / 2), window.innerWidth - w - 10);
    var top = r.bottom + 8;
    if (top + h > window.innerHeight - 10) top = Math.max(10, r.top - h - 8);
    termPop.style.left = left + "px";
    termPop.style.top = top + "px";
  }

  function hideTermPop() { termPop.hidden = true; }
  function scheduleHide() { clearTimeout(popHideTimer); popHideTimer = setTimeout(hideTermPop, 180); }
  function cancelHide() { clearTimeout(popHideTimer); }

  document.body.appendChild(termPop);
  document.addEventListener("mouseover", function (e) {
    if (!e.target.closest) return;
    var btn = e.target.closest(".gterm");
    if (btn) { cancelHide(); showTermPop(btn); }
    else if (!termPop.hidden && !e.target.closest(".term-pop")) scheduleHide();
  });
  document.addEventListener("mouseout", function (e) {
    if (e.target.closest && e.target.closest(".gterm")) scheduleHide();
  });
  document.addEventListener("focusin", function (e) {
    if (e.target.closest && e.target.closest(".gterm")) { cancelHide(); showTermPop(e.target.closest(".gterm")); }
  });
  document.addEventListener("focusout", function (e) {
    if (e.target.closest && e.target.closest(".gterm")) scheduleHide();
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest) return;
    var btn = e.target.closest(".gterm");
    if (btn) { cancelHide(); showTermPop(btn); }
    else if (!e.target.closest(".term-pop")) hideTermPop();
  });
  window.addEventListener("scroll", hideTermPop, { passive: true });
  window.addEventListener("resize", hideTermPop);

  // ---------- figure lightbox ----------
  var lb = el("div", "lightbox");
  lb.hidden = true;
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-label", "Figure viewer");
  var lbImg = el("img");
  lbImg.alt = "";
  var lbCap = el("p", "lb-cap");
  var lbFig = el("figure");
  lbFig.appendChild(lbImg);
  lbFig.appendChild(lbCap);
  var lbPrev = el("button", "lb-btn lb-prev", "‹");
  var lbNext = el("button", "lb-btn lb-next", "›");
  var lbClose = el("button", "lb-btn lb-close", "×");
  lbPrev.type = lbNext.type = lbClose.type = "button";
  lb.appendChild(lbPrev);
  lb.appendChild(lbFig);
  lb.appendChild(lbNext);
  lb.appendChild(lbClose);
  document.body.appendChild(lb);

  var lbModule = "", lbFiles = [], lbIdx = 0, lbTitle = "";

  function figLabel(name) {
    var m = String(name).match(/^p(\d+)-(\d+)/);
    return m ? "p. " + Number(m[1]) + " · figure " + Number(m[2]) : String(name).replace(/\.png$/, "");
  }

  function paintLb() {
    var f = lbFiles[lbIdx];
    if (!f) return;
    lbImg.src = "modules/media/" + lbModule + "/" + encodeURIComponent(f);
    lbImg.alt = figLabel(f);
    lbCap.textContent = (lbTitle ? lbTitle + " — " : "") + figLabel(f) + " (" + (lbIdx + 1) + " of " + lbFiles.length + ")";
  }

  function openLightbox(moduleId, title, files, index) {
    lbModule = moduleId;
    lbTitle = title || "";
    lbFiles = files;
    lbIdx = index;
    paintLb();
    lb.hidden = false;
    lbClose.focus();
  }

  function closeLightbox() { lb.hidden = true; }
  function stepLb(d) { lbIdx = (lbIdx + d + lbFiles.length) % lbFiles.length; paintLb(); }

  lbClose.addEventListener("click", closeLightbox);
  lbPrev.addEventListener("click", function () { stepLb(-1); });
  lbNext.addEventListener("click", function () { stepLb(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });

  // ---------- flashcards (spaced repetition over the glossary) ----------
  var CARDS_KEY = "fieldguide-cards-v1";
  var CARD_INTERVALS = [10 * 60000, 86400000, 3 * 86400000, 7 * 86400000, 16 * 86400000, 35 * 86400000];
  var cardState = loadCards();
  var cardsView = { cat: "all", practiceAll: false, queue: [], current: null, revealed: false };

  function loadCards() {
    try {
      var c = JSON.parse(localStorage.getItem(CARDS_KEY));
      if (c && typeof c === "object") return c;
    } catch (e) { /* ignore corrupt storage */ }
    return {};
  }

  function saveCards() {
    try { localStorage.setItem(CARDS_KEY, JSON.stringify(cardState)); } catch (e) { /* storage unavailable */ }
  }

  function cardRec(term) {
    if (!cardState[term]) cardState[term] = { box: 0, due: 0 };
    return cardState[term];
  }

  var cardLabels = ["Again", "Good", "Easy"];

  function answerCard(kind) {
    var g = cardsView.current;
    if (!g || !cardsView.revealed) return;
    var rec = cardRec(g.term);
    if (kind === 0) rec.box = 0;
    else rec.box = Math.min(rec.box + kind, CARD_INTERVALS.length - 1);
    rec.due = Date.now() + CARD_INTERVALS[rec.box];
    saveCards();
    cardsView.queue.shift();
    cardsView.current = cardsView.queue[0] || null;
    cardsView.revealed = false;
    paintCards();
  }

  function paintCards() {
    var stage = document.querySelector(".card-stage");
    var status = document.querySelector(".cards-status");
    if (!stage) return;
    var inDeck = glossary.filter(function (g) { return cardsView.cat === "all" || g.cat === cardsView.cat; });
    var now = Date.now();
    var due = inDeck.filter(function (g) { return cardRec(g.term).due <= now; }).length;
    var mastered = inDeck.filter(function (g) { return cardRec(g.term).box >= 4; }).length;
    if (status) {
      status.textContent = inDeck.length + " cards in this deck · " + due + " due · " + mastered + " well known";
    }
    stage.textContent = "";
    var g = cardsView.current;
    if (!g) {
      var done = el("div", "card-done");
      done.appendChild(el("p", "card-done-title", "All caught up."));
      done.appendChild(el("p", "muted", "No cards are due in this deck right now. Come back later, or practise everything anyway."));
      var again = el("button", "btn ghost", "Practice all " + inDeck.length + " cards");
      again.type = "button";
      again.addEventListener("click", function () {
        cardsView.practiceAll = true;
        buildQueue();
        paintCards();
      });
      done.appendChild(again);
      stage.appendChild(done);
      return;
    }
    var rec = cardRec(g.term);
    var card = el("article", "fcard" + (cardsView.revealed ? " is-open" : ""));
    card.setAttribute("tabindex", "0");
    card.appendChild(el("p", "fcard-hint", cardsView.revealed ? "Rate your recall" : "Tap the card or press Space to reveal"));
    card.appendChild(el("h2", null, g.term));
    card.appendChild(el("p", "tag", g.cat || ""));
    if (cardsView.revealed) {
      card.appendChild(el("p", "fcard-def", g.def));
      var see = el("p", "fcard-see");
      (g.see || []).forEach(function (mid, i) {
        if (i) see.appendChild(document.createTextNode(" · "));
        see.appendChild(link("#/module/" + mid, null, moduleTitle(mid)));
      });
      if (see.childNodes.length) card.appendChild(see);
      var ratings = el("div", "fcard-actions");
      [0, 1, 2].forEach(function (kind) {
        var b = el("button", "btn small fc-" + ["again", "good", "easy"][kind], cardLabels[kind]);
        b.type = "button";
        b.addEventListener("click", function () { answerCard(kind); });
        ratings.appendChild(b);
      });
      card.appendChild(ratings);
    }
    card.addEventListener("click", function (e) {
      if (e.target.closest("a, button")) return;
      cardsView.revealed = !cardsView.revealed;
      paintCards();
    });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        cardsView.revealed = !cardsView.revealed;
        paintCards();
      }
    });
    stage.appendChild(card);
  }

  function buildQueue() {
    var now = Date.now();
    cardsView.queue = glossary.filter(function (g) {
      if (cardsView.cat !== "all" && g.cat !== cardsView.cat) return false;
      return cardsView.practiceAll || cardRec(g.term).due <= now;
    }).sort(function (a, b) {
      return cardRec(a.term).due - cardRec(b.term).due || a.term.localeCompare(b.term);
    });
    cardsView.current = cardsView.queue[0] || null;
    cardsView.revealed = false;
  }

  function showCards() {
    routeToken++;
    view.textContent = "";
    updateOverall();
    view.appendChild(link("#/glossary", "crumb", "← Glossary"));
    view.appendChild(el("h1", null, "Flashcards"));
    view.appendChild(el("p", "muted", "Spaced repetition over the glossary. Rate how well you recalled each term — “Again” brings it back in ten minutes, “Good” and “Easy” push it days away."));

    var cats = ["all"];
    glossary.forEach(function (g) { if (cats.indexOf(g.cat) === -1) cats.push(g.cat); });
    cats.sort(function (a, b) { return a === "all" ? -1 : b === "all" ? 1 : a.localeCompare(b); });
    var chips = el("div", "chips cards-chips");
    cats.forEach(function (cat) {
      var b = el("button", "chip", cat === "all" ? "All" : cat);
      b.type = "button";
      b.setAttribute("aria-pressed", String(cardsView.cat === cat));
      b.addEventListener("click", function () {
        cardsView.cat = cat;
        cardsView.practiceAll = false;
        Array.prototype.forEach.call(chips.children, function (c) { c.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        buildQueue();
        paintCards();
      });
      chips.appendChild(b);
    });
    var tools = el("section", "toolbar");
    tools.appendChild(chips);
    view.appendChild(tools);

    view.appendChild(el("p", "result-count cards-status"));
    var stage = el("div", "card-stage");
    view.appendChild(stage);

    buildQueue();
    paintCards();
  }

  // ---------- routing ----------
  function setActiveSection() {
    var section = location.hash.replace(/^#\/?/, "").split("/")[0] || "library";
    if (section === "path") section = "paths";
    if (section === "tutorial") section = "tutorials";
    if (section === "module" || section === "search") section = "library";
    var links = document.querySelectorAll ? document.querySelectorAll(".site-nav a") : [];
    Array.prototype.forEach.call(links, function (a) {
      var match = a.getAttribute("data-nav") === section;
      a.classList.toggle("is-active", match);
      if (match) a.setAttribute("aria-current", "page");
      else if (a.removeAttribute) a.removeAttribute("aria-current");
    });
  }

  function setTitle(t) {
    document.title = t ? t + " · Architecture Field Guide" : "Architecture & Backend Field Guide";
  }

  function route() {
    hideTermPop();
    var parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    var head = parts[0];
    document.body.classList.toggle("is-reading", head === "module" || head === "tutorial");
    setActiveSection();
    if (head === "module" && docById[parts[1]]) setTitle(docById[parts[1]].title);
    else if (head === "tutorial" && tutorialById[parts[1]]) setTitle(tutorialById[parts[1]].title);
    else if (head === "path" && pathById[parts[1]]) setTitle(pathById[parts[1]].name);
    else if (head === "paths") setTitle("Learning paths");
    else if (head === "tutorials") setTitle("Hands-on tutorials");
    else if (head === "glossary") setTitle("Glossary");
    else if (head === "cards") setTitle("Flashcards");
    else if (head === "search") setTitle("Search");
    else setTitle(null);
    if (head === "module" && docById[parts[1]]) {
      showModule(parts[1], Number(parts[2]) || 0);
    } else if (head === "tutorial" && tutorialById[parts[1]]) {
      showTutorial(parts[1]);
    } else if (head === "tutorials") {
      showTutorials();
    } else if (head === "path" && pathById[parts[1]]) {
      showPath(parts[1]);
    } else if (head === "paths") {
      showPaths();
    } else if (head === "glossary") {
      showGlossary();
    } else if (head === "cards") {
      showCards();
    } else if (head === "search") {
      showSearch(decodeURIComponent(parts.slice(1).join("/")));
    } else {
      showHome();
    }
  }

  // quick find: live dropdown with grouped results
  var qf = document.getElementById("quickfind");
  if (qf) {
    var qfInput = qf.querySelector("input");
    var qfMenu = el("div", "qf-menu");
    qfMenu.hidden = true;
    qf.appendChild(qfMenu);
    var qfItems = [];
    var qfActive = -1;

    function closeQf() { qfMenu.hidden = true; qfActive = -1; }

    function openQf(q) {
      var n = q.toLowerCase();
      qfItems = [];
      if (n.length >= 2) {
        function score(text) {
          text = String(text).toLowerCase();
          if (text.indexOf(n) === 0) return 3;
          if (text.indexOf(n) !== -1) return 2;
          return 0;
        }
        docs.forEach(function (d) {
          var s = score(d.title);
          if (!s) s = score(d.summary) || (d.tags.join(" ").toLowerCase().indexOf(n) !== -1 ? 1 : 0);
          if (s) qfItems.push({ kind: "Module", title: d.title, sub: d.summary, href: "#/module/" + d.id, score: s });
        });
        tutorials.forEach(function (t) {
          var s = score(t.title);
          if (!s) s = score(t.subtitle) ? 1 : 0;
          if (s) qfItems.push({ kind: "Tutorial", title: t.title, sub: t.subtitle, href: "#/tutorial/" + t.id, score: s });
        });
        glossary.forEach(function (g) {
          var s = score(g.term);
          if (!s && g.def.toLowerCase().indexOf(n) !== -1) s = 1;
          if (s) qfItems.push({ kind: "Glossary", title: g.term, sub: g.def, href: "#/glossary", score: s });
        });
        qfItems.sort(function (a, b) { return b.score - a.score; });
        qfItems = qfItems.slice(0, 8);
      }
      qfMenu.textContent = "";
      if (!qfItems.length) {
        qfMenu.appendChild(el("p", "qf-empty", n.length >= 2
          ? "No matches — press Enter for a full search."
          : "Type to search modules, tutorials and the glossary."));
      }
      qfItems.forEach(function (item, i) {
        var b = el("button", "qf-item");
        b.type = "button";
        b.appendChild(el("span", "qf-kind", item.kind));
        var txt = el("span", "qf-text");
        txt.appendChild(el("strong", null, item.title));
        txt.appendChild(el("span", "qf-sub", item.sub));
        b.appendChild(txt);
        b.addEventListener("click", function () {
          location.hash = item.href;
          closeQf();
          qfInput.blur();
        });
        qfMenu.appendChild(b);
      });
      qfActive = -1;
      qfMenu.hidden = false;
    }

    qfInput.addEventListener("input", function () { openQf(qfInput.value.trim()); });
    qfInput.addEventListener("focus", function () {
      if (qfInput.value.trim()) openQf(qfInput.value.trim());
    });
    qfInput.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (qfMenu.hidden || !qfItems.length) return;
        e.preventDefault();
        qfActive = e.key === "ArrowDown"
          ? (qfActive + 1) % qfItems.length
          : (qfActive - 1 + qfItems.length) % qfItems.length;
        Array.prototype.forEach.call(qfMenu.querySelectorAll(".qf-item"), function (b, i) {
          b.classList.toggle("is-active", i === qfActive);
        });
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (qfActive > -1 && qfItems[qfActive]) {
          location.hash = qfItems[qfActive].href;
          closeQf();
          qfInput.blur();
        } else if (qfInput.value.trim()) {
          location.hash = "#/search/" + encodeURIComponent(qfInput.value.trim());
          closeQf();
          qfInput.blur();
        }
      } else if (e.key === "Escape") {
        closeQf();
        qfInput.blur();
      }
    });
    qf.addEventListener("submit", function (e) { e.preventDefault(); });
    document.addEventListener("click", function (e) {
      if (!qf.contains(e.target)) closeQf();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (!lb.hidden) {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") stepLb(-1);
      else if (e.key === "ArrowRight") stepLb(1);
      return;
    }
    var tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (e.key === "/") {
      var input = document.querySelector(".quickfind input");
      if (input) { e.preventDefault(); input.focus(); input.select(); }
      return;
    }
    if (location.hash.indexOf("#/cards") === 0) {
      if (e.key === " " || e.key === "Enter") {
        var card = document.querySelector(".card-stage .fcard");
        if (card) { e.preventDefault(); card.click(); }
      } else if (cardsView.current && cardsView.revealed) {
        var sel = { "1": ".fc-again", "2": ".fc-good", "3": ".fc-easy" }[e.key];
        if (sel) {
          var fb = document.querySelector(".card-stage " + sel);
          if (fb) fb.click();
        }
      }
      return;
    }
    var m = location.hash.match(/^#\/module\/([^/]+)\/(\d+)$/);
    if (!m || !docById[m[1]]) return;
    var idx = Number(m[2]);
    var total = lessonTotal(m[1]);
    if (e.key === "ArrowRight" && idx < total - 1) location.hash = "#/module/" + m[1] + "/" + (idx + 1);
    if (e.key === "ArrowLeft" && idx > 0) location.hash = "#/module/" + m[1] + "/" + (idx - 1);
  });

  window.addEventListener("hashchange", route);

  // reading progress bar
  var readbar = el("div", "readbar");
  var readfill = el("span");
  readbar.appendChild(readfill);
  document.body.appendChild(readbar);
  window.addEventListener("scroll", function () {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    readfill.style.width = Math.min(100, Math.max(0, pct)) + "%";
  }, { passive: true });

  updateOverall();
  route();
})();

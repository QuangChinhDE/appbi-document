/* ===== AppBI product site — shared shell (header / footer / TOC / changelog page) ===== */
(function(){
  var MODULES = [
    {id:'sources',       n:'Kết nối dữ liệu',        ic:'🔌', d:'PostgreSQL, BigQuery, Sheets, Excel — truy vấn live.'},
    {id:'datasets',      n:'Dataset & Mô hình',      ic:'🗄️', d:'Bảng, quan hệ, Measures, chất lượng dữ liệu.'},
    {id:'explore',       n:'Explore — Biểu đồ',      ic:'📈', d:'33 loại biểu đồ, dựng bằng kéo-thả.'},
    {id:'dashboards',    n:'Dashboard — Báo cáo',    ic:'📊', d:'Đa trang, bộ lọc, chia sẻ, trợ lý AI.'},
    {id:'workboards',    n:'Workboard — Mini-app',   ic:'🧩', d:'Form/Table/Doc + RLS + Mobile/PWA + OCR.'},
    {id:'govern',        n:'Govern — Quản trị',      ic:'🏛️', d:'Chỉ số dùng chung, từ điển & nhãn.', badge:'MỚI'},
    {id:'observability', n:'Observability — Giám sát',ic:'📡', d:'Sức khoẻ dữ liệu, sự cố, lineage.', badge:'MỚI'}
  ];
  window.APPBI_MODULES = MODULES;

  /* Onboarding track — guided A→Z path (core system, before AI) */
  var ONBOARDING = [
    {id:'guide-1-source',    n:'1 · Tạo Data Source',          ic:'🔌', d:'Kết nối PostgreSQL/BigQuery/Sheets/Excel, test & chia sẻ.', ready:true},
    {id:'guide-2-dataset',   n:'2 · Tạo Dataset',              ic:'🗄️', d:'Gom bảng, source & SQL table, xem trước & nhận dạng kiểu.', ready:true},
    {id:'guide-3-model',     n:'3 · Nối Model',                ic:'🧩', d:'Relationship/join, khoá, Measures, semantic.'},
    {id:'guide-4a-explore',  n:'4A · Explore & tính năng chart',ic:'📈', d:'Gán role, aggregation, filter/sort/limit, preview/SQL, lưu.'},
    {id:'guide-4b-charts',   n:'4B · Thư viện 33 loại chart',  ic:'📊', d:'Đủ 33 loại theo 9 nhóm + tuỳ chọn riêng từng loại.'},
    {id:'guide-5-dashboard', n:'5 · Dashboard',                ic:'🧱', d:'Thêm chart đã lưu, layout, bộ lọc, đa trang.'},
    {id:'guide-6-theme',     n:'6 · Theme & giao diện',        ic:'🎨', d:'Đổi theme, màu/nền/font, tuỳ biến giao diện đẹp.'},
    {id:'guide-7-public',    n:'7 · Public link',              ic:'🌐', d:'Normal vs Nâng cao: khoá filter, slicer, embed…'}
  ];
  var isReady = function(m){ return !isGuidePage || m.ready === true; };
  window.APPBI_ONBOARDING = ONBOARDING;

  var page = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/,'') || 'index';
  var isGuidePage = page==='guide' || /^guide-/.test(page);
  var A = function(id){ return page===id ? ' class="active"' : ''; };

  /* ---------- header ---------- */
  var ddItems = MODULES.map(function(m){
    return '<a href="'+m.id+'.html"'+(page===m.id?' style="background:var(--soft)"':'')+'><span class="di">'+m.ic+'</span><span><b>'+m.n+'</b><small>'+m.d+'</small></span></a>';
  }).join('');
  document.body.insertAdjacentHTML('afterbegin',
    '<header class="site"><div class="container bar">'+
      '<a class="logo" href="index.html"><span class="mk">📊</span> AppBI</a>'+
      '<button class="hamb" id="hamb" aria-label="Menu">☰</button>'+
      '<nav id="nav">'+
        '<a href="index.html"'+A('index')+'>Tổng quan</a>'+
        '<div class="dd" id="dd"><button class="navbtn" id="ddbtn">Sản phẩm ▾</button><div class="dd-menu">'+ddItems+'</div></div>'+
        '<a href="guide.html"'+(isGuidePage?' class="active"':'')+'>Hướng dẫn A→Z</a>'+
        '<a href="showcase.html"'+A('showcase')+'>Sản phẩm đầu cuối</a>'+
        '<a href="changelog.html"'+A('changelog')+'>Cập nhật</a>'+
        '<span class="spacer"></span>'+
        '<a class="btn btn-primary" href="showcase.html" style="padding:9px 16px">Xem demo</a>'+
      '</nav>'+
    '</div></header>');

  /* ---------- footer ---------- */
  var footCols = MODULES.map(function(m){ return '<a href="'+m.id+'.html">'+m.n+'</a>'; }).join('');
  document.body.insertAdjacentHTML('beforeend',
    '<footer class="site"><div class="container"><div class="row">'+
      '<div class="logo"><span class="mk">📊</span> AppBI</div>'+
      '<nav><a href="index.html">Tổng quan</a>'+footCols+'<a href="showcase.html">Demo</a><a href="changelog.html">Cập nhật</a></nav>'+
    '</div><small>AppBI — Nền tảng phân tích &amp; ứng dụng dữ liệu. Ảnh minh hoạ dùng bộ dữ liệu mẫu (chỉ là ví dụ).</small></div></footer>'+
    '<button class="totop" id="totop" title="Lên đầu trang">↑</button>');

  /* ---------- dropdown + mobile + totop ---------- */
  var dd=document.getElementById('dd');
  document.getElementById('ddbtn').addEventListener('click', function(e){ e.stopPropagation(); dd.classList.toggle('open'); });
  document.addEventListener('click', function(e){ if(!dd.contains(e.target)) dd.classList.remove('open'); });
  document.getElementById('hamb').addEventListener('click', function(){ document.getElementById('nav').classList.toggle('open'); });
  var tt=document.getElementById('totop');
  window.addEventListener('scroll', function(){ tt.style.display = window.scrollY>600 ? 'flex':'none'; });
  tt.addEventListener('click', function(){ window.scrollTo({top:0,behavior:'smooth'}); });

  /* ---------- breadcrumb (any page with an .mhero band) ---------- */
  var NAV = isGuidePage ? ONBOARDING : MODULES;
  var curMod=null, curIdx=-1;
  NAV.forEach(function(m,i){ if(m.id===page){ curMod=m; curIdx=i; } });
  var mheroC=document.querySelector('.mhero .container');
  if(mheroC){
    var crumbLast = curMod ? curMod.n :
      (page==='guide' ? 'Hướng dẫn A→Z'
      : page==='showcase' ? 'Sản phẩm đầu cuối'
      : page==='changelog' ? 'Cập nhật & Lộ trình'
      : (document.title.split('—')[0]||'').trim());
    var midCrumb = curMod
      ? (isGuidePage ? '<a href="guide.html">Hướng dẫn A→Z</a><span class="sep">›</span>'
                     : '<a href="index.html#modules">Sản phẩm</a><span class="sep">›</span>')
      : '';
    mheroC.insertAdjacentHTML('afterbegin',
      '<nav class="breadcrumb"><a href="index.html">🏠 Trang chủ</a><span class="sep">›</span>'+midCrumb+
      '<span class="cur">'+crumbLast+'</span></nav>');
    var bk=mheroC.querySelector('.bk'); if(bk) bk.style.display='none';
  }

  /* ---------- neutralize links to not-yet-built guide chapters (no dead 404 links anywhere) ---------- */
  var notReady={}; ONBOARDING.forEach(function(m){ if(m.ready!==true) notReady[m.id]=true; });
  [].slice.call(document.querySelectorAll('a[href^="guide-"]')).forEach(function(a){
    var id=(a.getAttribute('href')||'').replace(/#.*$/,'').replace(/\.html$/,'');
    if(notReady[id]){ a.classList.add('lnk-soon'); a.removeAttribute('href'); a.setAttribute('title','Chương này đang được biên soạn'); }
  });

  /* ---------- DOCS SHELL (module detail pages): left nav tree · feature cards · right "on this page" + helpful · prev/next ---------- */
  var main=document.querySelector('.doc-main');
  var wrap=document.querySelector('.doc-wrap');
  if(main && wrap){
    var secs=[].slice.call(main.querySelectorAll('section.doc[id]'));
    var secMeta=secs.map(function(s){
      var h=s.querySelector('h3.feat');
      var idEl=h?h.querySelector('.feat-id'):null; var idt=idEl?idEl.textContent.trim():'';
      var rest=h?h.textContent.replace(/\s+/g,' ').trim():s.id;
      if(idt && rest.indexOf(idt)===0) rest=rest.slice(idt.length).trim();
      rest=rest.replace(/(ĐIỂM MẠNH|MỚI)/g,'').trim();
      var pEl=s.querySelector('p'); var desc=pEl?pEl.textContent.replace(/\s+/g,' ').replace(/^Là gì:\s*/i,'').trim():'';
      if(desc.length>96) desc=desc.slice(0,95).trim()+'…';
      return {id:s.id, idt:idt, title:rest, desc:desc};
    });

    /* left: whole-product nav tree (current module expanded to its sections) */
    var left=wrap.querySelector('aside.toc') || document.createElement('aside');
    if(!left.parentNode) wrap.insertBefore(left, main);
    left.className='docnav';
    left.innerHTML =
      '<div class="nvhead">'+(isGuidePage?'Hướng dẫn A→Z':'Tài liệu sản phẩm')+'</div>'+
      '<a class="nvlink" href="'+(isGuidePage?'guide.html':'index.html')+'">'+(isGuidePage?'Tổng quan hướng dẫn':'Tổng quan')+'</a>'+
      '<div class="nvgroup">'+ NAV.map(function(m){
        var on=m.id===page;
        var kids = on ? '<div class="kids">'+secMeta.map(function(s){
          return '<a href="#'+s.id+'" data-t="'+s.id+'">'+(s.idt?'<i>'+s.idt+'</i>':'')+s.title+'</a>';
        }).join('')+'</div>' : '';
        if(!isReady(m)){
          return '<div class="nv soon"><span class="top"><span class="di">'+m.ic+'</span>'+m.n+'<em class="soon">sắp ra</em></span></div>';
        }
        return '<div class="nv'+(on?' on':'')+'"><a class="top" href="'+m.id+'.html"><span class="di">'+m.ic+'</span>'+
          m.n+(m.badge?' <em>'+m.badge+'</em>':'')+'</a>'+kids+'</div>';
      }).join('') +'</div>'+
      (isGuidePage
        ? '<a class="nvlink" href="index.html#modules">Tài liệu module</a><a class="nvlink" href="showcase.html">Sản phẩm đầu cuối</a>'
        : '<a class="nvlink" href="guide.html">Hướng dẫn A→Z</a><a class="nvlink" href="showcase.html">Sản phẩm đầu cuối</a><a class="nvlink" href="changelog.html">Cập nhật &amp; Lộ trình</a>');

    /* feature cards + lead at top of content (Airbyte child-page style) */
    if(secMeta.length){
      main.insertAdjacentHTML('afterbegin',
        '<p class="doclead">Trang này gồm <b>'+secMeta.length+' phần</b> — chọn nhanh một mục hoặc cuộn để đọc hướng dẫn từng bước.</p>'+
        '<div class="featcards">'+secMeta.map(function(s){
          return '<a class="fcard" href="#'+s.id+'"><span class="fic">'+(curMod?curMod.ic:'📄')+'</span>'+
            '<b>'+(s.idt?'<span class="fnum">'+s.idt+'</span> ':'')+s.title+'</b>'+
            (s.desc?'<p>'+s.desc+'</p>':'')+'<span class="go">Xem mục →</span></a>';
        }).join('')+'</div>');
    }

    /* right rail: on this page + helpful */
    var right=document.createElement('aside'); right.className='docaside';
    right.innerHTML =
      '<div class="onthis"><div class="ttl">Trên trang này</div><div class="list">'+
        secMeta.map(function(s){ return '<a href="#'+s.id+'" data-t="'+s.id+'">'+s.title+'</a>'; }).join('')+
      '</div></div>'+
      '<div class="helpful"><div class="q">Trang này có hữu ích?</div>'+
        '<div class="btns"><button data-h="y">👍 Có</button><button data-h="n">👎 Không</button></div>'+
        '<div class="thx" hidden>Cảm ơn phản hồi của bạn! 🙌</div></div>';
    wrap.appendChild(right);
    wrap.classList.add('docs3');
    [].slice.call(right.querySelectorAll('.helpful button')).forEach(function(b){
      b.addEventListener('click', function(){ right.querySelector('.btns').hidden=true; right.querySelector('.thx').hidden=false; });
    });

    /* prev / next pager — skip unbuilt (non-ready) chapters */
    var firstFallback = isGuidePage ? {id:'guide', n:'Tổng quan hướng dẫn'} : {id:'index', n:'Tổng quan'};
    var lastFallback  = isGuidePage ? {id:'guide', n:'Mục lục hướng dẫn'}   : {id:'showcase', n:'Sản phẩm đầu cuối'};
    var prev = firstFallback, next = lastFallback;
    for(var pi=curIdx-1; pi>=0; pi--){ if(isReady(NAV[pi])){ prev=NAV[pi]; break; } }
    for(var ni=curIdx+1; ni<NAV.length; ni++){ if(isReady(NAV[ni])){ next=NAV[ni]; break; } }
    main.insertAdjacentHTML('beforeend',
      '<nav class="pager">'+
        '<a class="pg prev" href="'+prev.id+'.html"><span>← Trước</span><b>'+prev.n+'</b></a>'+
        '<a class="pg next" href="'+next.id+'.html"><span>Tiếp →</span><b>'+next.n+'</b></a>'+
      '</nav>');

    /* scrollspy — highlight matching links in BOTH left tree + right rail */
    var spy=[].slice.call(document.querySelectorAll('[data-t]')); var byId={};
    spy.forEach(function(a){ var k=a.getAttribute('data-t'); (byId[k]=byId[k]||[]).push(a); });
    if(secs.length && 'IntersectionObserver' in window){
      var io=new IntersectionObserver(function(ents){
        ents.forEach(function(en){ if(en.isIntersecting){
          spy.forEach(function(a){ a.classList.remove('active'); });
          (byId[en.target.id]||[]).forEach(function(a){ a.classList.add('active'); });
        }});
      },{ rootMargin:'-90px 0px -72% 0px', threshold:0 });
      secs.forEach(function(s){ io.observe(s); });
    }
  }

  /* ---------- changelog (rendered into #changelog on changelog.html) ---------- */
  var clg=document.getElementById('changelog');
  if(clg){
    function row(date,type,area,who,html,link,label){
      return '<tr><td class="date">'+date+'</td><td class="type"><span class="tg '+(type==='LỚN'?'big':'small')+'">'+type+
        '</span></td><td class="area">'+area+'</td><td class="content">'+html+'</td><td class="who-c"><span class="who '+who+'">'+who+
        '</span></td><td class="doc"><a href="'+link+'">'+label+' →</a></td></tr>';
    }
    var head='<thead><tr><th>Ngày</th><th>Loại</th><th>Mảng</th><th>Nội dung</th><th>Người thực hiện</th><th>Hướng dẫn</th></tr></thead>';
    var t7=
      row('02/07','LỚN','Workboard · Form','minhngo03','<b>Widget Bản đồ (Leaflet)</b> — chọn vùng/lô trên bản đồ vệ tinh (polygon), cho mini-app hiện trường.','workboards.html','Workboard')+
      row('02/07','LỚN','Workboard · Table','minhngo03','<b>Chế độ Gallery</b> — bản ghi dạng thẻ ảnh, gom nhóm theo ngày/lô + bộ lọc.','workboards.html','Workboard')+
      row('02/07','NHỎ','Workboard · Tooling','minhngo03','<b>Dựng Workboard bằng AI (MCP)</b> — authoring/dataset/model/source.','workboards.html','Workboard')+
      row('02/07','LỚN','Dashboard','anhphan','<b>Báo cáo real-time (snapshot)</b> — tải BigQuery cực nhanh, gần thời gian thực.','dashboards.html','Dashboard')+
      row('02/07','NHỎ','Dashboard','anhphan','<b>Đơn vị hiển thị toàn báo cáo</b> (tỷ/triệu/nghìn) + tooltip tile, KPI không xuống dòng.','dashboards.html','Dashboard')+
      row('01/07','LỚN','Observability','chinhbui02','<b>Ra mắt module giám sát dữ liệu</b> — độ tươi/chất lượng, sự cố, lineage, cảnh báo.','observability.html','Observability')+
      row('01/07','NHỎ','Explore/Dataset','chinhbui02','<b>“Explain mode”</b> — hiện SQL sinh ra ở danh sách giá trị lọc; health-probe.','explore.html','Explore');
    var t6=
      row('30/06','LỚN','Govern & Catalog','chinhbui02','<b>Lớp quản trị ngữ nghĩa DB-backed</b> — chỉ số dùng chung, nhãn/thuật ngữ, xung đột.','govern.html','Govern')+
      row('24/06','LỚN','AI bot','chinhbui02','<b>Trợ lý AI thế hệ mới</b> — router Nhanh/Sâu, phân tích sâu, tra cứu web, trích dẫn nguồn.','dashboards.html','Trợ lý AI')+
      row('22/06','LỚN','Workboard','chinhbui02','<b>Mini-app Mobile & PWA</b> — cài lên màn hình chính, offline-first, iOS.','workboards.html','Workboard')+
      row('21/06','LỚN','Workboard','chinhbui02','<b>OCR chụp ảnh tự điền form</b> — AI đọc ảnh phiếu, điền sẵn các trường.','workboards.html','Workboard')+
      row('23/06','NHỎ','Explore','chinhbui02','Thêm biểu đồ <b>9-Box Grid</b>; bản đồ điểm vector thật (MAP_POINT).','explore.html','Explore')+
      row('21/06','NHỎ','Dashboard','anhphan','<b>Tương tác chéo (cross-highlight)</b> kiểu PBI; Overview + song ngữ EN/VI.','dashboards.html','Dashboard')+
      row('17/06','NHỎ','Dashboard','anhphan','<b>Xuất PDF v2 (hybrid)</b>; đồng biên tập real-time; Theme kiểu PBI.','dashboards.html','Dashboard')+
      row('10/06','NHỎ','Dataset','chinhbui02','<b>Trình soạn Measure kiểu PBI</b> + tối ưu tốc độ tải BigQuery/Sheets.','datasets.html','Dataset')+
      row('09/06','LỚN','Workboard','chinhbui02','<b>Workspaces + Export/Import v2 + publish/draft + Cổng</b> chia sẻ.','workboards.html','Workboard')+
      row('02/06','LỚN','Semantic engine','chinhbui02','<b>Chuẩn PowerBI cho số liệu</b> — measure isolation, lọc cross-fact (EXISTS).','datasets.html','Dataset');
    var t5=
      row('28/05','LỚN','Dashboard/Filter','anhphan','<b>Bộ lọc chuẩn PowerBI</b> — page-scope, dedup, slicer Looker, distinct-cascade.','dashboards.html','Dashboard')+
      row('30/05','NHỎ','Explore','chinhbui02','Chuẩn hoá định dạng KPI/Gauge/Bullet/Podium; auto-route measure cho Table.','explore.html','Explore');
    clg.innerHTML =
      '<div class="clog-legend"><span><b>Người thực hiện:</b></span>'+
        '<span><span class="who chinhbui02">chinhbui02</span> lõi · AI bot · Workboard(trước)</span>'+
        '<span><span class="who anhphan">anhphan</span> Dashboard</span>'+
        '<span><span class="who minhngo03">minhngo03</span> Workboard(mới)</span></div>'+
      '<div class="clog-mhead">Tháng 7 / 2026</div><table>'+head+'<tbody>'+t7+'</tbody></table>'+
      '<div class="clog-mhead">Tháng 6 / 2026</div><table>'+head+'<tbody>'+t6+'</tbody></table>'+
      '<div class="clog-mhead">Tháng 5 / 2026</div><table>'+head+'<tbody>'+t5+'</tbody></table>';
  }
})();

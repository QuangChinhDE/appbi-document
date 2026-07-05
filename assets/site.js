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
  var page = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/,'') || 'index';
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

  /* ---------- sticky TOC + scrollspy (module pages) ---------- */
  var main=document.querySelector('.doc-main'), tocList=document.getElementById('toc');
  if(main && tocList){
    var secs=[].slice.call(main.querySelectorAll('section.doc[id]'));
    var links={};
    tocList.innerHTML = secs.map(function(s){
      var h=s.querySelector('h3.feat'); if(!h) return '';
      var idEl=h.querySelector('.feat-id'); var idt=idEl?idEl.textContent.trim():'';
      var rest=h.textContent.replace(/\s+/g,' ').trim();
      if(idt && rest.indexOf(idt)===0) rest=rest.slice(idt.length).trim();
      rest=rest.replace(/(ĐIỂM MẠNH|MỚI)/g,'').trim();
      var label=(idt?idt+' ':'')+rest;
      return '<a href="#'+s.id+'" data-t="'+s.id+'">'+label+'</a>';
    }).join('');
    [].slice.call(tocList.querySelectorAll('a')).forEach(function(a){ links[a.getAttribute('data-t')]=a; });
    tocList.addEventListener('click', function(e){ if(window.innerWidth<=920){} });
    var io=new IntersectionObserver(function(ents){
      ents.forEach(function(en){ if(en.isIntersecting){
        Object.keys(links).forEach(function(k){ links[k].classList.remove('active'); });
        var a=links[en.target.id]; if(a) a.classList.add('active');
      }});
    },{ rootMargin:'-80px 0px -72% 0px', threshold:0 });
    secs.forEach(function(s){ io.observe(s); });
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

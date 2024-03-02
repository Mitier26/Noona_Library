const API_KEY = `76920f087955f921eb6b6f79d89fc42703ef032dc51e44b6ee7e4be168f2de59`;
let url = new URL(`http://data4library.kr/api/loanItemSrch?authKey=${API_KEY}`);
let url1 = new URL('https://www.nl.go.kr/NL/search/openApi/search.do?');

// 날씨 아이콘
$.getJSON('http://api.openweathermap.org/data/2.5/weather?id=1835848&appid=e185eb6e85e051757f1c4c54a4258982&units=metric',function(data){
        //data로 할일 작성
        //alert(data.list[0].main.temp_min)
        let $minTemp=data.main.temp_min;
        let $maxTemp= data.main.temp_max;
        let $cTemp=data.main.temp;
        let $cDate=data.dt;
        let $wIcon=data.weather[0].icon;
        

        let $now= new Date($.now())
        
        //alert(new Date($.now()))
        //A.append(B) A요소의 내용 뒤에 B를 추가
        //A.prepend(B) A요소의 내용 앞에 B를 추가
        $('.clowtemp').append($minTemp.toFixed(1).toString()+"°C");
        $('.ctemp').append($cTemp.toFixed(1).toString()+"°C");
        $('.chightemp').append($maxTemp.toFixed(1).toString()+"°C");
        $('h4').prepend($now.getFullYear()+'/'+($now.getMonth()+1)+'/'+$now.getDate()+'/'+$now.getHours()+":"+$now.getMinutes())
        $('.cicon').append('<img src="https://openweathermap.org/img/wn/'+$wIcon+'@2x.png">')
    })



// 인기대출도서 목록
let popularLoanBooksList = [];
// 지역, 성별, 나이 탭을 가져옴
const tabs = document.querySelectorAll("#yb-popular-loan-books-menu button")
console.log("tabs",tabs);
tabs.forEach(mode=>mode.addEventListener("click", (e)=>popularLoanBooksFilter(e)));

const regionMenu = document.querySelectorAll(".region-menu");
const ageMenu = document.querySelectorAll(".age-menu");
const genderMenu = document.querySelectorAll(".gender-menu");

let resultNum = 0;
let page = 1;
const ybPageSize = 20;
const ybGroupSize = 5;

regionMenu.forEach(region => 
    region.addEventListener("change",(e) => getPopularLoanBooksByRegion(e)));
ageMenu.forEach(age => 
    age.addEventListener("change",(e) => getPopularLoanBooksByAge(e)));
genderMenu.forEach(gender => 
    gender.addEventListener("change",(e) => getPopularLoanBooksByGender(e)));

const popularLoanBooksFilter = (e) => {
    let mode = e.target.id
    console.log("mode", mode);
    let filterHTML = ``
    if(mode === "region"){
        filterHTML = `
        <select class="form-select region-menu" aria-label="Default select example">
            <option selected>전국</option>
            <option value="11">서울</option>
            <option value="21">부산</option>
            <option value="22">대구</option>
            <option value="23">인천</option>
            <option value="24">광주</option>
            <option value="25">대전</option>
            <option value="26">울산</option>
            <option value="29">세종</option>
            <option value="31">경기</option>
            <option value="32">강원</option>
            <option value="33">충북</option>
            <option value="34">충남</option>
            <option value="35">전북</option>
            <option value="36">전남</option>
            <option value="37">경북</option>
            <option value="38">경남</option>
            <option value="39">제주</option>
        </select>`
        document.getElementById('filter').innerHTML=filterHTML
    }else if(mode === "age"){
        filterHTML = `
        <select class="form-select age-menu" aria-label="Default select example">
            <option selected>전체</option>
            <option value="0">영유아(0~5세)</option>
            <option value="6">유아(6~7세)</option>
            <option value="8">초등(8~13세)</option>
            <option value="14">청소년(14~19세)</option>
            <option value="20">20대</option>
            <option value="30">30대</option>
            <option value="40">40대</option>
            <option value="50">50대</option>
            <option value="60">60세 이상</option>
            <option value="-1">미상</option>
        </select>`
        document.getElementById('filter').innerHTML=filterHTML;
    }else if(mode === "gender"){
        filterHTML = `
        <select class="form-select gender-menu" aria-label="Default select example">
            <option selected>전체</option>
            <option value="0">남성</option>
            <option value="1">여성</option>
            <option value="2">미상</option>
        </select>`
        document.getElementById('filter').innerHTML=filterHTML;
    }
    const regionMenu = document.querySelectorAll(".region-menu");
    const ageMenu = document.querySelectorAll(".age-menu");
    const genderMenu = document.querySelectorAll(".gender-menu"); 
    regionMenu.forEach(region => 
        region.addEventListener("change",(e) => getPopularLoanBooksByRegion(e)));
    ageMenu.forEach(age => 
        age.addEventListener("change",(e) => getPopularLoanBooksByAge(e)));
    genderMenu.forEach(gender => 
        gender.addEventListener("change",(e) => getPopularLoanBooksByGender(e)));
}

const getPopularLoanBooks = async () => {
    url.searchParams.set('format', 'json');
    url.searchParams.set('startDt', '2024-01-01');
    url.searchParams.set('endDt', '2024-02-29');

    getPopularLoanBooksData()
};

const getPopularLoanBooksData = async() => {
    url.searchParams.set("pageNo", page);
    url.searchParams.set("pageSize", ybPageSize);
    const response = await fetch(url);
    const data = await response.json();
    popularLoanBooksList = data.response.docs;
    resultNum = data.response.resultNum;
    popularLoanBooksRender();
    ybPaginationRender();
}

const getPopularLoanBooksByRegion = async(e) => {
    const region = e.target.value;
    console.log("region", region);
    url.searchParams.set('region', region);
    getPopularLoanBooksData();
};

const getPopularLoanBooksByAge = async(e) => {
    const age = e.target.value;
    console.log("age", age);
    url.searchParams.set('age', age);
    getPopularLoanBooksData();
}

const getPopularLoanBooksByGender = async(e) => {
    const gender = e.target.value;
    console.log("gender", gender);
    url.searchParams.set('gender', gender);
    getPopularLoanBooksData();
}

getPopularLoanBooks();

const popularLoanBooksRender = () => {
    const popularLoanBooksHTML = popularLoanBooksList.map(
        (book)=>
            `<div class = "col-lg-3 col-md-6 col-sm-12">
            <div class="card" style="width: 14.5rem;">
        <div class = "yb-books-ranking">${book.doc.ranking}</div>
        <img src=${book.doc.bookImageURL} class="card-img-top" alt="..."> <!-- 책표지 URL-->
        <div class="card-body">
          <div class="card-title">${book.doc.bookname}</div>
          <div class="card-text">${book.doc.authors}</div>
          <div class="card-text">출판사 : ${book.doc.publisher}</div>
          <div class="card-text">출판년도 : ${book.doc.publication_year}</div>
        </div>
    </div>
    </div>`
    ).join("");
    document.getElementById('yb-popular-loan-books').innerHTML=popularLoanBooksHTML
}

const ybPaginationRender=()=>{
    //resultNum
    //page
    //pageSize
    //ybGroupSize
    //totalPages
    const ybTotalPages = Math.ceil(resultNum/ybPageSize);
    //pageGroup
    const ybPageGroup = Math.ceil(page/ybGroupSize);
    //ybLastPage
    let ybLastPage = ybPageGroup * ybGroupSize;
    if(ybLastPage<ybTotalPages){
        ybLastPage=ybTotalPages
    }

    //ybFirstPage
    const ybFirstPage = ybLastPage - (ybGroupSize - 1)<=0 ? 1 : ybLastPage - (ybGroupSize - 1);
    
    let paginationHTML = ``


    if(ybFirstPage >= 6){
        paginationHTML = `<a class="page-link" onclick = "ybMoveToPage(1)" aria-label="First-Page">
        <span aria-hidden="true">&laquo;</span>
      </a><a class="page-link" onclick = "ybMoveToPage(${page-1})" aria-label="Previous">
        <span aria-hidden="true">&lt;</span></a>`;
    }

  for(let i=ybFirstPage;i<=ybLastPage;i++){
    paginationHTML+=`<li class="page-item" onclick="ybMoveToPage(${i})"><a class="page-link">${i}</a></li>`
  }

  if(ybLastPage<resultNum){
    paginationHTML+=`<a class="page-link" onclick = "ybMoveToPage(${page+1})" aria-label="Next">
<span aria-hidden="true">&gt;</span>
</a><a class="page-link" onclick = "ybMoveToPage(${resultNum})"aria-label="Last-Page">
<span aria-hidden="true">&raquo;</span>
</a>`
}
    document.querySelector(".pagination").innerHTML=paginationHTML;
}

const ybMoveToPage = (pageNum) => {
    console.log("ybMoveToPage", pageNum);
    page = pageNum;
    getPopularLoanBooksData();
}

